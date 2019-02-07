import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../seguridad/auth.service';
import { PaginationService } from '../utils/pagination.service';
import { DiagnosticoService } from '../common/servicios/diagnostico.service';

import { DiagnosticoFilter, Diagnostico } from '../common/model/diagnostico';

@Component({
    providers: [],
    templateUrl: 'catalogoDiagnostico.list.template.html'
})

export class CatalogoDiagnosticoListComponent extends PaginationService implements OnInit {

    filter: DiagnosticoFilter;
    diagnosticos: Diagnostico[];

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private diagnosticoService: DiagnosticoService) {
        super(1, 20);
    }

    ngOnInit(): void {
        this.resetDefaultPaginationConstanst();
        this.filter = new DiagnosticoFilter();
        this.diagnosticos = [];
    }

    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.resetDefaultPaginationConstanst();
        this.filtrar();
    }

    filtrar(): void {
        this.diagnosticoService.getByFilterPaginated(this.filter, this.paginationConstants.pageNumber,
            this.paginationConstants.pageSize)
            .subscribe(result => {
                this.diagnosticos = this.extractDataPaginated(result);
                if (this.diagnosticos != undefined && this.diagnosticos.length > 0) {
                    var inipos = jQuery("#resultadosBusqDiagnostico").position().top;
                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    limpiar(): void {
        this.resetDefaultPaginationConstanst();
        this.filter = new DiagnosticoFilter();
        this.diagnosticos = [];
    }
}
