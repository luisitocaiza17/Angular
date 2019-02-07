import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';

@Component({
    providers: [],
    templateUrl: 'administracionFunes.form.component.html'
})

export class AdminsitractionFunesFormComponent implements OnInit {

    opcion: string;
    accessConsultarFun: boolean;
    accessAsignarFun: boolean;
    accessAnularFun: boolean;
    accessIngresarFun: boolean;
    accesReactivarFun: boolean;
    accesActivarFunFacturaPrevia: boolean;

    constructor(private authService: AuthService) {
        this.accessConsultarFun = false;
        this.accessAsignarFun = false;
        this.accessAnularFun = false;
        this.accessIngresarFun = false;
        this.accesReactivarFun = false;
        this.accesActivarFunFacturaPrevia = false;
        this.verificarPermisos();
    }

    ngOnInit(): void {
        this.opcion = "ConsultarFun";
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            var adminFun = listaPermisos.find(p => p == Permiso.ADMINISTRADOR_FUN)
            if (admin != undefined || adminFun != undefined) {
                this.accessAsignarFun = true;
                this.accessAnularFun = true;
                this.accessIngresarFun = true;
                this.accessConsultarFun = true;
                this.accesReactivarFun = true;
                this.accesActivarFunFacturaPrevia = true;
            }
            else {
                var auth = listaPermisos.find(p => p == Permiso.ASIGNA_FUN);
                if (auth != undefined)
                    this.accessAsignarFun = true;

                auth = listaPermisos.find(p => p == Permiso.ANULA_FUN);
                if (auth != undefined)
                    this.accessAnularFun = true;

                auth = listaPermisos.find(p => p == Permiso.CREA_FUN);
                if (auth != undefined)
                    this.accessIngresarFun = true;

                auth = listaPermisos.find(p => p == Permiso.CONSULTA_FUN);
                if (auth != undefined)
                    this.accessConsultarFun = true;

                auth = listaPermisos.find(p => p == Permiso.REACTIVA_FUN);
                if (auth != undefined)
                    this.accesReactivarFun = true;

                auth = listaPermisos.find(p => p == Permiso.ACTIVA_FUN_FACTURA_PREVIA);
                if (auth != undefined)
                    this.accesActivarFunFacturaPrevia = true;
            }
        }
    }
}