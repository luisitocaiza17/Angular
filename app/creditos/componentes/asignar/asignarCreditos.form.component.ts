import { Component, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../seguridad/auth.service';

import { ContratoKey } from '../../../common/model/contrato';
import { Catalogo } from '../../../common/model/catalogo';

import { SobreReembolsoService } from '../../../sobres/service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../sobres/service/catalogoSobreReembolso.service';
import { ConstantesCreditos } from '../../utils/ConstantesCreditos';
import { SobreFilter } from '../../../sobres/model/SobreFilter';
import { ConsultorEntity } from '../../../sobres/model/ConsultorEntity';
import { SobreEntity } from '../../../sobres/model/SobreEntity';
import { DetalleSobreEntity } from '../../../sobres/model/DetalleSobreEntity';
import { Subscription } from 'rxjs';

import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ConvenioFilter, Convenio } from '../../../common/model/convenio';
import { ConvenioService } from '../../../common/servicios/convenio.service';

@Component({
    providers: [ConvenioService],
    templateUrl: 'asignarCreditos.form.template.html'
})

export class AsignarCreditosFormComponent implements OnDestroy {

    _contratoKey: ContratoKey;
    sobreFilter: SobreFilter;

    consultores: ConsultorEntity[];
    consultoresFiltrados: ConsultorEntity[];
    liquidadoresFiltrados: ConsultorEntity[];
    estados: Catalogo[];
    consultoresFiltradosOriginales: ConsultorEntity[];
    liquidadoresFiltradosOriginales: ConsultorEntity[];
    listadoTodosSobres: SobreEntity[];
    listadoSobres: SobreEntity[];
    sobresSeleccionados: SobreEntity[];
    todosEstados: Catalogo[];
    detallesSobres: DetalleSobreEntity[];
    detalleSobreSelected: DetalleSobreEntity;

    usuarioAsignado: string;
    usuarioLiquidador: string;

    filtroConsultor: string;
    filtroLiquidador: string;
    usuarioSeleccionado: string;

    tipoDoc: number;

    subscription: Subscription;
    interval: NodeJS.Timer;
    clinicas: string;
    listaEstados: string;

    sobre:SobreEntity;
    convenios: Convenio[];
    conveniosOriginales: Convenio[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es',
    };

    popupTitle: string;

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef, private changeDetector: ChangeDetectorRef,
        public sobreReembolsoService: SobreReembolsoService, public constantesCreditos: ConstantesCreditos,private convenioService: ConvenioService,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, private utilidadesGenericas: utilidadesGenericasService) {
            this.estados = [];  

        this.setear();
        this.loadConsultores();
        this.sobreFilter.FechaAsignacion = null;
        this.sobreFilter.FechaLiquidador = null;
        this.sobreFilter.FechaFinConsultor = null;
       
    }

    setear() {
        this.clinicas = "";
        this._contratoKey = new ContratoKey();
        this.sobreFilter = new SobreFilter();
        this.sobreFilter.Estados = [];
        this.listadoSobres = [];
        this.listadoTodosSobres = [];
        this.consultores = [];
        this.sobreFilter.FechaLiquidador = null;
        this.consultoresFiltrados = [];
        this.consultoresFiltradosOriginales = [];
        this.liquidadoresFiltradosOriginales = [];
        this.sobresSeleccionados = [];
        this.estados = [];
        this.todosEstados = [];
        this.usuarioAsignado = undefined;
        this.usuarioLiquidador = undefined;
        this.usuarioSeleccionado = undefined;
        this.filtroConsultor = undefined;
        this.filtroLiquidador = undefined;
        this.sobreFilter.FechaAsignacion = new Date();
        this.detallesSobres = [];
        this.tipoDoc = 2;
        this.detalleSobreSelected = new DetalleSobreEntity;
        this.sobreReembolsoService.resetDefaultPaginationConstanst();
        this.listaEstados = undefined;
        this.loadSobres();
      
       
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.changeDetector.detach();
        clearInterval(this.interval);
    }

    loadConsultores() {
        this.catalogoSobreReembolsoService.obtenerAuditoresLiquidadoresCredito().subscribe(
            result => {
                this.consultores = result;
                this.loadDatos();
                this.sobreFilter.TipoDocumento = this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO;
            },
            error => this.authService.showErrorPopup(error)
        );
    }
    loadDatos() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO).subscribe(
            result => {
                this.estados = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    

    seleccionarEstado(estado: Catalogo) {
        if (estado.Selected) {
            estado.Selected = false;
            this.sobreFilter.Estados = [];
            this.listaEstados = undefined;

            this.estados.forEach(element => {
                if (element.Selected) {
                    this.sobreFilter.Estados.push(element.Id);
                    if (this.listaEstados != undefined)
                        this.listaEstados = this.listaEstados + ", " + element.Valor;
                    else
                        this.listaEstados = element.Valor;
                }
            });
        }
        else {
            estado.Selected = true;
            this.sobreFilter.Estados.push(estado.Id);
            if (this.listaEstados != undefined)
                this.listaEstados = this.listaEstados + ", " + estado.Valor;
            else
                this.listaEstados = estado.Valor;
        }
    }

    loadSobres() {
        
        this.filtroConsultor = undefined;
        this.filtroLiquidador = undefined;
        this.usuarioSeleccionado = undefined;
        this.usuarioAsignado = undefined;
        this.usuarioLiquidador = undefined;

        this.sobreFilter.TipoDocumento = this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO;
        clearInterval(this.interval);
        this.subscription = this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, 20).subscribe(
            result => {
                this.listadoSobres = result;

                this.interval = setInterval(() => {
                    this.changeDetector.detectChanges();
                    this.changeDetector.detach();
                }, 100);
            },
            error => this.authService.showErrorPopup(error)
        );

    }


    seleccionar(sobre: SobreEntity): void {

        if (sobre.Selected == true) {
            sobre.Selected = false;
            this.listadoSobres.forEach(element => {
                if (element.IdSobre == sobre.IdSobre) {
                    element.Selected = false;
                }
            })
        }
        else {
            sobre.Selected = true;

            this.listadoSobres.forEach(element => {
                if (element.IdSobre == sobre.IdSobre) {
                    element.Selected = true;
                }
            })
        }
        this.sobresSeleccionados = [];
        this.listadoSobres.forEach(element => {
            if (element.Selected == true)
                this.sobresSeleccionados.push(element)
        });
    }

    seleccionarTodos() {
        this.sobresSeleccionados = [];
        if (this.listadoSobres.length > 0) {
            this.listadoSobres.forEach(element => {
                element.Selected = true;
                this.sobresSeleccionados.push(element);
            });
        }
    }

    asignarSobres(): void {

        if (this.validar()) {
            var mensaje = "El/ los creditos #";
            var control = 0;
            this.sobresSeleccionados.forEach(element => {
                if (element.IdEstadoSobre == this.constantesCreditos.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR) {
                    mensaje = mensaje + " " + element.NumeroSobre;
                    control++;
                }
                else {
                    mensaje = mensaje + " ya han sido asignados"
                }
            });


            if (control == 0) {
                this.asignar();
            }
            else {
                this.showPopupResultadoConfirm(mensaje);

            }

        }
    }


    validar(): boolean {

        if ((this.sobreFilter.FechaAsignacion != null || this.sobreFilter.FechaAsignacion == undefined) && (this.usuarioAsignado == undefined || this.usuarioAsignado == "" || this.usuarioAsignado == null)
            && (this.sobreFilter.FechaLiquidador != null || this.sobreFilter.FechaLiquidador == undefined) && (this.usuarioLiquidador == undefined || this.usuarioLiquidador == "" || this.usuarioLiquidador == null)) {
            this.authService.showErrorPopup("Debe seleccionar un auditor o un liquidador");
            return false;
        }

        if ((this.usuarioAsignado != undefined && this.usuarioAsignado != null && this.usuarioAsignado != "") && (this.sobreFilter.FechaAsignacion == null || this.sobreFilter.FechaAsignacion == undefined)) {
            this.authService.showErrorPopup("Debe seleccionar una fecha de auditor");
            return false;
        }

        if ((this.usuarioAsignado == undefined || this.usuarioAsignado == null || this.usuarioAsignado == "") && (this.sobreFilter.FechaAsignacion != null && this.sobreFilter.FechaAsignacion != undefined)) {
            this.authService.showErrorPopup("Debe seleccionar una usuario auditor");
            return false;
        }

        if ((this.usuarioLiquidador != undefined && this.usuarioLiquidador != null && this.usuarioLiquidador != "") && (this.sobreFilter.FechaLiquidador == null || this.sobreFilter.FechaLiquidador == undefined)) {
            this.authService.showErrorPopup("Debe seleccionar una fecha de liquidador");
            return false;
        }

        if ((this.usuarioLiquidador == undefined || this.usuarioLiquidador == null || this.usuarioLiquidador == "") && (this.sobreFilter.FechaLiquidador != null && this.sobreFilter.FechaLiquidador != undefined)) {
            this.authService.showErrorPopup("Debe seleccionar un usuario liquidador");
            return false;
        }


        if (this.sobreFilter.FechaLiquidador != undefined && this.sobreFilter.FechaLiquidador != null) {
            if (new Date(this.sobreFilter.FechaLiquidador.setHours(23, 59, 59)) < new Date()) {
                this.authService.showErrorPopup("La fecha del Liquidador no puede ser menor a la Fecha Actual");
                return false;
            }
        }

        if (this.sobreFilter.FechaAsignacion != undefined && this.sobreFilter.FechaAsignacion != null) {
            if (new Date(this.sobreFilter.FechaAsignacion.setHours(23, 59, 59)) < new Date()) {
                this.authService.showErrorPopup("La fecha del Auditor no puede ser menor a la Fecha Actual");
                return false;
            }
        }

        return true;
    }

    asignar() {

        this.sobreFilter.Estados = [];
        this.sobresSeleccionados.forEach(element => {
            if (element.Selected == true) {
                if (element.IdEstadoSobre == this.constantesCreditos.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR)
                    element.Accion = this.constantesCreditos.ACCION_ASIGNAR;
                else
                    element.Accion = this.constantesCreditos.ACCION_REASIGNAR;

                element.Accion = this.constantesCreditos.ACCION_ACTUALIZAR;

                if (this.usuarioAsignado != undefined)
                    element.UsuarioAsignado = this.usuarioAsignado;
                if (this.sobreFilter.FechaAsignacion != null)
                    element.FechaAsignacion = new Date(this.sobreFilter.FechaAsignacion.setHours(0, 0, 0));

                if (this.usuarioLiquidador != undefined)
                    element.UsuarioLiquidador = this.usuarioLiquidador;

                if (element.UsuarioLiquidador == null) {
                    element.FechaLiquidador = undefined;
                }
                else {
                    if (this.sobreFilter.FechaLiquidador)
                        element.FechaLiquidador = new Date(this.sobreFilter.FechaLiquidador.setHours(0, 0, 0));
                }

                if (element.IdEstadoSobre == this.constantesCreditos.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR) {
                    if (element.UsuarioLiquidador != undefined) {
                        element.DetalleSobre[0].IdEstado = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION;
                        element.IdEstadoSobre = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION;
                    }
                    else {
                        element.DetalleSobre[0].IdEstado = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA;
                        element.IdEstadoSobre = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA;
                    }
                }

                else {

                    if (element.UsuarioLiquidador != undefined) {
                        element.DetalleSobre[0].IdEstado = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION;
                        element.IdEstadoSobre = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION;



                    }
                    else {
                        element.DetalleSobre[0].IdEstado = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA;
                        element.IdEstadoSobre = this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA;

                    }
                }
            }
        });

        this.sobreReembolsoService.actualizarSobre(this.sobresSeleccionados).subscribe(
            result => {
                if (result) {
                    this.subscription.unsubscribe();
                    clearInterval(this.interval);
                    this.loadSobres();
                    this.authService.showSuccessPopup("Creditos Asignados");
                    $('#asignarSobresShowModal').modal('hide');
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                    $('#asignarSobresShowModal').modal('hide');
                }
            },
            error => this.authService.showErrorPopup(error)
        );

    }

    listarConsultores() {
        this.consultoresFiltrados = [];
        if (this.filtroConsultor == undefined) {
            this.consultoresFiltrados = this.consultores;
        }
        else {
            this.consultores.forEach(element => {
                if (element.NombreConsultor.indexOf(this.filtroConsultor) > -1) {
                    this.consultoresFiltrados.push(element);
                }

            });
        }
        this.consultoresFiltradosOriginales = this.consultoresFiltrados;
    }

    listarLiquidador() {

        this.liquidadoresFiltrados = [];
        if (this.filtroLiquidador == undefined) {
            this.liquidadoresFiltrados = this.consultores;
        }
        else {
            this.consultores.forEach(element => {
                if (element.NombreConsultor.indexOf(this.filtroLiquidador) > -1) {
                    this.liquidadoresFiltrados.push(element);
                }

            });
        }
        this.liquidadoresFiltradosOriginales = this.liquidadoresFiltrados;
    }

    seleccionarConsultor(consultor: ConsultorEntity) {
        this.usuarioAsignado = consultor.Usuario;
        this.filtroConsultor = consultor.NombreConsultor;
        this.usuarioSeleccionado = consultor.NombreConsultor;
        jQuery("#consultorViewModal").modal("hide");
    }
    seleccionarLiquidador(consultor: ConsultorEntity) {

        this.usuarioLiquidador = consultor.Usuario;
        this.filtroLiquidador = consultor.NombreConsultor;
        this.usuarioSeleccionado = consultor.NombreConsultor;
        jQuery("#liquidadorViewModal").modal("hide");
    }

    filtrarConsultores(searchValue: string) {

        if (this.consultoresFiltrados != undefined && this.consultoresFiltrados.length > 0) {
            var consultores = this.consultoresFiltradosOriginales.filter(item => item.NombreConsultor.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.consultoresFiltrados = consultores;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.consultoresFiltrados = this.consultoresFiltradosOriginales;
        }
    }
    filtrarLiquidadores(searchValue: string) {

        if (this.liquidadoresFiltrados != undefined && this.liquidadoresFiltrados.length > 0) {
            var liquidadores = this.liquidadoresFiltradosOriginales.filter(item => item.NombreConsultor.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.liquidadoresFiltrados = liquidadores;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.liquidadoresFiltrados = this.liquidadoresFiltradosOriginales;
        }
    }

    showPopupResultadoConfirm(msg: string): void {

        swal({
            title: "Desea Asignar ?",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {
                if (confirmed) {
                    this.asignar();
                }
            });
    }

    limpiar() {
        this.sobreFilter = new SobreFilter();
        this.sobreFilter.FechaAsignacion = new Date();
        this.sobreFilter.FechaLiquidador = new Date();
        this.filtroLiquidador = undefined;
        this.usuarioAsignado = undefined;
        this.usuarioLiquidador = undefined;
        this.listaEstados = undefined;
    }

    pageChanged(): void {
        this.loadSobres();
    }
    abrirModalDetalles(sobre: SobreEntity) {

        if (sobre.DetalleSobre.length == 0) {
            this.authService.showInfoPopup("Este sobre no posee detalles");
        }
        else {
            this.detallesSobres = sobre.DetalleSobre;
            this.detalleSobreSelected = new DetalleSobreEntity();
            var listaDetalles = [];
            listaDetalles = sobre.DetalleSobre;
            if (listaDetalles.length != 0) {
                this.detalleSobreSelected = listaDetalles[0];
            }
            $("#ModalDetalles").modal();
        }
    }

    cambiarBeneficiario(index: number) {
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.detalleSobreSelected = this.detallesSobres[index];
    }
    //historial

    cerrarModal(modal: string) {
        $('#' + modal).modal('hide');
    }

    validarAnular(): void {
        this.sobresSeleccionados = [];

        this.listadoSobres.forEach(element => {
            if (element.Selected == true) {
                element.IdEstadoSobre = this.constantesCreditos.CODIGO_ESTADO_CREDITO_ANULADO;
                element.DetalleSobre.forEach(det => {
                    det.IdEstado = this.constantesCreditos.CODIGO_ESTADO_CREDITO_ANULADO;
                });
                this.sobresSeleccionados.push(element)
            }
        });

        var mensaje = "seguro desea anular el/ los creditos";
        this.sobresSeleccionados.forEach(element => {
            mensaje = mensaje + " #" + element.NumeroSobre + ",";
            element.Accion = this.constantesCreditos.ACCION_ANULAR_SOBRE;
        });
        this.showPopupResultadoAnularConfirm(mensaje);
    }


    showPopupResultadoAnularConfirm(msg: string): void {
        swal({
            title: "Desea Continuar?",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {
                if (confirmed) {
                    this.anularSobre();
                }
            });
    }


    anularSobre() {

        this.sobreReembolsoService.actualizarSobre(this.sobresSeleccionados).subscribe(
            result => {
                if (result) {

                    this.subscription.unsubscribe();
                    clearInterval(this.interval);
                    this.loadSobres();
                    this.authService.showSuccessPopup("El o los Credito han sido anulados");

                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }
    abrirModalEstados() {
        $("#estadosViewModal").modal();
    }
    seleccionarConvenio(convenioSeleccionado: Convenio): void {

        this.sobreFilter.Clinica = convenioSeleccionado.Nombre;
        this.sobreFilter.idClinica = convenioSeleccionado.Numero;
        jQuery("#prestadorViewModal").modal("hide");
    }


    listarConvenios() {
        var filtro = new ConvenioFilter();
        filtro.Nombre = "*"+this.sobreFilter.Clinica+"*";
        this.convenioService.getMedicosForAutorizacionByFilter(filtro).subscribe(
            convenios => {
                this.convenios = convenios;
                this.conveniosOriginales = convenios;
                this.pintarConvenio();
            },
            error => this.authService.showErrorPopup(error));
    }

    pintarConvenio() {
        //selecciona el prestador o medico escogido anteriormente
        if (this.convenios != undefined && this.sobreFilter.Clinica != undefined) {

            this.convenios.forEach(element => {
                if (element.Numero == this.sobreFilter.idClinica)
                    element.Selected = true;
                else
                    element.Selected = false;
            });
        }
    }



}