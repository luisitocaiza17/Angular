import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../seguridad/auth.service';
import { PaginationService } from '../utils/pagination.service';
import { ProcedimientoService } from '../common/servicios/procedimiento.service';

import { ProcedimientoFilter, Procedimiento } from '../common/model/procedimiento';

@Component({
    providers: [ProcedimientoService],
    templateUrl: 'catalogoProcemiento.list.template.html'
})

export class CatalogoProcedimientoListComponent extends PaginationService {

    filter: ProcedimientoFilter;
    procedimientos: Procedimiento[];

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private procedimientoService: ProcedimientoService) {
        super(1, 20);
        this.filter = new ProcedimientoFilter();
        this.procedimientos = [];
    }

    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.resetDefaultPaginationConstanst();
        this.filtrar();
    }

    filtrar(): void {
        this.procedimientoService.getByFilterPaginated(this.filter, this.paginationConstants.pageNumber,
            this.paginationConstants.pageSize)
            .subscribe(result => {
                this.procedimientos = this.extractDataPaginated(result);
                if (this.procedimientos != undefined && this.procedimientos.length > 0) {
                    var inipos = jQuery("#resultadosBusqProcedimiento").position().top;
                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                }                
            },
            error => this.authService.showErrorPopup(error));
    }

    limpiar(): void {
        this.resetDefaultPaginationConstanst();
        this.procedimientos = [];
        this.filter = new ProcedimientoFilter();
    }
}
