import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { DetalleRemesaCuotas } from '../../common/model/detalleRemesa';
import { DatosFacturacionManual } from '../../common/model/transacciones';


import { DatosAnulacionContrato } from '../../common/model/transacciones';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';

@Component({
    selector: 'facturacionManual',
    providers: [TransaccionService],
    templateUrl: 'facturacionManual.form.template.html'
})

export class FacturacionManualFormComponent {


    desabilitar: boolean;
    cuotas: DetalleRemesaCuotas[];
    cuotaSeleccionada: DetalleRemesaCuotas;


    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined)
            this._contratoKey.Transaccion = "FACTURACION_MANUAL";
        this.loadDataAnulacion();
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        private transaccionService: TransaccionService, public detalleRemesaService: DetalleRemesaService) {
        this._contratoKey = new ContratoKey();
        this.desabilitar = false;
    }

    loadDataAnulacion(): void {
        if (this._contratoKey.ContratoCodigoEstado == 2 || this._contratoKey.ContratoCodigoEstado == 27) {
            this.authService.showInfoPopup("El contrato se encuentra Anulado Actualmente");
            this.desabilitar = true;
        }
        else {
            this.cargarCuotas();
        }
    }

    pageChanged(): void {
        this.cargarCuotas();
    }

    cargarCuotas(): void {
        this.detalleRemesaService.getCuotasPaginated(this._contratoKey).subscribe(
            result => {
                this.cuotas = result;
                if (this.cuotas != undefined && this.cuotas.length > 0) {
                    this.seleccionarCuota(this.cuotas[0]);
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    seleccionarCuota(couta: DetalleRemesaCuotas): void {
        if (this.cuotas != undefined) {
            this.cuotas.forEach(element => {
                element.Selected = false;
            });
        }
        couta.Selected = true;
        this.cuotaSeleccionada = couta;
    }



    anularCotizacion() {
        if (this.cuotaSeleccionada.MotivoCreacion.toLowerCase().indexOf("trans") > -1) {
            this.authService.showInfoPopup("La cotización esta siendo USADA en otra Aplicación, no Procede...");
        }
        else {
            var filter = new DatosFacturacionManual();
            filter.ContratoKey = this._contratoKey;
            filter.DetalleRemesa = this.cuotaSeleccionada;
            this.transaccionService.anularCotizacion(filter).subscribe(
                result => {
                    if (result.EstadoTransaccion) {
                        this.authService.showSuccessPopup("Cotización Anulada");
                        this.pageChanged();
                    }
                    else {
                        this.authService.showErrorPopup(result.Mensaje);
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    nuevaCotizacion() {
        if (this._contratoKey.TipoCuenta == 1 || this._contratoKey.TipoCuenta == 2 || this._contratoKey.TipoCuenta == 3 || this._contratoKey.TipoCuenta == 4) {

            this.transaccionService.crearCotizacion(this._contratoKey).subscribe(
                result => {
                    if (result.EstadoTransaccion) {
                        this.authService.showSuccessPopup("Cotización Creada");
                        this.pageChanged();
                    }
                    else {
                        this.authService.showErrorPopup(result.Mensaje);
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
        else {
            this.authService.showInfoPopup("Tipo de Cuenta Errado, favor Corregirlo");
        }

    }

}