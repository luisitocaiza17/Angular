import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratosTxListComponent } from '../contratosTx.list.component';

import { AuthService } from '../../seguridad/auth.service';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';

import { ContratoKey } from '../../common/model/contrato';

@Component({
    selector: 'mantenimientoOnservacion',
    providers: [AutorizacionService],
    templateUrl: 'mantenimientoObservacion.form.template.html'
})
export class MantenimientoObservacionFormComponent {
    suscription: any;
    desabilitar: boolean;

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.loadObservacion();
        }
    }

    constructor(public domSanitizer: DomSanitizer, public autorizacionService: AutorizacionService, private authService: AuthService,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef,
        private transaccionService: TransaccionService) {
        this._contratoKey = new ContratoKey();
    }

    guardarObservacion() {
        this.transaccionService.actualizarObservacion(this._contratoKey).subscribe(
            result => {
                if (result)
                    this.authService.showSuccessPopup("Se ha Actualizado las Observaciones");
                else
                    this.authService.showErrorPopup("No se ha Actualizado las Observaciones");
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadObservacion(): void {
        if (this._contratoKey.ContratoCodigoEstado == 2 || this._contratoKey.ContratoCodigoEstado == 27) {
            this.authService.showInfoPopup("El contrato se encuentra Anulado Actualmente");
            this.desabilitar = true;
        }
    }

    nuevaObservacion(contenido: string) {
        this._contratoKey.Observaciones = contenido;
    }
}