import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';



@Component({
    providers: [],
    templateUrl: 'tareasProgramadasFacturacion.form.component.html'
})

export class TareasProgramadasFacturacionFormComponent implements OnInit {

    opcion: string;
    accessNotasPca: boolean;
    accessNotasLote: boolean;

    constructor(private authService: AuthService) {
        this.accessNotasPca = false;
        this.accessNotasLote = false;
        this.verificarPermisos();
    }

    verificarPermisos(): void {

        this.accessNotasPca = false;
        this.accessNotasLote = false;

        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessNotasPca = true;
                this.accessNotasLote = true;

            }

            var auth = listaPermisos.find(p => p == Permiso.TAREA_PROGRAMADA_NOTAS_PCA);
            if (auth != undefined) {
                this.accessNotasPca = true;
            }

            var auth = listaPermisos.find(p => p == Permiso.TAREA_PROGRAMADA_NOTAS_LOTE);
            if (auth != undefined) {
                this.accessNotasLote = true;
            }
        }
    }



    ngOnInit(): void {
        this.opcion = "";
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }
}