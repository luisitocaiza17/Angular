import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';
import { FacturacionService } from '../../../common/servicios/facturacion.service';

@Component({
    selector: 'consultasValidacionComponente',
    providers: [FacturacionService],
    templateUrl: 'consultasValidacion.component.html'
})

export class ConsultasValidacionComponent implements OnDestroy {

   numeroEnvio: number

    constructor( 
        private chRef: ChangeDetectorRef, 
        private authService: AuthService, 
        private facturacionService: FacturacionService ) {
    }

    ngOnDestroy() {
    }

    generarArchivoControlFacturas() { 
        this.facturacionService.generarArchivoControlFacturas() 
                .subscribe( 
                res => this.authService.showSuccessPopup(res), 
                error => this.authService.showErrorPopup(error)
            );
    }

    generarArchivoEnvioDocumentos() { 
        this.facturacionService.generarArchivoEnvioDocumentos(this.numeroEnvio) 
                .subscribe( 
                res => this.authService.showSuccessPopup(res), 
                error => this.authService.showErrorPopup(error)
            );
    }

    generarArchivoLogErrores() { 
        this.facturacionService.generarArchivoLogErrores() 
                .subscribe( 
                res => this.authService.showSuccessPopup(res), 
                error => this.authService.showErrorPopup(error)
            );
    }
}