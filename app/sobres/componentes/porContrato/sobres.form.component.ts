import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../seguridad/auth.service';
import { RegionService } from '../../../common/servicios/region.service';
import { SobreReembolsoService } from '../../service/sobreReembolso.service';

import { ContratoKey } from '../../../common/model/contrato';
import { ConstantService } from '../../../utils/constant.service';
import { ContratosSbListComponent } from './contratosSb.list.component';
import { Permiso } from '../../../seguridad/usuario';

@Component({
    selector: 'sobresForm',
    providers: [],
    templateUrl: 'sobres.form.template.html'
})

export class SobresFormComponent implements OnInit {

    suscription: any;
    contratoKey: ContratoKey;
    opcion: string;
    accessSobresConsultas: boolean;
    accessSobresIngresar: boolean;
    accessSobresAsignar: boolean;
    accesssSobresAnular: boolean;


    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public sobreReembolsoService: SobreReembolsoService, private constantService: ConstantService,
        private contratosSbListComponent: ContratosSbListComponent) {

        this.verificarPermisos();

        this.contratoKey = new ContratoKey();

        this.suscription = this.contratosSbListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                }
            }
        );
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
