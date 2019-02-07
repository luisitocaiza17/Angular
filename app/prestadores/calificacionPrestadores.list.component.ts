import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../seguridad/auth.service';
import { PaginationService } from '../utils/pagination.service';

import { RegionService } from '../common/servicios/region.service';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { ConvenioService } from '../common/servicios/convenio.service';
import { CalificacionPrestadorService } from '../common/servicios/calificacionPrestador.service';
import { OrdenAtencionService } from '../common/servicios/ordenAtencion.service';
import { ContratoService } from '../common/servicios/contrato.service';
import { ReclamoService } from '../common/servicios/reclamo.service';
import { ReporteService } from '../common/servicios/reporte.service';

import { Region } from '../common/model/region';
import { Calificacion } from '../common/model/calificacion';
import { Catalogo } from '../common/model/catalogo';
import { ConvenioFilter, Convenio, TipoPrestador } from '../common/model/convenio';
import { CalificacionPrestador, CalificacionPrestadorFilter } from '../common/model/calificacionPrestador';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey, ContratoPrestadorEntityList } from '../common/model/contrato';
import { BeneficiarioKey, Beneficiario } from '../common/model/beneficiario';
import { Reclamo, ReclamoEntityFilter } from '../common/model/reclamo';
import { OrdenAtencion, OrdenAtencionFilter } from '../common/model/ordenAtencion';

@Component({
    providers: [ConvenioService, CalificacionPrestadorService, ContratoService, ReclamoService, OrdenAtencionService, ReporteService],
    templateUrl: 'calificacionPrestadores.list.template.html'
})

export class CalificacionPrestadoresListComponent extends PaginationService implements OnInit {

    tiposPrestador: string[];
    especialidades: Catalogo[];
    regiones: Region[];
    calificaciones: Calificacion[];
    codigoRegionTx: string;


    filterConvenio: ConvenioFilter;
    filterContrato: ContratoEntityFilter;
    filterBeneficiario: BeneficiarioKey;
    filterReclamo: ReclamoEntityFilter;
    filterOrdenAtencion: OrdenAtencionFilter;

    prestadores: Convenio[];
    contratos: ContratoPrestadorEntityList[];
    contrato: ContratoPrestadorEntityList;
    calificacionFilter: CalificacionPrestadorFilter;
    calificacion: CalificacionPrestador;
    calificacionList: CalificacionPrestador[];
    ordenAtencion: OrdenAtencion[];

    nombreMedicoBusqueda: string;
    nombreMedicoRespuesta: string;

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService, private convenioService: ConvenioService,
        private catalogoService: CatalogoService, private calificacionPrestadorService: CalificacionPrestadorService,
        public contratoService: ContratoService, public reclamoService: ReclamoService,
        private ordenAtencionService: OrdenAtencionService, public reporteService: ReporteService) {
        super(1, 15);
        this.filterConvenio = new ConvenioFilter();
        this.filterContrato = new ContratoEntityFilter();
        this.calificacionFilter = new CalificacionPrestadorFilter();
        this.calificacion = new CalificacionPrestador();
        this.prestadores = [];
        this.codigoRegionTx = undefined;

    }

    ngOnInit() {
        this.loadEspecialidades();
        this.loadRegiones();
        this.loadCalificaciones();
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

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
            error => this.authService.showErrorPopup(error));
    }

    loadCalificaciones(): void {
        if (this.calificaciones == undefined) {
            this.calificaciones = Calificacion.values;
        }
    }

    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.contratoService.resetDefaultPaginationConstanst();
        this.contratos = [];
        if (this.filterContrato.NumeroCedula != undefined || this.filterContrato.NombrePersona != undefined
            || this.filterContrato.ApellidoPersona != undefined) {
            this.filtrar();
        } else {
            this.filtrarTodos();
        }
    }

    filtrarTodos() {
        if (this.calificacionFilter.Calificacion == undefined)
            this.calificacionFilter.Calificacion = -1;

        this.calificacionFilter.NumeroConvenio = 0;
        this.calificacionFilter.Especialidad = this.filterConvenio.CodigoEspecialidad;
        this.calificacionFilter.NumeroReclamo = 0;
        this.calificacionFilter.Region = this.filterContrato.CodigoRegion;

        this.calificacionList = [];
        this.calificacionPrestadorService.getReportePrestadorList(this.calificacionFilter)
            .subscribe(result => {
                this.calificacionList = result;

                for (let calificacion of this.calificacionList) {


                    if(calificacion.Oda != "0" && calificacion.Convenio != "0"){
                        this.filterOrdenAtencion = new OrdenAtencionFilter();
                        this.filterOrdenAtencion.NumeroReclamo = +calificacion.Oda;
                        this.filterOrdenAtencion.NumeroConvenio = +calificacion.Convenio;
                        this.filterOrdenAtencion.NumeroPagina = 1;
                        this.filterOrdenAtencion.TotalRegistros = 10;
                        this.filterOrdenAtencion.IdentificacionBeneficiario = "";
                        this.filterOrdenAtencion.CodigoEstado = 0;
    
                        this.ordenAtencion = [];
                        this.ordenAtencionService.obtenerOrdenesAtencionRedSalud(this.filterOrdenAtencion)
                            .subscribe(result => {
                                this.ordenAtencion = result;
                                for (let orden of this.ordenAtencion) {
    
                                    
                                    this.contrato = new ContratoPrestadorEntityList();
    
                                    this.contrato.Convenio = calificacion.Convenio;
                                    this.contrato.NombreMedico = orden.NombresMedico.toUpperCase();
                                    this.contrato.CodigoRegion = orden.Region;
    
                                    this.contrato.Oda = calificacion.Oda;
                                    this.contrato.NumeroContrato = +orden.Contrato;
                                    this.contrato.NombresApellidosTitular = orden.NombresTitular;
                                    this.contrato.NombreBeneficiario = orden.NombresPaciente;
                                    this.contrato.CodigoPlan = "";
                                    this.contrato.VersionPlan = orden.NivelContrato;
                                    this.contrato.Especialidad = this.getNombreEspecialidad(calificacion.Especialidad);
                                    this.contrato.NivelPrestadorDesde = orden.NivelDesde;
                                    this.contrato.NivelPrestadorHasta = orden.NivelHasta;
                                    this.contrato.RegionCliente = orden.Region;
                                    this.contrato.Calificacion = calificacion.Calificacion;
                                    this.contrato.Comentario = calificacion.Comentario;
                                    this.contrato.FechaCalificacion = calificacion.FechaCalificación;
    
                                    if(this.filterConvenio.Nombre != undefined){
                                        if(this.contrato.NombreMedico.toUpperCase().toString().includes(this.filterConvenio.Nombre.toUpperCase().toString())){
                                            this.contratos.push(this.contrato);
                                            this.contratoService.paginationConstants.total = this.contratoService.paginationConstants.total +1;
                                        }                                        
                                     }else{
                                        this.contratos.push(this.contrato);
                                        this.contratoService.paginationConstants.total = this.contratoService.paginationConstants.total +1;
                                     }
    
                                    var inipos = jQuery("#divResultadoBusquedaPrestadores").position().top;
                                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);

                                }
    
                            },
                            error => this.authService.showErrorPopup(error));
                    }                  

                }
            },
            error => this.authService.showErrorPopup(error));
    }



    filtrar(): void {
        if ((this.filterContrato.RazonSocial != undefined && this.filterContrato.RazonSocial.trim() != '') || this.filterContrato.NumeroEmpresa != undefined && this.filterContrato.NumeroEmpresa.trim() != '')
            this.filterContrato.filterByEmpresa = true;
        else
            this.filterContrato.filterByEmpresa = false;

        if ((this.filterContrato.NumeroAlcance != undefined) || this.filterContrato.NumeroReclamo != undefined && this.filterContrato.NumeroReclamo != 0)
            this.filterContrato.filterByLiquidacion = true;
        else
            this.filterContrato.filterByLiquidacion = false;

        if (this.filterContrato.NumeroAutorizacion != undefined && this.filterContrato.NumeroAutorizacion != 0)
            this.filterContrato.filterByAutorizacion = true;
        else
            this.filterContrato.filterByAutorizacion = false;

        this.contratoService.getByFiltersPaginated(this.filterContrato)
            .subscribe(contratos => {
                this.loadData(contratos);
            },
            error => this.authService.showErrorPopup(error));

    }

    loadData(contratos: ContratoPrestadorEntityList[]): void {
        for (let cont of contratos) {

            this.filterBeneficiario = new BeneficiarioKey();
            this.filterBeneficiario.CodigoContrato = cont.CodigoContrato;
            this.filterBeneficiario.NumeroContrato = cont.NumeroContrato;
            this.filterBeneficiario.OdasMasivas = false;

            this.reclamoService.getReclamoOdaList(this.filterBeneficiario).subscribe(
                reclamos => {
                    for (let recl of reclamos) {

                        this.filterReclamo = new ReclamoEntityFilter();
                        this.filterReclamo.CodigoContrato = cont.CodigoContrato;
                        this.filterReclamo.NumeroReclamo = recl.NumeroReclamo;
                        this.filterReclamo.NumeroAlcance = recl.NumeroAlcance;


                        this.reclamoService.getDetalleReclamo(this.filterReclamo).subscribe(
                            detallesReclamos => {

                                for (let detalleReclamos of detallesReclamos) {

                                    if (this.calificacionFilter.Calificacion == undefined)
                                        this.calificacionFilter.Calificacion = -1;

                                    this.calificacionFilter.NumeroConvenio = detalleReclamos.NumeroConvenio;
                                    this.calificacionFilter.Especialidad = this.filterConvenio.CodigoEspecialidad;
                                    this.calificacionFilter.NumeroReclamo = recl.NumeroReclamo;
                                    this.calificacionFilter.Region = cont.CodigoRegion;

                                    this.calificacion = new CalificacionPrestador();
                                    this.calificacionPrestadorService.getReportePrestador(this.calificacionFilter)
                                        .subscribe(result => {
                                            this.calificacion = result;

                                            if (this.calificacion.Calificacion != undefined) {
                                                this.contrato = new ContratoPrestadorEntityList();

                                                this.contrato.Convenio = detalleReclamos.NumeroConvenio;
                                                this.contrato.NombreMedico = detalleReclamos.NombrePrestador.toUpperCase();
                                                this.contrato.RucPrestador = detalleReclamos.RucPrestador;
                                                this.contrato.CodigoRegion = cont.CodigoRegion;

                                                this.contrato.Oda = recl.NumeroReclamo;
                                                this.contrato.NumeroContrato = cont.NumeroContrato;
                                                this.contrato.NombresApellidosTitular = cont.NombresApellidos;
                                                this.contrato.NombreBeneficiario = recl.NombreBeneficiario;
                                                this.contrato.CodigoPlan = cont.CodigoPlan;
                                                this.contrato.VersionPlan = cont.VersionPlan;
                                                this.contrato.Especialidad = this.getNombreEspecialidad(this.calificacion.Especialidad);
                                                this.contrato.NivelPrestadorDesde = detalleReclamos.NivelPrestadorDesde;
                                                this.contrato.NivelPrestadorHasta = detalleReclamos.NivelPrestadorHasta;
                                                this.contrato.RegionCliente = cont.CodigoRegion;
                                                this.contrato.Calificacion = this.calificacion.Calificacion;
                                                this.contrato.Comentario = this.calificacion.Comentario;
                                                this.contrato.FechaCalificacion = this.calificacion.FechaCalificación;

                                                this.contratos.push(this.contrato);

                                                this.contratoService.paginationConstants.total = this.contratoService.paginationConstants.total +1;

                                                var inipos = jQuery("#divResultadoBusquedaPrestadores").position().top;
                                                jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                                            }

                                        },
                                        error => this.authService.showErrorPopup(error));
                                }
                            },
                            error => this.authService.showErrorPopup(error));
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    getNombreEspecialidad(espe: string): string {
        for (let esp of this.especialidades) {
            if (esp.CodigoProgress == espe) {
                return esp.Valor.toUpperCase();
            }
        }
        return "";
    }


    limpiar(): void {
        this.resetDefaultPaginationConstanst();
        this.filterConvenio = new ConvenioFilter();
        this.filterContrato = new ContratoEntityFilter();
        this.calificacionFilter = new CalificacionPrestadorFilter();
        this.prestadores = [];
        this.contratos = [];
    }

    generarReporte() { 
        if (this.filterContrato.NumeroCedula != undefined || this.filterContrato.NombrePersona != undefined
            || this.filterContrato.ApellidoPersona != undefined) {
            this.filtrar();
        } else {
            this.filtrarTodos();
        }
        console.log(this.calificacionFilter); 
        this.reporteService.descargarReporteCalificacionPrestadores(this.calificacionFilter).subscribe(
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
