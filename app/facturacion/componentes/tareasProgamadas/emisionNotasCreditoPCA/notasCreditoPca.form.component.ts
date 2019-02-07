import { Component } from '@angular/core';

import { AuthService } from '../../../../seguridad/auth.service';
import { TareasProgramadasFacturacionService } from '../../../service/tareasProgramadasFacturacion.service';
import { GenericosService } from '../../../../common/servicios/genericos.service';

import { CronTabEntity } from '../../../model/cronTabEntity';

@Component({
    selector: 'notasCreditoPca',
    providers: [TareasProgramadasFacturacionService, GenericosService],
    templateUrl: 'notasCreditoPca.form.template.html'
})

export class NotasCreditoPCAFormComponent {

    cronTab: CronTabEntity;


    constructor(private authService: AuthService,
        public tareasProgramadasFacturacionService: TareasProgramadasFacturacionService,
        public genericosService: GenericosService) {
        this.cronTab = new CronTabEntity;
        this.cronTab.Hora = 0;
        this.cronTab.Minutos = 0;
    }

    dias(diariamente: boolean) {

        if (!diariamente) {
            if (this.cronTab.Lunes && this.cronTab.Martes && this.cronTab.Miercoles && this.cronTab.Jueves &&
                this.cronTab.Viernes && this.cronTab.Sabado && this.cronTab.Domingo) {
                this.cronTab.Diariamente = true;
            }
            else {
                this.cronTab.Diariamente = false;
            }
        }
        else {
            if (this.cronTab.Diariamente) {
                this.cronTab.Diariamente = true;
                this.cronTab.Lunes = true;
                this.cronTab.Martes = true;
                this.cronTab.Miercoles = true;
                this.cronTab.Jueves = true;
                this.cronTab.Viernes = true;
                this.cronTab.Sabado = true;
                this.cronTab.Domingo = true;
            }
            else {
                this.cronTab.Diariamente = false;
                this.cronTab.Lunes = false;
                this.cronTab.Martes = false;
                this.cronTab.Miercoles = false;
                this.cronTab.Jueves = false;
                this.cronTab.Viernes = false;
                this.cronTab.Sabado = false;
                this.cronTab.Domingo = false;
            }
        }
    }

    emitir() {
        this.tareasProgramadasFacturacionService.emitirNotasCreditoPCA(this.cronTab)
            .subscribe(result => {
                this.authService.showSuccessPopup(result);
            },
                error => this.authService.showErrorPopup(error));
    }

    eliminarTarea() {
        this.genericosService.eliminarTareaProgramada("EmitirNotasCreditoMasivasPCA")
            .subscribe(result => {
                if(result)
                this.authService.showSuccessPopup("La tarea programada ha sido eliminada");
            },
                error => this.authService.showErrorPopup(error));
    }

}

