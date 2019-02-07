import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { GrupoService } from '../common/servicios/grupo.service';

import { Grupo, GrupoKey } from '../common/model/grupo';

import { ConstantService } from '../utils/constant.service';
@Component({
    providers: [GrupoService],
    templateUrl: 'corredoresProcess.list.template.html'
})

export class CorredoresProcessListComponent implements OnInit {

    editor: boolean;
    grupo: Grupo;
    grupos: Grupo[];
    isDesplegar: boolean;
    private grupoKey: BehaviorSubject<GrupoKey> = new BehaviorSubject<GrupoKey>(null);
    selector$: Observable<GrupoKey> = this.grupoKey.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
                private authService: AuthService, private constantService: ConstantService,
                public grupoService: GrupoService) {
        this.grupo = new Grupo();
        this.grupos = [];
    }

    ngOnInit(): void {
        this.isDesplegar = false;
        this.loadGrupos();
    }

    pageChanged(): void {
        this.loadGrupos();
    }

    crear(): void {
        this.grupoService.CreateGrupo(this.grupo)
            .subscribe(result => {
                    if(result === true) {
                        this.authService.showSuccessPopup('Se creo correctamente el grupo.');
                        this.loadGrupos();
                        this.grupo = new Grupo();
                    } else {
                        this.authService.showErrorPopup('El Grupo ' + this.grupo.Nombre + ' ya existe.')
                    }
                },
                error => this.authService.showErrorPopup(error));
    }

    limpiar(): void {
        this.grupo = new Grupo();
        this.grupos = [];
    }

    loadGrupos(): void {
        this.grupoService.GetGrupos()
            .subscribe(result => {
                    this.grupos = result;
                },
                error => this.authService.showErrorPopup(error));
    }

    inicializarPanelGrupos(selected: Grupo): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelAC").collapse("show");
        this.creargrupoKey(selected);
        correctHeight();
        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelAC").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new GrupoKey();
        key.unsuscribe = true;
        this.grupoKey.next(key);
    }

    verGrupos(grupo: Grupo): void {
    }

    creargrupoKey(selected: Grupo): void {
        var key = new GrupoKey();
        key.Numero = selected.Numero;
        key.Nombre = selected.Nombre;
        key.NewKey = true;
        this.grupoKey.next(key);
    }
}
