import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../seguridad/auth.service';
import { PaginationService } from '../../utils/pagination.service';
import { ProcedimientoService } from '../../common/servicios/procedimiento.service';
import { ValorPuntoService } from '../../common/servicios/valorPunto.service';
import { correctHeight } from '../../app.helpers';


import { ProcedimientoFilter, Procedimiento } from '../../common/model/procedimiento';
import { ValorPunto, ValorPuntoFilter } from '../../common/model/valorPunto';
import { Permiso } from '../../seguridad/usuario';


@Component({
    providers: [],
    templateUrl: 'catalogoValorPunto.list.template.html'
})
export class CatalogoValorPuntoListComponent extends PaginationService implements OnInit {

    filter: ProcedimientoFilter;
    procedimientos: Procedimiento[];
    procedimientoSelected: Procedimiento;

    valorPuntoFilter: ValorPuntoFilter;

    valorPuntoSeleccionado: ValorPunto;
    valoresPunto: ValorPunto[];

    valoresPuntoCorporativo: ValorPunto[];

    accessEditValorPunto: boolean;
    tipoValor: number; //1.INDIVIDUAL --> 2.CORPORATIVO
    isNuevoPuntoValor: boolean;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es',
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private procedimientoService: ProcedimientoService,
        private valorPuntoService: ValorPuntoService) {
        super(1, 5);
        this.verificarPermisos();
        this.filter = new ProcedimientoFilter();
        this.procedimientos = [];
        this.procedimientoSelected = new Procedimiento();
        this.valorPuntoSeleccionado = new ValorPunto();
        this.valoresPunto = [];
        this.tipoValor = 1;
        this.isNuevoPuntoValor = false;
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessEditValorPunto = true;
            }
            else {
                var auth = listaPermisos.find(p => p == Permiso.CATALOGOS_EDIT_VALOR_PUNTO);
                if (auth != undefined)
                    this.accessEditValorPunto = true;
            }
        }
    }


    ngOnInit(): void {
        this.valorPuntoFilter = new ValorPuntoFilter();
        this.valorPuntoFilter.FechaIncurrencia = new Date(Date.now());
        this.filtrar();
    }

    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.resetDefaultPaginationConstanst();
        this.filtrar();
    }

    filtrar(): void {
        this.verifyFechaIncurrencia();
        this.procedimientoService.getForValorPuntoByFilterPaginated(this.filter, this.paginationConstants.pageNumber,
            this.paginationConstants.pageSize)
            .subscribe(result => {
                this.procedimientos = this.extractDataPaginated(result);
                if (this.procedimientos != undefined && this.procedimientos.length > 0) {
                    this.seleccionar(this.procedimientos[0]);
                }
            },
                error => this.authService.showErrorPopup(error));
    }

    limpiar(): void {
        this.resetDefaultPaginationConstanst();
        this.procedimientos = [];
        this.filter = new ProcedimientoFilter();
        this.valorPuntoFilter = new ValorPuntoFilter();
        this.valorPuntoFilter.FechaIncurrencia = new Date(Date.now());
        this.valoresPunto = [];
        this.procedimientoSelected = new Procedimiento();
    }

    seleccionar(procedimiento: Procedimiento): void {
        this.limpiarSeleccion();
        if (procedimiento != undefined) {
            procedimiento.Selected = true;
            this.procedimientoSelected = procedimiento;
            this.cargarValoresPunto();
        }
    }

    limpiarSeleccion() {
        if (this.procedimientos != undefined) {
            this.procedimientos.forEach(element => {
                element.Selected = false;
            });
        }
    }

    cargarValoresPunto(): void {
        this.verifyFechaIncurrencia();
        this.valorPuntoFilter.CodigoGrupoArancel = this.procedimientoSelected.CodigoGrupoArancel;
        this.valorPuntoService.getValores(this.valorPuntoFilter).subscribe(
            result => {
                this.valoresPunto = result;
                this.cargarValoresPuntoCoorpativo();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    cargarValoresPuntoCoorpativo(): void {
        this.verifyFechaIncurrencia();
        this.valorPuntoFilter.CodigoGrupoArancel = this.procedimientoSelected.CodigoGrupoArancel;
        this.valorPuntoService.getValorPuntoCoorporativo(this.valorPuntoFilter).subscribe(
            result => {
                this.valoresPuntoCorporativo = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    verifyFechaIncurrencia(): void {
        if (this.valorPuntoFilter.FechaIncurrencia == undefined)
            this.valorPuntoFilter.FechaIncurrencia = new Date(Date.now());
    }

    abrirModalEditar(vaPunto: ValorPunto, tipo: number): void {
        this.tipoValor = tipo;
        this.valorPuntoSeleccionado = new ValorPunto();
        this.valorPuntoSeleccionado = vaPunto;
        this.valorPuntoSeleccionado.FechaDesde = new Date(vaPunto.FechaDesde);
        this.valorPuntoSeleccionado.FechaHasta = new Date(vaPunto.FechaHasta);

        $("#myModadEditValorPunto").modal();
    }

    salirModalEditar(): void {
        this.cargarValoresPunto();
        $('#myModadEditValorPunto').modal('hide');
    }

    actualizarValorPuntoIndividual() {
        this.valorPuntoService.actualizarValorPunto(this.valorPuntoSeleccionado).subscribe(
            result => {
                this.authService.showSuccessPopup("Datos Actualizados Correctamente");
                this.salirModalEditar();
                this.setear();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    actualizarValorPuntoCorporativo() {
        this.valorPuntoService.actualizarValorPuntoCoorporativo(this.valorPuntoSeleccionado).subscribe(
            result => {
                this.authService.showSuccessPopup("Datos Actualizados Correctamente");
                this.salirModalEditar();
                this.setear();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    setear() {
        this.valoresPunto = [];
        this.cargarValoresPunto();
    }

    inicializarPanelNuevoPuntoValor(){
        this.isNuevoPuntoValor = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelAgregarPV").collapse("show");


        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelAgregarPV").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    colapsarTab(){
        
    }
}
