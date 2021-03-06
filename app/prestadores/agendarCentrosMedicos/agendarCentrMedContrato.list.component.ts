import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../../app.helpers';
import { AuthService } from '../../seguridad/auth.service';
import { RegionService } from '../../common/servicios/region.service';
import { ReclamoService } from '../../common/servicios/reclamo.service';
import { AutorizacionKey } from '../../common/model/autorizacion';
import { GoogleAnalyticsEventsService } from '../../common/servicios/googleAnalyticsEvents.service';

import { Region } from '../../common/model/region';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../../common/model/contrato';
import { ConstantService } from '../../utils/constant.service';
@Component({
    providers: [ReclamoService, GoogleAnalyticsEventsService],
    templateUrl: 'agendarCentrMedContrato.list.template.html'
})

export class AgendarCitaCentroMedicoContratoListComponent implements OnInit {

    contratos: ContratoEntityList[];
    filter: ContratoEntityFilter;
    regiones: Region[];

    isDesplegar: boolean;

    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public reclamoService: ReclamoService, private constantService: ConstantService,
        public googleAnalyticsEventsService : GoogleAnalyticsEventsService) {
            this.initializeAnalytics();
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
        this.reclamoService.resetDefaultPaginationConstanst();
        this.contratos = [];
        this.filtrar();
    }

    limpiar(): void {
        this.filter = new ContratoEntityFilter();
        this.reclamoService.resetDefaultPaginationConstanst();
        this.contratos = [];
    }

    filtrar(): void {
        this.reclamoService.getByFiltersPaginatedForOdas(this.filter)
            .subscribe(contratos => {
                this.loadData(contratos);
                //this.googleAnalyticsEventsService.emitEvent("testCategory", "testAction", "testLabel", 10);
                this.googleAnalyticsEventsService.emitPageView("/search");
               // console.log('paso google analitics');
            },
            error => this.authService.showErrorPopup(error));
    }

    loadData(contratos: ContratoEntityList[]): void {
        this.contratos = contratos;
        var inipos = jQuery("#divResultadoBusquedaContratosAC").position().top;
        jQuery("html, body").animate({ scrollTop: inipos }, 300);
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new ContratoKey();
        key.unsuscribe = true;
        this.contratoKey.next(key);
    }

    inicializarPanelOdas(selected: ContratoEntityList): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelAC").collapse("show");

        this.crearContratoKey(selected);

        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelAC").position().top;
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
        key.CarenciasAmbulatorias = selected.CarenciasAmbulatorias;
        key.OdasConsumidas = selected.OdasConsumidas;
        key.OdasDisponibles = selected.OdasDisponibles;
        // cliente impago
        key.EsMoroso = selected.EsMoroso;
        key.Garantia = selected.Garantia;
        key.Deducible = selected.Deducible;

        key.NewKey = true;
        this.contratoKey.next(key);
    }

    private initializeAnalytics() {
        (function (i, s, o, g, r, a?, m?) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * <any>new Date();
            a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    
        ga('create', this.constantService.ID_GOOGLE_ANALITICS, 'auto');  
       
    }
}
