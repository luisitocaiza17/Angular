import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { LiquidacionListComponent } from './liquidacion.list.component';
import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatePipe } from '@angular/common';

import { Autorizacion, AutorizacionKey, AutorizacionValidacionKey, AutorizacionFilter } from '../common/model/autorizacion';
import { Liquidacion } from '../liquidacion/model/Liquidacion';


import { Convenio, ConvenioFilter } from '../common/model/convenio';
import { Canal, TipoAplicacion, TipoSolicitud, TipoCobertura, EstadoCobertura } from '../common/model/autorizacion.constant';
import { Validacion } from './validacion';

import { GestionPasientesService } from '../common/servicios/gestionPasientes.service';
import { ConvenioService } from '../common/servicios/convenio.service';
import { forEach } from '@angular/router/src/utils/collection';


import { ContratosLiquidacionListComponent } from './contratosLiquidacion.list.component';
import { ContratoKey } from '../common/model/contrato';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { LiquidacionService } from '../liquidacion/service/liquidacion.service';

@Component({
    selector: 'liquidacionForm',
    providers: [AutorizacionService, ConvenioService, GestionPasientesService, DatePipe, LiquidacionService],
    templateUrl: 'liquidacion.form.template.html'
})

export class LiquidacionFormComponent implements OnDestroy {
   
    //proceso de liquidaciones
    liquidacion: Liquidacion;
    suscriptionAut: any;
    suscriptionCont: any;
    contratoKey: ContratoKey;



 
    numeroAutorizacion: number;   
    autorizacion: Autorizacion;


    
    canales: string[];
    tiposSolicitud: string[];
    estadosCobertura: string[];
    tiposAplicacion: string[];
    tiposCobertura: string[];

    autorizacionKey: AutorizacionKey;
    convenios: Convenio[];
    conveniosOriginales: Convenio[];
    filtroPrestador: string;
    filtroMedico: string;
    medico: boolean = false;
    popupTitle: string = "Listado";

    habilitarCaso: boolean;
    esPrestador: boolean;

   

    messageCoberturaRequerida: string;

    validation: Validacion;
    numeroObservacion: number;
    convenioSeleccionado: Convenio;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService, public autorizacionService: AutorizacionService,
        private liquidacionService: LiquidacionService, private contratosLiquidacionListComponent: ContratosLiquidacionListComponent,
        private convenioService: ConvenioService, private liquidacionListComponent: LiquidacionListComponent,
        public gestionPasientesService: GestionPasientesService, private datepipe: DatePipe) {

        this.liquidacion = new Liquidacion();
        
        
        this.autorizacion = new Autorizacion();
        this.autorizacion.isEditable = true;
        this.validation = new Validacion();

        // constantes
        this.canales = Canal.values;
        this.tiposAplicacion = TipoAplicacion.values;
        this.tiposSolicitud = TipoSolicitud.values;
        this.tiposCobertura = TipoCobertura.values;
        this.numeroObservacion = undefined;

        this.habilitarCaso = true;
        this.esPrestador == false;

        this.suscriptionAut = this.liquidacionListComponent.autorizacionKey$.subscribe(
            (autorizacionKey) => {
                if (autorizacionKey != undefined && autorizacionKey.autorizacionSeleccionado != undefined
                    && (autorizacionKey.autorizacionSeleccionado.Id == undefined || autorizacionKey.autorizacionSeleccionado.Id == 0)) {
                    this.autorizacionKey = autorizacionKey;
                    this.loadAutorizacionForm();
                    
                }
            }
        );

        this.suscriptionCont = this.contratosLiquidacionListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {
                    if (!contratoKey.unsuscribe) {
                        this.contratoKey = contratoKey;
                        this.iniciarPantalla();
                    }
                }
            }
        );
    }

    ngOnInit(): void {
        this.liquidacion = new Liquidacion();
        this.convenios = [];
        this.conveniosOriginales = [];
    }

    iniciarPantalla(): void{
        this.liquidacionService.CargarPantallaInicial(this.contratoKey)
        .subscribe(
            result => {
                this.liquidacion = result;
            },
            error => this.authService.showErrorPopup(error)
        );

    }



    ngOnDestroy() {
        this.suscriptionAut.unsubscribe();
        this.suscriptionCont.unsubscribe();
    }

    loadAutorizacionForm(): void {
        this.autorizacion = new Autorizacion();
        this.autorizacion.isEditable = true;
        this.autorizacion.NumeroObservacion = undefined;
        if (this.autorizacionKey != undefined) {
            this.autorizacion = this.autorizacionKey.autorizacionSeleccionado;
            if (this.autorizacion.Diagnosticos == undefined)
                this.autorizacion.Diagnosticos = [];
        }
    }

    //Convenios
    listarConveniosMedico() {
        this.medico = true;
        this.listarConvenios();
        this.popupTitle = 'Listado de Médicos';
    }

    listarConveniosPrestador() {
        this.medico = false;
        this.listarConvenios();
        this.popupTitle = 'Listado de Clínicas y Hospitales';
    }

    listarConvenios() {
        var filtro = new ConvenioFilter();
        if (this.medico) {
            filtro.Nombre = this.filtroMedico;
            this.convenioService.getMedicosForAutorizacionByFilter(filtro).subscribe(
                convenios => {
                    this.convenios = convenios;
                    this.esPrestador = true;
                    if (this.convenios != undefined && this.convenios.length > 0) {
                        this.convenios.forEach(element => {
                            if (element.EsStaff) {
                                element.DescripcionEstaff = "Si";
                            }
                            else {
                                element.DescripcionEstaff = "No";
                            }
                        });
                    }

                    this.conveniosOriginales = convenios;
                    this.pintarConvenio();
                },
                error => this.authService.showErrorPopup(error));
        } else {
            filtro.Nombre = this.filtroPrestador;
            this.convenioService.getHospitalesForAutorizacionByFilter(filtro).subscribe(
                convenios => {
                    this.convenios = convenios;
                    this.esPrestador = false;
                    this.conveniosOriginales = convenios;
                    this.pintarConvenio();
                },
                error => this.authService.showErrorPopup(error));
        }


    }

    pintarConvenio() {
        //selecciona el prestador o medico escogido anteriormente
        if (this.convenios != undefined && this.autorizacion != undefined) {
            var numero = 0;
            if (this.medico) {
                numero = this.autorizacion.CodigoPrestador;
            } else {
                numero = this.autorizacion.CodigoPrestadorEmpresa;
            }

            this.convenios.forEach(element => {
                if (element.Numero == numero)
                    element.Selected = true;
                else
                    element.Selected = false;
            });
        }
    }

    filtrarConvenios(searchValue: string) {
        if (this.convenios != undefined && this.convenios.length > 0) {
            var a = this.conveniosOriginales.filter(item => item.Nombre.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.convenios = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.convenios = this.conveniosOriginales;
        }
    }

    seleccionarConvenio(convenioSeleccionado: Convenio): void {
        this.convenioSeleccionado = convenioSeleccionado;
        if (this.convenios != undefined) {
            this.convenios.forEach(element => {
                if (element.Numero == convenioSeleccionado.Numero)
                    element.Selected = true;
                else
                    element.Selected = false;
            });
        }

        if (this.medico) {
            this.filtroMedico = convenioSeleccionado.Nombre;
            this.autorizacion.CodigoPrestador = convenioSeleccionado.Numero;
            this.autorizacion.NombrePrestador = convenioSeleccionado.Nombre;
            this.autorizacion.NivelPrestador = convenioSeleccionado.NivelPrestadorDesde + '-' + convenioSeleccionado.NivelPrestadorHasta;

        } else {
            this.filtroPrestador = convenioSeleccionado.Nombre;
            this.autorizacion.CodigoPrestadorEmpresa = convenioSeleccionado.Numero;
            this.autorizacion.NombrePrestadorEmpresa = convenioSeleccionado.Nombre;
            this.autorizacion.NivelPrestadorEmpresa = convenioSeleccionado.NivelPrestadorDesde + '-' + convenioSeleccionado.NivelPrestadorHasta;
            this.autorizacion.RegionPrestadorEmpresa = convenioSeleccionado.Region;
            this.autorizacion.PrestadorTipo = convenioSeleccionado.TipoPrestador;
            this.autorizacion.NumeroEstadoConvenio = convenioSeleccionado.NumeroEstado;
            this.autorizacion.TipoConvenio = convenioSeleccionado.TipoConvenio;
        }

        jQuery("#prestadorViewModal").modal("hide");
        this.updateObservaciones();
    }

    //propio de autorizacion
    guardarAutorizacion(): void {
        if (this.autorizacion != undefined) {
            if (this.validarDiagnosticos()) {
                this.autorizacionService.create(this.autorizacion)
                    .subscribe(
                        result => {
                            jQuery("#casosViewModal").modal("hide");
                        },
                        error => this.authService.showErrorPopup(error)
                    );
            }
        }
    }

   getDiagnosticosForAutorizacion(): string[] {
        var cod = [];
        this.autorizacion.Diagnosticos.forEach(d => {
            cod.push(d.CodigoDiagnostico);
        });
        return cod;
    }


    isFormDisabled(): boolean {
        return (this.habilitarCaso == false
            || this.autorizacion.PersonaNumero == undefined            
            || this.autorizacion.CodigoPrestadorEmpresa == undefined
            || this.autorizacion.CodigoPrestador == undefined
            || this.autorizacion.EstadoCobertura == undefined
            || (this.autorizacion.EstadoCobertura == EstadoCobertura.CUBIERTO
                && (this.autorizacion.MontoAutorizado == undefined || this.autorizacion.MontoAutorizado <= 0
                    || this.autorizacion.MontoAutorizado > 9999999999))
            || (this.autorizacion.EstadoCobertura == EstadoCobertura.NO_CUBIERTO
                && (this.autorizacion.MotivoNoCubierto == undefined || this.autorizacion.MotivoNoCubierto.Id == undefined
                )));
    }

    validarDiagnosticos(): boolean {
        var msg = "Debe especificar al menos un diagnóstico " + this.autorizacion.EstadoCobertura + " principal.";
        if (this.autorizacion.Diagnosticos == undefined || this.autorizacion.Diagnosticos.length == 0) {
            var inipos = jQuery("#msgCoberturaRequerida").position().top;
            jQuery("html, body").animate({ scrollTop: inipos + 700 }, 300);
            this.messageCoberturaRequerida = msg;
            return false;
        } else if (this.autorizacion.Diagnosticos != undefined || this.autorizacion.Diagnosticos.length > 0) {
            var existe = false;
            this.autorizacion.Diagnosticos.forEach(d => {
                if (d.Tipo == this.autorizacion.EstadoCobertura && d.Principal)
                    existe = true;
            });
            if (!existe) {
                var inipos = jQuery("#msgCoberturaRequerida").position().top;
                jQuery("html, body").animate({ scrollTop: inipos }, 300);
                this.messageCoberturaRequerida = msg;
                return false;
            }
        }
        return true;
    }

    updateObservaciones(): void {
        var diagnosticosPreexistencias = false;
        if (this.autorizacion.TipoAplicacion == TipoAplicacion.CREDITO && this.autorizacion.Garantia == true) {


            this.autorizacion.Observaciones = "Cliente presenta garantia";
        } else {
            if (this.autorizacion.Diagnosticos != undefined && this.autorizacion.Diagnosticos.length > 0) {
                var cant = this.autorizacion.Diagnosticos.filter(d => d.Preexistencia == true).length;
                diagnosticosPreexistencias = cant > 0;
            }
            this.numeroObservacion = this.validation.getNumeroObservacion(this.autorizacion, diagnosticosPreexistencias);
        }

    }

    onChangeTipoSolicitud(estado: string) {

        if (estado == TipoSolicitud.EMERGENTE) {
            var autorizacionValKey = new AutorizacionValidacionKey();
            autorizacionValKey.CodigoPlan = this.autorizacion.CodigoPlan;
            autorizacionValKey.CodProducto = this.autorizacion.CodigoProducto;
            autorizacionValKey.Region = this.autorizacion.Region;
            autorizacionValKey.TipoSolicitud = estado;
            autorizacionValKey.VersioPlan = this.autorizacion.VersionPlan;
            autorizacionValKey.EstadoConvenio = this.convenioSeleccionado.NumeroEstado;
            autorizacionValKey.TipoConvenio = this.convenioSeleccionado.TipoConvenio;
            autorizacionValKey.ContratoNumero = this.autorizacion.ContratoNumero;

            var msg = "";
            this.autorizacionService.validacionTipoCobertura(autorizacionValKey).subscribe(convenios => {
                if (convenios != undefined && convenios.length > 0) {
                    convenios.forEach(element => {
                        msg += "<li>" + element + "</li>";
                    });
                    swal({
                        title: "",
                        text: "<h3>" + msg + "</h3>",
                        html: true,
                        type: 'info',
                        closeOnConfirm: true,
                        confirmButtonColor: "#1a7bb9",
                        confirmButtonText: "OK",
                    });
                }
            },
                error => this.authService.showErrorPopup(error));
        }
    }



    buscarAutorizacion(autorizacion: number): void {
        
        if (autorizacion != undefined) {
            var autorizacionFilter = new AutorizacionFilter();
            autorizacionFilter.NumeroAutorizacion = autorizacion;
            this.autorizacionService.getOneByFilter(autorizacionFilter).subscribe(
                result => {
                    console.log(result);
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }


}