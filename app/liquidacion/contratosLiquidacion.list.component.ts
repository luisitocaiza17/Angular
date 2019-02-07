import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { RegionService } from '../common/servicios/region.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { AutorizacionKey } from '../common/model/autorizacion';

import { Region } from '../common/model/region';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../common/model/contrato';
import { ConstantService } from '../utils/constant.service';
@Component({
    providers: [AutorizacionService],
    templateUrl: 'contratosLiquidacion.list.template.html'
})
export class ContratosLiquidacionListComponent implements OnInit {

    contratos: ContratoEntityList[];
    filter: ContratoEntityFilter;
    regiones: Region[];

    isDesplegar: boolean;

    desabilitarPasaporte: boolean; 
    desabilitarApellidos: boolean; 
    desabilitarNombres: boolean; 
    desabilitarCedula: boolean; 
    desabilitarContrato: boolean; 
    desabilitarProducto: boolean; 
    desabilitarRegion: boolean; 
    deshabilitarCobertura: boolean;
    deshabilitarNumeroCaso: boolean;
    seleccionRegion:string;

    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public autorizacionService: AutorizacionService,private constantService: ConstantService) {
            this.filter = new ContratoEntityFilter();
           
    }


    ControlFormulario(contenido : string) { 
        if(contenido==undefined || contenido==''){
            this.desabilitarPasaporte = false;
            this.desabilitarApellidos = false;
            this.desabilitarNombres = false;
            this.desabilitarCedula = false;
            this.desabilitarContrato = false;
            this.desabilitarProducto = false;
            this.desabilitarRegion = false;
            this.deshabilitarNumeroCaso = false;
        }
        else{
            this.desabilitarPasaporte = true;
            this.desabilitarApellidos = true;
            this.desabilitarNombres = true;
            this.desabilitarCedula = true;
            this.desabilitarProducto = true;
            this.desabilitarContrato = true;
            this.desabilitarRegion = true;
            this.deshabilitarNumeroCaso = true;

            var temp = this.filter.NumeroAutorizacion;
            this.filter = new ContratoEntityFilter();
            this.filter.NumeroAutorizacion = parseInt(contenido);
            if (isNaN(this.filter.NumeroAutorizacion))
                this.filter.NumeroAutorizacion = temp;
        }
    }

    ControlFormularioNumeroCaso(contenido : string) { 
        if(contenido==undefined || contenido==''){
            this.desabilitarPasaporte = false;
            this.desabilitarApellidos = false;
            this.desabilitarNombres = false;
            this.desabilitarCedula = false;
            this.desabilitarContrato = false;
            this.desabilitarProducto = false;
            this.desabilitarRegion = false;
            this.deshabilitarCobertura =false;
        }
        else{
            this.desabilitarPasaporte = true;
            this.desabilitarApellidos = true;
            this.desabilitarNombres = true;
            this.desabilitarCedula = true;
            this.desabilitarProducto = true;
            this.desabilitarContrato = true;
            this.desabilitarRegion = true;
            this.deshabilitarCobertura =true;
        }
    }

    ngOnInit(): void {
        this.filter = new ContratoEntityFilter();
        this.contratos = [];
        this.loadRegiones();
        this.isDesplegar = false;
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
            error => this.authService.showErrorPopup(error));
    }

    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.contratos = [];
        if(this.filter.NumeroCaso === undefined){
            this.filtrar();
        }else{
            this.filtrarPorNumeroCaso();
        }
        
    }

    limpiar(): void {
        this.filter = new ContratoEntityFilter();
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.contratos = [];
    }

    filtrar(): void {
        this.autorizacionService.getByFiltersPaginatedForAutorizacion(this.filter)
            .subscribe(contratos => {
                this.loadData(contratos);
            },
            error => this.authService.showErrorPopup(error));
    }

    filtrarPorNumeroCaso(): void {
        this.autorizacionService.getByFiltersNumeroCaso(this.filter)
            .subscribe(contratos => {
                this.loadData(contratos);
            },
            error => this.authService.showErrorPopup(error));
    }

    loadData(contratos: ContratoEntityList[]): void {
        this.contratos = contratos;
        var inipos = jQuery("#divResultadoBusquedaContratosAuth").position().top;
        jQuery("html, body").animate({ scrollTop: inipos }, 300);
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new ContratoKey();
        key.unsuscribe = true;
        this.contratoKey.next(key);
    }

    inicializarPanelAutorizacion(selected: ContratoEntityList): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelAutorizacion").collapse("show");

        this.crearContratoKey(selected);

        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelAutorizacion").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    crearContratoKey(selected: ContratoEntityList): void {
        var key = new ContratoKey();
        key.CodigoContrato = selected.CodigoContrato;
        key.CodigoProducto = selected.CodigoProducto;
        key.CodigoRegion = selected.CodigoRegion;
        key.ContratoEstado = selected.EstadoContrato;
        key.NumeroContrato = selected.NumeroContrato;
        key.Plan = selected.CodigoPlan;
        key.FechaVigencia = selected.FechaVigencia;
        key.NivelReferencia = selected.NivelReferencia;
        key.NombreEmpresa = selected.RazonSocial;
        key.NumeroEmpresa = selected.NumeroEmpresa;
        key.NumeroPersona = selected.NumeroPersona;
        key.NumeroSucursal = selected.NumeroSucursal;
        key.NombreSucursalEmpresa = selected.Sucursal;
        key.SucursalBloqueada = selected.SucursalBloqueada;
        key.Observaciones = selected.Observaciones;
        key.CeroTramites = selected.CeroTramites;
        key.Transicion = selected.Transicion;
        key.NombreTitular = selected.NombresApellidos;
        key.CedulaTitular = selected.Cedula;
        key.EmailDomicilio = selected.EmailDomicilio;
        key.EmailTrabajo = selected.EmailTrabajo;
        key.VersionPlan = selected.VersionPlan;
        // cliente impago
        key.EsMoroso = selected.EsMoroso;
        key.Garantia = selected.Garantia;
        key.Deducible = selected.Deducible;

        key.NewKey = true;
        this.contratoKey.next(key);
    }


}
