import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Autorizacion, AutorizacionFilter } from '../common/model/autorizacion';
import { TipoLiberarLiquidacion, EstadoCobertura, TipoSolicitud, ProductoContrato } from '../common/model/autorizacion.constant';
import { Region } from '../common/model/region';
import { Catalogo } from '../common/model/catalogo';
import { CatalogoService } from '../common/servicios/catalogo.service';

import { AuthService } from '../seguridad/auth.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { PaginationService } from '../utils/pagination.service';
import { RegionService } from '../common/servicios/region.service';

@Component({
    providers: [ReporteService],
    templateUrl: 'reporteAutorizacionesInSitu.template.html'
})

export class ReporteAutorizacionesInSituComponent extends PaginationService {

    autorizacionFilter: AutorizacionFilter;
    regiones: Region[];
    tiposLiberarLiquidacion: string[];
    tiposSolicitud: string[];
    estadosCobertura: string[];
    estadosAutorizacion: Catalogo[];
    productoContrato: string[];

    autorizaciones: Autorizacion[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public reporteService: ReporteService, private autorizacionService: AutorizacionService,
        private elementRef: ElementRef, private regionService: RegionService, private router: Router,
        private chRef: ChangeDetectorRef, private authService: AuthService, private catalogoService: CatalogoService) {
        super(1, 20);
    }

    ngOnInit(): void {
        this.autorizacionFilter = new AutorizacionFilter();
        this.tiposLiberarLiquidacion = TipoLiberarLiquidacion.values;
        this.tiposSolicitud = TipoSolicitud.values;
        this.estadosCobertura = EstadoCobertura.values;
        this.productoContrato = ProductoContrato.values;
        this.loadEstadosAutorizacion();
        this.loadRegiones();
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
            error => this.authService.showErrorPopup(error));
    }

    loadEstadosAutorizacion(): void {
        this.catalogoService.getEstadosAutorizacion()
            .subscribe(estados => {
                this.estadosAutorizacion = estados;
            },
            error => this.authService.showErrorPopup(error));
    }

    filtrar(): void {
        this.autorizacionService.getReporteAutorizacionesInSituByFilter(this.autorizacionFilter, this.paginationConstants.pageNumber,
            this.paginationConstants.pageSize)
            .subscribe(result => {
                this.autorizaciones = this.extractDataPaginated(result);
            },
            error => this.authService.showErrorPopup(error));
     }

    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
            this.resetDefaultPaginationConstanst();
            this.filtrar();
    }

    limpiar(): void {
        this.autorizacionFilter = new AutorizacionFilter();
        this.resetDefaultPaginationConstanst();
        this.autorizaciones = [];
    }

    generarReporte(): void {
        this.reporteService.descargaReporteAutorizacionesInSitu(this.autorizacionFilter).subscribe(
            result => {
                var blob: Blob = null;
                blob = new Blob([result._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                if (blob != null) {
                    var fileName = result.headers._headers.get("file-name")[0];
                    var url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    document.body.appendChild(link);
                    link.href = url;
                    link.download = fileName;
                    link.click();
                }
            },
            error => this.authService.showBlobErrorPopup(error));
    }
}