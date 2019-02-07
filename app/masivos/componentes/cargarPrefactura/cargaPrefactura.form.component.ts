import { Component } from '@angular/core';

import { AuthService } from './../../../seguridad/auth.service';
import { CargarArchivosMasivosService } from '../../services/cargarArchivoMasivos.service';
import { MasivosEntity } from '../../model/MasivosEntity';
import { ConstantesMasivos } from '../../utils/constantesMasivos';


@Component({
    selector: 'cargaPrefactura',
    providers: [],
    templateUrl: 'cargaPrefactura.form.template.html'
})

export class CargaPrefacturaFormComponent {

    subirArchivo: File;
    masivos: MasivosEntity;

    constructor(private authService: AuthService, private cargarArchivosService: CargarArchivosMasivosService,
        public constantesMasivos: ConstantesMasivos) {
        this.masivos = new MasivosEntity();

    }

    uploadFileToActivity(files: FileList) {
        this.subirArchivo = null;
        this.subirArchivo = files.item(0);
    }

    llamar() {
        if (this.subirArchivo != null) {
            this.cargarArchivosService.cargarArchivo(this.subirArchivo, this.masivos).subscribe(result => {
                this.authService.showSuccessPopup(result);
            },
                error => this.authService.showErrorPopup(error)
            );
        }

    }
}


