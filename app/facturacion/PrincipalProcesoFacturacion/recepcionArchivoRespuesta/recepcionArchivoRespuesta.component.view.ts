import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';

import { UploadFile } from '../../common/model/uploadFile';

@Component({
    selector: 'recepcionArchivoRespuesta',
    providers: [],
    templateUrl: 'recepcionArchivoRespuesta.component.view.html'
})

export class RecepcionArchivoRespuestaComponent implements OnDestroy {

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;
    
    inputFiles : UploadFile[];

    constructor(private chRef: ChangeDetectorRef, private authService: AuthService ) {
        this.inputFiles = Array<UploadFile>();
        
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

}