import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { ChartsModule } from 'ng2-charts';

import { AuthService } from '../seguridad/auth.service';
import { UsuarioAdmin, UsuarioAdminKey, RolAdmin, UsuarioRolAdmin, RolAdminKey, FuncionalidadAdmin, FuncionalidadRolAdmin } from '../common/model/admin';
import { RolesListComponent } from '../administracion/roles.list.component';
import { AdministracionSistemaService } from '../common/servicios/administracionSistema.service';

@Component({
    selector: 'rolFuncionalidad',
    providers: [AdministracionSistemaService],
    templateUrl: 'rolFuncionalidad.template.html'

})
export class RolFuncionalidadComponent implements OnInit {

    rolKey: RolAdminKey;
    suscription: any;
    funcionalidades: FuncionalidadAdmin[];
    funcionalidadesAsignados: FuncionalidadAdmin[];
    filter: FuncionalidadRolAdmin;


    constructor(private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private rolesListComponent: RolesListComponent,
        public administracionSistemaService: AdministracionSistemaService) {

        this.rolKey = new RolAdminKey();
        this.filter = new FuncionalidadRolAdmin();
        this.funcionalidades = [];
        this.funcionalidadesAsignados = [];

        this.suscription = this.rolesListComponent.selector$.subscribe(
            (rolKey) => {
                if (rolKey != undefined) {
                    if (!rolKey.unsuscribe) {
                        this.rolKey = rolKey;
                        this.cargarFuncionalidadAsignada();
                        this.filter.IdRol = this.rolKey.IdRol;
                    }
                }
            }
        );
    }

    pageChanged(): void {

    }

    cargarFuncionalidades(): void {
        this.administracionSistemaService.GetFuncionalidades()
            .subscribe(result => {
                this.funcionalidades = [];
                let existe = false;
                for (let r of result) {
                    for (let rA of this.funcionalidadesAsignados) {
                        if (r.IdFuncionalidad == rA.IdFuncionalidad) {
                            existe = true;
                        }
                    }
                    if(!existe){
                        this.funcionalidades.push(r);
                    }
                    existe = false;                    
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    cargarFuncionalidadAsignada(): void {
        this.administracionSistemaService.GetFuncionalidadesByIdRol(this.rolKey.IdRol)
            .subscribe(result => {
                this.funcionalidadesAsignados = result;
                this.cargarFuncionalidades();
            },
            error => this.authService.showErrorPopup(error));
    }

    ngOnInit(): void {

    }

    eliminarRol(IdFuncionalidadEliminar: number): void {
        this.filter.IdFuncionalidad = IdFuncionalidadEliminar;
        this.administracionSistemaService.eliminarFuncionalidadARol(this.filter)
            .subscribe(result => {
                if (result == true) {
                    this.cargarFuncionalidadAsignada();
                    this.authService.showSuccessPopup("Se elimindo corectamente la funcionalidad");
                }
            },
            error => this.authService.showErrorPopup(error));

    }

    guardar(): void {
        this.administracionSistemaService.asignarFuncionalidadARol(this.filter)
            .subscribe(result => {
                if (result == true) {
                    this.cargarFuncionalidadAsignada();
                    this.authService.showSuccessPopup("Se añadio corectamente la funcionalidad seleccionada");
                }
            },
            error => this.authService.showErrorPopup(error));
    }

}