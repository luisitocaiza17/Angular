import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { AdministracionSistemaService } from '../common/servicios/administracionSistema.service';

import { UsuarioAdmin, UsuarioAdminKey } from '../common/model/admin';

import { ConstantService } from '../utils/constant.service';
@Component({
    providers: [AdministracionSistemaService],
    templateUrl: 'usuarios.list.template.html'
})

export class UsuariosListComponent implements OnInit {

    usuario : UsuarioAdmin;
    usuarioSeleccionado : UsuarioAdmin;
    isDesplegar: boolean;

    private usuarioKey: BehaviorSubject<UsuarioAdminKey> = new BehaviorSubject<UsuarioAdminKey>(null);
    selector$: Observable<UsuarioAdminKey> = this.usuarioKey.asObservable();


    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private constantService: ConstantService,
        public administracionSistemaService : AdministracionSistemaService) {

            this.usuario = new UsuarioAdmin();
            this.usuarioSeleccionado = new UsuarioAdmin();
         
    }

    ngOnInit(): void {
        this.isDesplegar = false;
    }



    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.filtrar();
    }

    limpiar(): void {
        this.usuario = new UsuarioAdmin();
        this.usuarioSeleccionado = new UsuarioAdmin();
    }

    filtrar(): void {
        this.administracionSistemaService.GetUsuarioByNombreUsuario(this.usuario.NombreUsuario)
        .subscribe(result => {
            this.usuarioSeleccionado = result;
            if(this.usuarioSeleccionado.NombreUsuario == undefined){
                this.authService.showErrorPopup("Es usuario "+this.usuario.NombreUsuario+" no existe.");
            }else{
                this.usuarioSeleccionado = result;
            }            
        },
        error => this.authService.showErrorPopup(error));
    }

    inicializarPanelRoles(selected: UsuarioAdmin): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelAC").collapse("show");
        this.crearUsuarioKey(selected);
        correctHeight();
        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelAC").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new UsuarioAdminKey();
        key.unsuscribe = true;
        this.usuarioKey.next(key);
    }

    verRoles(usuario : UsuarioAdmin): void {
        
    }

    crearUsuarioKey(selected: UsuarioAdmin): void {
        var key = new UsuarioAdminKey();
        key.IdUsuario = selected.IdUsuario;
        key.NombreCompleto = selected.NombreCompleto;
        key.NombreUsuario = selected.NombreUsuario;
        key.NewKey = true;
        this.usuarioKey.next(key);
    }


}
