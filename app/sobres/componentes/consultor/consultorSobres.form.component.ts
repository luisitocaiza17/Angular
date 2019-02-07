import { Component, OnDestroy, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { SbConsultorListComponent } from './listadoSbConsultor.list.component';
import { AuthService } from '../../../seguridad/auth.service';

import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../service/catalogoSobreReembolso.service';
import { ContratoService } from '../../../common/servicios/contrato.service';
import { BeneficiarioService } from '../../../common/servicios/beneficiario.service';

import { ContratoKey } from '../../../common/model/contrato';
import { Catalogo } from '../../../common/model/catalogo';
import { TransaccionKey } from '../../../common/model/transacciones';
import { Beneficiario, BeneficiarioKey } from '../../../common/model/beneficiario';
import { SobreEntity } from '../../model/SobreEntity';
import { DetalleSobreEntity } from '../../model/DetalleSobreEntity';
import { TipoCoberturaEntity } from '../../model/TipoCoberturaEntity';
import { TipoDevolucionEntity } from '../../model/TipoDevolucionEntity';

import { ConstantesSobres } from '../../utils/constantesSobres';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { ClasulaEntity } from '../../model/ClausulaEntity';
import { LiteralClausulaEntity } from '../../model/LiteralClausulaEntity';
import { MotivoDevolucionEntity } from '../../model/MotivoDevolucionEntity';
import { DetalleSobreLiteralEntity } from '../../model/DetalleSobreLiteralEntity';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'consultorForm',
    providers: [ContratoService, BeneficiarioService],
    templateUrl: 'consultorSobres.form.template.html'
})

export class ConsultorSobresFormComponent implements OnDestroy {

    suscription: any;
    sobre: SobreEntity;
    controlValor: number;
    literales: LiteralClausulaEntity[];

    clausulas: ClasulaEntity[];
    clausulaSelected: ClasulaEntity;
    clausulasDevolucion: ClasulaEntity[];
    clausulasNegativa: ClasulaEntity[];

    detalleSobreSelected: DetalleSobreEntity;
    detalleSobreSelectedAux: DetalleSobreEntity;
    detalleSobreTemporal: DetalleSobreEntity[];
    contratoKey: ContratoKey;
    beneficiarios: Beneficiario[];
    estados: Catalogo[];
    establecimientos: Catalogo[];
    establecimientosbyRegion: Catalogo[];
    listaTotalEstados: Catalogo[];
    literalClausula: LiteralClausulaEntity[];
    motivosDevolucion: MotivoDevolucionEntity[];
    motivosDevolucionNegativa: MotivoDevolucionEntity[];
    novedad: Catalogo[];
    novedadTotal: Catalogo[];
    regiones: Catalogo[];
    tipoCarta: Catalogo[];
    tiposCobertura: TipoCoberturaEntity[];
    tiposDevolucion: TipoDevolucionEntity[];

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, public contratoService: ContratoService, private sbConsultorListComponent: SbConsultorListComponent,
        public constantesSobres: ConstantesSobres, public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, public beneficiarioService: BeneficiarioService,
        public genericas: utilidadesGenericasService) {

        this.setear();
        this.suscription = this.sbConsultorListComponent.selectSobre$.subscribe(
            (sobre) => {
                if (sobre != undefined && sobre.IdSobre != undefined) {
                    this.sobre = sobre;
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
        this.clausulas = [];
        this.clausulasNegativa = [];
        this.clausulasDevolucion = [];
        this.clausulaSelected = new ClasulaEntity();
        this.clausulaSelected.Literales = [];
        this.detalleSobreTemporal = [];
        this.estados = [];
        this.establecimientos = [];
        this.establecimientosbyRegion = [];
        this.listaTotalEstados = [];
        this.literalClausula = [];
        this.literales = [];
        this.motivosDevolucion = [];
        this.motivosDevolucionNegativa = [];
        this.novedad = [];
        this.novedadTotal = [];
        this.regiones = [];
        this.tipoCarta = [];
        this.tiposCobertura = [];
        this.tiposDevolucion = [];

        this.catalogoSobreReembolsoService.tiposCobertura.subscribe(tiposCobertura => {
            this.tiposCobertura = tiposCobertura;
        });

        this.catalogoSobreReembolsoService.tiposDevolucion.subscribe(tiposDevolucion => {
            this.tiposDevolucion = tiposDevolucion;
        });

        this.catalogoSobreReembolsoService.tiposCarta.subscribe(tiposCarta => {
            this.tipoCarta = tiposCarta;
        });

        this.catalogoSobreReembolsoService.regiones.subscribe(regiones => {
            this.regiones = regiones;
        });

        this.catalogoSobreReembolsoService.motivosDevolucion.subscribe(motivosDevolucion => {
            this.motivosDevolucion = motivosDevolucion;
        });

        this.catalogoSobreReembolsoService.motivosNegativa.subscribe(motivosDevolucionNegativa => {
            this.motivosDevolucionNegativa = motivosDevolucionNegativa;
        });

        this.catalogoSobreReembolsoService.clausulas.subscribe(clausulas => {
            this.clausulas = clausulas;
        });

        this.catalogoSobreReembolsoService.novedad.subscribe(novedad => {
            this.novedad = novedad;
            this.novedadTotal = novedad;
        });

        this.catalogoSobreReembolsoService.estados.subscribe(estados => {
            this.listaTotalEstados = estados;
        });

        this.catalogoSobreReembolsoService.establecimientos.subscribe(establecimientos => {
            this.establecimientos = establecimientos;
        });
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
                this.cargarEstablecimientos();
                this.migrarBeneficiarios();
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
                }
            });

            detalle.IdSobre = this.sobre.IdSobre;
            detalle.NumeroPersona = beneficiario.NumeroPersona;
            detalle.NombrePersona = beneficiario.NombreCompleto;
            detalle.TipoDocumento = beneficiario.TipoIdentificacion;
            detalle.DocumentoPersona = beneficiario.NumeroCedula;
            if (detalle.DocumentoPersona == undefined || detalle.DocumentoPersona == null)
                detalle.DocumentoPersona = beneficiario.NumeroPasaporte;
            detalle.GeneroPersona = beneficiario.Genero;
            detalle.EstadoPersona = beneficiario.Estado;
            detalle.NombreBeneficiario = beneficiario.NombreCompleto;

            this.detalleSobreTemporal.push(detalle);
        });
    }

    cargarEstablecimientos() {
        this.establecimientosbyRegion = [];
        if (this.sobre.IdRegionEstablecimiento != undefined)
            this.establecimientosbyRegion = this.establecimientos.filter(m => parseInt(m.CodigoProgress) == this.sobre.IdRegionEstablecimiento);

        this.loadEstados();

    }


    loadEstados() {
        this.listaTotalEstados.forEach(element => {
            if (element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_DEVUELTO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_ANULADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_EN_PROCESO) {
                this.estados.push(element);
            }
        });

        var estado = 0;
        this.estados.forEach(element => {
            if (this.sobre.IdEstadoSobre == element.Id) {
                estado = element.Id;
            }
        });

        if (estado != 0)
            this.sobre.IdEstadoSobre = estado;
        else
            this.sobre.IdEstadoSobre = undefined;
    }

    //FIN CARGA DATOS INICIALES
    crearCodigoSobrePersona() {
        this.detalleSobreSelected.NumeroSolicitudDetalle = undefined;
        if (this.detalleSobreSelected.IdTipoCobertura == this.constantesSobres.ID_TIPO_COBERTURA_AMBULATORIO)
            this.detalleSobreSelected.NumeroSolicitudDetalle = this.sobre.NumeroSobre + "-" + this.sobre.CodigoRegion.toUpperCase().substring(0, 1) + "-" + "A" + "-" + this.detalleSobreSelected.NumeroPersona;

        if (this.detalleSobreSelected.IdTipoCobertura == this.constantesSobres.ID_TIPO_COBERTURA_HOSPITALARIO)
            this.detalleSobreSelected.NumeroSolicitudDetalle = this.sobre.NumeroSobre + "-" + this.sobre.CodigoRegion.toUpperCase().substring(0, 1) + "-" + "H" + "-" + this.detalleSobreSelected.NumeroPersona;
    }

    /*PROPIEDADES DE DESABILITACION DE ELEMENTOS EN LA PANTALLA */
    desabilitaCambiarEstado() {
        this.cargarNovedadSegunEstado();
        this.detalleSobreSelected.Novedad = undefined;
        this.desabilitaCambiaTieneNovedad();
    }

    desabilitaCambiaTieneNovedad() {
        if (!this.detalleSobreSelected.Novedad || this.detalleSobreSelected.Novedad == undefined) {
            this.detalleSobreSelected.IdNovedad = undefined;
            this.desabilitaCambiarNovedad();
        }
    }

    desabilitaCambiarNovedad() {
        //PARA SABER LA DESCRIPCION DEL TIPO DE DEVOLUCION Y ENVIAR AL HISTORIAL
        this.novedad.forEach(element => {
            if (element.Id == this.detalleSobreSelected.IdNovedad)
                this.detalleSobreSelected.DescripcionNovedad = element.Valor;
        });

        if (this.detalleSobreSelected.IdNovedad != this.constantesSobres.ID_NOVEDAD_DEVOLUCION) {
            this.detalleSobreSelected.IdTipoDevolucion = undefined;
            this.desabilitaCambiaTipoDevolucion();
        }
    }

    desabilitaCambiaTipoDevolucion() {
        //PARA SABER LA DESCRIPCION DEL TIPO DE DEVOLUCION Y ENVIAR AL HISTORIAL
        this.tiposDevolucion.forEach(element => {
            if (element.IdTipoDevolucion == this.detalleSobreSelected.IdTipoDevolucion)
                this.detalleSobreSelected.DescripcionTipoDevolucion = element.NombreTipoDevolucion;
        });

        if (this.detalleSobreSelected.IdTipoDevolucion == undefined || this.detalleSobreSelected.IdTipoDevolucion == this.constantesSobres.ID_TIPO_DEVOLUCION_QPRA) {
            this.detalleSobreSelected.IdTipoCarta = undefined;
            this.desabilitaCambiaTipoCarta();
        }
    }

    desabilitaCambiaTipoCarta() {
        if (this.detalleSobreSelected.IdTipoCarta == undefined) {
            this.detalleSobreSelected.IdMotivoDevolucion = undefined;
            this.detalleSobreSelected.IdMotivoNegativa = undefined;
            this.detalleSobreSelected.IdClausulaDevolucion = undefined;
            this.detalleSobreSelected.IdClausulaNegativa = undefined;
            this.detalleSobreSelected.ClausulaDevolucion = undefined;
            this.detalleSobreSelected.ClausulaNegativa = undefined;
            this.desabilitaMotivoDevolucion();
            this.desabilitaMotivoNegativa();
        }
        else {
            //PARA SABER LA DESCRIPCION DEL TIPO DE CARTA Y ENVIAR AL HISTORIAL
            this.tipoCarta.forEach(element => {
                if (element.Id == this.detalleSobreSelected.IdTipoCarta)
                    this.detalleSobreSelected.DescripcionTipoCarta = element.Valor;
            });

            if (this.detalleSobreSelected.IdTipoCarta == this.constantesSobres.ID_TIPO_CARTA_DEVOLUCION) {
                this.detalleSobreSelected.IdClausulaNegativa = undefined;
                this.detalleSobreSelected.IdMotivoNegativa = undefined;
                this.detalleSobreSelected.ClausulaNegativa = undefined;

                this.desabilitaMotivoNegativa();
            }
            if (this.detalleSobreSelected.IdTipoCarta == this.constantesSobres.ID_TIPO_CARTA_NEGATIVA_COBERTURA) {
                this.detalleSobreSelected.IdClausulaDevolucion = undefined;
                this.detalleSobreSelected.IdMotivoDevolucion = undefined;
                this.detalleSobreSelected.ClausulaDevolucion = undefined;

                this.desabilitaMotivoDevolucion();
            }
        }
    }

    desabilitaMotivoDevolucion() {

        //PARA SABER LA DESCRIPCION DEL MOTIVO DE DEVOLUCION Y ENVIAR AL HISTORIAL   
        var motivo = this.motivosDevolucion.find(x => x.IdMotivoDevolucion == this.detalleSobreSelected.IdMotivoDevolucion)
        if (motivo != undefined) {
            this.detalleSobreSelected.DescripcionMotivoDevolucion = motivo.NombreMotivo;
            this.detalleSobreSelected.IdMotivoDevolucion = motivo.IdMotivoDevolucion;
            this.clausulasDevolucion = [];

            motivo.IdClausulas.forEach(element => {
                this.clausulasDevolucion.push(this.clausulas.find(x => x.IdClausula == element))
            });
        }
    }

    desabilitaMotivoNegativa() {
        //PARA SABER LA DESCRIPCION DEL MOTIVO NEGATIVA Y ENVIAR AL HISTORIAL
        var motivo = this.motivosDevolucionNegativa.find(x => x.IdMotivoDevolucion == this.detalleSobreSelected.IdMotivoNegativa)

        if (motivo != undefined) {
            this.detalleSobreSelected.DescripcionMotivoNegativa = motivo.NombreMotivo;
            this.detalleSobreSelected.IdMotivoNegativa = motivo.IdMotivoDevolucion;
            this.clausulasNegativa = [];

            console.log("Hola");
            console.log(motivo.IdClausulas)
            motivo.IdClausulas.forEach(element => {
                this.clausulasNegativa.push(this.clausulas.find(x => x.IdClausula == element))
            });
        }
    }

    cargarNovedadSegunEstado() {
        this.novedad = [];
        this.detalleSobreSelected.DescripcionEstado = undefined;

        if (this.detalleSobreSelected.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_DEP_AUDITORIA_MEDICA) {
            this.detalleSobreSelected.DescripcionEstado = this.constantesSobres.NOMBRE_ESTADO_SOBRE_DPTO_AUDITORIA_MEDICA;
            this.novedadTotal.forEach(element => {
                if (element.Id == this.constantesSobres.ID_NOVEDAD_HELP || element.Id == this.constantesSobres.ID_NOVEDAD_REQUERIMIENTO || element.Id == this.constantesSobres.ID_NOVEDAD_PI || element.Id == this.constantesSobres.ID_NOVEDAD_AUD_MEDICA_RF) {
                    this.novedad.push(element);
                }
            });
        }

        if (this.detalleSobreSelected.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_PENDIENTE) {
            this.detalleSobreSelected.DescripcionEstado = this.constantesSobres.NOMBRE_ESTADO_SOBRE_PENDIENTE;
            this.novedadTotal.forEach(element => {
                if (element.Id == this.constantesSobres.ID_NOVEDAD_HELP || element.Id == this.constantesSobres.ID_NOVEDAD_REQUERIMIENTO || element.Id == this.constantesSobres.ID_NOVEDAD_PI) {
                    this.novedad.push(element);
                }
            });
        }

        if (this.detalleSobreSelected.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_AUDITORIA_MEDICA_RF) {
            this.detalleSobreSelected.DescripcionEstado = this.constantesSobres.NOMBRE_ESTADO_SOBRE_AUD_MEDICA_RF;
            this.novedadTotal.forEach(element => {
                if (element.Id == this.constantesSobres.ID_NOVEDAD_HELP || element.Id == this.constantesSobres.ID_NOVEDAD_REQUERIMIENTO || element.Id == this.constantesSobres.ID_NOVEDAD_PI || element.Id == this.constantesSobres.ID_NOVEDAD_DEPARTAMENTO_AUDITORIA_MEDICA) {
                    this.novedad.push(element);
                }
            });
        }

        if (this.detalleSobreSelected.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_QPRA) {
            this.detalleSobreSelected.DescripcionEstado = this.constantesSobres.NOMBRE_ESTADO_SOBRE_QPRA;
            this.novedadTotal.forEach(element => {
                if (element.Id == this.constantesSobres.ID_NOVEDAD_HELP || element.Id == this.constantesSobres.ID_NOVEDAD_REQUERIMIENTO || element.Id == this.constantesSobres.ID_NOVEDAD_PI || element.Id == this.constantesSobres.ID_NOVEDAD_DEPARTAMENTO_AUDITORIA_MEDICA || element.Id == this.constantesSobres.ID_NOVEDAD_DEVOLUCION) {
                    this.novedad.push(element);
                }
            });
        }

        if (this.detalleSobreSelected.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_MORA) {
            this.detalleSobreSelected.DescripcionEstado = this.constantesSobres.NOMBRE_ESTADO_SOBRE_MORA;
            this.novedadTotal.forEach(element => {
                if (element.Id == this.constantesSobres.ID_NOVEDAD_HELP || element.Id == this.constantesSobres.ID_NOVEDAD_REQUERIMIENTO || element.Id == this.constantesSobres.ID_NOVEDAD_PI || element.Id == this.constantesSobres.ID_NOVEDAD_DEPARTAMENTO_AUDITORIA_MEDICA || element.Id == this.constantesSobres.ID_NOVEDAD_AUD_MEDICA_RF) {
                    this.novedad.push(element);
                }
            });
        }

        if (this.detalleSobreSelected.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_LIQUIDADO) {
            this.detalleSobreSelected.DescripcionEstado = this.constantesSobres.NOMBRE_ESTADO_SOBRE_LIQUIDADO;
            this.novedad = this.novedadTotal;
        }

        if (this.detalleSobreSelected.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_CODIFICADO) {
            this.detalleSobreSelected.DescripcionEstado = this.constantesSobres.NOMBRE_ESTADO_SOBRE_CODIFICADO;
            this.novedad = this.novedadTotal;
        }
    }
    /*FIN PROPIEDADES DE DESABILITACION DE ELEMENTOS EN LA PANTALLA */

    /*Modal Detalle*/
    abrirModalDetalleSobre(detalleSobre: DetalleSobreEntity) {
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.detalleSobreSelected = detalleSobre;
        if (this.detalleSobreSelected.Literales == undefined)
            this.detalleSobreSelected.Literales = [];

        this.desabilitaMotivoDevolucion();
        this.desabilitaMotivoNegativa();

        this.cargarNovedadSegunEstado();
        if (this.detalleSobreSelected.ValorPresentadoDetalle == undefined) {
            this.detalleSobreSelected.ValorPresentadoDetalle = 0;
        }
        this.almacenarDatosAnteriores();
        $("#detalleSobreViewModal").modal();
    }

    cancelarDetalle() {
        this.recuperarDatosAnteriores();
        this.salirModal();
    }

    guardarDetalle() {
        console.log(this.detalleSobreTemporal);
        if (this.validarDetalle()) {
            this.actualizarDetalleSobre();
            this.salirModal();
        }
        console.log(this.sobre.DetalleSobre);
    }

    validarDetalle() {
        if (this.detalleSobreSelected.ValorPresentadoDetalle <= 0) {
            this.authService.showErrorPopup("El valor presentado debe ser mayor a 0");
            return false
        }
        return true;
    }

    actualizarDetalleSobre() {
        this.sobre.DetalleSobre = [];
        this.detalleSobreTemporal.forEach(element => {
            if (element.IdEstado != undefined) {
                this.sobre.DetalleSobre.push(element);
            }
        });
    }

    limpiarRegistroDetalleSobre(detalleSobre: DetalleSobreEntity) {

        this.detalleSobreSelected = detalleSobre;
        if (this.authService.isAuthorizeRequest()) {
            swal({
                title: "<h3> Desea Eliminar al Beneficiario </h3>",
                text: "<h3>¿Esta seguro que desea eliminar el registro?</h3>",
                type: "warning",
                html: true,
                showCancelButton: true,
                cancelButtonText: "No",
                confirmButtonColor: "#ec4758",
                confirmButtonText: "Si",
                closeOnConfirm: true
            }, () => {
                this.detalleSobreSelected.IdEstado = undefined;
                this.detalleSobreSelected.NumeroSolicitudDetalle = undefined;
                this.detalleSobreSelected.ValorPresentadoDetalle = undefined;
                this.detalleSobreSelected.IdTipoCobertura = undefined;
                this.detalleSobreSelected.ObservacionesConsultor = undefined;
                this.desabilitaCambiarEstado();
                this.actualizarDetalleSobre();
            });
        }
    }

    salirModal() {
        $('#detalleSobreViewModal').modal('hide');
    }
    /*Fin Modal Detalle*/

    /*Moldal Clausula*/
    abrirModalLiteralesClausula(idClausula: number, idTipoCarta: number) {
        this.clausulaSelected = new ClasulaEntity();
        this.clausulaSelected = this.clausulas.find(x => x.IdClausula == idClausula);

        if (idTipoCarta == this.constantesSobres.ID_TIPO_CARTA_DEVOLUCION)
            this.clausulaSelected.IdMotivo = this.detalleSobreSelected.IdMotivoDevolucion;
        else
            this.clausulaSelected.IdMotivo = this.detalleSobreSelected.IdMotivoNegativa;

        this.clausulaSelected.Literales.forEach(literales => {
            literales.Selected = false;
            this.detalleSobreSelected.Literales.forEach(literalesActuales => {
                if (literalesActuales.IdLiteralClausula == literales.IdLiteralClausula && literalesActuales.IdMotivo == this.clausulaSelected.IdMotivo)
                    literales.Selected = true;
            });
        });

        this.salirModal()
        $("#modalLiteralClausulaViewModal").modal();
    }

    actualizarLiterales(literal: LiteralClausulaEntity) {

        if (!literal.Selected) {
            var literalDetalleSobre = new DetalleSobreLiteralEntity();
            literalDetalleSobre.IdDetalleSobre = this.detalleSobreSelected.IdDetalleSobre;
            literalDetalleSobre.IdClausula = literal.IdClausula;
            literalDetalleSobre.IdLiteralClausula = literal.IdLiteralClausula;
            literalDetalleSobre.DetalleLiteral = literal.LiteralClausula;
            literalDetalleSobre.IdMotivo = this.clausulaSelected.IdMotivo;

            this.detalleSobreSelected.Literales.push(literalDetalleSobre);
            literal.Selected = true;
        }
        else {
            var index = this.detalleSobreSelected.Literales.indexOf(this.detalleSobreSelected.Literales.find(x => x.IdLiteralClausula == literal.IdLiteralClausula));
            if (index !== -1) {
                this.detalleSobreSelected.Literales.splice(index, 1);
            }
            literal.Selected = false;
        }
    }

    guardarLiterales() {
        $("#detalleSobreViewModal").modal();
        $('#modalLiteralClausulaViewModal').modal('hide');
    }

    /*Fin Modal Clausula*/
    /*GUARDAR CAMBIOS*/
    guardar() {
        this.recargarLiterales();
        this.asignarEstado();

        if (this.verificarValores()) {
            if (this.authService.isAuthorizeRequest()) {
                this.sobre.ValorPresentado = this.controlValor;
                this.sobre.ValorConsultor = this.controlValor;
                var mensaje = "EL sobre se acualizará con estado " + this.sobre.NombreEstadoSobre;
                var titulo = "¿Desea Actualizar el Sobre?";
                this.confirmarActualizar(titulo, mensaje, "warning");
            }
        }
        else {
            if (new Date() < new Date(this.genericas.proximoMes(this.sobre.FechaDigitacion))) {
                if (this.authService.isAuthorizeRequest()) {
                    var mensaje = "El Valor del Detalle ($" + this.controlValor + ") no coincide con el valor del Sobre($" + this.sobre.ValorPresentado + "), ¿Desea guardar el Sobre con estado " + this.sobre.NombreEstadoSobre + "?";
                    this.sobre.ValorPresentado = this.controlValor;
                    this.sobre.ValorConsultor = this.controlValor;
                    var titulo = "¿Desea Actualizar el Sobre?";
                    this.confirmarActualizar(titulo, mensaje, "warning");
                }
            } else {
                if (this.authService.isAuthorizeRequest()) {
                    this.sobre.ValorConsultor = this.controlValor;
                    var mensaje = "El Valor del Detalle ($" + this.controlValor + ") no coincide con el valor del Sobre($" + this.sobre.ValorPresentado + "), ¿Desea guardar el Sobre con estado " + this.sobre.NombreEstadoSobre + "?";
                    var titulo = "¿Este sobre ya ha sido reportado con un valor de $" + this.sobre.ValorPresentado + ", desea Actualizar el Sobre?";
                    this.confirmarActualizar(titulo, mensaje, "warning");
                }
            }
        }

    }

    confirmarActualizar(titulo: string, mensaje: string, tipo: string) {
        swal({
            title: "<h3>" + titulo + "</h3>",
            text: "<h3>" + mensaje + "</h3>",
            type: tipo,
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

    verificarValores(): boolean {
        this.controlValor = 0;
        this.sobre.DetalleSobre.forEach(element => {
           // this.sobre.IdEstadoSobre = element.IdEstado;
            //this.sobre.NombreEstadoSobre = element.DescripcionEstado;

            this.controlValor = this.controlValor + element.ValorPresentadoDetalle;
        });

        if (this.controlValor == this.sobre.ValorPresentado)
            return true;
        else
            return false;
    }



    asignarEstado() {

        this.sobre.EnviarMail = false;
        this.sobre.Devuelto = false;
        var esProcesado = false;


        this.sobre.IdEstadoSobre = this.sobre.DetalleSobre[0].IdEstado;
        this.sobre.NombreEstadoSobre = this.sobre.DetalleSobre[0].DescripcionEstado;

        this.sobre.DetalleSobre.forEach(element => {
            if (element.IdNovedad == this.constantesSobres.ID_NOVEDAD_DEVOLUCION) {
                this.sobre.EnviarMail = true;
                this.sobre.Devuelto = true;
            }

            if (element.IdEstado != this.sobre.IdEstadoSobre)
                esProcesado = true;
        });

        if (esProcesado) {
            this.sobre.IdEstadoSobre = this.constantesSobres.CODIGO_ESTADO_SOBRE_EN_PROCESO;
            this.sobre.NombreEstadoSobre = this.constantesSobres.NOMBRE_ESTADO_SOBRE_EN_PROCESO;
        }

        if (this.sobre.DetalleSobre.find(x => x.IdEstado == this.constantesSobres.CODIGO_ESTADO_SOBRE_LIQUIDADO) != null) {
            this.sobre.IdEstadoSobre = this.constantesSobres.CODIGO_ESTADO_SOBRE_LIQUIDADO;
            this.sobre.NombreEstadoSobre = this.constantesSobres.NOMBRE_ESTADO_SOBRE_LIQUIDADO;
        }
    }

    recargarLiterales() {
        this.sobre.DetalleSobre.forEach(detalleSobre => {
            var literalesSobre = [];
            if (detalleSobre.IdClausulaDevolucion != undefined) {
                detalleSobre.Literales.forEach(literales => {
                    if (literales.IdClausula == detalleSobre.IdClausulaDevolucion && literales.IdMotivo == detalleSobre.IdMotivoDevolucion)
                        literalesSobre.push(literales);
                });
            }


            if (detalleSobre.IdClausulaNegativa != undefined) {
                detalleSobre.Literales.forEach(literales => {
                    if (literales.IdClausula == detalleSobre.IdClausulaNegativa && literales.IdMotivo == detalleSobre.IdMotivoNegativa)
                        literalesSobre.push(literales);
                });
            }

            detalleSobre.Literales = [];
            detalleSobre.Literales = literalesSobre;
        });
    }

    actualizarSobre() {
        var sobres = [];
        this.sobre.Accion = this.constantesSobres.ACCION_CONSULTOR;
        this.sobre.NombreEstadoSobre = this.listaTotalEstados.find(x => x.Id == this.sobre.IdEstadoSobre).Valor;

        sobres.push(this.sobre);

        this.sobreReembolsoService.actualizarSobre(sobres).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Sobre Actualizado");
                    this.ngOnDestroy();
                    this.sbConsultorListComponent.loadSobres();
                    jQuery("#divConsultar").collapse("hide");
                    jQuery("#divPanelSobres").collapse("hide");

                    if (this.sobre.IdEstadoSobre == this.constantesSobres.CODIGO_ESTADO_SOBRE_DEVUELTO || this.sobre.EnviarMail) {
                        this.sbConsultorListComponent.inicializarPanelMail(this.sobre);
                    } else {
                        jQuery("#divConsultar").collapse("show");
                        this.sbConsultorListComponent.colapsarTab();
                    }
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error al Guardar los datos");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }
    /*GUARDAR CAMBIOS*/

    irQpra() {
        $("<a>").attr("href", "http://portal:8000/").attr("target", "_blank")[0].click();
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
        this.detalleSobreSelectedAux.ObservacionesGestion = this.detalleSobreSelected.ObservacionesConsultor;
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
        this.detalleSobreSelected.ObservacionesGestion = this.detalleSobreSelectedAux.ObservacionesConsultor;
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