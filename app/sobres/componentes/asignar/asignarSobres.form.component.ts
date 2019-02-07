import { Component, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../seguridad/auth.service';

import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../service/catalogoSobreReembolso.service';

import { ContratoKey } from '../../../common/model/contrato';
import { Catalogo } from '../../../common/model/catalogo';
import { SobreFilter } from '../../model/SobreFilter';
import { ConsultorEntity } from '../../model/ConsultorEntity';
import { SobreEntity } from '../../model/SobreEntity';

import { ConstantesSobres } from '../../utils/constantesSobres';
import { DetalleSobreEntity } from '../../model/DetalleSobreEntity';

@Component({
    providers: [],
    templateUrl: 'asignarSobres.form.template.html'
})

export class AsignarSobresFormComponent {

    _contratoKey: ContratoKey;
    sobreFilter: SobreFilter;

    consultores: ConsultorEntity[];
    consultoresFiltrados: ConsultorEntity[];
    estados: Catalogo[];
    consultoresFiltradosOriginales: ConsultorEntity[];
    listadoTodosSobres: SobreEntity[];
    listadoSobres: SobreEntity[];
    sobresSeleccionados: SobreEntity[];
    todosEstados: Catalogo[];
    detallesSobres: DetalleSobreEntity[];
    detalleSobreSelected: DetalleSobreEntity;
    
    usuarioAsignado: string;
    filtroConsultor: string;
    usuarioSeleccionado: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, public constantesSobres: ConstantesSobres,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService) {

        this.setear();
        this.loadConsultores();
    }

    setear() {
        this._contratoKey = new ContratoKey();
        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.listadoTodosSobres = [];
        this.consultores = [];
        this.consultoresFiltrados = [];
        this.consultoresFiltradosOriginales = [];
        this.sobresSeleccionados = [];
        this.estados = [];
        this.todosEstados = [];
        this.usuarioAsignado = undefined;
        this.usuarioSeleccionado = undefined;
        this.filtroConsultor = undefined;
        this.sobreFilter.FechaAsignacion = new Date();
        this.detallesSobres= [];
        this.detalleSobreSelected= new DetalleSobreEntity;
        this.sobreReembolsoService.resetDefaultPaginationConstanst();
    }

    loadConsultores() {
        this.catalogoSobreReembolsoService.obtenerConsultores().subscribe(
            result => {
                this.consultores = result;
                this.loadEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadEstados() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE).subscribe(
            result => {
                this.todosEstados = result;
                this.listaEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    listaEstados() {
        this.todosEstados.forEach(element => {
            if (element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_ANULADO) {
                this.estados.push(element);
            }
        });
    }

    loadSobres() {
        if (this.sobreFilter.FechaDesde == undefined && this.sobreFilter.FechaHasta == undefined
            && this.sobreFilter.NumeroSobre == undefined && this.sobreFilter.IdEstado == undefined
            && this.sobreFilter.UsuarioAsignado == undefined && this.sobreFilter.IngresadoPor == undefined
            && this.sobreFilter.FechaAsignacionDesde == undefined && this.sobreFilter.FechaAsignacionHasta == undefined) {

            this.authService.showErrorPopup("Seleccione al menos 1 filtro para la busqueda")
        }
        else {
            this.filtroConsultor = undefined;
            this.usuarioSeleccionado = undefined;

            this.sobreFilter.Estados = [];
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_LIQUIDADO);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_CODIFICADO);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_MORA);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_DEVUELTO);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_DEP_AUDITORIA_MEDICA);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_PENDIENTE);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_AUDITORIA_MEDICA_RF);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_QPRA);
            this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_EN_PROCESO);

            this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, 20).subscribe(
                result => {
                    this.listadoSobres = result;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
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
        if (this.sobreFilter.FechaAsignacion == null) {
            this.authService.showInfoPopup("Debe ingresar una fecha de asignación")
        }
        else {
            var mensaje = "El/ los sobres #";
            var control = 0;
            this.sobresSeleccionados.forEach(element => {
                if (element.IdEstadoSobre == this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO || element.IdEstadoSobre == this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO) {
                    mensaje = mensaje + " " + element.NumeroSobre;
                    control++;
                }
            });
            mensaje = mensaje + " ya han sido asignados"

            if (control == 0) {
                this.asignar();
            }
            else {
                this.showPopupResultadoConfirm(mensaje);
            }
        }
    }

    asignar() {
        this.sobresSeleccionados.forEach(element => {
            if (element.Selected == true) {
                element.UsuarioAsignado = this.usuarioAsignado;
                element.FechaAsignacion = this.sobreFilter.FechaAsignacion;
                if (element.IdEstadoSobre == this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO){
                    element.IdEstadoSobre = this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO;
                    element.Accion = this.constantesSobres.ACCION_ASIGNAR;
                    element.NombreEstadoSobre = this.constantesSobres.NOMBRE_ESTADO_SOBRE_ASIGNADO;
                }
                else{
                    element.IdEstadoSobre = this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO;
                    element.Accion = this.constantesSobres.ACCION_REASIGNAR;
                    element.NombreEstadoSobre = this.constantesSobres.NOMBRE_ESTADO_SOBRE_REASIGNADO;
                }
            }
        });

        this.sobreReembolsoService.actualizarSobre(this.sobresSeleccionados).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Sobres Asignados");
                    $('#asignarSobresShowModal').modal('hide');
                    this.loadSobres();
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                    $('#asignarSobresShowModal').modal('hide');
                    this.loadSobres();
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

    seleccionarConsultor(consultor: ConsultorEntity) {
        this.usuarioAsignado = consultor.Usuario;
        this.filtroConsultor = consultor.NombreConsultor;
        this.usuarioSeleccionado = consultor.NombreConsultor;
        jQuery("#consultorViewModal").modal("hide");
    }

    filtrarConsultores(searchValue: string) {
        if (this.consultoresFiltrados != undefined && this.consultoresFiltrados.length > 0) {
            var a = this.consultoresFiltradosOriginales.filter(item => item.NombreConsultor.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.consultoresFiltrados = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.consultoresFiltrados = this.consultoresFiltradosOriginales;
        }
    }

    showPopupResultadoConfirm(msg: string): void {
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
                    this.asignar();
                }
            });
    }

    limpiar() {
        this.sobreFilter = new SobreFilter();
        this.sobreFilter.FechaAsignacion = new Date();
    }

    pageChanged(): void {
        this.loadSobres();
    }
    abrirModalDetalles(sobre: SobreEntity) {

        if(sobre.DetalleSobre.length == 0){
            this.authService.showInfoPopup("Este sobre no posee detalles");
        }
        else{
        this.detallesSobres = sobre.DetalleSobre;
        this.detalleSobreSelected = new DetalleSobreEntity();
        var listaDetalles = [];
        listaDetalles = sobre.DetalleSobre;
        if(listaDetalles.length !=0){
            this.detalleSobreSelected = listaDetalles[0];
        }
        $("#ModalDetalles").modal();
    }
    }

    cambiarBeneficiario(index:number){
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.detalleSobreSelected  = this.detallesSobres[index];
    }
    //historial

    cerrarModal(modal: string) {
        $('#' + modal).modal('hide');

    }
}