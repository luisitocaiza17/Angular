import { Component } from '@angular/core';

import { AuthService } from './../../../seguridad/auth.service';
import { MasivosService } from '../../services/masivos.service';
import { MasivosEntity } from '../../model/MasivosEntity';
import { ConstantesMasivos } from '../../utils/constantesMasivos';


@Component({
    selector: 'auditarGenerarReclamo',
    providers: [],
    templateUrl: 'auditarGenerarReclamo.form.template.html'
})

export class AuditarGenerarReclamoFormComponent {

    subirArchivo: File;
    masivos: MasivosEntity;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    constructor(private authService: AuthService, private masivosService: MasivosService,
        public constantesMasivos: ConstantesMasivos) {
        this.masivos = new MasivosEntity();

    }

    uploadFileToActivity(files: FileList) {
        this.subirArchivo = null;
        this.subirArchivo = files.item(0);
    }

    buscar() {

        this.masivosService.buscarGenerarMuestra(this.masivos).subscribe(result => {
            this.authService.showSuccessPopup(result);
        },
            error => this.authService.showErrorPopup(error)
        );
    }

}



