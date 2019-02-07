import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';
import { FacturacionService } from '../../../common/servicios/facturacion.service';

@Component({
    selector: 'generacionTxtFacturacionComponent',
    providers: [FacturacionService],
    templateUrl: 'generacionTxtFacturacion.component.view.html'
})

export class GeneracionTxtFacturacionComponent implements OnDestroy {

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;

    constructor( 
        private chRef: ChangeDetectorRef, 
        private authService: AuthService, 
        private facturacionService: FacturacionService ) {
    }

    ngOnDestroy() {
    }

    generarInformacionEnTxt() { 
        this.facturacionService.generarDocumentosTxtFacturacion() 
                .subscribe( 
                res => this.authService.showSuccessPopup(res), 
                error => this.authService.showErrorPopup(error)
            );
    }
}