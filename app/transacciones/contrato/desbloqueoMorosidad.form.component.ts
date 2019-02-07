import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { Plan } from '../../common/model/plan';

import { TransaccionService } from '../../common/servicios/transaccion.service';

@Component({
    selector: 'desbloqueoMorosidad',
    providers: [TransaccionService],
    templateUrl: 'desbloqueoMorosidad.form.template.html'
})

export class DesbloqueoMorosidadFormComponent {
    moroso: boolean = false;
    montoMora: number;
    anterior: string;
    Bloqueo: string;
    desabilitar: boolean;
    desabilitarSelect: boolean;

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined)
            this.loadBloqueo();
        else
            this._contratoKey = new ContratoKey();
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        private transaccionService: TransaccionService) {
        this._contratoKey = new ContratoKey();
    }

    loadBloqueo() {
        if (this._contratoKey.ContratoCodigoEstado == 2 || this._contratoKey.ContratoCodigoEstado == 27) {
            this.authService.showInfoPopup("El contrato se encuentra Anulado Actualmente");
            this.desabilitar = true;
            this.desabilitarSelect = true;
        }
        else {
            console.log(this._contratoKey.EsMoroso);

            if (this._contratoKey.EsMoroso == this.moroso) {
                this.Bloqueo = "2";
                this.anterior = 'No';
                this.montoMora = this._contratoKey.MontoMora;
                this.desabilitar = true;
                this._contratoKey.EstadoMorosidad = false;
            }
            else {
                this.Bloqueo = "1";
                this.anterior = 'Si';
                this.montoMora = this._contratoKey.MontoMora;
                this.desabilitar = true;
                this._contratoKey.EstadoMorosidad = true;
            }
        }
    }

    actualizarMorosidad() {
        if (this.anterior != this.Bloqueo) {
            this.transaccionService.actualizarMorosidad(this._contratoKey).subscribe(
                result => {
                    if (result)
                        this.authService.showSuccessPopup("Se ha Actualizado el Contrato");
                    else
                        this.authService.showErrorPopup("Ha ocurrido un error estableciendo conexión con la base de datos. Por favor intentelo más tarde");
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    desbloquearCombo($event) {
        if (this.desabilitar == true) {
            this.desabilitar = false;
        }
        else {
            this.desabilitar = true;
        }
    }
}