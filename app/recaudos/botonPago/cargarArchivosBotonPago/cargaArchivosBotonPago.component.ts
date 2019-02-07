import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';
import { UploadFile } from '../../../facturacion/common/model/uploadFile';


@Component({
    selector: 'carga-archivos-boton-pago',
    providers: [],
    templateUrl: 'cargaArchivosBotonPago.component.html'
})

export class CargarArchivosBotonPagoComponent implements OnDestroy {

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