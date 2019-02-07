import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamoService } from '../common/servicios/reclamo.service';
import { TipoLiberarLiquidacion, EstadoCobertura, TipoSolicitud, ProductoContrato } from '../common/model/autorizacion.constant';
import { Region } from '../common/model/region';
import { Catalogo } from '../common/model/catalogo';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { AuthService } from '../seguridad/auth.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { ReclamoEntityFilter } from '../common/model/reclamo';
import { PaginationService } from '../utils/pagination.service';
import { RegionService } from '../common/servicios/region.service';

@Component({  
    providers: [ReporteService],
    templateUrl: 'reporteOdas.template.html'
})

export class ReporteOdasComponent extends PaginationService {

    reclamoEntityFilter: ReclamoEntityFilter;
    regiones: Region[];
    /*tiposLiberarLiquidacion: string[];
    tiposSolicitud: string[];
    estadosCobertura: string[];
    estadosAutorizacion: Catalogo[];*/
    productoContrato: string[];
    reclamos: ReclamoEntityFilter[];


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public reclamoService: ReclamoService, public reporteService: ReporteService, private elementRef: ElementRef, private regionService: RegionService, 
        private router: Router, private chRef: ChangeDetectorRef, private authService: AuthService, private catalogoService: CatalogoService) {
        super(1, 20);
    }

    ngOnInit(): void {
        this.reclamoEntityFilter = new ReclamoEntityFilter();      
        this.loadRegiones();  
        this.productoContrato = ProductoContrato.values;
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
            error => this.authService.showErrorPopup(error));
    }

    filtrar(): void {
        this.reclamoService.ObtenerReporteReclamoOdas(this.reclamoEntityFilter, this.paginationConstants.pageNumber,
            this.paginationConstants.pageSize)
            .subscribe(result => {
                this.reclamos = this.extractDataPaginated(result);
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
        this.reclamoEntityFilter = new ReclamoEntityFilter(); 
        this.resetDefaultPaginationConstanst();
        this.reclamos = [];
    }

    generarReporte(): void {
        this.reporteService.descargarReporteOdas(this.reclamoEntityFilter).subscribe(
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

    colapsarTab(): void {
    
    }
}
