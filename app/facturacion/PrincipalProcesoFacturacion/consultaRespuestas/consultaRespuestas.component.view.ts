import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';

@Component({
    selector: 'consultaRespuestasFacturacion',
    providers: [],
    templateUrl: 'consultaRespuestas.component.view.html'
})

export class ConsultaRespuestasComponent implements OnDestroy {

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;

    constructor( 
        private chRef: ChangeDetectorRef, private authService: AuthService ) {
    }

    ngOnDestroy() {
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var permisoConsultaFull = listaPermisos.find(p => p == Permiso.CONSULTA_FULL || p == Permiso.ADMINISTRADOR);
            if (permisoConsultaFull != undefined)
                this.consultaFull = true;
            else
                this.consultaFull = false;

            var permisosConsultaExterna = listaPermisos.find(p => p == Permiso.CONSULTA_EXTERNA);
            if(permisosConsultaExterna != undefined)
                this.consultaExterna = true;
            else
                this.consultaExterna = false;
        }
    }

    colapsarTab(){
        
    }

}