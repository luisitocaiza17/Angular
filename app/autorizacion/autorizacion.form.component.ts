import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AutorizacionListComponent } from './autorizacion.list.component';
import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatePipe } from '@angular/common';

import { Autorizacion, AutorizacionKey, AutorizacionValidacionKey } from '../common/model/autorizacion';
import { Convenio, ConvenioFilter } from '../common/model/convenio';
import { Canal, TipoAplicacion, TipoSolicitud, TipoCobertura, EstadoCobertura } from '../common/model/autorizacion.constant';
import { Validacion } from './validacion';
import { Caso, CasoFilter } from '../common/model/gestionPasientes';

import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { GestionPasientesService } from '../common/servicios/gestionPasientes.service';
import { ConvenioService } from '../common/servicios/convenio.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
    selector: 'autorizacionForm',
    providers: [AutorizacionService, ConvenioService, GestionPasientesService, DatePipe],
    templateUrl: 'autorizacion.form.template.html'
})

export class AutorizacionFormComponent implements OnDestroy {
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

    casos: Caso[];
    casoSeleccionado: CasoFilter;
    casoNuevo: CasoFilter;
    casoFilter: CasoFilter;
    habilitarCaso: boolean;
    esPrestador: boolean;

    suscription: any;

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
        private convenioService: ConvenioService, private autorizacionListComponent: AutorizacionListComponent,
        public gestionPasientesService: GestionPasientesService, private datepipe: DatePipe) {

        this.autorizacion = new Autorizacion();
        this.autorizacion.isEditable = true;
        this.validation = new Validacion();

        // constantes
        this.canales = Canal.values;
        this.tiposAplicacion = TipoAplicacion.values;
        this.tiposSolicitud = TipoSolicitud.values;
        this.tiposCobertura = TipoCobertura.values;
        this.numeroObservacion = undefined;
        this.casos = [];
        this.casoSeleccionado = new CasoFilter();
        this.casoNuevo = new CasoFilter();
        this.casoFilter = new CasoFilter();
        this.habilitarCaso = true;
        this.esPrestador == false;

        this.suscription = this.autorizacionListComponent.autorizacionKey$.subscribe(
            (autorizacionKey) => {
                if (autorizacionKey != undefined && autorizacionKey.autorizacionSeleccionado != undefined
                    && (autorizacionKey.autorizacionSeleccionado.Id == undefined || autorizacionKey.autorizacionSeleccionado.Id == 0)) {
                    this.autorizacionKey = autorizacionKey;
                    this.loadAutorizacionForm();
                }
            }
        );
    }

    ngOnInit(): void {
        this.convenios = [];
        this.conveniosOriginales = [];
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
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

            //set para asignacion de casos
            this.casoSeleccionado.idConvenio = convenioSeleccionado.Numero.toString();
            this.casoSeleccionado.nombreMedico = convenioSeleccionado.Nombre.toString();
            this.casoSeleccionado.estadoConvenio = convenioSeleccionado.Estado.toString();

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
                            this.asignarCaso(result);
                        },
                        error => this.authService.showErrorPopup(error)
                    );
            }
        }
    }

    //bloque de casos hospitalarios para autorizaciones

    getCasosParaAutorizacion(): void {
        this.casoFilter = new CasoFilter();
        this.casoFilter.CodigoContrato = this.autorizacion.CodigoContrato.toString();
        this.casoFilter.NumeroPersona = this.autorizacion.PersonaNumero.toString();
        this.gestionPasientesService.GetCasos(this.casoFilter)
            .subscribe(
                result => {
                    this.casos = result;
                    this.habilitarCaso = false;
                },
                error => this.authService.showErrorPopup(error)
            );
    }


    seleccionarCaso(casoSelect: Caso): void {
        this.casoSeleccionado.NumeroCaso = casoSelect.numeroCaso;
        this.casoSeleccionado.CodigoCobertura = this.autorizacion.CodigoContrato;
        this.casoSeleccionado.IdConvenioPrestador = this.autorizacion.CodigoPrestadorEmpresa;
        this.casoSeleccionado.Diagnostico = this.getDiagnosticos(casoSelect);
        this.casoSeleccionado.MontoAutorizado = this.autorizacion.MontoAutorizado;
        // this.casoSeleccionado.FechaIngreso = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        this.casoSeleccionado.FechaIngreso = this.datepipe.transform(this.autorizacion.FechaHospitalizacion, 'yyyy-MM-dd');
        this.casoSeleccionado.TipoCobertura = this.autorizacion.TipoCobertura;
        if (this.casoSeleccionado.NumeroCaso != undefined) {
            this.habilitarCaso = true;
        } else {
            this.habilitarCaso = false;
        }
    }

    getDiagnosticos(casoSelect: Caso): string[] {
        var cod = [];
        if (casoSelect.diagnostico.enfermedades.length == 0) {
            if (this.autorizacion.Diagnosticos.length > 0) {
                this.autorizacion.Diagnosticos.forEach(d => {
                    cod.push(d.CodigoDiagnostico);
                });
                return cod;
            }
        } else {
            casoSelect.diagnostico.enfermedades.forEach(d => {
                cod.push(d.codigo);
            });
            return cod;
        }
    }

    getDiagnosticosForAutorizacion(): string[] {
        var cod = [];
        this.autorizacion.Diagnosticos.forEach(d => {
            cod.push(d.CodigoDiagnostico);
        });
        return cod;
    }



    asignarCaso(numeroAutorizacion: number): void {
        this.casoSeleccionado.NumeroAutorizacion = numeroAutorizacion;
        this.casoSeleccionado.estadoCobertura = this.autorizacion.EstadoCobertura.toString();
        this.casoSeleccionado.NombreCentroMedico = this.autorizacion.NombrePrestadorEmpresa;

        if (this.casoSeleccionado.MontoAutorizado == null) {
            this.casoSeleccionado.MontoAutorizado = 0;
        }

        this.gestionPasientesService.AsignarAutorizacionACaso(this.casoSeleccionado)
            .subscribe(
                result => {
                    this.autorizacionListComponent.verListado();
                    toastr.success('La Autorización ha sido creada satisfactoriamente.');
                },
                error => this.authService.showErrorPopup(error)
            );
    }

    nuevoCaso(): void {
        this.casoNuevo = new CasoFilter();
        this.casoNuevo.CodigoContrato = this.autorizacion.CodigoContrato.toString();
        this.casoNuevo.EstadoContrato = this.autorizacion.ContratoEstado;
        this.casoNuevo.FechaInclusion = "10/10/2017";//this.autorizacion.fecha.
        this.casoNuevo.FechaExclusion = this.datepipe.transform(this.autorizacion.FechaExclusionPersona, 'yyyy-MM-dd');

        this.casoNuevo.NombresBeneficiario = this.autorizacion.Nombre;
        this.casoNuevo.ApellidosBeneficiario = this.autorizacion.Apellido;
        this.casoNuevo.TipoDocumentoIdentificacion = this.autorizacion.TipoDocumento;
        this.casoNuevo.NumeroDocumentoIdentificacion = this.autorizacion.CedulaBeneficiario;
        this.casoNuevo.EdadBeneficiario = this.autorizacion.EdadPersona;
        this.casoNuevo.GeneroBeneficiario = this.autorizacion.GeneroPersona;
        this.casoNuevo.MaternidadBeneficiario = false; //this.autorizacion.ma
        this.casoNuevo.NumeroPersona = this.autorizacion.PersonaNumero.toString();
        this.casoNuevo.Diagnostico = this.getDiagnosticosForAutorizacion();
        this.casoNuevo.NombreCentroMedico = this.autorizacion.NombrePrestadorEmpresa;


        jQuery("#casosViewModal").modal("hide");
    }

    guardarNuevoCaso(guardar: boolean): void {
        if (guardar == true) {
            //guardar y regresar
            this.gestionPasientesService.GuardaNuevoCaso(this.casoNuevo)
                .subscribe(
                    result => {
                        this.getCasosParaAutorizacion();
                        jQuery("#casosNuevoViewModal").modal("hide");
                    },
                    error => this.authService.showErrorPopup(error)
                );

        } else {
            //solo regresar
            this.casoNuevo = new CasoFilter();
            jQuery("#casosNuevoViewModal").modal("hide");
        }

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
}