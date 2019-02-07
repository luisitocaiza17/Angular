import { Component, Input, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../../seguridad/auth.service';

import { SobreReembolsoService } from '../../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../service/catalogoSobreReembolso.service';

import { ContratoKey } from '../../../../common/model/contrato';
import { Catalogo } from '../../../../common/model/catalogo';
import { SobreFilter } from '../../../model/SobreFilter';
import { ConsultorEntity } from '../../../model/ConsultorEntity';
import { SobreEntity } from '../../../model/SobreEntity';

import { ConstantesSobres } from '../../../utils/constantesSobres';
import { DetalleSobreEntity } from '../../../model/DetalleSobreEntity';


@Component({
    selector: 'anularSobreContrato',
    providers: [],
    templateUrl: 'anularSobreContrato.form.template.html'
})

export class AnularSobreByContratoFormComponent {

    _contratoKey: ContratoKey;
    sobreFilter: SobreFilter;
    consultores: ConsultorEntity[];
    estados: Catalogo[];
    listadoSobres: SobreEntity[];
    listadoTodosSobres: SobreEntity[];
    sobresSeleccionados: SobreEntity[];
    detalleSobreSelected: DetalleSobreEntity;
    detallesSobres: DetalleSobreEntity[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.sobreFilter.CodigoContrato = this._contratoKey.CodigoContrato;
            this.sobreFilter.NumeroContrato = this._contratoKey.NumeroContrato;
            this.sobreFilter.CodigoRegion = this._contratoKey.CodigoRegion;
            this.sobreFilter.CodigoProducto = this._contratoKey.CodigoProducto;
        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, public catalogoSobreReembolsoService: CatalogoSobreReembolsoService,
        public constantesSobres: ConstantesSobres) {
        this.setear();
        this.loadConsultores();
    }

    setear() {
        this._contratoKey = new ContratoKey();
        this.sobreFilter = new SobreFilter();
        this.detallesSobres = [];
        this.detalleSobreSelected = new DetalleSobreEntity;
        this.consultores = [];
        this.estados = [];
        this.listadoSobres = [];
        this.listadoTodosSobres = [];
        this.sobresSeleccionados = [];

        this.sobreReembolsoService.resetDefaultPaginationConstanst();
    }

    loadConsultores() {
        this.catalogoSobreReembolsoService.obtenerConsultores().subscribe(
            result => {
                this.consultores = result;
                this.loadDatos();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadDatos() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE).subscribe(
            result => {
                this.estados = result;
                this.loadSobres();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadSobres() {
        this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, 20).subscribe(
            result => {
                this.listadoSobres = result;
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
    }

    seleccionarTodos() {
        this.sobresSeleccionados = [];
        if (this.listadoSobres.length > 0) {
            this.listadoSobres.forEach(element => {
                if (element.IdEstadoSobre != this.constantesSobres.CODIGO_ESTADO_SOBRE_ANULADO) {
                    element.Selected = true;
                    this.sobresSeleccionados.push(element);
                }
            });
        }
    }



    validarAnular(): void {
        this.sobresSeleccionados = [];

        this.listadoSobres.forEach(element => {
            if (element.Selected == true) {
                element.IdEstadoSobre = this.constantesSobres.CODIGO_ESTADO_SOBRE_ANULADO;
                element.DetalleSobre.forEach(detalle => {
                    detalle.IdEstado = this.constantesSobres.CODIGO_ESTADO_SOBRE_ANULADO;
                });
                this.sobresSeleccionados.push(element)
            }
        });

        var mensaje = "seguro desea anular el/ los sobres";
        this.sobresSeleccionados.forEach(element => {
            mensaje = mensaje + " #" + element.NumeroSobre + ",";
            element.Accion = this.constantesSobres.ACCION_ANULAR_SOBRE;
        });
        this.showPopupResultadoConfirm(mensaje);
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
                    this.anularSobre();
                }
            });
    }


    anularSobre() {
        this.sobreReembolsoService.actualizarSobre(this.sobresSeleccionados).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("El o los Sobres han sido anulados");
                    this.loadSobres();
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    limpiar() {
        this.sobreFilter = new SobreFilter();
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
}