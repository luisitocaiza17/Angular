import { Component, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../seguridad/auth.service';
import { ContratoKey } from '../../../common/model/contrato';
import { AutorizacionService } from '../../../common/servicios/autorizacion.service';
import { PlanService } from '../../../common/servicios/plan.service';
import { DetalleRemesaService } from '../../../common/servicios/detalleRemesa.service';
import { TransaccionService } from '../../../common/servicios/transaccion.service';
import { PlanCambioEntity, PlanContrato, AprobacionPlanEntity, AprobacionPlanFilter } from '../../../common/model/plan';
import { DetalleRemesa } from '../../../common/model/detalleRemesa';
import { DatosBancoContrato, CambioSelectPlan } from '../../../common/model/transacciones';
import { GestionRetencionCliente } from '../../../common/model/retencion';
import { SeguroCampesinoEntity } from '../../../common/model/transacciones';
import { DescuentoEntity } from '../../../common/model/descuento';
import { AdministracionSistemaService } from '../../../common/servicios/administracionSistema.service';
import { Router } from '@angular/router';
import { ConstantService } from '../../../utils/constant.service';
import { RetencionesVime } from '../../../common/servicios/retencionesVime.service';
import { RetencionService } from '../../../common/servicios/retencion.service';
import { RetencionCambioPlanEntity } from '../../../common/model/retencion';
import { PdfService } from "../../../common/servicios/pdf.service";


import { DescuentoCliente, GetRetencionKey } from '../../../common/model/retencion';





@Component({
    selector: 'planTx',
    providers: [AutorizacionService, AdministracionSistemaService, RetencionService, PdfService],
    templateUrl: 'planTx.form.template.html'
})

export class PlanTxFormComponent {

    planes: PlanCambioEntity[];
    planesCotizados: PlanCambioEntity[];
    bancos: DatosBancoContrato[];
    descuentos: DescuentoEntity[];
    cantidadContratos: number;
    descuentoVT: number;
    fechaMaxima: Date;
    seguroCampesino: SeguroCampesinoEntity;
    planSeleccionado: PlanCambioEntity;
    planKeySelected: string;
    planContrato: PlanContrato;
    detalleRemesa: DetalleRemesa;
    meses: number;
    fechaFinTarjeta: Date;
    desabilitar: boolean;
    habilitar: boolean;
    fechaActual: Date;
    periodo: number;
    dias: number;
    fechaRemesa: Date;
    cambioPlan: CambioSelectPlan;
    seteo: number;
    seteoFecha: number;
    fechaValidar: Date;
    aprobacionPlanEntity: AprobacionPlanEntity;
    aprobacionPlanFilter: AprobacionPlanFilter;
    Nivel1: string;
    Nivel2: string;
    Nivel3: string;
    rolGestion: string;
    nivelJefe: string;
    nivelUsuario: string;
    aplicaAprobacion: GestionRetencionCliente;
    infoCambioPlan: RetencionCambioPlanEntity;

    beneficiarios: DescuentoCliente[] = [];
    parametroSSC: number;
    key: GetRetencionKey;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.habilitar = false;
            this._contratoKey.Retroactivo = 2;
            this.loadPlanes();
            this.loadNivelesAprobacion();
            this.loadPrefactura();
        }
        else {
            this.planes = [];
            this.planesCotizados = [];
            this.bancos = [];
        }
    }

    get contratokey() {
        return this._contratoKey;
    }

    constructor(public domSanitizer: DomSanitizer, public autorizacionService: AutorizacionService, private authService: AuthService,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef, private planService: PlanService,
        private detalleRemesaService: DetalleRemesaService, private transaccionService: TransaccionService,
        private router: Router, private administracionSistemaService: AdministracionSistemaService,
        private constantService: ConstantService, private retencionVimeService: RetencionesVime, public pdfService: PdfService,
        private retencionService: RetencionService) {
        this._contratoKey = new ContratoKey();
        this.planSeleccionado = new PlanCambioEntity();
        this.detalleRemesa = new DetalleRemesa();
        this.planContrato = new PlanContrato();
        this.seguroCampesino = new SeguroCampesinoEntity();
        this.cambioPlan = new CambioSelectPlan();
        this.planes = [];
        this.planesCotizados = [];
        this.bancos = [];

        //this.key = new RetencionKey();
        this.aprobacionPlanEntity = new AprobacionPlanEntity();
        this.aprobacionPlanFilter = new AprobacionPlanFilter();
        this.infoCambioPlan = new RetencionCambioPlanEntity();
    }

    loadNivelesAprobacion(): void {
        this.Nivel1 = this.constantService.NIVEL_1_RETENCION;
        this.Nivel2 = this.constantService.NIVEL_2_RETENCION;
        this.Nivel3 = this.constantService.NIVEL_3_RETENCION;
    }

    loadPrefactura(): void {
        this.key = new GetRetencionKey();
        this.key.CodigoProducto = this._contratoKey.CodigoProducto;
        this.key.NumeroContrato = this._contratoKey.NumeroContrato;
        this.key.Region = this._contratoKey.CodigoRegion;
        this.retencionService.getdescuentoRetencionCliente(this.key).subscribe(descuentos => {
            this.beneficiarios = descuentos.map(x => {
                x.PorcentajeDescNuevo = 0.0;
                return x;
            });
        });

        this.parametroSSC = 0.005
        this.retencionService.obtenerParametroPorNombre('SSC')
            .subscribe(result => {
                this.parametroSSC = Number(result.Valor);
            },
                error => this.parametroSSC = 0.005);
    }

    loadPlanes(): void {
        this.planSeleccionado.VersionPlan = this._contratoKey.VersionPlan;
        this.planSeleccionado.NombrePlan = this._contratoKey.NombrePlan;
        this.planSeleccionado.CodigoPlan = this._contratoKey.Plan;

        if (this._contratoKey.FechaFinTarjeta != undefined) {
            let fecha = this._contratoKey.FechaFinTarjeta.split("/");
            this._contratoKey.FechaFinTarjeta = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
            this.fechaFinTarjeta = new Date(this._contratoKey.FechaFinTarjeta);
        }
        if (this._contratoKey.EsMoroso == true) {
            this.authService.showInfoPopup("El contrato está moroso y que no se puede proceder");
            this.habilitar = true;
            this._contratoKey.PorcentajeDescuento = 0;
        }
        else {
            if (this.planes == undefined || this.planes.length == 0) {

                this.transaccionService.getDatosPlanRetencion(this._contratoKey).subscribe(
                    result => {
                        this.planes = result.ListaPlanes;
                        this.detalleRemesa = result.DetalleRemesa;
                        this.bancos = result.Bancos;
                        this.cantidadContratos = result.CantidadContratos;
                        this.descuentos = result.Descuento;
                        this._contratoKey.PorcentajeDescuentoVT = result.DescuentoVT;
                        this.seguroCampesino = result.Seguro;
                        this.detalleRemesa.FacturadoHasta = new Date(this.detalleRemesa.FacturadoHasta);
                        this._contratoKey.FechaHasta = this.detalleRemesa.FacturadoHasta;
                        this.fechaValidar = this.detalleRemesa.FacturadoHasta;

                        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
                        this.changeTipoCuenta();
                        this.loadPlanCotizacion();

                        this.planKeySelected = this._contratoKey.CodigoPlan;
                        this.infoCambioPlan.PlanAnterior = this._contratoKey.CodigoPlan.toString();
                        this.planSeleccionado.VersionPlan = this._contratoKey.VersionPlan;
                        this.planSeleccionado.NombrePlan = this._contratoKey.NombrePlan;

                    },
                    error => this.authService.showErrorPopup(error)
                );
            }
        }
    }

    validarAprobacion() {
        this.aprobacionPlanEntity = new AprobacionPlanEntity();
        this.aprobacionPlanFilter = new AprobacionPlanFilter();
        this.aprobacionPlanFilter.CodigoProducto = this._contratoKey.CodigoProducto;
        this.aprobacionPlanFilter.Region = this._contratoKey.CodigoRegion;
        this.aprobacionPlanFilter.CodigoPlanActual = this._contratoKey.CodigoPlan;
        this.aprobacionPlanFilter.VersionPlanActual = this._contratoKey.VersionPlan;
        this.aprobacionPlanFilter.CodigoPlanNuevo = this.planSeleccionado.CodigoPlan;
        this.aprobacionPlanFilter.VersionPlanNuevo = this.planSeleccionado.VersionPlan;
        this.planService.verificarPermisoCambioPlan(this.aprobacionPlanFilter).subscribe(
            result => {
                this.aprobacionPlanEntity = result;
                if (this.aprobacionPlanEntity.TieneAprobacion == true)
                    this.getNivelesUsuario();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    crearFormularioMovimiento() {
        this._contratoKey.Plan = "Cambio de producto de " + this._contratoKey.NombrePlan + " a " + this.planContrato.Plan.NombrePlan;
        this._contratoKey.NombreMotivoAnulacion = this._contratoKey.Plan;
        this._contratoKey.CodigoPlan = this.planContrato.Plan.CodigoPlan;
        this._contratoKey.VersionPlan = this.planContrato.Plan.VersionPlan;
        this.transaccionService.GenerarPdfFormularioMovimientoCambioPlan(this._contratoKey, "Notificación Cambio Plan")
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


    buscaDescuento(tipoCuenta: number, periodoPago: number): void {
        for (let i in this.descuentos) {
            if (this.descuentos[i].TipoCuenta == tipoCuenta && this.descuentos[i].NumeroDesde == this.cantidadContratos) {
                var porcentajeDescuento = this.descuentos[i].PorcentajeDescuento.split(";");
                this._contratoKey.PorcentajeDescuento = parseInt(porcentajeDescuento[periodoPago - 1]);
            }
        }
        if (this._contratoKey.PorcentajeDescuento == undefined) {
            this.authService.showInfoPopup("No encuentro descuento");
            this._contratoKey.PorcentajeDescuento = 0;
        }
    }

    onChangePlan() {
        if (this.planKeySelected != undefined) {

            this.planSeleccionado = this.planes.find(p => p.CodigoPlan == this.planKeySelected);
            this.planContrato.Plan = this.planSeleccionado;
            this.planContrato.Contrato = this._contratoKey;
            this.planContrato.DetalleRemesa = this.detalleRemesa;
            this.planContrato.Seguro = this.seguroCampesino;

            this.validarAprobacion();
            this.getTotalMedicinaPrepagada();

            this.planService.validarNuevoPlan(this.planContrato).subscribe(
                result => {
                    this.cambioPlan = result;
                    this._contratoKey.Text = this.cambioPlan.Text;
                    if (this.cambioPlan.Mensaje != undefined) {
                        this.authService.showInfoPopup(this.cambioPlan.Mensaje);
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    onChangeRetroactivo() {
        if (this.detalleRemesa.EstadoRemesa != undefined && this.detalleRemesa.FacturadoHasta != undefined && this.detalleRemesa.FechaCreacion != undefined && this._contratoKey.Retroactivo != undefined) {

            if (this._contratoKey.Retroactivo == 1) {
                this.fechaActual = new Date();
                this.periodo = 0;

                this.fechaRemesa = new Date(this.detalleRemesa.FechaCreacion);

                var diasDif = this.fechaActual.getTime() - this.fechaRemesa.getTime();
                this.dias = Math.round(diasDif / (1000 * 60 * 60 * 24));

                if (this.dias < 32) {
                    if (this._contratoKey.PeriodoPago == 1 || this._contratoKey.PeriodoPago == 2 || this._contratoKey.PeriodoPago == 3) {
                        this.periodo = this._contratoKey.PeriodoPago;
                    }
                    if (this._contratoKey.PeriodoPago == 4) {
                        this.periodo = 6;
                    }
                    if (this._contratoKey.PeriodoPago == 5) {
                        this.periodo = 12;
                    }
                    if (this._contratoKey.PeriodoPago == 6) {
                        this.periodo = 4;
                    }
                    this.fechaMaxima = (restarMeses(new Date(this.detalleRemesa.FacturadoHasta), this.periodo));
                    this._contratoKey.FechaHasta = this.fechaMaxima;
                }
                else {
                    this.validar();
                    this.authService.showInfoPopup("Han transcurrido mas de 30 días desde la última Facturación. Por lo tanto no puede realizar el cambio retroactivo");
                }
            } else {

            }
        }

        function restarMeses(fecha, numeroMeses) {
            fecha.setMonth(fecha.getMonth() - numeroMeses);
            return fecha;
        }

    }

    validar() {
        if (this.seteo == undefined) {
            this._contratoKey.Retroactivo = undefined;
            this.seteo = 0;
        }
        else {
            this._contratoKey.Retroactivo = 2;
            this.seteo = undefined;
        }
    }


    onChangeFechaMaxima() {
        if (this._contratoKey.Retroactivo == undefined) {
            this.authService.showInfoPopup("Primero Seleccione Retroactivo");
        }
        else {
            if (this._contratoKey.FechaHasta > new Date(this._contratoKey.FechaFin)) {
                this._contratoKey.FechaHasta = new Date(this.detalleRemesa.FacturadoHasta);
                this.authService.showInfoPopup("Fecha Inicio del Cambio de Plan, No debe ser MAYOR al Fin de Vigencia del Contrato");
            }
            else if (this._contratoKey.Retroactivo == 2 && this._contratoKey.FechaHasta < this.detalleRemesa.FacturadoHasta) {
                this._contratoKey.FechaHasta = new Date(this.detalleRemesa.FacturadoHasta);
                this.authService.showInfoPopup("El Inicio del Cambio de Plan No Puede ser Menor al Facturado Hasta");
            }
            else if (this._contratoKey.Retroactivo == 1) {
                if (this._contratoKey.FechaHasta < this.fechaMaxima) {
                    this._contratoKey.FechaHasta = new Date(this.detalleRemesa.FacturadoHasta);
                    this._contratoKey.Retroactivo = 2;
                    this.authService.showInfoPopup("Cambio de Plan extemporáneo, Sobrepasó la fecha límite de Cambio");
                }

                else if (this._contratoKey.FechaHasta >= this.detalleRemesa.FacturadoHasta) {

                    this._contratoKey.Retroactivo = 2;
                    this.authService.showInfoPopup("Cambio de Plan NO es Retroactivo, Procede Cambio Normal");
                }
            }
        }
    }

    changeFormaPago() {
        if (this._contratoKey.FormaPago == 2) {
            this._contratoKey.TipoCuenta = 4;
            this._contratoKey.CodigoBanco = undefined;
            this._contratoKey.NumeroCuenta = undefined;
            this._contratoKey.FechaFinTarjeta = undefined;
        }
        if (this._contratoKey.FormaPago == 1) {
            this._contratoKey.TipoCuenta == 1;
        }
        //BUSCA DESCUENTO
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
    }

    changePeriodoPago() {
        //BUSCA DESCUENTO
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
        if (this.meses % this._contratoKey.PeriodoPago != 0) {
            this.authService.showInfoPopup("El periodo de facturación que ud. ha seleccionado no coincidirá con el fin de vigencia en las próximas facturaciones REVISE...");
        }
    }

    changeTipoCuenta() {

        if (this._contratoKey.FormaPago == 1 && this._contratoKey.TipoCuenta == 4) {
            this._contratoKey.TipoCuenta = undefined;
            this.authService.showInfoPopup("Si es Débito, no puede elegir Pago Directo en Tipo-Cuenta");
        }
        if (this._contratoKey.TipoCuenta == 3) {
            this.desabilitar = true;
        }
        else {
            this.desabilitar = false;
        }

        //BUSCA DESCUENTO
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
    }


    guardarCambioPlan() {
        if (this._contratoKey.FacturarRuc == undefined || this._contratoKey.FacturarRuc == "") {
            this._contratoKey.FacturarRuc == "0000000000000";
        }
        var control = 1;

        if (this._contratoKey.Retroactivo == 1) {

            this.fechaRemesa = new Date(this.detalleRemesa.FechaCreacion);
            var diasDif = this.fechaActual.getTime() - this.fechaRemesa.getTime();
            this.dias = Math.round(diasDif / (1000 * 60 * 60 * 24));
            if (this.dias > 31) {
                control = 0;
                this.authService.showInfoPopup("Han transcurrido mas de 30 días desde la última Facturación. Por lo tanto no puede realizar el cambio retroactivo");
            }
            if (this._contratoKey.FechaHasta < this.fechaMaxima) {
                control = 0;
                this.authService.showInfoPopup("Cambio de Plan extemporáneo, Sobrepasó la fecha límite de Cambio");
            }

        }
        if (this._contratoKey.Retroactivo == 2 && this._contratoKey.FechaHasta < this.detalleRemesa.FacturadoHasta) {
            control = 0;
            this.authService.showInfoPopup("El Inicio del Cambio de Plan No Puede ser Menor al Facturado Hasta");
        }
        if (this._contratoKey.FechaHasta > new Date(this._contratoKey.FechaFin)) {
            control = 0;
            this.authService.showInfoPopup("Fecha Inicio del Cambio de Plan, No debe ser MAYOR al Fin de Vigencia del Contrato");
        }

        if (this.seguroCampesino.Cerror != "") {
            control = 0;
        }

        if (this.aprobacionPlanEntity.TieneAprobacion == true) {
            if (this.nivelUsuario == "Nivel3") {
                control = 1;
            } else {
                if (this.nivelUsuario == "Nivel2" && this.aprobacionPlanEntity.NivelAprobacion != "Nivel3") {
                    control = 1;
                } else {
                    if (this.nivelUsuario == "Nivel1" && this.aprobacionPlanEntity.NivelAprobacion != "Nivel3" && this.aprobacionPlanEntity.NivelAprobacion != "Nivel2") {
                        control = 1;
                    } else {
                        control = 0;
                        this.mostrarModal('#modalEnviado');
                    }
                }
            }
        } else {
            if (this.aprobacionPlanEntity.NivelAprobacion == "No_Nivel") {
                control = 0;
                this.authService.showInfoPopup("El plan no esta en la matriz de aprobación");
            }
        }

        if (control == 1) {
            this._contratoKey.FechaFinTarjetaDate = this.fechaFinTarjeta;
            this.planContrato.Plan.Proceso = "RET";
            this.transaccionService.cambiaPlan(this.planContrato).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Se ha cambiado el plan");
                        this.crearComentario();
                        this.crearFormularioMovimiento();
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error");
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    registrarAprobacion(): void {
        const usrData = this.authService.getDatosUsuarioAutenticado();
        this.aplicaAprobacion = new GestionRetencionCliente();
        this.aplicaAprobacion.Id = 0;
        this.aplicaAprobacion.Region = this._contratoKey.CodigoRegion;
        this.aplicaAprobacion.CodigoProducto = this._contratoKey.CodigoProducto;
        this.aplicaAprobacion.NumeroContrato = this._contratoKey.NumeroContrato;
        this.aplicaAprobacion.EstadoId = 3;
        this.aplicaAprobacion.UsuarioGestion = usrData.NombreUsuario;
        this.aplicaAprobacion.UsuarioAprobador = this.nivelJefe;
        this.aplicaAprobacion.TipoMovimiento = "CAMBIO_PLAN";

        var planCotizado = this.planesCotizados.find(p => p.CodigoPlan == this.planContrato.Plan.CodigoPlan)
        var preciototal = planCotizado.PrecioBase.toFixed(2);
        this.planContrato.Plan.PrecioBase = +preciototal;
        this.aplicaAprobacion.DatosGestion = JSON.stringify(this.planContrato);

        this.retencionVimeService.AplicaAprobacion(this.aplicaAprobacion).subscribe(resp => {
            this.router.navigate(['/retencion/comentario/movimiento/' + this._contratoKey.CodigoRegion + '/' + this._contratoKey.CodigoProducto + '/' + this._contratoKey.NumeroContrato + '/CAMBIOPLAN/' + resp.IdDesc]);
        }, error => this.authService.showErrorPopup(error));
    }

    loadPlanCotizacion() {
        this.planService.getListaPlanesCP(this._contratoKey.CodigoProducto, this._contratoKey.NumeroContrato, this._contratoKey.CodigoRegion, "RET").subscribe(
            result => {
                this.planesCotizados = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    crearComentario(): void {
        this.router.navigate(['/retencion/comentario/movimiento/' + this._contratoKey.CodigoRegion + '/' + this._contratoKey.CodigoProducto + '/' + this._contratoKey.NumeroContrato + '/CAMBIOPLAN/']);
    }

    getNivelesUsuario() {
        const usrData = this.authService.getDatosUsuarioAutenticado();
        this.administracionSistemaService.GetRolesByIdUsuario(usrData.Id)
            .subscribe(result => {
                if (result.length > 0) {
                    result.forEach(element => {
                        if (this.Nivel1.search(element.NombreRol) != -1 || this.Nivel2.search(element.NombreRol) != -1 || this.Nivel3.search(element.NombreRol) != -1) {
                            this.rolGestion = element.NombreRol;
                            this.nivelUsuario = this.getNivelUsuario();
                            this.nivelJefe = this.getNivelSuperior();
                        }
                    });
                } else {
                    this.nivelUsuario = "Nivel0";
                    this.nivelJefe = "Nivel0";
                }
            },
                error => this.authService.showErrorPopup(error)
            );
    }

    getNivelSuperior() {
        if (this.Nivel1.search(this.rolGestion) != -1) {
            return "Nivel2";
        } else {
            if (this.Nivel2.search(this.rolGestion) != -1) {
                return "Nivel3";
            }
        }
        return "Nivel3";
    }

    getNivelUsuario() {
        if (this.Nivel1.search(this.rolGestion) != -1)
            return "Nivel1";
        if (this.Nivel2.search(this.rolGestion) != -1)
            return "Nivel2";
        if (this.Nivel3.search(this.rolGestion) != -1)
            return "Nivel3";
    }

    confirmar() {
        this.registrarAprobacion();
        this.esconderModal('#modalEnviado');
    }

    mostrarModal(selector: string) {
        $(selector).modal('show');
    }

    esconderModal(selector: string) {
        $(selector).modal('hide');
    }



    //datos para la prefactura
    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    getTotalPorcentajeDescAnterior(): number {
        return this.suma(this.beneficiarios, x => x.PorcentajeDescAnterior);
    }

    getTotalValorDescuentoAnterior(): number {
        return this.suma(this.beneficiarios, x => x.ValorDescuentoAnterior);
    }

    getTotalPorcentajeDescuento(): number {
        return this.suma(this.beneficiarios, x => x.PorcentajeDesc);
    }

    getTotalValorDescuento(): number {
        return this.suma(this.beneficiarios, x => x.ValorDescuento);
    }

    getTotalPorcentajeDescNuevo(beneficiario): number {
        if (beneficiario) {
            let descNuevo = beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
            return descNuevo;
        } else {
            return ((this.getTotalValorDescuentoNuevo(null) * 100) / this.getTotalMedicinaPrepagada());

        }
    }

    getTotalValorDescuentoNuevo(beneficiario): number {
            if (beneficiario) {
                let descNuevo = parseFloat(beneficiario.PorcentajeDescNuevo) ? (parseFloat(beneficiario.PorcentajeDescNuevo) + parseFloat(beneficiario.PorcentajeDesc)) : parseFloat(beneficiario.PorcentajeDesc);
                let descTotal = ((beneficiario.MedicinaPrepagada) * (descNuevo / 100)); // + this.getTotalValorDescuento(); --+ beneficiario.ServiciosAdicionales
                return descTotal;
            } else {
                let total = this.suma(this.beneficiarios, x => x.MedicinaPrepagada * (this.getTotalValorDescNuevo(x) / 100)) + this.getTotalValorDescuento();
                return total;
            }          
    }

    getTotalValorDescuentoNuevaFactura(): number {
        if (this.planContrato.Plan == undefined){
            let total = this.suma(this.beneficiarios, x => x.MedicinaPrepagada * (this.getTotalValorDescNuevo(x) / 100)) + this.getTotalValorDescuento();
            return total;
        }else{
            var planCotizado = this.planesCotizados.find(p => p.CodigoPlan == this.planContrato.Plan.CodigoPlan)
            var preciototal = planCotizado.Descuento.toFixed(2);
            var result = +preciototal;
            return result;
        }                
        
    }

    getTotalMedicinaPrepagada(): number {
        if (this.planContrato.Plan == undefined)
            return this.suma(this.beneficiarios, x => x.MedicinaPrepagada);

        var planCotizado = this.planesCotizados.find(p => p.CodigoPlan == this.planContrato.Plan.CodigoPlan)
        var preciototal = planCotizado.MedicinaPrepagada.toFixed(2);
        var result = +preciototal;
        return result;

    }

    getTotalMedicinaPrepagadaAnterior(): number {
            return this.suma(this.beneficiarios, x => x.MedicinaPrepagada);
    }

    getTotalServiciosAdicionales(): number {
        return this.suma(this.beneficiarios, x => x.ServiciosAdicionales);
    }

    getTotalDescuentoDisponible(beneficiario): number {
        if (beneficiario) {
            return (beneficiario.DescuentoDisponible > beneficiario.PorcentajeDescNuevo ? beneficiario.DescuentoDisponible : beneficiario.PorcentajeDescNuevo) - (beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0);
        }
        return this.suma(this.beneficiarios, x => (x.DescuentoDisponible > x.PorcentajeDescNuevo ? x.DescuentoDisponible : x.PorcentajeDescNuevo) - (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));
    }

    getSubTotal1(beneficiario): number {
        if (beneficiario) {
            return beneficiario.MedicinaPrepagada + beneficiario.ServiciosAdicionales;
        }
        return this.suma(this.beneficiarios, x => x.MedicinaPrepagada + x.ServiciosAdicionales);
    }

    getSubTotal1Nuevo(): number {
        return this.getTotalMedicinaPrepagada() + this.getTotalServiciosAdicionales();
    }

    getTotalValorDescNuevo(beneficiario): number {
        if (beneficiario) {
            return beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
        } else {
            return this.suma(this.beneficiarios, x => (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));
        }
    }

    getSubTotal2(): number {
        return this.getSubTotal1(null) - this.getTotalValorDescuento();
    }

    getSubTotal2ConDescuento(beneficiarios): number {
        return this.getSubTotal1(beneficiarios) - this.getTotalValorDescuentoNuevo(beneficiarios);
    }

    getSubTotal2ConDescuentoNuevaFactura(): number {
        return this.getSubTotal1Nuevo() - this.getTotalValorDescuentoNuevaFactura();
    }


    getGastoAdministrativo(): number {
        if (this.beneficiarios.length > 0) {
            return this.beneficiarios[0].GastoAdministrativo;
        }
        return 0;
    }

    getSubTotal3(): number {
        return this.getSubTotal2() + this.getGastoAdministrativo();
    }

    getSubTotal3ConDescuento(): number {
        return this.getSubTotal2ConDescuentoNuevaFactura() + this.getGastoAdministrativo();
    }

    getSSC(): number {
        return this.getSubTotal3() * this.parametroSSC;
    }

    getSSCConDescuento(): number {
        return this.getSubTotal3ConDescuento() * this.parametroSSC;
    }


}