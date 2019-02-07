import { Injectable, Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AutorizacionListComponent } from './autorizacion.list.component';
import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { EjecutivoCuentaService } from '../common/servicios/ejecutivoCuenta.service';
import { ParentescoService } from '../common/servicios/parentesco.service';
import { ConvenioService } from '../common/servicios/convenio.service';

import { Autorizacion, AutorizacionKey, AutorizacionFilter, } from '../common/model/autorizacion';
import { MotivoDiagnosticoNoCubierto } from '../common/model/motivoDiagnosticoNoCubierto';
import { Catalogo } from '../common/model/catalogo';
import { Parentesco } from '../common/model/parentesco';
import {
    TipoEnfermedad, LugarAtencionIND, LugarAtencionCOR, TipoTratamiento, EstadoCobertura,
    TipoHospitalizacionCOR, TipoHospitalizacionIND, FormaDePago, TipoLiberarLiquidacion,
    ContantesAutorizacion, TipoAplicacion, TipoCobertura
} from '../common/model/autorizacion.constant';
import { Convenio, ConvenioFilter } from '../common/model/convenio';
import { EjecutivoCuenta } from '../common/model/ejecutivoCuenta';
import { correctHeight } from '../app.helpers';
import { Validacion } from './validacion';

import { Caso, CasoFilter } from '../common/model/gestionPasientes';
import { GestionPasientesService } from '../common/servicios/gestionPasientes.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'autorizacionEditForm',
    providers: [AutorizacionService, ParentescoService, ConvenioService, GestionPasientesService, DatePipe],
    templateUrl: 'autorizacion.edit.form.template.html'
})

export class AutorizacionEditFormComponent implements OnDestroy {

    autorizacion: Autorizacion;
    autorizacionKey: AutorizacionKey;
    suscription: any;

    // selects
    ejecutivosCuenta: EjecutivoCuenta[];
    tiposLiberarLiquidacion: string[];
    tiposEnfermedad: string[];
    lugaresAtencion: string[];
    tiposTratamiento: string[];
    tiposAtencion: string[];
    formasPago: string[];
    parentescos: Parentesco[];
    parentescoSeleccionado: Parentesco;
    deshabilitarOtroParentesco: boolean;
    opcsalir: boolean;
    msgContratoAnulado: string[];

    tiposCobertura: string[];

    medico: boolean = false;
    popupTitle: string = "Listado";
    convenios: Convenio[];
    conveniosOriginales: Convenio[];
    filtroPrestador: string;
    filtroMedico: string;
    convenioSeleccionado: Convenio;
    tiposAplicacion: string[];
    validation: Validacion;
    numeroObservacion: number;
    casoFilter: CasoFilter;
    montoAnterior: number;
    fechaAnterior: Date;

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
        private ejecutivoCuentaService: EjecutivoCuentaService,
        private parentescoService: ParentescoService,
        private autorizacionListComponent: AutorizacionListComponent,
        private convenioService: ConvenioService,
        private gestionPasientesService: GestionPasientesService, 
        private datepipe: DatePipe) {

        this.deshabilitarOtroParentesco = true;
        this.autorizacion = new Autorizacion();
        this.parentescoSeleccionado = new Parentesco();
        this.validation = new Validacion();
        this.casoFilter = new CasoFilter();

        // Constantes
        this.tiposEnfermedad = TipoEnfermedad.values;
        this.tiposTratamiento = TipoTratamiento.values;
        this.formasPago = FormaDePago.values;
        this.tiposLiberarLiquidacion = TipoLiberarLiquidacion.values;
        this.tiposAplicacion = TipoAplicacion.values;
        this.numeroObservacion = undefined;
        this.tiposCobertura = TipoCobertura.values;

        this.suscription = this.autorizacionListComponent.autorizacionKey$.subscribe(
            (autorizacionKey) => {
                if (autorizacionKey != undefined && autorizacionKey.autorizacionSeleccionado != undefined
                    && autorizacionKey.autorizacionSeleccionado.Id != undefined && autorizacionKey.autorizacionSeleccionado.Id != 0
                    && autorizacionKey.autorizacionSeleccionado.NumeroAutorizacion != undefined
                    && autorizacionKey.autorizacionSeleccionado.NumeroAutorizacion != 0) {
                    this.loadAutorizacion(autorizacionKey);
                }
            }
        );
    }

    loadAutorizacion(autorizacionKey: AutorizacionKey): void {
        var filter = new AutorizacionFilter();
        filter.IdAutorizacion = autorizacionKey.autorizacionSeleccionado.Id;
        filter.NumeroAutorizacion = autorizacionKey.autorizacionSeleccionado.NumeroAutorizacion;
        this.autorizacionService.getOneByFilterForUpdate(filter).subscribe(
            result => {

                this.autorizacionKey = autorizacionKey;

                this.montoAnterior = result.MontoAutorizado;
                this.fechaAnterior = result.FechaHospitalizacion;
                this.casoFilter.NumeroAutorizacion = result.Id;
                this.casoFilter.NumeroCaso = result.NumeroCaso;
                this.casoFilter.FechaHora = moment(new Date()).format('YYYY-MM-DD'); 

                this.setComplexData(result);
                this.autorizacion = result;
                this.setDate(result);
                this.filtroPrestador = this.autorizacion.NombrePrestadorEmpresa;
                this.filtroMedico = this.autorizacion.NombrePrestador;


                this.isEditable(this.autorizacion);

                this.loadFormData();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    setComplexData(result: Autorizacion): void {
        result.CodigoPlan = this.autorizacionKey.autorizacionSeleccionado.CodigoPlan;
        result.FechaVigencia = this.autorizacionKey.autorizacionSeleccionado.FechaVigencia;
        result.ClienteImpago = this.autorizacionKey.autorizacionSeleccionado.ClienteImpago;
        result.NivelReferencia = this.autorizacionKey.autorizacionSeleccionado.NivelReferencia;
        result.CeroTramites = this.autorizacionKey.autorizacionSeleccionado.CeroTramites;
        result.ObservacionesContrato = this.autorizacionKey.autorizacionSeleccionado.ObservacionesContrato;
        result.ContratoEstado = this.autorizacionKey.autorizacionSeleccionado.ContratoEstado;
        result.Garantia = this.autorizacionKey.autorizacionSeleccionado.Garantia;
    }

    setDate(result: Autorizacion): void {
        if (result.FechaHospitalizacion != undefined)
            this.autorizacion.FechaHospitalizacion = new Date(result.FechaHospitalizacion);
        if (result.FechaAlta != undefined)
            this.autorizacion.FechaAlta = new Date(result.FechaAlta);
        if (result.FechaLlamada != undefined)
            this.autorizacion.FechaLlamada = new Date(result.FechaLlamada);
        if (result.HoraLlamada != undefined)
            this.autorizacion.HoraLlamada = new Date(result.HoraLlamada);
        if (this.autorizacion.Diagnosticos == undefined)
            this.autorizacion.Diagnosticos = [];
        if (this.autorizacion.FechaRequerimiento != undefined)
            this.autorizacion.FechaRequerimiento = new Date(result.FechaRequerimiento);
    }

    public isEditable(a: Autorizacion): void {
        a.isEditable = true;
        if (a.Estado != undefined && a.Estado.Id != undefined && a.Estado.Id > 0)
            a.isEditable = (a.Estado.Id != Catalogo.ESTADO_AUTORIZACION_ANULADO && a.Estado.Id != Catalogo.ESTADO_AUTORIZACION_PAGADO && a.Estado.Id != Catalogo.ESTADO_AUTORIZACION_FINALIZADO)
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    loadFormData(): void {
        this.selectLugaresAtencion();
        this.selectTiposAtencion();

        this.loadEjecutivosCuenta();
        this.loadParentescosContacto();
    }

    selectLugaresAtencion(): void {
        if (this.autorizacionService.isContratoCoorporativo(this.autorizacion.CodigoProducto))
            this.lugaresAtencion = LugarAtencionCOR.values;
        else
            this.lugaresAtencion = LugarAtencionIND.values;
    }

    selectTiposAtencion(): void {
        if (this.autorizacionService.isContratoCoorporativo(this.autorizacion.CodigoProducto))
            this.tiposAtencion = TipoHospitalizacionCOR.values;
        else
            this.tiposAtencion = TipoHospitalizacionIND.values;
    }

    loadEjecutivosCuenta(): void {
        this.ejecutivoCuentaService.getEjecutivosCuentaContrato(this.autorizacion.CodigoContrato, this.autorizacion.CodigoProducto)
            .subscribe(ejecutivosCuenta => {
                this.ejecutivosCuenta = ejecutivosCuenta;
            },
            error => this.authService.showErrorPopup(error));
    }

    loadParentescosContacto(): void {
        this.parentescoService.getParentescosContrato(this.autorizacion.CodigoContrato)
            .subscribe(parentescos => {
                this.parentescos = parentescos;
                if (this.autorizacion.CodigoParentesco != undefined) {
                    if (this.autorizacion.CodigoParentesco == Parentesco.PARENTESCO_SIN_RELACION
                        || this.autorizacion.CodigoParentesco == Parentesco.PARENTESCO_OTROS) {
                        this.deshabilitarOtroParentesco = false;
                    }

                    this.parentescoSeleccionado = this.parentescos.find(p => p.Codigo == this.autorizacion.CodigoParentesco);
                    if (this.parentescoSeleccionado.NombresParientes != undefined && this.autorizacion.NombreContacto != undefined) {
                        var nombrePariente = this.parentescoSeleccionado.NombresParientes.find(n => n == this.autorizacion.NombreContacto);
                        if (nombrePariente != undefined)
                            this.parentescoSeleccionado.NombrePariente = nombrePariente;
                    }
                }
                else
                    this.parentescoSeleccionado = new Parentesco();
            },
            error => this.authService.showErrorPopup(error));
    }

    onChangeParentesco(codigo: number): void {
        this.deshabilitarOtroParentesco = true;
        this.parentescoSeleccionado = this.parentescos.find(p => p.Codigo == codigo);
        if (codigo != undefined) {
            if (codigo == Parentesco.PARENTESCO_SIN_RELACION) {
                this.limpiarDatosParentezco();
            } else if (codigo == Parentesco.PARENTESCO_OTROS) {
                this.limpiarDatosParentezco();
                this.deshabilitarOtroParentesco = false;
            }
            else {
                if (this.parentescoSeleccionado != null) {
                    this.autorizacion.OtroParentesco = null;
                    this.autorizacion.NombreContacto = null;
                    if (this.parentescoSeleccionado.NombresParientes != undefined) {
                        if (this.parentescoSeleccionado.NombresParientes.length == 1)
                            this.autorizacion.NombreContacto = this.parentescoSeleccionado.NombresParientes[0];
                    }
                }
            }
        } else {
            this.limpiarDatosParentezco();
        }
    }

    onSelectPariente(nombrePariente: string): void {
        this.autorizacion.NombreContacto = nombrePariente;
    }

    limpiarDatosParentezco(): void {
        this.autorizacion.NombreContacto = null;
        this.autorizacion.OtroParentesco = null;
    }

    //propio de autorizacion
    autoCompletarDatos(): void {
        this.autorizacion.ResponsableLlamada = this.authService.nombreCompleto;
        var date = new Date();
        this.autorizacion.FechaLlamada = date;
        this.autorizacion.HoraLlamada = date;
    }

    updateAutorizacion(sal: boolean): void {
        this.opcsalir = sal;
        this.msgContratoAnulado = [];
        var constantesAutorizacion = new ContantesAutorizacion();
        if (this.autorizacion != undefined) {
            if (this.autorizacion.EstadoPersona == constantesAutorizacion.ESTADO_ANULADO) {
                this.msgContratoAnulado.push("El Estado del Beneficiario es ANULADO");
            }

            if (this.autorizacion.FechaExclusionPersona != undefined) {
                if (new Date(this.autorizacion.FechaExclusionPersona).getTime() < new Date().getTime()) {
                    this.msgContratoAnulado.push("Fecha de exclusión del Beneficiario menor a la actual");
                }
            }

            if (this.autorizacion.ClienteImpago) {
                this.msgContratoAnulado.push("El Cliente actual se encuentra MOROSO");
            }
            if (this.autorizacion.ContratoEstado == constantesAutorizacion.ESTADO_ANULADO) {
                this.msgContratoAnulado.push("El Estado del Contrato Actual es ANULADO");
            }

            if (this.msgContratoAnulado != undefined && this.msgContratoAnulado.length > 0) {
                jQuery("#validaGuardarModal").modal("show");
            }
            else {
                this.actualizar();
            }
        }
    }

    actualizar(): void {
        this.autorizacionService.update(this.autorizacion).subscribe(
            result => {
                this.aumentarCuota();
                jQuery("#validaGuardarModal").modal("hide");
                if (this.opcsalir)
                    this.autorizacionListComponent.verListado();
                else {
                    this.setComplexData(result);
                    this.autorizacion = result;
                    this.setDate(result);
                    this.isEditable(this.autorizacion);

                }
                toastr.success('La Autorización ha sido actualizada satisfactoriamente.');
                this.opcsalir = null;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    anularAutorizacion(): void {
        if (this.autorizacion != undefined) {
            this.autorizacion.Estado.Id = Catalogo.ESTADO_AUTORIZACION_ANULADO;
            this.autorizacion.Estado.Valor = Catalogo.ESTADO_AUTORIZACION_ANULADO_TEXT;
            this.autorizacionService.update(this.autorizacion).subscribe(
                result => {
                    jQuery("#confirmarAnulacionModal").modal("hide");
                    this.autorizacionListComponent.verListado();
                    toastr.success('La Autorización ha sido anulada satisfactoriamente.');
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    finalizarAutorizacion(): void {
        if (this.autorizacion != undefined) {
            this.autorizacion.Estado.Id = Catalogo.ESTADO_AUTORIZACION_FINALIZADO;
            this.autorizacion.Estado.Valor = Catalogo.ESTADO_AUTORIZACION_FINALIZADO_TEXT;
            this.autorizacionService.update(this.autorizacion).subscribe(
                result => {
                    this.aumentarCuota();
                    jQuery("#confirmarFinalizarModal").modal("hide");
                    this.autorizacionListComponent.verListado();
                    toastr.success('La Autorización se ha finalizado satisfactoriamente.');
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    aumentarCuota(): void {
        if (this.montoAnterior != this.autorizacion.MontoAutorizado && this.casoFilter.NumeroCaso != 0) {
            this.casoFilter.ValorCupo = this.autorizacion.MontoAutorizado;
            this.gestionPasientesService.AumentarCuota(this.casoFilter)
                .subscribe(
                result => {
                },
                error => this.authService.showErrorPopup(error)
                );
        }
        
        var fecAnterior = this.datepipe.transform(this.fechaAnterior, 'yyyy-MM-dd');
        var fecNueva = this.datepipe.transform(this.autorizacion.FechaHospitalizacion, 'yyyy-MM-dd');

        if (fecAnterior != fecNueva && this.casoFilter.NumeroCaso != 0) {
            this.casoFilter.FechaIngreso = this.datepipe.transform(this.autorizacion.FechaHospitalizacion, 'yyyy-MM-dd');

            this.gestionPasientesService.ActualizaFecha(this.casoFilter)
                .subscribe(
                result => {
                },
                error => this.authService.showErrorPopup(error)
                );
        }


    }

    salir(): void {
        this.autorizacionListComponent.verListado();
    }

    isFormDisabled(): boolean {
        return (this.autorizacion.PersonaNumero == undefined
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
                    this.conveniosOriginales = convenios;
                    this.pintarConvenio();
                },
                error => this.authService.showErrorPopup(error));
        } else {
            filtro.Nombre = this.filtroPrestador;
            this.convenioService.getHospitalesForAutorizacionByFilter(filtro).subscribe(
                convenios => {
                    this.convenios = convenios;
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

    ngOnInit(): void {
        this.convenios = [];
        this.conveniosOriginales = [];
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

    updateObservaciones(): void {
        var diagnosticosPreexistencias = false;
        if (this.autorizacion.TipoAplicacion == TipoAplicacion.CREDITO) {
            this.autorizacion.Observaciones = "Cliente presenta garantia";
        } else {
            if (this.autorizacion.Diagnosticos != undefined && this.autorizacion.Diagnosticos.length > 0) {
                var cant = this.autorizacion.Diagnosticos.filter(d => d.Preexistencia == true).length;
                diagnosticosPreexistencias = cant > 0;
            }
            this.numeroObservacion = this.validation.getNumeroObservacion(this.autorizacion, diagnosticosPreexistencias);
        }

    }

    listarConveniosMedico() {
        this.medico = true;
        this.listarConvenios();
        this.popupTitle = 'Listado de Médicos';
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
}