import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { ReporteMovimiento, ReporteMovimientoFilter, TipoMovimiento } from '../../common/model/movimiento';
import { Region } from '../../common/model/region';

import { AuthService } from '../../seguridad/auth.service';
import { ReporteService } from '../../common/servicios/reporte.service';
import { PaginationService } from '../../utils/pagination.service';
import { RegionService } from '../../common/servicios/region.service';
import { MovimientoService } from '../../common/servicios/movimiento.service';

@Component({
    providers: [ReporteService, MovimientoService],
    templateUrl: 'reporteMovimientos.template.html'
})

export class ReporteMovimientosComponent extends PaginationService {

    movimientoFilter : ReporteMovimientoFilter;
    movimientos : ReporteMovimiento[];
    regiones: Region[];
    tiposAplicacion: string[];
    tiposPrestador: string[];
    estadosCobertura: string[];
    tipoMovimientos : TipoMovimiento[];


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public reporteService: ReporteService, public movimientoService: MovimientoService,
        private elementRef: ElementRef, private regionService: RegionService, private router: Router,
        private chRef: ChangeDetectorRef, private authService: AuthService) {
        super(1, 20);        
    }

    ngOnInit(): void {
        this.loadRegiones();
        this.loadTipoMovimientos();
        this.movimientoFilter = new ReporteMovimientoFilter();
        
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
            error => this.authService.showErrorPopup(error));
    }

    loadTipoMovimientos(): void {
        this.tipoMovimientos = [];
        this.movimientoService.getTipoMovimientos()
            .subscribe(result => {
                this.tipoMovimientos = result ;
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
        this.resetDefaultPaginationConstanst();
        this.movimientoFilter =  new ReporteMovimientoFilter();
    }

    filtrar(): void {
        this.movimientos = [];
        if(this.movimientoFilter.CodigoTransaccion == undefined){
            this.movimientoFilter.CodigoTransaccion = 0 ;
        }
        this.movimientoService.getReporte(this.movimientoFilter).subscribe(
            result => {
                this.movimientos = result;
                
            },
            error => this.authService.showErrorPopup(error));
    }

    generarReporte(): void {
        if(this.movimientoFilter.CodigoTransaccion == undefined){
            this.movimientoFilter.CodigoTransaccion = 0 ;
        }
        this.reporteService.descargaReporteMovimientos(this.movimientoFilter).subscribe(
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