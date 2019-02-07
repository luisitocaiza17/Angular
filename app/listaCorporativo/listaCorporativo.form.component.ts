import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../app.helpers';
import { ListaCorporativoFilter, ListaCorporativoEntity, ListaCorporativoKey } from '../common/model/listaCorporativo';
import { AuthService } from '../seguridad/auth.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ListaCorporativoService } from '../common/servicios/listaCorporativo.service';
import { ConstantService } from '../utils/constant.service';
import { Permiso } from '../seguridad/usuario';

@Component({
    providers: [ListaCorporativoService],
    templateUrl: 'listaCorporativo.form.template.html'
})

export class ListaCorporativoFormComponent implements OnInit{

    isDesplegar: boolean;

    filter: ListaCorporativoFilter;
    listadoCorporativo: ListaCorporativoEntity[];

    private listaPlanesKey: BehaviorSubject<ListaCorporativoKey> = new BehaviorSubject<ListaCorporativoKey>(null);
    selectPlan$: Observable<ListaCorporativoKey> = this.listaPlanesKey.asObservable();

    constructor(public listaCorporativoService:ListaCorporativoService, private authService: AuthService, 
        private chRef: ChangeDetectorRef, private constantService: ConstantService,  public autorizacionService: AutorizacionService, )
    {
        this.filter = new ListaCorporativoFilter();
        this.listadoCorporativo = [];
    }
    
    ngOnInit(): void {
        this.filter = new ListaCorporativoFilter();
        this.listadoCorporativo = []; 
        this.isDesplegar = false;
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new ListaCorporativoKey();
        key.unsuscribe = true;
        this.listaPlanesKey.next(key);
    }

    inicializarPanelLista(selected: ListaCorporativoEntity): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#clpListaContrato").collapse("hide");
        jQuery("#divPanelPlanes").collapse("show");
        this.crearPlanesKey(selected);
        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelPlanes").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    pageChanged(): void {
        this.filtrar();
    }

    crearPlanesKey(selected:ListaCorporativoEntity):void{
        var key = new ListaCorporativoKey();
        key.SucursalEmpresa = selected.SucursalEmpresa;
        key.EmpresaNumero = selected.EmpresaNumero;
        key.NewKey = true;
        this.listaPlanesKey.next(key);
    }

    buscar():void{
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.listadoCorporativo=[];
        this.filtrar();
    }

    filtrar():void{
        this.listaCorporativoService.getByFilters(20,this.filter).subscribe(
            result => {
                this.listadoCorporativo = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }


    limpiar(): void {
        this.filter = new ListaCorporativoFilter();
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.listadoCorporativo = [];
    }

}