import { Component, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../seguridad/auth.service';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';

import { TabPanelControl } from '../tabPanelControl';
import { ContratoKey } from '../../common/model/contrato';
import { ContratoViewComponent } from '../contrato.view.component';
import { Beneficiario, BeneficiarioKey } from '../../common/model/beneficiario';
import { Permiso } from '../../seguridad/usuario';

@Component({
    selector: 'beneficiarios',
    providers: [BeneficiarioService],
    templateUrl: 'beneficiarios.template.html'
})

export class BeneficiariosComponent extends TabPanelControl implements OnDestroy {

    beneficiarios: Beneficiario[];
    beneficiarioSeleccionado: Beneficiario;
    tabSeleccionado: string;
    contratoKey: ContratoKey;
    consultaExterna: boolean;
    
    suscription: any;

    consultaFull: boolean;

    private beneficiarioKey: BehaviorSubject<BeneficiarioKey> = new BehaviorSubject<BeneficiarioKey>(new BeneficiarioKey());
    beneficiarioKey$: Observable<BeneficiarioKey> = this.beneficiarioKey.asObservable();

    constructor(private authService: AuthService, private contratoViewComponent: ContratoViewComponent,
        public beneficiarioService: BeneficiarioService) {

        super(TabPanelControl.TAB_BENEFICIARIOS);

        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                this.contratoKey = contratoKey;
                this.cargarDatos();  
                this.verificarPermisos();             
            }
        );
    }

    ngOnInit(): void {
        this.beneficiarios = [];        
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    pageChanged(): void {
        this.loadBeneficiarioList();
    }

    cargarDatos(): void {
        if (this.contratoKey != undefined) {
            if (this.contratoKey.NewKey) {
                this.loaded = false;
                this.beneficiarios = [];
                this.beneficiarioSeleccionado = new Beneficiario();
            }

            if (this.isActive(this.contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadBeneficiarioList();
                }
            }
        } else {
            this.beneficiarios = [];
            this.beneficiarioSeleccionado = new Beneficiario();
        }
    }

    loadBeneficiarioList(): void {        
        this.tabSeleccionado = this.obtenerTabActivo();
        if (this.contratoKey != undefined) {
            var beneficiarioFilter = this.createBeneficiarioFilter(this.contratoKey.CodigoContrato, 0);
            this.beneficiarioService.getBeneficiarioListByContrato(beneficiarioFilter).subscribe(
                beneficiarios => {
                    this.loadData(beneficiarios);
                    this.loaded = true;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    loadData(beneficiarios: Beneficiario[]): void {
        this.beneficiarios = beneficiarios;
        if (this.contratoKey != undefined && this.contratoKey.filterByLiquidacion && this.contratoKey.NumeroPersonaReclamo != undefined) {
            var beneficiarioLiquidacion = this.seleccionarFiltroLiquidacion(this.contratoKey.NumeroPersonaReclamo);
            this.seleccionar(beneficiarioLiquidacion, false);
        } else {
            if (this.beneficiarios != undefined && this.beneficiarios.length > 0) {
                this.seleccionar(this.beneficiarios[0], false);
                this.loaded = true;
            }
        }
    }

    seleccionar(beneficiario: Beneficiario, irADetalles: boolean): void {
        this.limpiarSeleccion();
        if (beneficiario != undefined) {
            beneficiario.Selected = true;
            this.beneficiarioSeleccionado = beneficiario;
            this.createBeneficiarioKey(this.beneficiarioSeleccionado);
            if (irADetalles)
                this.goToDetails();
        }

        //Selecciona el tab correspondiente
        jQuery("#divTabsBeneficiario #" + this.tabSeleccionado).click();
    }

    limpiarSeleccion() {
        if (this.beneficiarios != undefined) {
            this.beneficiarios.forEach(element => {
                element.Selected = false;
            });
        }
    }

    seleccionarFiltroLiquidacion(numeroPersona: number): Beneficiario {
        var beneficiarioLiq = new Beneficiario();
        if (this.beneficiarios != undefined && numeroPersona != undefined) {
            this.beneficiarios.forEach(element => {
                if (element.NumeroPersona == numeroPersona)
                    beneficiarioLiq = element;
            });
        }
        return beneficiarioLiq;
    }

    createBeneficiarioKey(beneficiario: Beneficiario) {
        this.beneficiarioSeleccionado = beneficiario;
        this.createBeneficiarioKeyGenerico(beneficiario.NumeroPersona);
    }

    createBeneficiarioEntityKey(beneficiario: Beneficiario) {
        this.createBeneficiarioKeyGenerico(beneficiario.NumeroPersona);
    }

    createBeneficiarioKeyGenerico(numeroPersona: number) {
        var key = new BeneficiarioKey();
        key.CodigoContrato = this.contratoKey.CodigoContrato;
        key.CodigoProducto = this.contratoKey.CodigoProducto;
        key.CodigoRegion = this.contratoKey.CodigoRegion;
        key.NumeroContrato = this.contratoKey.NumeroContrato;
        key.NumeroEmpresa = this.contratoKey.NumeroEmpresa;
        key.NumeroPersona = numeroPersona;
        key.NumeroAlcance = this.contratoKey.NumeroAlcance;
        key.NumeroReclamo = this.contratoKey.NumeroReclamo;
        key.filterByLiquidacion = this.contratoKey.filterByLiquidacion;
        key.filterByAutorizacion = this.contratoKey.filterByAutorizacion;
        key.NumeroAutorizacion = this.contratoKey.NumeroAutorizacion;
        key.ActiveTab = this.tabSeleccionado;
        key.NewKey = true;
        key.Transicion = this.contratoKey.Transicion;
        key.CodigoPlan = this.contratoKey.Plan;
        key.VersionPlan = this.contratoKey.VersionPlan;
        this.beneficiarioKey.next(key);
    }

    changeTabSeleccion(tabId: string) {
        this.tabSeleccionado = tabId;
        var key = this.beneficiarioKey.getValue();
        key.ActiveTab = tabId;
        key.NewKey = false;
        this.beneficiarioKey.next(key);
    }

    createBeneficiarioFilter(codigoContrato: number, numeroPersona: number): BeneficiarioKey {
        var beneficiarioFilter = new BeneficiarioKey();
        beneficiarioFilter.CodigoContrato = codigoContrato;
        beneficiarioFilter.NumeroPersona = numeroPersona;
        return beneficiarioFilter;
    }

    obtenerTabActivo(): string {                       
        if (this.contratoKey != undefined && this.contratoKey.filterByLiquidacion)
            return TabPanelControl.TAB_BENEFICIARIOS_RECLAMOS;

        if (this.contratoKey != undefined && this.contratoKey.filterByAutorizacion)
            return TabPanelControl.TAB_BENEFICIARIOS_AUTORIZACION;

        return TabPanelControl.TAB_BENEFICIARIOS_RESUMEN;
    }

    goToDetails(): void {
        var inipos = jQuery("#divTabsBeneficiario").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 285 }, 300);

    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var permisoConsultaFull = listaPermisos.find(p => p == Permiso.CONSULTA_FULL || p == Permiso.ADMINISTRADOR);
            if (permisoConsultaFull != undefined)
                this.consultaFull = true;
            else
                this.consultaFull = false;

            var permisosConsultaExterna = listaPermisos.find(p => p == Permiso.CONSULTA_EXTERNA);
            if(permisosConsultaExterna != undefined)
                this.consultaExterna = true;
            else
                this.consultaExterna = false;
        }
    }
}