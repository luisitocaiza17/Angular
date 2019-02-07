import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';
import { FacturacionService } from '../../../common/servicios/facturacion.service';
import { FacturacionElectronicaService } from '../../../common/servicios/facturacionElectronicaService';

@Component({
    selector: 'generarInformacionComponent',
    providers: [FacturacionElectronicaService],
    templateUrl: 'generarInformacion.component.view.html'
})

export class GenerarInformacionComponent implements OnDestroy {

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;

    constructor( 
        private chRef: ChangeDetectorRef, 
        private authService: AuthService, 
        private facturacionElectronicaService: FacturacionElectronicaService ) {
    }

    ngOnDestroy() {
    }

    generarInformacionEnTablas() { 
        this.facturacionElectronicaService.validarEInsertarInformacionEnTablasFacturacion() 
                .subscribe( 
                    res => this.authService.showSuccessPopup(res), 
                    error => this.authService.showErrorPopup(error)
                ); 
    }

    ConfirmarGenerarInformacionEnTablas(): void {
        swal({
            title: "",
            text: "<h3>" + ' Esta Seguro que desea ejecutar esta acción ' + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "SI",
            cancelButtonText: "NO",
            closeOnConfirm: true,

        },
            confirmed => {
                if (confirmed) {
                    this.generarInformacionEnTablas();
                }

            });
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