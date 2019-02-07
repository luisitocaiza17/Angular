import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../seguridad/auth.service';
import { RegionService } from '../common/servicios/region.service';
import { ContratoService } from '../common/servicios/contrato.service';
import { SobreReembolsoService } from '../sobres/service/sobreReembolso.service';
import { ConstantService } from '../utils/constant.service';
import { SobreService } from '../common/servicios/sobre.service';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../common/model/contrato';
import { Reclamo, ReclamoEntityFilter } from '../common/model/reclamo';
import { Region } from '../common/model/region';
import { TabPanelControl } from './tabPanelControl';
import { Permiso } from '../seguridad/usuario';
import { SobreFilter } from '../sobres/model/SobreFilter';

@Component({
    providers: [ContratoService, SobreService],
    templateUrl: 'contrato.list.template.html'
})

export class ContratoListComponent implements OnInit {

    contratos: ContratoEntityList[];
    filter: ContratoEntityFilter;
    filterSobres: SobreFilter;
    private tabPanelControl: TabPanelControl;
    consultaExterna: boolean;
    esReclamoLiquidado: boolean;

    regiones: Region[];

    isAuthorizeEdit: boolean;
    isAuthorizeDelete: boolean;
    isDesplegar: boolean;

    reclamoList: Reclamo[];

    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    private NumeroSobreFilter: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    NumeroSobreChange$: Observable<string> = this.NumeroSobreFilter.asObservable();

    constructor(public contratoService: ContratoService, public sobreReembolsoService: SobreReembolsoService,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private regionService: RegionService, private constantService: ConstantService, public sobreService: SobreService) {
        this.tabPanelControl = new TabPanelControl();
        this.filterSobres = new SobreFilter();
    }

    ngOnInit(): void {
        this.filter = new ContratoEntityFilter();
        this.contratos = [];
        this.loadRegiones();
        this.isDesplegar = false;
        this.verificarPermisos();

        this.validarPermisosVendedores();

    }

    validarPermisosVendedores(): void {
        this.filter.Usuario = this.authService.nombreUsuario;
        this.filter.TipoPermiso = this.authService.tipoPermiso;
        //Para maquinas con IP especifica
        let auxBoolean = localStorage.getItem('USER_CARTERA_BOOL');
        if (auxBoolean.toString() == "true") {
            if (this.filter.TipoPermiso == Permiso.CONSULTA_VENDEDOR) {
                console.log("THIS IS A SELLER AT THE ASSIGNED MACHINE");
                this.filter.TipoPermiso = Permiso.CONSULTA_FULL;
            }
        }
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
        this.contratoService.resetDefaultPaginationConstanst();
        this.contratos = [];
        this.validarPermisosVendedores();
        this.filtrar();
    }

    limpiar(): void {
        this.filter = new ContratoEntityFilter();
        this.contratoService.resetDefaultPaginationConstanst();
        this.contratos = [];
        this.validarPermisosVendedores();
    }

    filtrar(): void {

        if ((this.filter.RazonSocial != undefined && this.filter.RazonSocial.trim() != '') || this.filter.NumeroEmpresa != undefined && this.filter.NumeroEmpresa.trim() != '')
            this.filter.filterByEmpresa = true;
        else
            this.filter.filterByEmpresa = false;

        if ((this.filter.NumeroAlcance != undefined) || this.filter.NumeroReclamo != undefined && this.filter.NumeroReclamo != 0)
            this.filter.filterByLiquidacion = true;
        else
            this.filter.filterByLiquidacion = false;

        if (this.filter.NumeroAutorizacion != undefined && this.filter.NumeroAutorizacion != 0)
            this.filter.filterByAutorizacion = true;
        else
            this.filter.filterByAutorizacion = false;

        if (this.filter.NumeroSobre == undefined || this.filter.NumeroSobre.trim() == '') {

            if(this.filter.NumeroEmpresa != "1" && this.filter.NumeroEmpresa != "5000001"){
                this.contratoService.getByFiltersPaginated(this.filter)
                .subscribe(contratos => {
                    this.loadData(contratos);
                },
                    error => this.authService.showErrorPopup(error));
            }

        }
        else {
            var filterReclamo = new ReclamoEntityFilter();
            filterReclamo.NumeroSobre = this.filter.NumeroSobre;
            this.sobreService.getByNumeroSobrePaginated(filterReclamo)
                .subscribe(reclamos => {
                    this.reclamoList = reclamos;
                    if (this.reclamoList.length > 0) {
                        this.NumeroSobreFilter.next(this.filter.NumeroSobre);
                    }
                    else
                        this.loadSobres();
                },
                    error => this.authService.showErrorPopup(error));
        }
    }

    loadData(contratos: ContratoEntityList[]): void {
        this.contratos = contratos;
        if (this.contratos.length == 1) {
            this.inicializarContratoViewModal(this.contratos[0], true);
        } else {
            if (this.contratos.length == 0 && this.filter.TipoPermiso == "VENDEDOR") {
                this.showPopup('No existe un contrato vinculado a su cartera con la búsqueda indicada', 'error');
            }
            var inipos = jQuery("#divResultadoBusquedaContratos").position().top;
            jQuery("html, body").animate({ scrollTop: inipos }, 300);
        }
    }

    showPopup(msg: string, type: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: type,
            closeOnConfirm: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
        });
    }

    inicializarContratoViewModal(selected: ContratoEntityList, openPopup: boolean): void {
        var key = new ContratoKey();
        // obtener el tab que debe estar activo por defecto
        key.ActiveTab = this.obtenerTabActivo();

        key.CodigoContrato = selected.CodigoContrato;
        key.CodigoProducto = selected.CodigoProducto;
        key.CodigoRegion = selected.CodigoRegion;
        key.NumeroContrato = selected.NumeroContrato;
        key.NumeroEmpresa = selected.NumeroEmpresa;
        key.NumeroPersona = selected.NumeroPersona;
        key.NumeroPersonaReclamo = selected.NumeroPersonaReclamo;
        key.filterByLiquidacion = this.filter.filterByLiquidacion;
        key.filterByAutorizacion = this.filter.filterByAutorizacion;
        key.NumeroReclamo = this.filter.NumeroReclamo;
        key.NumeroAlcance = this.filter.NumeroAlcance;
        key.NumeroAutorizacion = this.filter.NumeroAutorizacion;
        key.Transicion = selected.Transicion;
        key.Plan = selected.CodigoPlan;
        key.VersionPlan = selected.VersionPlan;
        key.NumeroSobre = this.filter.filterByNumeroSobre == false ? null : this.filterSobres.NumeroSobre;
        key.PagoInteligente = selected.PagoInteligente;
        key.EnvioPi = selected.EnvioPi;
        key.CodigoBancoCredito = selected.CodigoBancoCredito;
        key.NombreBancoPI = selected.NombreBancoPI;
        key.NumeroCuentaCredito = selected.NumeroCuentaCredito;
        key.EmailDomicilio = selected.EmailDomicilio;
        key.EmailTrabajo = selected.EmailTrabajo;
        key.Celular = selected.Celular;
        key.NewKey = true;
        var fechaString = selected.FechaInicio.split('/');
        key.FechaInicio = new Date(fechaString[2] + "-" + fechaString[1] + "-" + fechaString[0]);

        this.contratoKey.next(key);

        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#clpListaContrato").collapse("hide");
        jQuery("#clpDatosContrato").collapse("show");

        // mostrar activo por defecto el tab que se desee   
        jQuery("#contratoViewModal #" + key.ActiveTab).click();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#contratoViewModal").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
    }

    // Determinar que tab debe estar activo por defecto
    obtenerTabActivo(): string {
        /*if ( this.consultaExterna == true)
        {
            
        }*/

        if (this.filter.filterByLiquidacion || this.filter.filterByAutorizacion)
            return TabPanelControl.TAB_BENEFICIARIOS;

        if (this.filter.filterByNumeroSobre) {
            return TabPanelControl.TAB_SOBRES;
        }

        return TabPanelControl.TAB_DASHBOARD;
    }

    onSelectReclamo(selected: Reclamo): void {

        this.filter.NumeroAlcance = selected.NumeroAlcance;
        this.filter.NumeroReclamo = selected.NumeroReclamo;
        this.filter.filterByLiquidacion = true;
        this.filter.filterByAutorizacion = false;
        this.filter.filterByNumeroSobre = false;

        if ((this.filter.RazonSocial != undefined && this.filter.RazonSocial.trim() != '') || this.filter.NumeroEmpresa != undefined && this.filter.NumeroEmpresa.trim() != '')
            this.filter.filterByEmpresa = true;
        else
            this.filter.filterByEmpresa = false;

        this.contratoService.getByFiltersPaginated(this.filter)
            .subscribe(contratos => {
                this.loadData(contratos);
            },
                error => this.authService.showErrorPopup(error));
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        jQuery("#clpDatosContrato").collapse("hide");
        this.chRef.detectChanges();
        jQuery("#clpListaContrato").collapse("show");
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {

            var permisosConsultaExterna = listaPermisos.find(p => p == Permiso.CONSULTA_EXTERNA);
            if (permisosConsultaExterna != undefined)
                this.consultaExterna = true;
            else
                this.consultaExterna = false;
        }
    }

    verUrl(): void {
        window.open(this.constantService.URL_TRACKING_CONTRATOS.toString(), "_blank");
    }

    loadSobres(): void {
        this.filter.filterByNumeroSobre = true;
        this.filterSobres.NumeroSobre = this.filter.NumeroSobre;
        this.sobreReembolsoService.getSobresByFiltersPaginated(this.filterSobres, 20)
            .subscribe(sobre => {
                if (sobre.length > 0) {
                    this.filter.NumeroContrato = sobre[0].NumeroContrato;
                    this.filter.CodigoRegion = sobre[0].CodigoRegion;
                    this.filter.CodigoProducto = sobre[0].CodigoProducto
                    this.contratoService.getByFiltersPaginated(this.filter)
                        .subscribe(contratos => {
                            this.loadData(contratos);
                            var positionContratoBuscado;
                            for (var i = 0; i < this.contratos.length; i++) {
                                if (this.contratos[i].NumeroContrato == sobre[0].NumeroContrato &&
                                    this.contratos[i].CodigoRegion == sobre[0].CodigoRegion &&
                                    this.contratos[i].CodigoProducto == sobre[0].CodigoProducto)
                                    positionContratoBuscado = i;
                            }
                            this.inicializarContratoViewModal(contratos[positionContratoBuscado], false);
                        },
                            error => this.authService.showErrorPopup(error));
                }
            },
                error => this.authService.showErrorPopup(error));
    }

}