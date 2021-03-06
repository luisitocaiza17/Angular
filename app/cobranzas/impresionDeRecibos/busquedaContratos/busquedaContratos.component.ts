import { Component, ElementRef, ChangeDetectorRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ContratoKey, ContratoEntityList, ContratoEntityFilter } from "../../../common/model/contrato";
import { Observable } from 'rxjs/Rx';
import { Router } from "@angular/router";
import { RegionService } from  "../../../common/servicios/region.service";
import { ConstantService } from "../../../utils/constant.service";
import { ContratoService } from "../../../common/servicios/contrato.service";
import { Region } from "../../../common/model/region";
import { AuthService } from "../../../seguridad/auth.service";


@Component({
    selector: 'gestionDeLaCobranza',
    providers: [],
    templateUrl: 'busquedaContratos.template.html'
})

export class BusquedaContratosComponentForRecibos { 
    contratos: ContratoEntityList[];
    filter: ContratoEntityFilter;
    regiones: Region[]; 
    isDesplegar: boolean;

    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    private NumeroSobreFilter: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    NumeroSobreChange$: Observable<string> = this.NumeroSobreFilter.asObservable();

    constructor(public contratoService: ContratoService, private elementRef: ElementRef,
        private router: Router, private chRef: ChangeDetectorRef, private authService: AuthService,
        private regionService: RegionService, private constantService: ConstantService) {
    }

    ngOnInit(): void {
        this.filter = new ContratoEntityFilter();
        this.contratos = [];
        this.loadRegiones();
        this.isDesplegar = false;
        this.filter.Usuario = this.authService.nombreUsuario;
        this.filter.TipoPermiso = this.authService.tipoPermiso;
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
        this.filtrar();
    }

    limpiar(): void {
        this.filter = new ContratoEntityFilter();
        this.contratoService.resetDefaultPaginationConstanst();
        this.contratos = [];
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

        this.contratoService.getByFiltersPaginated(this.filter)
            .subscribe(contratos => {
                this.loadData(contratos);
            },
                error => this.authService.showErrorPopup(error));
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

        key.CodigoProducto = selected.CodigoProducto;
        key.CodigoRegion = selected.CodigoRegion;
        key.NumeroContrato = selected.NumeroContrato;
        key.NombresApellidos = selected.NombresApellidos; 
        key.ContratoEstado = selected.EstadoContrato; 
        key.AFavor = selected.AFavor;
        key.FacturarCedula = selected.FacturarCedula; 
        key.FacturarPasaporte = selected.FacturarPasaporte; 
        key.FacturarRuc = selected.FacturarRuc; 
        key.NumeroEmpresa = selected.NumeroEmpresa; 
        key.CalleCorrespondencia = selected.CalleCorrespondencia; 
        key.FechaInicio = selected.FechaInicioDate; 
        key.FechaFin = selected.FechaFinDate; 
        key.TipoCuenta = selected.TipoCuenta; 
        key.NewKey = true;
        this.contratoKey.next(key);

        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#clpListaContrato").collapse("hide");
        jQuery("#clpDatosContrato").collapse("show");

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#contratoViewModal").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        jQuery("#clpDatosContrato").collapse("hide");
        this.chRef.detectChanges();
        jQuery("#clpListaContrato").collapse("show");
    }

    verUrl(): void {
        window.open(this.constantService.URL_TRACKING_CONTRATOS.toString(), "_blank");
    }
}
