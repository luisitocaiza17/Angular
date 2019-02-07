import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { ContratosCrListComponent } from './contratosCrList.list.component';

import { Permiso } from '../../../seguridad/usuario';
import { ContratoKey } from '../../../common/model/contrato';
import { SobreReembolsoService } from '../../../sobres/service/sobreReembolso.service';

@Component({
    selector: 'creditosForm',
    providers: [],
    templateUrl: 'creditos.form.template.html'
})

export class CreditosFormComponent implements OnInit {

    suscription: any;
    contratoKey: ContratoKey;
    opcion: string;
    accessSobresConsultas: boolean;
    accessSobresIngresar: boolean;
    accessSobresAsignar: boolean;
    accesssSobresAnular: boolean;


    constructor(private authService: AuthService,
        public SobreRembolsoService: SobreReembolsoService,
        private ContratosCrListComponent: ContratosCrListComponent) {

        this.verificarPermisos();

        this.contratoKey = new ContratoKey();

        this.suscription = this.ContratosCrListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                }
            }
        );
    }

    ngOnInit(): void {
        this.opcion = "Ingresar";
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

        this.accessSobresConsultas = false;
        this.accessSobresIngresar = false;
        this.accessSobresAsignar = false;
        this.accesssSobresAnular = false;

        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessSobresConsultas = true;
                this.accessSobresIngresar = true;
                this.accessSobresAsignar = true;
                this.accesssSobresAnular = true;
            }

            auth = listaPermisos.find(p => p == Permiso.SOBRES_CONSULTA);
            if (auth != undefined) {
                this.accessSobresConsultas = true;
            }

            var auth = listaPermisos.find(p => p == Permiso.SOBRES_INGRESAR);
            if (auth != undefined) {
                this.accessSobresIngresar = true;
            }

            auth = listaPermisos.find(p => p == Permiso.SOBRES_ASIGNAR);
            if (auth != undefined) {
                this.accessSobresAsignar = true;
            }

            auth = listaPermisos.find(p => p == Permiso.SOBRES_ANULAR);
            if (auth != undefined) {
                this.accesssSobresAnular= true;
            }
        }
    }
}
