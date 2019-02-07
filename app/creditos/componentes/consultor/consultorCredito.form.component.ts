import { Component, OnDestroy, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { AuthService } from '../../../seguridad/auth.service';
import { ContratoService } from '../../../common/servicios/contrato.service';
import { BeneficiarioService } from '../../../common/servicios/beneficiario.service';

import { Catalogo } from '../../../common/model/catalogo';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { SobreReembolsoService } from '../../../sobres/service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../sobres/service/catalogoSobreReembolso.service';
import { CrConsultorListComponent } from './listadoCrConsultor.list.component';
import { ConstantesCreditos } from '../../utils/ConstantesCreditos';
import { SobreEntity } from '../../../sobres/model/SobreEntity';
import { DetalleSobreEntity } from '../../../sobres/model/DetalleSobreEntity';
import { TipoCoberturaEntity } from '../../../sobres/model/TipoCoberturaEntity';
import { TipoDevolucionEntity, } from '../../../sobres/model/TipoDevolucionEntity';
import { TransaccionKey } from '../../../common/model/transacciones';
import { ContratoKey } from '../../../common/model/contrato';

@Component({
    selector: 'consultorCreditoForm',
    providers: [ContratoService, BeneficiarioService],
    templateUrl: 'consultorCredito.form.template.html'
})

export class ConsultorCreditosFormComponent implements OnDestroy {

    contratoKey: ContratoKey;
    suscription: any;
    sobre: SobreEntity;
    controlValor: number;
    detalleSobreSelected: DetalleSobreEntity;
    estados: Catalogo[];
    listaTotalEstados: Catalogo[];
    tiposCobertura: TipoCoberturaEntity[];
    tiposDevolucion: TipoDevolucionEntity[];

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, public contratoService: ContratoService, private crConsultorListComponent: CrConsultorListComponent,
        public constantesCreditos: ConstantesCreditos, public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, public beneficiarioService: BeneficiarioService,
        public genericas: utilidadesGenericasService) {

        this.setear();
        this.suscription = this.crConsultorListComponent.selectSobre$.subscribe(
            (sobre) => {
                if (sobre != undefined && sobre.IdSobre != undefined) {
                    this.sobre = sobre;
                    console.log(this.sobre);
                    if (this.sobre.DetalleSobre.length > 0)
                        this.detalleSobreSelected = this.sobre.DetalleSobre[0];

                    this.loadContratoKey();

                }
            }
        );
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    setear() {
        this.contratoKey = new ContratoKey();
        this.sobre = new SobreEntity();
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.sobre.DetalleSobre = [];


        this.estados = [];
        this.listaTotalEstados = [];
        this.tiposCobertura = [];
        this.tiposDevolucion = [];

        this.sobreReembolsoService.resetDefaultPaginationConstanst();
    }

    loadContratoKey() {
        var filter = new TransaccionKey();
        filter.CodigoProducto = this.sobre.CodigoProducto;
        filter.CodigoRegion = this.sobre.CodigoRegion;
        filter.NumeroContrato = this.sobre.NumeroContrato;

        this.contratoService.getContratoKey(filter).subscribe(
            result => {
                this.contratoKey = result;
                this.loadTiposDeCobertura();
            },
            error => this.authService.showErrorPopup(error)
        );
    }


    loadTiposDeCobertura() {
        this.catalogoSobreReembolsoService.obtenerTiposDeCobertura().subscribe(
            result => {
                this.tiposCobertura = result;
                this.loadTiposDeDevolucion();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadTiposDeDevolucion() {
        this.catalogoSobreReembolsoService.obtenerTiposDeDevolucion().subscribe(
            result => {
                this.tiposDevolucion = result;
                this.loadEstados()
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadEstados() {
        this.listaTotalEstados = [];
        this.estados = [];
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO).subscribe(
            result => {
                this.listaTotalEstados = result;

                this.listaTotalEstados.forEach(element => {
                    if (element.Id != this.constantesCreditos.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR && element.Id != this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA && element.Id != this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA) {
                        this.estados.push(element);
                    }
                });

                var estado = 0;
                this.estados.forEach(element => {
                    if (this.sobre.IdEstadoSobre == element.Id) {
                        estado = element.Id;
                    }
                });

                if (estado != 0) {
                    this.sobre.IdEstadoSobre = estado;
                }
                else {
                    this.sobre.IdEstadoSobre = undefined;
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    /*GUARDAR CAMBIOS*/
    guardar() {

        if (this.verificar30Dias()) {
            if (this.authService.isAuthorizeRequest()) {
                this.sobre.ValorPresentado = this.sobre.DetalleSobre[0].ValorPresentadoDetalle;
                this.sobre.ValorConsultor = this.sobre.DetalleSobre[0].ValorPresentadoDetalle;

                swal({
                    title: "<h3>¿Desea Actualizar el Credito?</h3>",
                    text: "<h3>EL credito se acualizará con estado " + this.estados.find(x => x.Id == this.sobre.DetalleSobre[0].IdEstado).Valor + "</h3>",
                    type: "warning",
                    html: true,
                    showCancelButton: true,
                    cancelButtonText: "No",
                    confirmButtonColor: "#ec4758",
                    confirmButtonText: "Si",
                    closeOnConfirm: true
                }, () => {
                    this.actualizarSobre();
                });
            }
        }
        else {
            swal({
                title: "<h3>Este crédito ya ha sido reportado con un valor de $" + this.sobre.ValorPresentado + ", ¿Desea Actualizar el Crédito?</h3>",
                text: "<h3>EL credito se acualizará con estado " + this.estados.find(x => x.Id == this.sobre.DetalleSobre[0].IdEstado).Valor + "</h3>",
                type: "info",
                html: true,
                showCancelButton: true,
                cancelButtonText: "No",
                confirmButtonColor: "#ec4758",
                confirmButtonText: "Si",
                closeOnConfirm: true
            }, () => {
                this.sobre.ValorConsultor = this.sobre.DetalleSobre[0].ValorPresentadoDetalle;
                this.sobre.DetalleSobre[0].ValorPresentadoDetalle = this.sobre.ValorPresentado;
                this.actualizarSobre();
            });
        }
    }


    verificar30Dias(): boolean {

        if (new Date() < new Date(this.genericas.proximoMes(this.sobre.FechaDigitacion)))
            return true;
        else
            return false;

    }

    actualizarSobre() {
        var sobres = [];
        this.sobre.IdEstadoSobre = this.sobre.DetalleSobre[0].IdEstado;
        this.sobre.Accion = this.constantesCreditos.ACCION_CONSULTOR;
        sobres.push(this.sobre);
        if (this.detalleSobreSelected.IdEstado == this.constantesCreditos.CODIGO_ESTADO_CREDITO_CODIFICADO ||
            this.detalleSobreSelected.IdEstado == this.constantesCreditos.CODIGO_ESTADO_CREDITO_DEVOLUCION ||
            this.detalleSobreSelected.IdEstado == this.constantesCreditos.CODIGO_ESTADO_CREDITO_NEGADO) {
            this.sobre.FechaFinConsultor = new Date();
        }

        this.sobreReembolsoService.actualizarSobre(sobres).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Credito Actualizado");
                    this.ngOnDestroy();
                    this.crConsultorListComponent.loadSobres();
                    jQuery("#divConsultar").collapse("hide");
                    jQuery("#divPanelSobres").collapse("hide");

                    if (this.sobre.EnviarMail) {
                        this.crConsultorListComponent.inicializarPanelMail(this.sobre);
                    } else {
                        jQuery("#divConsultar").collapse("show");
                        this.crConsultorListComponent.colapsarTab();
                    }
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error al Guardar los datos");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }
    ValidarDevolucion() {
        this.detalleSobreSelected.IdTipoDevolucion = undefined;
    }
    /*GUARDAR CAMBIOS*/

    irQpra() {
        $("<a>").attr("href", "http://portal:8000/").attr("target", "_blank")[0].click();
    }
}