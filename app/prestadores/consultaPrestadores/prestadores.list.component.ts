import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../seguridad/auth.service';
import { PaginationService } from '../../utils/pagination.service';

import { correctHeight } from '../../app.helpers';
import { ConvenioService } from '../../common/servicios/convenio.service';
import { CatalogoService } from '../../common/servicios/catalogo.service';
import { Catalogo } from '../../common/model/catalogo';
import { Permiso } from '../../seguridad/usuario';

import { ConvenioFilter, Convenio, TipoPrestador } from '../../common/model/convenio';

@Component({
    providers: [ConvenioService],
    templateUrl: 'prestadores.list.template.html'
})

export class PrestadoresListComponent extends PaginationService implements OnInit {

    tiposPrestador: string[];
    especialidades: Catalogo[];

    filter: ConvenioFilter;
    prestadores: Convenio[];
    ciudades: Catalogo[];
    _esRecomendado: boolean;
    opcion: string;
    isActualizarConvenio: boolean;
    isInsertarConvenio: boolean;
    accessActualizaConvenio: boolean;
    accessInsertarConvenio: boolean;


    private convenio: BehaviorSubject<Convenio> = new BehaviorSubject<Convenio>(null);
    numeroConvenio$: Observable<Convenio> = this.convenio.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private convenioService: ConvenioService,
        private catalogoService: CatalogoService) {
        super(1, 15);
        this.filter = new ConvenioFilter();
        this.prestadores = [];
        this.ciudades = [];
        this.isActualizarConvenio = false;
        this.isInsertarConvenio = false;
        this.accessActualizaConvenio = false;
        this.accessInsertarConvenio = false;
        this.verificarPermisos();

    }

    ngOnInit() {
        this.opcion = "";
        this.loadTiposPrestador();
        this.loadEspecialidades();
        this.loadCiudades();

        jQuery("#nivelRange").ionRangeSlider({
            type: "double",
            min: 0,
            max: 10,
            from: null,
            to: null,
            step: 1,
            grid: true,
            grid_snap: true,
            scope: this.filter,
            hide_min_max: true,
            hide_from_to: true,
            force_edges: true
        });
    }


    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessActualizaConvenio = true;
                this.accessInsertarConvenio = true;
            }
            else {
                var auth = listaPermisos.find(p => p == Permiso.ACTUALIZAR_CONVENIO);
                if (auth != undefined)
                    this.accessActualizaConvenio = true;

                auth = listaPermisos.find(p => p == Permiso.INGRESAR_CONVENIO);
                if (auth != undefined)
                    this.accessInsertarConvenio = true;


            }
        }
    }

    loadTiposPrestador(): void {
        this.tiposPrestador = TipoPrestador.values;
    }

    loadEspecialidades(): void {
        if (this.especialidades == undefined || this.especialidades.length == 0) {
            this.catalogoService.getEspecialidadesForOdas().subscribe(
                result => {
                    this.especialidades = result;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    loadCiudades(): void {
        if (this.ciudades == undefined || this.ciudades.length == 0) {
            this.catalogoService.getCiudadesForOdas().subscribe(
                result => {
                    this.ciudades = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }


    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.resetDefaultPaginationConstanst();
        this.filtrar();
    }

    filtrar(): void {
        this.filter.NivelDesde = jQuery("#nivelRange").data('from');
        this.filter.NivelHasta = jQuery("#nivelRange").data('to');

        this.filter.EsRecomendado = this._esRecomendado ? 1 : 0;

        this.convenioService.getByFilterPaginated(this.filter, this.paginationConstants.pageNumber,
            this.paginationConstants.pageSize)
            .subscribe(result => {
                this.prestadores = this.extractDataPaginated(result);
                if (this.prestadores != undefined && this.prestadores.length > 0) {
                    this.prestadores.forEach(element => {
                        if (element.EsStaff) {
                            element.DescripcionEstaff = "Si";
                        }
                        else {
                            element.DescripcionEstaff = "No";
                        }
                    });
                    var inipos = jQuery("#divResultadoBusquedaPrestadores").position().top;
                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                }
            },
                error => this.authService.showErrorPopup(error));

    }

    limpiar(): void {
        this.resetDefaultPaginationConstanst();
        this.filter = new ConvenioFilter();
        this.prestadores = [];
    }

    colapsarTab(): void {
        this.isActualizarConvenio = false;
        this.isInsertarConvenio = false;

        var key = new Convenio();
        key.unsuscribe = true;
        this.convenio.next(key);

    }

    inicializarPanelActualizar(selected: Convenio): void {
        this.isActualizarConvenio = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelInsertar").collapse("hide");
        jQuery("#divPanelActualizarConvenio").collapse("show");

        this.crearConvenioEntity(selected);
        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelActualizarConvenio").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
    }

    inicilizarPanelInsertar(): void {
        this.isInsertarConvenio = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelActualizarConvenio").collapse("hide");
        jQuery("#divPanelInsertar").collapse("show");


        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelInsertar").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    crearConvenioEntity(selected: Convenio): void {
        var key = new Convenio();
        key.Numero = selected.Numero;
        this.convenio.next(key);
    }
}
