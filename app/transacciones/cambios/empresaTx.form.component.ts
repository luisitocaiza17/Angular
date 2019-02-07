import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { Empresa } from '../../common/model/empresa';
import { EmpresaService } from '../../common/servicios/empresa.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';

import { DatosBancoContrato } from '../../common/model/transacciones';
import { DescuentoEntity } from '../../common/model/descuento';
import { DetalleRemesaCuotas } from '../../common/model/detalleRemesa';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';

@Component({
    selector: 'empresaTx',
    providers: [EmpresaService],
    templateUrl: 'empresaTx.form.template.html'
})

export class EmpresaTxFormComponent implements OnDestroy {

    suscription: any;
    contratoKey: ContratoKey;
    filtroRUC: string;
    empresa: Empresa;
    sucursales: Empresa[];
    busqueda: boolean;

    cantidadContratos: number;
    bancos: DatosBancoContrato[];
    descuentos: DescuentoEntity[];
    fechaFinTarjeta: Date;
    cuotas: DetalleRemesaCuotas[];
    meses: number;
    desabilitar: boolean;
    habilitar: boolean;

    _contratoKey: ContratoKey;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private chRef: ChangeDetectorRef, private authService: AuthService,
        private contratosTxListComponent: ContratosTxListComponent,
        private empresaService: EmpresaService,
        private transaccionService: TransaccionService,
        public detalleRemesaService: DetalleRemesaService) {
        this._contratoKey = new ContratoKey();
        this.empresa = new Empresa();
        this.sucursales = [];
        this.suscription = this.contratosTxListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                    this._contratoKey = contratoKey;
                    this.desabilitar = true;
                } else {
                    this._contratoKey = new ContratoKey();
                    this.bancos = [];
                    this.descuentos = [];
                    this.cuotas = [];
                }
            }
        );
    }

    ngOnInit(): void {
        this.filtroRUC = "";
        this.busqueda = false;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    buscarEmpresa() {
        this.empresaService.getByRuc(this.filtroRUC).subscribe(
            result => {
                this.sucursales = result;
                if (this.sucursales.length >= 1) {
                    this.empresa = this.sucursales[0];
                    this.busqueda = true;
                    this.loadDatos();                    
                } else {
                    this.authService.showErrorPopup("No Existe empresa con ese número de R.U.C.");
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    cambiarEmpresa() {
        this.setDatoAnteriorEmpresa();
        this.empresaService.getActualizarEmpresa(this.empresa.Numero,
            this.empresa.NumeroSucursal, this.contratoKey.CodigoContrato, this.contratoKey).subscribe(
            result => {
                if (result) {                    
                    this.contratoKey.NombreEmpresa = this.empresa.Nombre;
                    this.contratoKey.RucEmpresa = this.filtroRUC
                    this.contratoKey.NombreSucursalEmpresa = this.getNuevoNombreSucursal();
                    this.contratoKey.NumeroSucursal = this.empresa.NumeroSucursal.toString();
                    this.guardarFormaPago();
                    this.filtroRUC = "";
                    this.empresa = new Empresa();
                    this.busqueda = false;

                    
                } else {
                    this.authService.showErrorPopup("No se pudo cambiar la empresa");
                }
                console.log(result);
            },
            error => this.authService.showErrorPopup(error));
    }

    setDatoAnteriorEmpresa(): void {
        this.contratoKey.Anterior = "Cambio Empresa " + this.contratoKey.NumeroEmpresa +
        " FP " + this.contratoKey.FormaPago +
        " TC " + this.contratoKey.TipoCuenta +
        " B " + this.contratoKey.CodigoBanco +
        " PP " + this.contratoKey.PeriodoPago +
        " FR " + this.contratoKey.FacturarRuc +
        " FC " + this.contratoKey.FacturarCedula +
        " FP " + this.contratoKey.FacturarPasaporte +
        " D " + this.contratoKey.NombreDuenioCuenta +
        " NC " + this.contratoKey.NumeroCuenta;
    }
      

    getNuevoNombreSucursal(): string {
        for (let suc of this.sucursales) {
            if (this.empresa.NumeroSucursal == suc.NumeroSucursal)
                return suc.NombreSucursal;
        }
        return "";
    }

    showPopup(msg: string, titulo: string, type: string): void {
        swal({
            title: titulo,
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: type,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        });
    }

    loadDatos() {
        
        this.transaccionService.getDatosFormaPago(this._contratoKey).subscribe(
            result => {
                this.bancos = result.Bancos;
                this.meses = result.Meses;
                this.cantidadContratos = result.CantidadContratos;
                this.descuentos = result.Descuento;
                this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
                this.changeTipoCuenta();
                this._contratoKey.Anterior = "FP " + this._contratoKey.FormaPago +
                    " TC " + this._contratoKey.TipoCuenta +
                    " B " + this._contratoKey.CodigoBanco +
                    " PP " + this._contratoKey.PeriodoPago +
                    " FR " + this._contratoKey.FacturarRuc +
                    " FC " + this._contratoKey.FacturarCedula +
                    " FP " + this._contratoKey.FacturarPasaporte +
                    " D " + this._contratoKey.NombreDuenioCuenta +
                    " NC " + this._contratoKey.NumeroCuenta;

                    if (this.filtroRUC == "9999999999999" || this.empresa.Numero == 1) {                        
                        this.habilitar = false;             
            
                    } else {
                        this.habilitar = true;
                        this._contratoKey.FormaPago = this.empresa.FormaPago;
                        this._contratoKey.TipoCuenta = this.empresa.TipoCuenta;
                        this._contratoKey.CodigoBanco = this.empresa.CodigoBanco;
                        this._contratoKey.PeriodoPago = this.empresa.PeriodoPago;
                        this._contratoKey.FacturarRuc = this.empresa.FacturaRuc;
                        this._contratoKey.FacturarCedula = this.empresa.FacturaCedula;
                        this._contratoKey.FacturarPasaporte = "";
                        this._contratoKey.NombreDuenioCuenta = this.empresa.NombreDuenioCuenta;
                        this._contratoKey.NumeroCuenta= this.empresa.NumeroCuenta;
                      
                    }


                    if (this._contratoKey.FechaFinTarjeta != undefined) {
                        let fecha = this._contratoKey.FechaFinTarjeta.split("/");
                        this._contratoKey.FechaFinTarjeta = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                        this.fechaFinTarjeta = new Date(this._contratoKey.FechaFinTarjeta);
                    }
            
                    if (this._contratoKey.FacturarPasaporte == "") {
                        this._contratoKey.FacturarPasaporte = "0000000000000";
                    }

            },
            error => this.authService.showErrorPopup(error)
        );

    }

    buscaDescuento(tipoCuenta: number, periodoPago: number): void {
        for (let i in this.descuentos) {
            if (this.descuentos[i].TipoCuenta == tipoCuenta && this.descuentos[i].NumeroDesde == this.cantidadContratos) {
                var porcentajeDescuento = this.descuentos[i].PorcentajeDescuento.split(";");
                this._contratoKey.PorcentajeDescuento = parseInt(porcentajeDescuento[periodoPago - 1]);
            }
        }
        if (this._contratoKey.PorcentajeDescuento == undefined) {
            this.showPopup("No encuentro descuento", "", "info");
            this._contratoKey.PorcentajeDescuento = 0;
        }
    }

    changeTipoCuenta() {
        if (this._contratoKey.FormaPago == 1 && this._contratoKey.TipoCuenta == 4) {
            this._contratoKey.TipoCuenta = undefined;
            this.showPopup("Si es Débito, no puede elegir Pago Directo en Tipo-Cuenta", "Datos Incompatibles", "info");
        }
        if (this._contratoKey.TipoCuenta == 3) {
            this.desabilitar = true;
        }
        else {
            this.desabilitar = false;
        }
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
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
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
    }

    changePeriodoPago() {
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
        if (this.meses % this._contratoKey.PeriodoPago != 0) {
            this.showPopup("El periodo de facturación que ud. ha seleccionado no coincidirá con el fin de vigencia en las próximas facturaciones REVISE...", "", "info");
        }
    }

    guardarFormaPago() {
        this.cuotas = [];
        if (this.fechaFinTarjeta != undefined || this.fechaFinTarjeta != null) {
            this._contratoKey.FechaFinTarjetaDate = this.fechaFinTarjeta;
        }
        this._contratoKey.FechaHasta = new Date();
        this.transaccionService.modificarFormaPago(this._contratoKey).subscribe(
            result => {
                if (result) {
                    this.showPopup("La empresa y la forma de pago a sido cambiada correctamente.", "", "info");
                    this.habilitar = result;
                }
                else {
                    this.showPopup("No ha modificado la forma de pago", "", "info");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }







}