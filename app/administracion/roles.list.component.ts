import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { AdministracionSistemaService } from '../common/servicios/administracionSistema.service';

import { RolAdmin, RolAdminKey } from '../common/model/admin';

import { ConstantService } from '../utils/constant.service';
@Component({
    providers: [AdministracionSistemaService],
    templateUrl: 'roles.list.template.html'
})

export class RolesListComponent implements OnInit {

    rol : RolAdmin;
    roles : RolAdmin[];
    isDesplegar: boolean;

    private rolKey: BehaviorSubject<RolAdminKey> = new BehaviorSubject<RolAdminKey>(null);
    selector$: Observable<RolAdminKey> = this.rolKey.asObservable();


    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private constantService: ConstantService,
        public administracionSistemaService : AdministracionSistemaService) {

            this.rol = new RolAdmin();
            this.roles = [];
         
    }

    ngOnInit(): void {
        this.isDesplegar = false;
        this.loadRolers();
    }



    pageChanged(): void {
        this.loadRolers();
    }

    crear(): void {
        this.administracionSistemaService.CreateRol(this.rol.NombreRol)
        .subscribe(result => {
            if(result == true){
                this.authService.showSuccessPopup("Se creo correctamente el rol.");
                this.loadRolers();  
                this.rol = new RolAdmin();
            }else{
                this.authService.showErrorPopup("El Rol "+this.rol.NombreRol+" ya existe.")
            }
            
                  
        },
        error => this.authService.showErrorPopup(error));
    }

    limpiar(): void {
        this.rol = new RolAdmin();
        this.roles = [];
    }

    loadRolers(): void {
        this.administracionSistemaService.GetRoles()
        .subscribe(result => {
            this.roles = result;         
        },
        error => this.authService.showErrorPopup(error));
    }

    inicializarPanelRoles(selected: RolAdmin): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelAC").collapse("show");
        this.crearrolKey(selected);
        correctHeight();
        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelAC").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new RolAdminKey();
        key.unsuscribe = true;
        this.rolKey.next(key);
    }

    verRoles(rol : RolAdmin): void {
        
    }

    crearrolKey(selected: RolAdmin): void {
        var key = new RolAdminKey();
        key.IdRol = selected.IdRol;
        key.NombreRol = selected.NombreRol;
        key.NewKey = true;
        this.rolKey.next(key);
    }


}
