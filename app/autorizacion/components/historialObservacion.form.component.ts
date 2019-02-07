import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgModel } from '@angular/forms';

import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Autorizacion } from '../../common/model/autorizacion';
import { ObservacionAutorizacion } from '../../common/model/observacionAutorizacion';
import { ObservacionAutorizacionService } from '../../common/servicios/observacionAutorizacion.service';

@Component({
    selector: 'historialObservacionForm',
    providers: [ObservacionAutorizacionService],
    templateUrl: 'historialObservacion.form.template.html'
})

export class HistorialObservacionForm {

    observacionesCompletas: ObservacionAutorizacion[];

    _autorizacion: Autorizacion;
    texto = "\n\n DESCRIPCION DE LA ENFERMEDAD"
    + "\n\n ANTECEDENTES PATOLOGICOS (Registrar fecha de realización)"
    + "\n\n CODIGO Y DESCRIPCIÓN DE/LOS DIAGNOSTICOS"
    + "\n\n\n\n CODIGO Y DESCRIPCIÓN DE/LOS PROCEDIMINETOS PROPUESTOS"
    + "\n\n RESULTADO DE LA INVESTIGACION (Registrar: Fecha. fuente, descripción de lo obtenido)\n";
    @Input()
    set autorizacion(autorizacionObj: Autorizacion) {
        this._autorizacion = autorizacionObj;
        if (this._autorizacion == undefined)
            this._autorizacion = new Autorizacion();
        if (this.autorizacion.CodigoContrato != undefined)
            this.loadObservaciones();
    }

    get autorizacion() {
        return this._autorizacion;
    }

    _numeroObservacion: number;
    @Input()
    set numeroObservacion(numero: number) {
        this._numeroObservacion = numero;
        this.loadObservacion();
    }

    get numeroObservacion() {
        return this._numeroObservacion;
    }

    constructor(public observacionAutorizacionService: ObservacionAutorizacionService, private authService: AuthService,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef) {
        this.autorizacion = new Autorizacion();
    }

    ngOnInit(): void {
        this.observacionesCompletas = [];
    }

    loadObservaciones() {
        if (this.observacionesCompletas == undefined || this.observacionesCompletas.length < 1) {
            this.observacionAutorizacionService.getAll()
                .subscribe(observaciones => {
                    this.observacionesCompletas = observaciones;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    onChangeSelection() {
        var observacion = this.observacionesCompletas.find(b => b.Numero == this._autorizacion.NumeroObservacion);
        if (observacion != undefined) {
            this._autorizacion.NumeroObservacion = observacion.Numero;
            this._autorizacion.Observaciones = observacion.Observacion;
        }
        else {
            this._autorizacion.NumeroObservacion = undefined;
            this._autorizacion.Observaciones = null;
        }
    }

    loadObservacion(): void {
        if (this._numeroObservacion != undefined) {
            this._autorizacion.NumeroObservacion = this._numeroObservacion;
            this.onChangeSelection();
        }
        else {
            this._autorizacion.NumeroObservacion = undefined;
            this._autorizacion.Observaciones = null;
        }
    }

    textoHistoria(): void {
        if (this.authService.isAuthorizeRequest()) {
            swal({
                title: "Atención!",
                text: "Las cabeceras de análisis de coberturas serán agregadas al final del texto ingresado en el campo HISTORIA CLÍNICA",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#ec4758",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
            }, () => {
                if (this.autorizacion.ObservacionHistoriaClinica != undefined) {
                    this.autorizacion.ObservacionHistoriaClinica = this.autorizacion.ObservacionHistoriaClinica + this.texto;
                }
                else {
                    this.autorizacion.ObservacionHistoriaClinica = this.texto;
                }
                this.chRef.detectChanges();
            });
        }
    }
}