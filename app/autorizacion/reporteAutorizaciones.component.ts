import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Autorizacion, AutorizacionFilter } from '../common/model/autorizacion';
import { TipoAplicacion, EstadoCobertura } from '../common/model/autorizacion.constant';
import { TipoPrestador } from '../common/model/convenio';
import { Region } from '../common/model/region';

import { AuthService } from '../seguridad/auth.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { PaginationService } from '../utils/pagination.service';
import { RegionService } from '../common/servicios/region.service';

@Component({
    providers: [ReporteService],
    templateUrl: 'reporteAutorizaciones.template.html'
})

export class ReporteAutorizacionesComponent extends PaginationService {

    autorizacionFilter: AutorizacionFilter;
    regiones: Region[];
    tiposAplicacion: string[];
    tiposPrestador: string[];
    estadosCobertura: string[];

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
        private chRef: ChangeDetectorRef, private authService: AuthService) {
        super(1, 20);
    }

    ngOnInit(): void {
        this.autorizacionFilter = new AutorizacionFilter();
        this.tiposAplicacion = TipoAplicacion.values;
        this.tiposPrestador = TipoPrestador.values;
        this.estadosCobertura = EstadoCobertura.values;
        this.loadRegiones();
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
        this.resetDefaultPaginationConstanst();
        this.filtrar();
    }

    limpiar(): void {
        this.autorizacionFilter = new AutorizacionFilter();
        this.resetDefaultPaginationConstanst();
        this.autorizaciones = [];
    }

    filtrar(): void {
        this.autorizacionService.getReporteAutorizacionesByFilter(this.autorizacionFilter, this.paginationConstants.pageNumber,
            this.paginationConstants.pageSize)
            .subscribe(result => {
                this.autorizaciones = this.extractDataPaginated(result);
            },
            error => this.authService.showErrorPopup(error));
    }

    generarReporte(): void {
        this.reporteService.descargaReporteAutorizaciones(this.autorizacionFilter).subscribe(
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