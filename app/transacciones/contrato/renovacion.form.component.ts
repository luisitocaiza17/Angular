import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Plan } from '../../common/model/plan';
import { DatosRenovacion } from '../../common/model/transacciones';

import { ContratoKey } from '../../common/model/contrato';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';




@Component({
    selector: 'renovacion',
    providers: [AutorizacionService],
    templateUrl: 'renovacion.form.template.html'
})

export class RenovacionFormComponent {

    habilitar: boolean;
    datosRenovacion: DatosRenovacion;

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.validar();
        }

        else {
            this._contratoKey = new ContratoKey();
            this.datosRenovacion = new DatosRenovacion();
        }
    }
    constructor(public domSanitizer: DomSanitizer, public autorizacionService: AutorizacionService, private authService: AuthService,
        private contratosTxListComponent: ContratosTxListComponent,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef,
        private planService: PlanService, private transaccionService: TransaccionService) {

        this._contratoKey = new ContratoKey();
        this.datosRenovacion = new DatosRenovacion();
        this.habilitar = false;

    }



    validar() {
        if (this._contratoKey.EsMoroso == true) {
            this.authService.showInfoPopup("Imposible Realizar esta Modificación, Contrato Moroso");
            this.habilitar = true;
        }
        else {
            var diasDif = new Date(this._contratoKey.FechaFin).getTime() - new Date().getTime();
            var mesAux = (Math.round(diasDif / (1000 * 60 * 60 * 24)) / 30);

            if (mesAux < 2) {
                this.load();

            }
            else {
                this.authService.showInfoPopup("Renovación Fuera de Tiempo, Por Favor revise su Contrato");
                this.habilitar = true;
            }

        }
    }

    load() {
        this.transaccionService.getDatosRenovacion(this._contratoKey).subscribe(
            result => {
                this.datosRenovacion.Cobranza = result.Cobranza;
                this.datosRenovacion.PlanesTitularFechaFin = result.PlanesTitularFechaFin
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    guardarRenovacion() {

        var control = 0;
        if (new Date(this._contratoKey.FechaFin) > new Date()) {
            var diasDif = new Date(this._contratoKey.FechaFin).getTime() - new Date().getTime();
            var dias = Math.round(diasDif / (1000 * 60 * 60 * 24));

            if (dias > 60) {

                this.authService.showInfoPopup("Contrato No entra en periodo de Renovación .....Cambio No Procede");
                var control = 1;
            }
        }
        else {
            this._contratoKey.FechaAux = new Date(this._contratoKey.FechaFin);

        }

        if (new Date(this.datosRenovacion.PlanesTitularFechaFin) == new Date(this._contratoKey.FechaFin) || this.datosRenovacion.PlanesTitularFechaFin == undefined) {
            this.authService.showInfoPopup("No Cambia en Planes Cl22, Fechas Diferentes");
            var control = 1;
        }
        if ((this.datosRenovacion.Cobranza == false)) {
            this.authService.showInfoPopup("No Cambia en Cobranzas Cl24, Fechas Diferentes");
            var control = 1;
        }

        if (control == 0) {
            this.transaccionService.renovarContrato(this._contratoKey).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Se ha renovado el contrato");
                    }

                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error, no se ha renovado el Contrato");
                    }
                },
                error => this.authService.showErrorPopup(error)
            );

        }
    }
}
