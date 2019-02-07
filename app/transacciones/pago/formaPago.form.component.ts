import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { Plan } from '../../common/model/plan';
import { DatosBancoContrato } from '../../common/model/transacciones';
import { DescuentoEntity } from '../../common/model/descuento';
import { DetalleRemesaCuotas, DetalleRemesa } from '../../common/model/detalleRemesa';

import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';
import { number } from 'ng2-validation/dist/number';




@Component({
    selector: 'formaPago',
    providers: [AutorizacionService],
    templateUrl: 'formaPago.form.template.html'
})

export class FormaPagoFormComponent {

    meses: number;
    desabilitar: boolean;
    guardar: boolean;
    habilitar: boolean;
    cantidadContratos: number;
    bancos: DatosBancoContrato[];
    descuentos: DescuentoEntity[];
    fechaFinTarjeta: Date;
    cuotas: DetalleRemesaCuotas[];
    valorPago: number;
    valorPagoDescuento: number;
    valorActual: number;
    valorServicio: number;


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    _contratoKey: ContratoKey;
    DatosContrato: ContratoKey;


    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this._contratoKey.Transaccion = "FORMA_PAGO"
            this.loadDatos();

            this.desabilitar = true;
            this.guardar = false;
        }

        else {
            this._contratoKey = new ContratoKey();
            this.DatosContrato = new ContratoKey();
            this.bancos = [];
            this.descuentos = [];
            this.cuotas = [];
        }
        this.DatosContrato = Object.assign({}, this._contratoKey);
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        private transaccionService: TransaccionService, public detalleRemesaService: DetalleRemesaService, private router: Router) {
        this._contratoKey = new ContratoKey();
        this.DatosContrato = new ContratoKey();
        this.bancos = [];
        this.descuentos = [];
        this.cuotas = [];

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
        if (this._contratoKey.CodigoProducto != "ONC") {
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
        }
    }

    changePeriodoPago() {

        //BUSCA DESCUENTO****************************************************************************
        if (this._contratoKey.CodigoProducto != "ONC") {
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
        }
        this.calculos();


        if (this.meses % this._contratoKey.PeriodoPago != 0) {
            this.authService.showInfoPopup("El periodo de facturación que ud. ha seleccionado no coincidirá con el fin de vigencia en las próximas facturaciones REVISE...");
        }
    }

    calculos() {
        this.valorPagoDescuento = this.valorActual * (this._contratoKey.PorcentajeDescuento / 100);
        this.valorPago = (this.valorActual + this.valorServicio) - this.valorPagoDescuento;
    }

    changeTipoCuenta() {

        if (this._contratoKey.FormaPago == 1 && this._contratoKey.TipoCuenta == 4) {
            this._contratoKey.TipoCuenta = undefined;
            this.authService.showInfoPopup("Si es Débito, no puede elegir Pago Directo en Tipo-Cuenta");
        }
        if (this._contratoKey.TipoCuenta == 3) {
            this.desabilitar = true;
            if (this.fechaFinTarjeta == undefined || this.fechaFinTarjeta == null) {
                this.authService.showInfoPopup("Al seleccionar como Tipo de Cuenta TARJETA Debe ingresar la Fecha de Caducidad de la Tarjeta");
                this.guardar = true;
            }
            else {
                this.guardar = false;
            }
        }
        else {
            this.desabilitar = false;
        }

        //BUSCA DESCUENTO****************************************************************************
        if (this._contratoKey.CodigoProducto != "ONC") {
            this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
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

    loadDatos() {
        /*   if (this._contratoKey.NumeroEmpresa != "1" && this._contratoKey.NumeroEmpresa != "5000001") {
              this.authService.showInfoPopup("Este contrato pertenece a un GRUPAL no puede cambiar por esta transacción");
              this.habilitar = true;
              this._contratoKey.PorcentajeDescuento = 0;
          } */
        // else {


        this.habilitar = false;
        if (this._contratoKey.FechaFinTarjeta != undefined) {
            let fecha = this._contratoKey.FechaFinTarjeta.split("/");
            this._contratoKey.FechaFinTarjeta = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
            this.fechaFinTarjeta = new Date(this._contratoKey.FechaFinTarjeta);
        }

        if (this._contratoKey.FacturarPasaporte == "") {
            this._contratoKey.FacturarPasaporte = "0000000000000";
        }

        this.transaccionService.getDatosFormaPago(this._contratoKey).subscribe(
            result => {
                this.bancos = result.Bancos;
                this._contratoKey.FechaHasta = result.DetalleRemesa.FacturadoHasta;
                this.meses = result.Meses;
                this.cantidadContratos = result.CantidadContratos;
                this.descuentos = result.Descuento;
                this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
                if (this._contratoKey.CodigoProducto == "ONC") {
                    this.DatosContrato.PorcentajeDescuento = result.DescuentoActual;
                    this._contratoKey.PorcentajeDescuento=result.DescuentoActual;
                } else {
                    this.DatosContrato.PorcentajeDescuento = this._contratoKey.PorcentajeDescuento;

                }
                this.calculos();
                this.changeTipoCuenta();
                /*          this._contratoKey.Anterior = "FP " + this._contratoKey.FormaPago +
                             " TC " + this._contratoKey.TipoCuenta +
                             " B " + this._contratoKey.CodigoBanco +
                             " PP " + this._contratoKey.PeriodoPago +
                             " FR " + this._contratoKey.FacturarRuc +
                             " FC " + this._contratoKey.FacturarCedula +
                             " FP " + this._contratoKey.FacturarPasaporte +
                             " D " + this._contratoKey.NombreDuenioCuenta +
                             " NC " + this._contratoKey.NumeroCuenta; */

                this._contratoKey.Anterior = this.verFormaPago(this._contratoKey.FormaPago) +
                    ";" + this.verPeriodoPago(this._contratoKey.PeriodoPago) +
                    ";" + this.verTipoCuenta(this._contratoKey.TipoCuenta) +
                    ";" + this.verBanco(this._contratoKey.CodigoBanco)
                    ;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    validarTargeta() {
        var dateDay = new Date();
        if (this._contratoKey.TipoCuenta == 3) {
            if (this.fechaFinTarjeta != undefined || this.fechaFinTarjeta != null) {
                console.log(this.fechaFinTarjeta);

                if (this.fechaFinTarjeta >= dateDay) {
                    this._contratoKey.FechaFinTarjetaDate = this.fechaFinTarjeta;
                    this.guardar = false;
                } else {
                    this.authService.showErrorPopup("La Fecha de caducidad no puede ser menor al día de hoy");
                    this.guardar = true;
                    //this.fechaFinTarjeta = null;
                }
            }
        }
    }

    guardarFormaPago() {
        this.cuotas = [];
        this.filtrar();



        this._contratoKey.AuxNombreBanco = this.verBanco(this._contratoKey.CodigoBanco);
        this.transaccionService.modificarFormaPago(this._contratoKey).subscribe(
            result => {
                if (result) {

                    this.guardar = result;
                    this.habilitar = result;
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    filtrar(): void {
        
        this.detalleRemesaService.getCuotasPaginated(this._contratoKey)
            .subscribe(cuotas => {
                this.loadData(cuotas);
            },
                error => this.authService.showErrorPopup(error));
    }

    loadData(cuotas: DetalleRemesaCuotas[]): void {
        this.cuotas = cuotas;
        var inipos = jQuery("#divResultadoBusquedaContratos").position().top;
        jQuery("html, body").animate({ scrollTop: inipos }, 300);

        /* if (this.contratos != undefined && this.contratos.length > 0)
             this.crearContratoKey(this.contratos[0]);*/
    }

    pageChanged(): void {
        this.filtrar();
    }

    crearComentario(): void {
        this.router.navigate(['/retencion/comentario/movimiento/' + this._contratoKey.CodigoRegion + '/' + this._contratoKey.CodigoProducto + '/' + this._contratoKey.NumeroContrato + '/FORMAPAGO/']);
    }

    CrearPdfFormularioMovimiento() {
        this.transaccionService.GenerarPdfFormularioMovimientoCambioFormaPago(this.DatosContrato, "Notificación Cambio Forma de Pago (Retención)")
            .subscribe(
                resp => {
                    var blob = new Blob([resp._body], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(blob);
                    window.open(fileURL);
                },
                err => {
                    this.authService.showBlobErrorPopup(err);
                });
    }

    ActualizarCuotas(): void {
        this.transaccionService.actualizarCuotas(this._contratoKey).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Se ha modificado la forma de pago y las Cuotas");
                    this.cuotas = [];
                    this.filtrar();
                }

                else {
                    this.authService.showSuccessPopup("Se ha modificado la forma de pago");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
        this.transferirRemesa();
    }
    Mensaje() {
        this.authService.showSuccessPopup("Se ha modificado la forma de pago");
    }

    verFormaPago(formaPago: number): string {
        var resultado = "";

        switch (formaPago) {
            case 1:
                resultado = "Débito"
                break;

            case 2:
                resultado = "Pago Directo"
                break;

            default:
                break;
        }

        return resultado;
    }

    verPeriodoPago(periodoPago: number): string {
        var resultado = "";
        switch (periodoPago) {
            case 1:
                resultado = "Mensual"
                break;

            case 2:
                resultado = "Bimestral"
                break;

            case 3:
                resultado = "Trimestral"
                break;
            case 4:
                resultado = "Semestral"
                break;
            case 5:
                resultado = "Anual"
                break;
            case 6:
                resultado = "Cuatrimestral"
                break;

            default:
                break;
        }

        return resultado;
    }

    verTipoCuenta(tipoCuenta: number): string {
        var resultado = "";
        switch (tipoCuenta) {
            case 1:
                resultado = "Cuenta Corriente"
                break;

            case 2:
                resultado = "Cuenta Ahorro"
                break;
            case 3:
                resultado = "Tarjeta"
                break;
            case 4:
                resultado = "Pago Directo"
                break;


            default:
                break;
        }
        return resultado;
    }

    verBanco(codigoBanco: number): string {
        var resultado = "";
        if (this.bancos != undefined) {
            this.bancos.forEach(resp => {
                if (resp.CodigoBanco == codigoBanco) {
                    resultado = resp.NombreBanco;
                    return resultado;
                }
            });
        }

        return resultado;
    }


    transferirRemesa(){
        let Remesa = new DetalleRemesa();
        this.cuotas.forEach(cuota=> {
            Remesa.CodigoProducto=this._contratoKey.CodigoProducto;
            Remesa.CodigoBanco=this._contratoKey.CodigoBanco;
            Remesa.ContratoNumero=this._contratoKey.NumeroContrato;
            Remesa.Region=this._contratoKey.CodigoRegion;
            Remesa.NumeroLineaRemesa = cuota.NumeroLineaRemesa+"";
            Remesa.NumeroRemesa =  cuota.NumeroRemesa+"";
            Remesa.EstatusDetalleRemesa=cuota.EstatusDetalleRemesa;
            this.transaccionService.transferenciaRemesaContrato(Remesa).subscribe(
                result => {
                    this.bancos = result;
                },
                error => this.authService.showErrorPopup(error)
            );
        });
    
    }

}