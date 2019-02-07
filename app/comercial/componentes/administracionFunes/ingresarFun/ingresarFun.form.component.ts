import { Component, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../seguridad/auth.service';
import { RegionService } from '../../../../common/servicios/region.service';
import { ServicioVentasService } from '../../../service/servicioVentas.service';
import { ServicioFunVendedorService } from '../../../service/servicioFunVendedor.service';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { PersonaService } from '../../../../common/servicios/persona.service';
import { CatalogoComercialService } from '../../../service/catalogoComercial.service';

import { ConstantesComercialService } from '../../../utils/constantesComercial.service.';
import { VariablesConstantService } from '../../../../utils/variableConstant.service.';

import { RegionEntity } from '../../../../common/model/genericos';
import { utilidadesGenericasService } from '../../../../utils/utilidadesGenericas';
import { VendedorSucursalEntity } from '../../../model/vendedorSucursalEntity';
import { ComercialMotivosFilter } from '../../../model/comercialMotivosFilter';
import { MotivosFunEntity } from '../../../model/motivosFunEntity';
import { CreateFunKey } from '../../../model/createFunKey';
import { SerieFunEntity } from '../../../model/serieFunEntity';
import { FunEntity } from '../../../model/funEntity';
import { SerieFunFilter } from '../../../model/serieFunFilter';
import { GrupoUsuario } from '../../../../common/model/grupoUsuario';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ingresarFunForm',
    providers: [ServicioVentasService, ServicioFunVendedorService, ConstantesComercialService, GenericosService, PersonaService, CatalogoComercialService],
    templateUrl: 'ingresarFun.form.template.html'
})

export class IngresarFunFormComponent implements OnDestroy {

    fun: CreateFunKey;
    serieFilter: SerieFunFilter;
    serie: SerieFunEntity;
    pageNumber: number;
    pageSize: number;
    CurrentPageSize: number;
    total: number;
    numeroSerie: number;
    fechaCierre: Date;
    tipoBusqueda: string;
    motivoAnulacion: number;
    nombrePersona: string;

    listaRegiones: RegionEntity[];
    listaSucursales: VendedorSucursalEntity[];
    listaPersonas: GrupoUsuario[];
    listaSeries: SerieFunEntity[];
    listaFunes: FunEntity[];
    listaMotivosAnulacion: MotivosFunEntity[];
    listaMotivosAnulacionOriginales: MotivosFunEntity[];
    personasFiltradas: GrupoUsuario[];

    interval: NodeJS.Timer;
    subscription: Subscription;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public ventasService: ServicioVentasService, public constantService: VariablesConstantService,
        public constantesComercial: ConstantesComercialService, public utils: utilidadesGenericasService,
        public funService: ServicioFunVendedorService, public genericoService: GenericosService,
        public personaService: PersonaService, public catalogoService: CatalogoComercialService) {

        this.numeroSerie = undefined;
        this.fechaCierre = new Date();
        this.tipoBusqueda = undefined;
        this.motivoAnulacion = undefined;

        this.serie = new SerieFunEntity();
        this.serieFilter = new SerieFunFilter();
        this.fun = new CreateFunKey();
        this.listaPersonas = [];

        this.listaRegiones = [];
        this.listaSucursales = [];
        this.listaSeries = [];
        this.listaFunes = [];
        this.listaMotivosAnulacion = [];
        this.listaMotivosAnulacionOriginales = [];
        this.personasFiltradas = [];


        this.cargarCombos();
        this.obtieneNumeroFun();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    limpiar() {
        this.serieFilter = new SerieFunFilter();
    }

    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
    }

    obtieneNumeroFun() {
        this.funService.obtieneNumeroFun().subscribe(
            result => {
                this.fun.FunInicial = result;
                this.loadSucursales();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadSucursales() {
        this.catalogoService.VendedorSucursal(1, 0).subscribe(
            result => {
                this.listaSucursales = result;
                this.loadMotivosAnulacion();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadMotivosAnulacion() {

        var filter = new ComercialMotivosFilter();
        filter.CodigoEstado = 2;
        filter.Estado = 1;
        filter.NumeroMotivo = null;

        this.catalogoService.MotivoEstadoFun(filter).subscribe(
            result => {
                this.listaMotivosAnulacion = result;
                this.loadGrupoPersonas();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadGrupoPersonas() {
        var lista = [];
        lista.push(this.constantesComercial.GRUPO_VENDEDORES);
        this.genericoService.ObtenerUsuariosGrupo(lista).subscribe(
            result => {
                this.listaPersonas = result;
                this.personasFiltradas = result;
                this.obtenerFunesCreadosEnProceso();
            },
            error => this.authService.showErrorPopup(error)
        )
    }


    obtenerFunesCreadosEnProceso() {
        clearInterval(this.interval);
        this.subscription = this.funService.obtenerFunesCreadosEnProceso(this.serieFilter).subscribe(
            result => {
                this.listaSeries = result;

                this.interval = setInterval(() => {
                    this.chRef.detectChanges();
                    this.chRef.detach();
                }, 100);
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    obtenerlistaFunes(serie: number) {
        this.numeroSerie = serie;
        this.pageNumber = this.funService.paginationConstants.pageNumber;
        this.pageSize = this.funService.paginationConstants.pageSize;
        this.CurrentPageSize = this.funService.paginationConstants.currentPageSize;
        this.total = this.funService.paginationConstants.total;

        this.listaFunes = [];
        this.funService.obtenerFunSerie(this.numeroSerie).subscribe(
            result => {
                this.listaFunes = result;
                $('#myModalListaFunes').modal();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    pageChanged() {
        this.obtenerFunesCreadosEnProceso();
    }

    pageFunChanged() {
        this.obtenerlistaFunes(this.numeroSerie);
    }

    salirModalFun() {
        this.funService.paginationConstants.pageNumber = this.pageNumber;
        this.funService.paginationConstants.pageSize = this.pageSize;
        this.funService.paginationConstants.currentPageSize = this.CurrentPageSize;
        this.funService.paginationConstants.total = this.total;
        $('#myModalListaFunes').modal('hide');

    }

    /*PERSONAS DIRECTORIO ACTIVO */
    abrirMolalUsuarios(tipoBusqueda: string) {
        this.tipoBusqueda = tipoBusqueda;
        $('#myModalListadoPersonas').modal();
    }

    seleccionarPersona(persona: GrupoUsuario) {
        if (this.tipoBusqueda == this.constantesComercial.TIPO_FUN_RECEPTOR) {
            this.fun.NombreReceptor = persona.NombreCompleto;
            this.fun.Receptor = persona.Usuario;
        }

        if (this.tipoBusqueda == this.constantesComercial.TIPO_SERIE_EMISOR) {
            this.serieFilter.NombreUsuarioEmisor = persona.NombreCompleto;
            this.serieFilter.AdUsuarioEmisor = persona.Usuario;
        }

        if (this.tipoBusqueda == this.constantesComercial.TIPO_SERIE_RECEPTOR) {
            this.serieFilter.NombreUsuarioReceptor = persona.NombreCompleto;
            this.serieFilter.AdUsuarioReceptor = persona.Usuario;
        }
        $('#myModalListadoPersonas').modal('hide');
        this.personasFiltradas = this.listaPersonas;
        this.nombrePersona = undefined;
    }

    filtrarPersona(searchValue: string) {
        if (this.personasFiltradas != undefined && this.personasFiltradas.length > 0) {
            var a = this.listaPersonas.filter(item => item.NombreCompleto.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.personasFiltradas = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.personasFiltradas = this.listaPersonas;
        }
    }

    /*fIN Usuario Directorio Activo */


    crearFun() {
        if (this.fun.CodigoSucursal == undefined || this.fun.FechaEntrega == undefined || this.fun.FunInicial == undefined || this.fun.FunFinal == undefined || this.fun.Porcentaje == undefined || this.fun.Receptor == undefined || this.fun.Observaciones == undefined) {
            this.authService.showErrorPopup("Completar todos los campos");
        }
        else {
            this.funService.procesoCrearFun(this.fun).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Funes creados exitosamente");
                        this.obtenerFunesCreadosEnProceso();
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    anularSerie() {
        swal({
            title: "",
            text: "<h3>Está seguro que desea anular la serie #" + this.serie.Numero + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {
                if (confirmed) {
                    this.procesoAnularSerie();
                }
            });

        //this.actualizaSerieFun("ha sido Anulada");
    }

    abrirModalFechaCierre(serie: SerieFunEntity) {
        this.serie = new SerieFunEntity();
        this.serie = serie;
        this.fechaCierre = new Date();
        $('#myModalFechaCierre').modal();
    }

    cerrarSerie() {
        if (this.fechaCierre == undefined) {
            this.authService.showErrorPopup("Debe seleccionar una fecha de cierre");
        }
        else {
            this.serie.Estado = this.constantService.CODIGO_ESTADO_CERRADA;
            this.serie.FechaCierre = this.fechaCierre;
            this.funService.actualizaSerieFun(this.serie).subscribe(
                result => {
                    this.obtenerFunesCreadosEnProceso();
                    $('#myModalFechaCierre').modal('hide');
                    this.authService.showSuccessPopup("La serie #" + result.Numero + " ha sido cerrada");
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }


    procesoAnularSerie() {
        this.funService.procesoAnularSerie(this.serie).subscribe(
            result => {
                if (result) {
                    $('#myModalListadoMotivos').modal('hide');
                    this.obtenerFunesCreadosEnProceso();
                    this.authService.showSuccessPopup("La serie #" + this.serie.Numero + " ha sido anulada");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    abrirModalMotivos(serie: SerieFunEntity) {
        this.serie = new SerieFunEntity();
        this.serie = serie;
        this.serie.Estado = this.constantService.CODIGO_ESTADO_ANULADO;
        this.motivoAnulacion = undefined;
        $('#myModalListadoMotivos').modal();;
    }

    filtarMotivo(searchValue: string) {
        if (this.listaMotivosAnulacion != undefined && this.listaMotivosAnulacion.length > 0) {
            var listaAux = this.listaMotivosAnulacionOriginales.filter(item => item.Descripcion.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.listaMotivosAnulacion = listaAux;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.listaMotivosAnulacion = this.listaMotivosAnulacionOriginales;
        }
    }

    seleccionarMotivo(motivo: MotivosFunEntity) {
        this.motivoAnulacion = motivo.NumeroMotivo;
        this.serie.NumeroMotivo = this.motivoAnulacion;
        this.anularSerie();
    }
}

