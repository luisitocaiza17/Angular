import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { ChartsModule } from 'ng2-charts';

import { AuthService } from '../seguridad/auth.service';
import { UsuarioAdmin, UsuarioAdminKey, RolAdmin, UsuarioRolAdmin } from '../common/model/admin';
import { UsuariosListComponent } from '../administracion/usuarios.list.component';
import { AdministracionSistemaService } from '../common/servicios/administracionSistema.service';

@Component({
    selector: 'rolUsuario',
    providers: [AdministracionSistemaService],
    templateUrl: 'rolUsuario.template.html'

})
export class RolUsuarioComponent implements OnInit {


    usuarioKey: UsuarioAdminKey;
    suscription: any;
    roles: RolAdmin[];
    rolesAsignados: RolAdmin[];
    filter: UsuarioRolAdmin;


    constructor(private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private usuariosListComponent: UsuariosListComponent,
        public administracionSistemaService: AdministracionSistemaService) {

        this.usuarioKey = new UsuarioAdminKey();
        this.filter = new UsuarioRolAdmin();
        this.roles = [];
        this.rolesAsignados = [];

        this.suscription = this.usuariosListComponent.selector$.subscribe(
            (usuKey) => {
                if (usuKey != undefined) {
                    if (!usuKey.unsuscribe) {
                        this.usuarioKey = usuKey;
                        this.cargarRolesAsignados();
                        this.filter.IdUsuario = this.usuarioKey.IdUsuario;
                    }
                }
            }
        );
    }

    pageChanged(): void {

    }

    cargarRoles(): void {
        this.administracionSistemaService.GetRoles()
            .subscribe(result => {
                this.roles = [];
                let existe = false;
                for (let r of result) {
                    for (let rA of this.rolesAsignados) {
                        if (r.IdRol == rA.IdRol) {
                            existe = true;
                        }
                    }

                    if(!existe){
                        this.roles.push(r);
                    }
                    existe = false;
                    
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    cargarRolesAsignados(): void {
        this.administracionSistemaService.GetRolesByIdUsuario(this.usuarioKey.IdUsuario)
            .subscribe(result => {
                this.rolesAsignados = result;
                this.cargarRoles();
            },
            error => this.authService.showErrorPopup(error));
    }

    ngOnInit(): void {

    }

    eliminarRol(IdRolEliminar: number): void {
        this.filter.IdRol = IdRolEliminar;
        this.administracionSistemaService.eliminarRolAUsuario(this.filter)
            .subscribe(result => {
                if (result == true) {
                    this.cargarRolesAsignados();
                    this.authService.showSuccessPopup("Se elimindo corectamente el rol");
                }
            },
            error => this.authService.showErrorPopup(error));

    }

    guardar(): void {
        this.administracionSistemaService.asignarRolAUsuario(this.filter)
            .subscribe(result => {
                if (result == true) {
                    this.cargarRolesAsignados();
                    this.authService.showSuccessPopup("Se añadio corectamente el rol seleccionado");
                }
            },
            error => this.authService.showErrorPopup(error));
    }

}