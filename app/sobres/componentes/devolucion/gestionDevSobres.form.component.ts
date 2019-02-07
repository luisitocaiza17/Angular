import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { DevolucionSobresListComponent } from './../devolucion/devolucionSobres.list.component';
import { AuthService } from '../../../seguridad/auth.service';

import { ContratoKey } from '../../../common/model/contrato';
import { Catalogo } from '../../../common/model/catalogo';
import { SobreEntity } from '../../model/SobreEntity';
import { DetalleSobreEntity } from '../../model/DetalleSobreEntity';

import { BeneficiarioService } from '../../../common/servicios/beneficiario.service';

import { Beneficiario, BeneficiarioKey } from '../../../common/model/beneficiario';
import { EmailSobreFilter } from '../../model/EmailSobreFilter';

import { TipoCoberturaEntity } from '../../model/TipoCoberturaEntity';
import { TipoDevolucionEntity } from '../../model/TipoDevolucionEntity';
import { MotivoDevolucionEntity } from '../../model/MotivoDevolucionEntity';


import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { PdfSobreReembolsoService } from '../../service/pdfSobreReembolso.service';

import { CatalogoSobreReembolsoService } from '../../service/catalogoSobreReembolso.service';
import { ContratoService } from '../../../common/servicios/contrato.service';
import { TransaccionKey } from '../../../common/model/transacciones';
import { ConstantesSobres } from '../../utils/constantesSobres';

import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';


@Component({
    selector: 'gestionDevolucionSobres',
    providers: [PdfSobreReembolsoService],
    templateUrl: 'gestionDevSobres.form.template.html'
})

export class GestionDevSobresFormComponent implements OnDestroy {

    suscription: any;
    sobre: SobreEntity;
    detalleSobreSelected: DetalleSobreEntity;
    detalleSobreSelectedAux = new DetalleSobreEntity();

    contratoKey: ContratoKey;
    beneficiarios: Beneficiario[];
    estados: Catalogo[];
    establecimientos: Catalogo[];
    establecimientosbyRegion: Catalogo[];
    listaTotalEstados: Catalogo[];
    motivosDevolucion: MotivoDevolucionEntity[];
    motivosDevolucionNegativa: MotivoDevolucionEntity[];
    motivosGestion: MotivoDevolucionEntity[];
    novedad: Catalogo[];
    novedadTotal: Catalogo[];
    regiones: Catalogo[];
    tipoCarta: Catalogo[];
    tiposCobertura: TipoCoberturaEntity[];
    tiposDevolucion: TipoDevolucionEntity[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, public contratoService: ContratoService, private gestionDevSobresFormComponent: DevolucionSobresListComponent,
        public constantesSobres: ConstantesSobres, public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, public beneficiarioService: BeneficiarioService,
        public genericas: utilidadesGenericasService, public pdfSobreReembolsoService: PdfSobreReembolsoService) {

        this.setear();
        this.suscription = this.gestionDevSobresFormComponent.selectSobre$.subscribe(
            (sobre) => {
                if (sobre != undefined && sobre.IdSobre != undefined) {
                    this.sobre = sobre;
                    this.sobre.DetalleSobre = sobre.DetalleSobre;
                    if (sobre.FechaCourier != undefined)
                        this.sobre.FechaCourier = new Date(this.sobre.FechaCourier);
                    if (sobre.FechaEnvio != undefined)
                        this.sobre.FechaEnvio = new Date(this.sobre.FechaEnvio);
                    if (sobre.FechaGestion != undefined)
                        this.sobre.FechaGestion = new Date(this.sobre.FechaGestion);
                    this.loadContratoKey();
                }
            }
        );
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    setear() {
        this.sobre = new SobreEntity();
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.sobre.DetalleSobre = [];

        this.contratoKey = new ContratoKey();

        this.beneficiarios = [];
        this.estados = [];
        this.establecimientos = [];
        this.establecimientosbyRegion = [];
        this.listaTotalEstados = [];
        this.motivosDevolucion = [];
        this.motivosDevolucionNegativa = [];
        this.novedad = [];
        this.novedadTotal = [];
        this.regiones = [];
        this.tipoCarta = [];
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
                this.loadBeneficiario();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadBeneficiario() {
        var filterBenediciario = new BeneficiarioKey();
        filterBenediciario.CodigoContrato = this.contratoKey.CodigoContrato;
        filterBenediciario.NumeroContrato = this.contratoKey.NumeroContrato;

        this.beneficiarioService.getBeneficiarioAutorizacion(filterBenediciario).subscribe(
            beneficiarios => {
                this.beneficiarios = beneficiarios;
                this.migrarBeneficiarios();
                this.loadTiposDeCobertura();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    migrarBeneficiarios() {
        this.beneficiarios.forEach(beneficiario => {
            var detalle = new DetalleSobreEntity();

            this.sobre.DetalleSobre.forEach(element => {
                if (beneficiario.NumeroPersona == element.NumeroPersona) {
                    detalle = element;
                    detalle.NumeroPersona = beneficiario.NumeroPersona;
                    detalle.NombrePersona = beneficiario.NombreCompleto;
                    detalle.TipoDocumento = beneficiario.TipoIdentificacion;
                    detalle.DocumentoPersona = beneficiario.NumeroCedula;
                    if (detalle.DocumentoPersona == undefined || detalle.DocumentoPersona == null)
                        detalle.DocumentoPersona = beneficiario.NumeroPasaporte;
                    detalle.GeneroPersona = beneficiario.Genero;
                    detalle.EstadoPersona = beneficiario.Estado;
                }
            });
        });
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
                this.loadTipoCarta();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadTipoCarta() {
        this.catalogoSobreReembolsoService.obtenerTiposCarta().subscribe(
            result => {
                result.forEach(element => {
                    if (element.Id != 4) {
                        this.tipoCarta.push(element);
                    }
                });
                this.loadMotivosDeDevolucion();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadMotivosDeDevolucion() {
        this.catalogoSobreReembolsoService.obtenerMotivosDevolucion(this.constantesSobres.ID_TIPO_CARTA_DEVOLUCION).subscribe(
            result => {
                this.motivosDevolucion = result;
                this.loadMotivosDeDevolucionNegativa();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadMotivosDeDevolucionNegativa() {
        this.catalogoSobreReembolsoService.obtenerMotivosDevolucion(this.constantesSobres.ID_TIPO_CARTA_NEGATIVA_COBERTURA).subscribe(
            result => {
                this.motivosDevolucionNegativa = result;
                this.loadMotivosGesion();
            },
            error => this.authService.showErrorPopup(error)
        );
    }


    loadMotivosGesion() {
        this.motivosGestion = [];
        this.catalogoSobreReembolsoService.obtenerMotivosDevolucion(4).subscribe(
            result => {
                this.motivosGestion = result;
                console.log(this.motivosGestion);
                this.loadNovedades();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadNovedades(): void {
        this.catalogoSobreReembolsoService.obtenerNovedades().subscribe(
            result => {
                this.novedad = result;
                this.novedadTotal = result;
                this.loadEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadEstados() {
        this.listaTotalEstados = [];
        this.estados = [];
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE).subscribe(
            result => {
                this.listaTotalEstados = result;

                this.listaTotalEstados.forEach(element => {
                    if (element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_DEVUELTO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_ANULADO) {
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
                this.loadRegiones();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadRegiones() {
        this.catalogoSobreReembolsoService.obtenerRegiones().subscribe(
            result => {
                this.regiones = result;
                this.obtenerEstablecimientos();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    obtenerEstablecimientos() {
        this.catalogoSobreReembolsoService.obtenerEstablecimientos().subscribe(
            result => {
                this.establecimientos = result;
                this.loadEstablecimientos();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadEstablecimientos() {
        this.establecimientosbyRegion = [];
        if (this.sobre.IdRegionEstablecimiento != undefined)
            this.establecimientosbyRegion = this.establecimientos.filter(m => parseInt(m.CodigoProgress) == this.sobre.IdRegionEstablecimiento);
        this.cargarEstablecimientos();
    }

    cargarEstablecimientos() {
        this.establecimientosbyRegion = [];
        if (this.sobre.IdRegionEstablecimiento != undefined)
            this.establecimientosbyRegion = this.establecimientos.filter(m => parseInt(m.CodigoProgress) == this.sobre.IdRegionEstablecimiento);
    }

    //FIN CARGA DATOS INICIALES

    /*Modal Detalle*/
    abrirModalDetalleSobre(detalleSobre: DetalleSobreEntity) {
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.detalleSobreSelected = detalleSobre;
        if (this.detalleSobreSelected.ValorPresentadoDetalle == undefined) {
            this.detalleSobreSelected.ValorPresentadoDetalle = 0;
        }
        $("#detalleSobreViewModal").modal();
    }

    salirModalDetalle() {
        $('#detalleSobreViewModal').modal('hide');
    }
    /*Fin Modal Detalle*/

    /*Modal Getion*/
    abrirModalGestionSobre(detalleSobre: DetalleSobreEntity) {
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.detalleSobreSelected = detalleSobre;
        this.almacenarDatosAnteriores();
        $("#gestionSobreViewModal").modal();
    }

    cancelarModalGestion() {
        this.recuperarDatosAnteriores();
        this.salirModalGestion();
    }

    salirModalGestion() {
        $('#gestionSobreViewModal').modal('hide');
    }

    /*Fin Modal Gestion*/

    fechaGestionChange() {
        if (this.sobre.FechaGestion == undefined) {
            this.sobre.DetalleSobre.forEach(element => {
                element.IdMotivoGestion = undefined;
                element.ObservacionesGestion = undefined;
            }
            );
        }
    }


    view(): void {
        if (this.sobre != undefined) {

            var filter = new EmailSobreFilter();
            filter.IdSobre = this.sobre.IdSobre;
            filter.Ciudad = this.sobre.Ciudad;
            let resp = this.pdfSobreReembolsoService.generarCartaDevolcionPdf(filter)
                .subscribe(
                    resp => {
                        var blob = new Blob([resp._body], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(blob);
                        window.open(fileURL);
                    },
                    err => {
                        this.authService.showBlobErrorPopup(err);
                    });
        }
    }

    guardarGestion() {
        var sobres = [];
        this.sobre.Accion = this.constantesSobres.ACCION_GESTIONAR;
        this.sobre.UsuarioGestion = this.authService.nombreUsuario;
        this.sobre.NombreEstadoSobre = this.constantesSobres.NOMBRE_ESTADO_SOBRE_DEVUELTO;
        sobres.push(this.sobre);

        this.sobreReembolsoService.actualizarSobre(sobres).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Sobre Actualizado");
                    this.ngOnDestroy();
                    this.gestionDevSobresFormComponent.loadSobres();
                    jQuery("#divConsultar").collapse("hide");
                    jQuery("#divPanelSobres").collapse("hide");
                    jQuery("#divConsultar").collapse("show");
                    this.gestionDevSobresFormComponent.colapsarTab();
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error al Guardar los datos");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    almacenarDatosAnteriores() {
        this.detalleSobreSelectedAux = new DetalleSobreEntity();
        this.detalleSobreSelectedAux.IdSobre = this.detalleSobreSelected.IdSobre;
        this.detalleSobreSelectedAux.IdEstado = this.detalleSobreSelected.IdEstado
        this.detalleSobreSelectedAux.FechaIngresoDetalle = this.detalleSobreSelected.FechaIngresoDetalle;
        this.detalleSobreSelectedAux.IdTipoCobertura = this.detalleSobreSelected.IdTipoCobertura;
        this.detalleSobreSelectedAux.Novedad = this.detalleSobreSelected.Novedad;
        this.detalleSobreSelectedAux.IdNovedad = this.detalleSobreSelected.IdNovedad;
        this.detalleSobreSelectedAux.IdTipoDevolucion = this.detalleSobreSelected.IdTipoDevolucion;
        this.detalleSobreSelectedAux.IdTipoCarta = this.detalleSobreSelected.IdTipoCarta;
        this.detalleSobreSelectedAux.IdMotivoDevolucion = this.detalleSobreSelected.IdMotivoDevolucion;
        this.detalleSobreSelectedAux.IdMotivoNegativa = this.detalleSobreSelected.IdMotivoNegativa;
        this.detalleSobreSelectedAux.IdMotivoGestion = this.detalleSobreSelected.IdMotivoGestion;
        this.detalleSobreSelectedAux.IdClausulaDevolucion = this.detalleSobreSelected.IdClausulaDevolucion;
        this.detalleSobreSelectedAux.IdClausulaNegativa = this.detalleSobreSelected.IdClausulaNegativa;
        this.detalleSobreSelectedAux.NumeroPersona = this.detalleSobreSelected.NumeroPersona;
        this.detalleSobreSelectedAux.ValorPresentadoDetalle = this.detalleSobreSelected.ValorPresentadoDetalle;
        this.detalleSobreSelectedAux.NumeroSolicitudDetalle = this.detalleSobreSelected.NumeroSolicitudDetalle;
        this.detalleSobreSelectedAux.ObservacionesConsultor = this.detalleSobreSelected.ObservacionesConsultor;
        this.detalleSobreSelectedAux.ObservacionesGestion = this.detalleSobreSelected.ObservacionesGestion;
        this.detalleSobreSelectedAux.NumeroQpra = this.detalleSobreSelected.NumeroQpra;
        this.detalleSobreSelectedAux.FechaCambioEstado = this.detalleSobreSelected.FechaCambioEstado;

        this.detalleSobreSelectedAux.NumeroReclamo = this.detalleSobreSelected.NumeroReclamo;
        this.detalleSobreSelectedAux.NumeroAlcance = this.detalleSobreSelected.NumeroAlcance;
        this.detalleSobreSelectedAux.FechaPresentacionReclamo = this.detalleSobreSelected.FechaPresentacionReclamo;
        this.detalleSobreSelectedAux.EstadoReclamo = this.detalleSobreSelected.EstadoReclamo;
        this.detalleSobreSelectedAux.MontoPresentado = this.detalleSobreSelected.MontoPresentado;
        this.detalleSobreSelectedAux.FechaLiquidacionReclamo = this.detalleSobreSelected.FechaLiquidacionReclamo;
        this.detalleSobreSelectedAux.FechaPagoReclamo = this.detalleSobreSelected.FechaPagoReclamo;
        this.detalleSobreSelectedAux.MontoBonificado = this.detalleSobreSelected.MontoBonificado;
        this.detalleSobreSelectedAux.SecuencialConstitucion = this.detalleSobreSelected.SecuencialConstitucion;
        this.detalleSobreSelectedAux.Migrado = this.detalleSobreSelected.Migrado;
        this.detalleSobreSelectedAux.IdConstitucion = this.detalleSobreSelected.IdConstitucion;

        this.detalleSobreSelectedAux.ClausulaDevolucion = this.detalleSobreSelected.ClausulaDevolucion;
        this.detalleSobreSelectedAux.ClausulaNegativa = this.detalleSobreSelected.ClausulaNegativa;
        this.detalleSobreSelectedAux.DescripcionEstado = this.detalleSobreSelected.DescripcionEstado;
        this.detalleSobreSelectedAux.TituloClausulaDevolucion = this.detalleSobreSelected.TituloClausulaDevolucion;
        this.detalleSobreSelectedAux.TituloClausulaDevolucion = this.detalleSobreSelected.TituloClausulaDevolucion;
        this.detalleSobreSelectedAux.DescripcionMotivoDevolucion = this.detalleSobreSelected.DescripcionMotivoDevolucion;
        this.detalleSobreSelectedAux.DescripcionMotivoNegativa = this.detalleSobreSelected.DescripcionMotivoNegativa;
        this.detalleSobreSelectedAux.NombreBeneficiario = this.detalleSobreSelected.NombreBeneficiario;
        this.detalleSobreSelectedAux.Literales = this.detalleSobreSelected.Literales;
    }

    recuperarDatosAnteriores() {
        this.detalleSobreSelected.IdSobre = this.detalleSobreSelectedAux.IdSobre;
        this.detalleSobreSelected.IdEstado = this.detalleSobreSelectedAux.IdEstado;
        this.detalleSobreSelected.FechaIngresoDetalle = this.detalleSobreSelectedAux.FechaIngresoDetalle;
        this.detalleSobreSelected.IdTipoCobertura = this.detalleSobreSelectedAux.IdTipoCobertura;
        this.detalleSobreSelected.Novedad = this.detalleSobreSelectedAux.Novedad;
        this.detalleSobreSelected.IdNovedad = this.detalleSobreSelectedAux.IdNovedad;
        this.detalleSobreSelected.IdTipoDevolucion = this.detalleSobreSelectedAux.IdTipoDevolucion;
        this.detalleSobreSelected.IdTipoCarta = this.detalleSobreSelectedAux.IdTipoCarta;
        this.detalleSobreSelected.IdMotivoDevolucion = this.detalleSobreSelectedAux.IdMotivoDevolucion;
        this.detalleSobreSelected.IdMotivoNegativa = this.detalleSobreSelectedAux.IdMotivoNegativa;
        this.detalleSobreSelected.IdMotivoGestion = this.detalleSobreSelectedAux.IdMotivoGestion;
        this.detalleSobreSelected.IdClausulaDevolucion = this.detalleSobreSelectedAux.IdClausulaDevolucion;
        this.detalleSobreSelected.IdClausulaNegativa = this.detalleSobreSelectedAux.IdClausulaNegativa;
        this.detalleSobreSelected.NumeroPersona = this.detalleSobreSelectedAux.NumeroPersona;
        this.detalleSobreSelected.ValorPresentadoDetalle = this.detalleSobreSelectedAux.ValorPresentadoDetalle;
        this.detalleSobreSelected.NumeroSolicitudDetalle = this.detalleSobreSelectedAux.NumeroSolicitudDetalle;
        this.detalleSobreSelected.ObservacionesConsultor = this.detalleSobreSelectedAux.ObservacionesConsultor;
        this.detalleSobreSelected.ObservacionesGestion = this.detalleSobreSelectedAux.ObservacionesGestion;
        this.detalleSobreSelected.NumeroQpra = this.detalleSobreSelectedAux.NumeroQpra;
        this.detalleSobreSelected.FechaCambioEstado = this.detalleSobreSelectedAux.FechaCambioEstado;

        this.detalleSobreSelected.NumeroReclamo = this.detalleSobreSelectedAux.NumeroReclamo;
        this.detalleSobreSelected.NumeroAlcance = this.detalleSobreSelectedAux.NumeroAlcance;
        this.detalleSobreSelected.FechaPresentacionReclamo = this.detalleSobreSelectedAux.FechaPresentacionReclamo;
        this.detalleSobreSelected.EstadoReclamo = this.detalleSobreSelectedAux.EstadoReclamo;
        this.detalleSobreSelected.MontoPresentado = this.detalleSobreSelectedAux.MontoPresentado;
        this.detalleSobreSelected.FechaLiquidacionReclamo = this.detalleSobreSelectedAux.FechaLiquidacionReclamo;
        this.detalleSobreSelected.FechaPagoReclamo = this.detalleSobreSelectedAux.FechaPagoReclamo;
        this.detalleSobreSelected.MontoBonificado = this.detalleSobreSelectedAux.MontoBonificado;
        this.detalleSobreSelected.SecuencialConstitucion = this.detalleSobreSelectedAux.SecuencialConstitucion;
        this.detalleSobreSelected.Migrado = this.detalleSobreSelectedAux.Migrado;
        this.detalleSobreSelected.IdConstitucion = this.detalleSobreSelectedAux.IdConstitucion;

        this.detalleSobreSelected.ClausulaDevolucion = this.detalleSobreSelectedAux.ClausulaDevolucion;
        this.detalleSobreSelected.ClausulaNegativa = this.detalleSobreSelectedAux.ClausulaNegativa;
        this.detalleSobreSelected.DescripcionEstado = this.detalleSobreSelectedAux.DescripcionEstado;
        this.detalleSobreSelected.TituloClausulaDevolucion = this.detalleSobreSelectedAux.TituloClausulaDevolucion;
        this.detalleSobreSelected.TituloClausulaNegativa = this.detalleSobreSelectedAux.TituloClausulaNegativa;
        this.detalleSobreSelected.DescripcionMotivoDevolucion = this.detalleSobreSelectedAux.DescripcionMotivoDevolucion;
        this.detalleSobreSelected.DescripcionMotivoNegativa = this.detalleSobreSelectedAux.DescripcionMotivoNegativa;
        this.detalleSobreSelected.NombreBeneficiario = this.detalleSobreSelectedAux.NombreBeneficiario;
        this.detalleSobreSelected.Literales = this.detalleSobreSelectedAux.Literales;
    }
}