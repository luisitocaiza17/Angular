import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';
import { Beneficiario,BeneficiarioKey} from '../../common/model/beneficiario';

import { ContratoKey } from '../../common/model/contrato';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';


import { PlanCambioEntity, PlanContrato } from '../../common/model/plan';
import { DetalleRemesa } from '../../common/model/detalleRemesa';
import { DatosBancoContrato, CambioSelectPlan } from '../../common/model/transacciones';
import { SeguroCampesinoEntity } from '../../common/model/transacciones';
import { DescuentoEntity } from '../../common/model/descuento';

@Component({
    selector: 'planTx',
    providers: [AutorizacionService,BeneficiarioService],
    templateUrl: 'planTx.form.template.html'
})

export class PlanTxFormComponent {

    planes: PlanCambioEntity[];
    planesCP: PlanCambioEntity[];
    bancos: DatosBancoContrato[];
    descuentos: DescuentoEntity[];
    cantidadContratos: number;
    descuentoVT: number;
    fechaMaxima: Date;
    seguroCampesino: SeguroCampesinoEntity;
    planSeleccionado: PlanCambioEntity;
    planKeySelected: string;
    planContrato: PlanContrato;
    detalleRemesa: DetalleRemesa;
    meses: number;
    fechaFinTarjeta: Date;
    desabilitar: boolean;
    habilitar: boolean;
    habilitarFechaInicioNuevoPlan: boolean;
    fechaActual: Date;
    periodo: number;
    dias: number;
    fechaRemesa: Date;
    cambioPlan: CambioSelectPlan;
    seteo: number;
    seteoFecha: number;
    fechaValidar: Date;
    beneficiarios: Beneficiario[];
    beneficiarioKey: BeneficiarioKey;
    beneficiarioSeleccionado: Beneficiario;
    fechaHastaTmp : Date;



    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.habilitar = false;
            this.habilitarFechaInicioNuevoPlan = false;
            this._contratoKey.Retroactivo = 2;
            
            this.loadPlanes();
        }
        else {
            this.planes = [];
            this.bancos = [];
        }
    }

    get contratokey() {
        return this._contratoKey;
    }

    constructor(public domSanitizer: DomSanitizer, public autorizacionService: AutorizacionService, private authService: AuthService,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef, private planService: PlanService,
        private detalleRemesaService: DetalleRemesaService, private transaccionService: TransaccionService,public beneficiarioService: BeneficiarioService) {
        this._contratoKey = new ContratoKey();
        this.planSeleccionado = new PlanCambioEntity();
        this.detalleRemesa = new DetalleRemesa();
        this.planContrato = new PlanContrato();
        this.seguroCampesino = new SeguroCampesinoEntity();
        this.beneficiarioKey = new BeneficiarioKey();
        this.cambioPlan = new CambioSelectPlan();
        this.planes = [];
        this.bancos = [];
        this.beneficiarios = [];
        
        this.planesCP = [];
        this.beneficiarioSeleccionado = new Beneficiario();
    }


    loadPlanes(): void {


        if (this._contratoKey.FechaFinTarjeta != undefined) {
            let fecha = this._contratoKey.FechaFinTarjeta.split("/");
            this._contratoKey.FechaFinTarjeta = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
            this.fechaFinTarjeta = new Date(this._contratoKey.FechaFinTarjeta);
        }
        if (this._contratoKey.EsMoroso == true) {
            this.authService.showInfoPopup("El contrato está moroso y que no se puede proceder");
            this.habilitar = true;
            this._contratoKey.PorcentajeDescuento = 0;
        }
        else {
            if (this.planes == undefined || this.planes.length == 0) {

                this.transaccionService.getDatosPlan(this._contratoKey).subscribe(
                    result => {
                        this.planes = result.ListaPlanes;
                        this.detalleRemesa = result.DetalleRemesa;
                        this.bancos = result.Bancos;
                        this.cantidadContratos = result.CantidadContratos;
                        this.descuentos = result.Descuento;
                        this._contratoKey.PorcentajeDescuentoVT = result.DescuentoVT;
                        this.seguroCampesino = result.Seguro;
                        this.detalleRemesa.FacturadoHasta = new Date(this.detalleRemesa.FacturadoHasta);
                        this._contratoKey.FechaHasta = this.detalleRemesa.FacturadoHasta;
                        this.fechaHastaTmp  = new Date(this._contratoKey.FechaHasta);
                        this.fechaValidar = this.detalleRemesa.FacturadoHasta;

                        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
                        this.changeTipoCuenta();
                        this.loadBeneficiarios();
                        this.loadPlanCotizacion();

                        this.planKeySelected = this._contratoKey.CodigoPlan;
                        this.planSeleccionado.VersionPlan = this._contratoKey.VersionPlan;
                        this.planSeleccionado.NombrePlan = this._contratoKey.NombrePlan; 

                    },
                    error => this.authService.showErrorPopup(error)
                );
            }
        }
    }

    buscaDescuento(tipoCuenta: number, periodoPago: number): void {
        for (let i in this.descuentos) {
            if (this.descuentos[i].TipoCuenta == tipoCuenta && this.descuentos[i].NumeroDesde == this.cantidadContratos) {
                var porcentajeDescuento = this.descuentos[i].PorcentajeDescuento.split(";");
                this._contratoKey.PorcentajeDescuento = parseInt(porcentajeDescuento[periodoPago - 1]);
            }
        }
        if (this._contratoKey.PorcentajeDescuento == undefined) {
            this.authService.showInfoPopup("No encuentro descuento");
            this._contratoKey.PorcentajeDescuento = 0;
        }
    }

    onChangePlan() {

        if (this.planKeySelected != undefined) {

            this.planSeleccionado = this.planes.find(p => p.CodigoPlan == this.planKeySelected);
            this.planContrato.Plan = this.planSeleccionado;
            this.planContrato.Contrato = this._contratoKey;
            this.planContrato.DetalleRemesa = this.detalleRemesa;
            this.planContrato.Seguro = this.seguroCampesino;

            this.planService.validarNuevoPlan(this.planContrato).subscribe(
                result => {
                    this.cambioPlan = result;
                    this._contratoKey.Text = this.cambioPlan.Text;
                    if (this.cambioPlan.Mensaje != undefined) {
                        this.authService.showInfoPopup(this.cambioPlan.Mensaje);
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    onChangeRetroactivo() {
        
        if (this.detalleRemesa.EstadoRemesa != undefined && this.detalleRemesa.FacturadoHasta != undefined && this.detalleRemesa.FechaCreacion != undefined && this._contratoKey.Retroactivo != undefined) {

            if (this._contratoKey.Retroactivo == 1) {
                this.habilitarFechaInicioNuevoPlan = true;
                this.fechaActual = new Date();
                this.periodo = 0;

                this.fechaRemesa = new Date(this.detalleRemesa.FechaCreacion);

                var diasDif = this.fechaActual.getTime() - this.fechaRemesa.getTime();
                this.dias = Math.round(diasDif / (1000 * 60 * 60 * 24));

                if (this.dias < 32) {
                    if (this._contratoKey.PeriodoPago == 1 || this._contratoKey.PeriodoPago == 2 || this._contratoKey.PeriodoPago == 3) {
                        this.periodo = this._contratoKey.PeriodoPago;
                    }
                    if (this._contratoKey.PeriodoPago == 4) {
                        this.periodo = 6;
                    }
                    if (this._contratoKey.PeriodoPago == 5) {
                        this.periodo = 12;
                    }
                    if (this._contratoKey.PeriodoPago == 6) {
                        this.periodo = 4;
                    }
                    this.fechaMaxima = (restarMeses(new Date(this.detalleRemesa.FacturadoHasta), this.periodo));
                    this._contratoKey.FechaHasta = this.fechaMaxima;
                }
                else {
                    this.validar();
                    this.authService.showInfoPopup("Han transcurrido mas de 30 días desde la última Facturación. Por lo tanto no puede realizar el cambio retroactivo");
                    this.habilitarFechaInicioNuevoPlan = true;
                }
            }else{                
                this.habilitarFechaInicioNuevoPlan = false;
                this.fechaMaxima = undefined;
                this._contratoKey.FechaHasta = new Date(this.fechaHastaTmp);
            }
        }

        function restarMeses(fecha, numeroMeses) {
            fecha.setMonth(fecha.getMonth() - numeroMeses);
            return fecha;
        }

    }

    validar() {
        if (this.seteo == undefined) {
            this._contratoKey.Retroactivo = undefined;
            this.seteo = 0;
        }
        else {
            this._contratoKey.Retroactivo = 2;
            this.seteo = undefined;
        }
    }


    onChangeFechaMaxima() {
        if (this._contratoKey.Retroactivo == undefined) {
            this.authService.showInfoPopup("Primero Seleccione Retroactivo");
        }
        else {
            if (this._contratoKey.FechaHasta > new Date(this._contratoKey.FechaFin)) {
                this._contratoKey.FechaHasta = new Date(this.detalleRemesa.FacturadoHasta);
                this.authService.showInfoPopup("Fecha Inicio del Cambio de Plan, No debe ser MAYOR al Fin de Vigencia del Contrato");
            }
            else if (this._contratoKey.Retroactivo == 2 && this._contratoKey.FechaHasta < this.detalleRemesa.FacturadoHasta) {
                this._contratoKey.FechaHasta = new Date(this.detalleRemesa.FacturadoHasta);
                this.authService.showInfoPopup("El Inicio del Cambio de Plan No Puede ser Menor al Facturado Hasta");
            }
            else if (this._contratoKey.Retroactivo == 1) {
                if (this._contratoKey.FechaHasta < this.fechaMaxima) {
                    this._contratoKey.FechaHasta = new Date(this.detalleRemesa.FacturadoHasta);
                    this._contratoKey.Retroactivo = 2;
                    this.authService.showInfoPopup("Cambio de Plan extemporáneo, Sobrepasó la fecha límite de Cambio");
                }

                else if (this._contratoKey.FechaHasta >= this.detalleRemesa.FacturadoHasta) {

                    this._contratoKey.Retroactivo = 2;
                    this.authService.showInfoPopup("Cambio de Plan NO es Retroactivo, Procede Cambio Normal");
                }
            }
        }
    }

    changeFormaPago() {
        if (this._contratoKey.FormaPago == 2) {
            this._contratoKey.TipoCuenta = 4;
            this._contratoKey.CodigoBanco = undefined;
            this._contratoKey.NumeroCuenta = undefined;
            this._contratoKey.FechaFinTarjeta = undefined;
        }
        if (this._contratoKey.FormaPago == 1) {
            this._contratoKey.TipoCuenta == 1;
        }
        //BUSCA DESCUENTO****************************************************************************
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
    }

    changePeriodoPago() {

        //BUSCA DESCUENTO****************************************************************************
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);

        if (this.meses % this._contratoKey.PeriodoPago != 0) {
            this.authService.showInfoPopup("El periodo de facturación que ud. ha seleccionado no coincidirá con el fin de vigencia en las próximas facturaciones REVISE...");
        }
    }

    changeTipoCuenta() {

        if (this._contratoKey.FormaPago == 1 && this._contratoKey.TipoCuenta == 4) {
            this._contratoKey.TipoCuenta = undefined;
            this.authService.showInfoPopup("Si es Débito, no puede elegir Pago Directo en Tipo-Cuenta");
        }
        if (this._contratoKey.TipoCuenta == 3) {
            this.desabilitar = true;
        }
        else {
            this.desabilitar = false;
        }

        //BUSCA DESCUENTO****************************************************************************
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
    }


    guardarCambioPlan() {
        if(this._contratoKey.FacturarRuc == undefined || this._contratoKey.FacturarRuc == ""){
            this._contratoKey.FacturarRuc == "0000000000000";
        }
        var control = 1;

        if (this._contratoKey.Retroactivo == 1) {

            this.fechaRemesa = new Date(this.detalleRemesa.FechaCreacion);
            var diasDif = this.fechaActual.getTime() - this.fechaRemesa.getTime();
            this.dias = Math.round(diasDif / (1000 * 60 * 60 * 24));
            if (this.dias > 31) {
                control = 0;
                this.authService.showInfoPopup("Han transcurrido mas de 30 días desde la última Facturación. Por lo tanto no puede realizar el cambio retroactivo");
            }
            if (this._contratoKey.FechaHasta < this.fechaMaxima) {
                control = 0;
                this.authService.showInfoPopup("Cambio de Plan extemporáneo, Sobrepasó la fecha límite de Cambio");
            }

        }
        if (this._contratoKey.Retroactivo == 2 && this._contratoKey.FechaHasta < this.detalleRemesa.FacturadoHasta) {
            control = 0;
            this.authService.showInfoPopup("El Inicio del Cambio de Plan No Puede ser Menor al Facturado Hasta");
        }
        if (this._contratoKey.FechaHasta > new Date(this._contratoKey.FechaFin)) {
            control = 0;
            this.authService.showInfoPopup("Fecha Inicio del Cambio de Plan, No debe ser MAYOR al Fin de Vigencia del Contrato");
        }

        //validar que no se suba a un nivel mayor 
        if (this.cambioPlan.Mensaje != undefined) {
            control = 0;
            this.authService.showInfoPopup("No se puede cambiar a un plan Mayor");        
        }

        if (this.seguroCampesino.Cerror != "") {
            control = 0;
        }

        if (control == 1) {
            this._contratoKey.FechaFinTarjetaDate = this.fechaFinTarjeta;
            this.planContrato.Plan.Proceso = "TRAN";
            this.transaccionService.cambiaPlan(this.planContrato).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Se ha cambiado el plan");
                    }

                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error");
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }

    }

    loadPlanCotizacion() {
        this.planService.getListaPlanesCP(this._contratoKey.CodigoProducto,this._contratoKey.NumeroContrato,this._contratoKey.CodigoRegion, "TRAN").subscribe(
            result => {
                this.planesCP =  result;//
            },
            error => this.authService.showErrorPopup(error)
        );        
    }

 
    concatenar(valor:number) : string{
        return (valor/4) + 'px';  
     }
 
     getheight() : string{
         return 10 + 'px';  
      }





      loadBeneficiarios(): void {
        if (this._contratoKey != undefined) {
            var beneficiarioFilter = this.createBeneficiarioFilter(this._contratoKey.CodigoContrato, 0);
            this.beneficiarioService.getBeneficiarioListByContrato(beneficiarioFilter).subscribe(
                beneficiarios => {
                    this.beneficiarios = beneficiarios;                   
                },
                error => this.authService.showErrorPopup(error));
        }
    }



    createBeneficiarioFilter(codigoContrato: number, numeroPersona: number): BeneficiarioKey {
        var beneficiarioFilter = new BeneficiarioKey();
        beneficiarioFilter.CodigoContrato = codigoContrato;
        beneficiarioFilter.NumeroPersona = numeroPersona;
        return beneficiarioFilter;
    }


    
    seleccionar(beneficiario: Beneficiario): void {
        this.limpiarSeleccion();
        if (beneficiario != undefined) {
            beneficiario.Selected = true;
            this.beneficiarioSeleccionado = beneficiario;

        }
    }
    limpiarSeleccion() {
        if (this.beneficiarios != undefined) {
            this.beneficiarios.forEach(element => {
                element.Selected = false;
            });
        }
    }

    pageChanged(){

    }

}