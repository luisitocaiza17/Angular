import { Component, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContratoKey } from '../../common/model/contrato';
import { Retencion, DescuentoCliente, GetRetencionKey } from '../../common/model/retencion';
import { RetencionService } from '../../common/servicios/retencion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { AuthService } from '../../seguridad/auth.service';
import { AdministracionSistemaService } from '../../common/servicios/administracionSistema.service';
import { RetencionesVime } from '../../common/servicios/retencionesVime.service';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';
import { Beneficiario, BeneficiarioKey, BeneficiarioList } from '../../common/model/beneficiario';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { PlanCambioEntity, PlanContrato } from '../../common/model/plan';
import { RetencionListComponent } from '../retencion.list.component';
import { DescuentoEntity } from '../../common/model/descuento';
import { DatosBancoContrato } from '../../common/model/transacciones';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { DetalleRemesaCuotas } from '../../common/model/detalleRemesa';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';
import { FilterEmisionTarjetas } from '../../common/model/transacciones';
import { DetalleMontoFactura } from '../modificarBeneficiarios/model/detalleMontoFactura';
import { RetencionesState } from '../services/retenciones.state';
import { TransaccionKey } from '../../common/model/transacciones';
import { ContratoService } from '../../common/servicios/contrato.service';

@Component({
    providers: [AdministracionSistemaService, RetencionesVime, BeneficiarioService, RetencionListComponent],
    templateUrl: 'formaPago.template.html',
    styles: ['.text-primary { color: #337ab7!important; } .btn:hover, .btn:focus, .btn.focus{ background-color:lightgrey; }']
})

export class RetencionFormaPagoComponent implements OnInit {
    key: GetRetencionKey;
    retencion: Retencion;
    beneficiarios: BeneficiarioList[];
    beneficiario: DescuentoCliente[] = [];
    parametroSSC: number;

    Bene: Beneficiario[];
    planes: PlanCambioEntity[];
    descuentos: DescuentoEntity[];
    bancos: DatosBancoContrato[];
    habilitar: boolean;
    desabilitar: boolean;
    meses: number;
    fechaFinTarjeta: Date;
    cuotas: DetalleRemesaCuotas[];
    guardar: boolean;
    valorActual: number;
    valorServicio: number;
    detalleMontoFacturaActual: DetalleMontoFactura;
    detalleMontoFacturaNueva: DetalleMontoFactura;
    interval: any;
    valorPago: number;
    valorPagoDescuento: number;
    planContrato: PlanContrato;

    rolGestion: string;
    usuarioJefe: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    cantidadContratos: number;
    _contratoKey: ContratoKey;
    DatosContrato: ContratoKey;

    suscription: any;

    beneficiarioKey: BeneficiarioKey;
    beneficiarioSeleccionado: Beneficiario;

    @Output() onLoadBilling: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private retencionService: RetencionService,
        private authService: AuthService,
        public beneficiarioService: BeneficiarioService,
        private planService: PlanService,
        private transaccionService: TransaccionService,
        public detalleRemesaService: DetalleRemesaService,
        private changeDetector: ChangeDetectorRef,
        private router: Router,
        public retencionState: RetencionesState,
        public contratoService: ContratoService
    ) {

        this.beneficiarioKey = new BeneficiarioKey();
        this.beneficiarioSeleccionado = new Beneficiario();
        this._contratoKey = new ContratoKey();

        this.beneficiarios = [];
        this.planes = [];
        this.planContrato = new PlanContrato();

        this.retencionService.retenciones.subscribe((res) => {
            this.retencion = res || undefined;
            if (this.retencion) {
                this.retencion.SiniestralidadNumber = parseFloat(this.retencion.Siniestralidad);
                this.loadCambioPlan();
                this.CloneData();
                //INICIO PARA RE-OBTENER EL CONTRATO//
                var filter = new TransaccionKey();
                filter.CodigoProducto = this.DatosContrato.CodigoProducto;
                filter.CodigoRegion = this.DatosContrato.CodigoRegion;
                filter.NumeroContrato = this.DatosContrato.NumeroContrato;

                this.contratoService.getContratoKey(filter).subscribe(
                    result => {
                        this.DatosContrato = result;
                        this._contratoKey = result;
                        this._contratoKey.Transaccion = "FORMA_PAGO";
                    },
                    error => this.authService.showErrorPopup(error)
                );
                //FIN RE-OBTENER EL CONTRATO//
            }
        });

        this.loadDatos();
    }

    ngOnInit(): void {
        this.detalleMontoFacturaActual = new DetalleMontoFactura();
        var FacturaAnterior = Object.assign({}, this.detalleMontoFacturaNueva);
        //this.CloneData();
        this.consultarValores();
        // this.getPrecioBeneficiario();
        this.loadPrefactura();
        this.valorActual = this.getTotalMedicinaPrepagadaAnterior();

        if (this._contratoKey.CodigoContrato != undefined) {
            let filter = new FilterEmisionTarjetas();
            filter.Beneficiarios = this.beneficiarios;
            filter.Contrato = this._contratoKey;
            this.calcularTotalFactura(filter);
        }
    }

    changePeriodoPago() {
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
        this.calculos();

        if (this.meses % this._contratoKey.PeriodoPago != 0) {
            this.authService.showInfoPopup("El periodo de facturación que ud. ha seleccionado no coincidirá con el fin de vigencia en las próximas facturaciones REVISE...");
        }
    }

    CloneData() {
        this.DatosContrato = Object.assign({}, this._contratoKey);
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

    calcularTotalFactura(filter) {
        this.planService.getDetalleMontoFactura(filter).subscribe(detalleMontoFactura => {
            this.detalleMontoFacturaActual = detalleMontoFactura;
            // this.detalleMontoFacturaNueva = detalleMontoFactura;
        });
    }

    calcularTotalFacturaNueva(filter) {
        this.planService.getDetalleMontoFactura(filter).subscribe(detalleMontoFactura => {
            this.detalleMontoFacturaNueva = detalleMontoFactura;
            this.interval = setInterval(() => {
                this.changeDetector.detectChanges();
                this.changeDetector.detach();
            }, 100);

        });
    }




    consultaDescuento(tipoCuenta: number, periodoPago: number): number {
        let descuento: number;
        for (let i in this.descuentos) {
            if (this.descuentos[i].TipoCuenta == tipoCuenta && this.descuentos[i].NumeroDesde == this.cantidadContratos) {
                var porcentajeDescuento = this.descuentos[i].PorcentajeDescuento.split(";");
                descuento = parseInt(porcentajeDescuento[periodoPago - 1]);
            }
        }
        if (this._contratoKey.PorcentajeDescuento == undefined) {
            this.authService.showInfoPopup("No encuentro descuento");
            descuento = 0;
        }
        return descuento;
    }

    loadCambioPlan() {
        this.retencionService.contratoKey.subscribe((res) => {
            this._contratoKey = res;
            this.iniciarkey();
            this.loadPlanCotizacion();
        });
    }


    calculos() {
        this.valorPagoDescuento = this.getTotalMedicinaPrepagadaAnterior() * (this._contratoKey.PorcentajeDescuento / 100);
        this.valorPago = (this.getTotalMedicinaPrepagadaAnterior() + this.valorServicio) - this.valorPagoDescuento;
    }



    ActualizarCuotas(): void {
        this.transaccionService.actualizarCuotas(this._contratoKey).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Se ha modificado la forma de pago y las Cuotas");
                    this.cuotas = [];
                    this.filtrar();
                    this.crearComentario();
                }
                else {
                    this.authService.showSuccessPopup("Se ha modificado la forma de pago");
                    this.crearComentario();
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    Mensaje() {
        this.authService.showSuccessPopup("Se ha modificado la forma de pago");
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
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
        this.calculos();

    }


    loadPlanCotizacion() {
        this.planService.getListaPlanesCP(this._contratoKey.CodigoProducto, this._contratoKey.NumeroContrato, this._contratoKey.CodigoRegion, "RET").subscribe(
            result => {
                this.planes = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadBeneficiarios(): void {
        if (this._contratoKey != undefined) {
            this.beneficiarioKey = new BeneficiarioKey();
            this.beneficiarioKey.CodigoRegion = this._contratoKey.CodigoRegion;
            this.beneficiarioKey.CodigoProducto = this._contratoKey.CodigoProducto;
            this.beneficiarioKey.NumeroContrato = this._contratoKey.NumeroContrato;
            this.beneficiarioService.getBeneficiariosMaternidad(this.beneficiarioKey).subscribe(beneficiarios => {
                this.beneficiarios = beneficiarios;
            });

        }
    }

    consultarValores(): void {
        this.valorActual = 0;
        this.valorServicio = 0;
        if (this._contratoKey != undefined) {
            this.beneficiarioKey = new BeneficiarioKey();
            this.beneficiarioKey.CodigoRegion = this._contratoKey.CodigoRegion;
            this.beneficiarioKey.CodigoProducto = this._contratoKey.CodigoProducto;
            this.beneficiarioKey.NumeroContrato = this._contratoKey.NumeroContrato;
            this.beneficiarioService.getBeneficiariosMaternidad(this.beneficiarioKey).subscribe(beneficiarios1 => {
                this.beneficiarios = beneficiarios1;
                beneficiarios1.forEach(element => {
                    // this.valorActual = this.valorActual + element.PrecioBeneficiario;
                    this.valorServicio = this.valorServicio + element.PrecioServicios;
                });
            });
        }
    }

    loadDatos() {
        /*   if (this._contratoKey.NumeroEmpresa != "1" && this._contratoKey.NumeroEmpresa != "5000001") {
              this.authService.showInfoPopup("Este contrato pertenece a un GRUPAL no puede cambiar por esta transacción");
              this.habilitar = true;
              this._contratoKey.PorcentajeDescuento = 0;
          } */
        // else {


        this.habilitar = false;
        if (this._contratoKey.FechaFinTarjeta != undefined) {
            let fecha = this._contratoKey.FechaFinTarjeta.split("/");
            this._contratoKey.FechaFinTarjeta = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
            this.fechaFinTarjeta = new Date(this._contratoKey.FechaFinTarjeta);
        }

        if (this._contratoKey.FacturarPasaporte == "") {
            this._contratoKey.FacturarPasaporte = "0000000000000";
        }

        this.transaccionService.getDatosFormaPago(this._contratoKey).subscribe(
            result => {
                this.bancos = result.Bancos;
                this._contratoKey.FechaHasta = result.DetalleRemesa.FacturadoHasta;
                this.meses = result.Meses;
                this.cantidadContratos = result.CantidadContratos;
                this.descuentos = result.Descuento;
                this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
                this.DatosContrato.PorcentajeDescuento = this._contratoKey.PorcentajeDescuento;
                this.calculos();
                this.changeTipoCuenta();
                /*          this._contratoKey.Anterior = "FP " + this._contratoKey.FormaPago +
                             " TC " + this._contratoKey.TipoCuenta +
                             " B " + this._contratoKey.CodigoBanco +
                             " PP " + this._contratoKey.PeriodoPago +
                             " FR " + this._contratoKey.FacturarRuc +
                             " FC " + this._contratoKey.FacturarCedula +
                             " FP " + this._contratoKey.FacturarPasaporte +
                             " D " + this._contratoKey.NombreDuenioCuenta +
                             " NC " + this._contratoKey.NumeroCuenta; */

                this._contratoKey.Anterior = this.verFormaPago(this._contratoKey.FormaPago) +
                    ";" + this.verPeriodoPago(this._contratoKey.PeriodoPago) +
                    ";" + this.verTipoCuenta(this._contratoKey.TipoCuenta) +
                    ";" + this.verBanco(this._contratoKey.CodigoBanco)
                    ;
            },
            error => this.authService.showErrorPopup(error)
        );
    }


    verFormaPago(formaPago: number): string {
        var resultado = "";

        switch (formaPago) {
            case 1:
                resultado = "Débito"
                break;

            case 2:
                resultado = "Pago Directo"
                break;

            default:
                break;
        }

        return resultado;
    }

    verPeriodoPago(periodoPago: number): string {
        var resultado = "";
        switch (periodoPago) {
            case 1:
                resultado = "Mensual"
                break;

            case 2:
                resultado = "Bimestral"
                break;

            case 3:
                resultado = "Trimestral"
                break;
            case 4:
                resultado = "Semestral"
                break;
            case 5:
                resultado = "Anual"
                break;
            case 6:
                resultado = "Cuatrimestral"
                break;

            default:
                break;
        }

        return resultado;
    }

    verTipoCuenta(tipoCuenta: number): string {
        var resultado = "";
        switch (tipoCuenta) {
            case 1:
                resultado = "Cuenta Corriente"
                break;

            case 2:
                resultado = "Cuenta Ahorro"
                break;
            case 3:
                resultado = "Tarjeta"
                break;
            case 4:
                resultado = "Pago Directo"
                break;


            default:
                break;
        }
        return resultado;
    }

    verBanco(codigoBanco: number): string {
        var resultado = "";
        if (this.bancos != undefined) {
            this.bancos.forEach(resp => {
                if (resp.CodigoBanco == codigoBanco) {
                    resultado = resp.NombreBanco;
                    return resultado;
                }
            });
        }

        return resultado;
    }



    guardarFormaPago() {
        this.cuotas = [];
        this.filtrar();
        if (this.fechaFinTarjeta != undefined || this.fechaFinTarjeta != null) {
            this._contratoKey.FechaFinTarjetaDate = this.fechaFinTarjeta;
        }


        this.transaccionService.modificarFormaPago(this._contratoKey).subscribe(
            result => {
                if (result) {
                    this.guardar = result;
                    this.habilitar = result;
                    this.CrearPdfFormularioMovimiento();
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    filtrar(): void {
        this.detalleRemesaService.getCuotasPaginated(this._contratoKey)
            .subscribe(cuotas => {
                this.loadData(cuotas);
            },
                error => this.authService.showErrorPopup(error));
    }

    loadData(cuotas: DetalleRemesaCuotas[]): void {
        this.cuotas = cuotas;
        var inipos = jQuery("#divResultadoBusquedaContratos").position().top;
        jQuery("html, body").animate({ scrollTop: inipos }, 300);
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
        this.buscaDescuento(this._contratoKey.TipoCuenta, this._contratoKey.PeriodoPago);
    }


    iniciarkey() {
        var key = new ContratoKey();
        key.ActiveTab = "movimientosTab";
        key.CodigoContrato = this.retencion.CodigoContrato;
        this.contratoKey.next(key);
    }


    seleccionar(beneficiario: Beneficiario): void {
        this.limpiarSeleccion();
        if (beneficiario != undefined) {
            beneficiario.Selected = true;
            this.beneficiarioSeleccionado = beneficiario;
        }
    }

    limpiarSeleccion() {
        if (this.beneficiarios != undefined) {
            this.beneficiarios.forEach(element => {
                element.Selected = false;
            });
        }
    }

    mostrarModal(selector: string) {
        $(selector).modal('show');
    }

    esconderModal(selector: string) {
        $(selector).modal('hide');
    }

    enviar() {
        this.esconderModal('#modalEnviar');
        this.mostrarModal('#modalEnviado');
    }

    confirmar() {
        this.esconderModal('#modalEnviado');
    }


    keys(obj) {
        return Object.keys(obj);
    }

    concatenar(valor: number): string {
        return (valor / 4) + 'px';
    }

    getheight(): string {
        return 10 + 'px';
    }

    crearComentario(): void {
        this.setDataContratoKey();
        this.router.navigate(['/retencion/comentario/movimiento/' + this._contratoKey.CodigoRegion + '/' + this._contratoKey.CodigoProducto + '/' + this._contratoKey.NumeroContrato + '/FORMAPAGO/']);
    }


    setDataContratoKey() {
        this.retencionState.setContratoKey(this._contratoKey);
    }

    CrearPdfFormularioMovimiento() {
        this.transaccionService.GenerarPdfFormularioMovimientoCambioFormaPago(this._contratoKey, "Notificación Cambio Forma de Pago (Retención)")
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


    //datos para la prefactura
    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    getTotalPorcentajeDescAnterior(): number {
        return this.suma(this.beneficiario, x => x.PorcentajeDescAnterior);
    }

    getTotalValorDescuentoAnterior(): number {
        return this.suma(this.beneficiario, x => x.ValorDescuentoAnterior);
    }

    getTotalPorcentajeDescuento(): number {
        return this.suma(this.beneficiario, x => x.PorcentajeDesc);
    }

    getTotalValorDescuento(): number {
        return this.suma(this.beneficiario, x => x.ValorDescuento);
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
            let total = this.suma(this.beneficiario, x => x.MedicinaPrepagada * (this.getTotalValorDescNuevo(x) / 100)) + this.getTotalValorDescuento();
            return total;
        }
    }

    getTotalValorDescuentoNuevaFactura(): number {
        var result = this.getTotalValorDescuento() + this.valorPagoDescuento;
        return result;
    }

    getTotalMedicinaPrepagada(): number {
        if (this.planContrato.Plan == undefined)
            return this.suma(this.beneficiario, x => x.MedicinaPrepagada);
        var result;
        return result;
    }

    getTotalMedicinaPrepagadaAnterior(): number {
        return this.suma(this.beneficiario, x => x.MedicinaPrepagada);
    }

    getTotalServiciosAdicionales(): number {
        return this.suma(this.beneficiario, x => x.ServiciosAdicionales);
    }

    getTotalDescuentoDisponible(beneficiario): number {
        if (beneficiario) {
            return (beneficiario.DescuentoDisponible > beneficiario.PorcentajeDescNuevo ? beneficiario.DescuentoDisponible : beneficiario.PorcentajeDescNuevo) - (beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0);
        }
        return this.suma(this.beneficiario, x => (x.DescuentoDisponible > x.PorcentajeDescNuevo ? x.DescuentoDisponible : x.PorcentajeDescNuevo) - (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));
    }

    getSubTotal1(beneficiario): number {
        if (beneficiario) {
            return beneficiario.MedicinaPrepagada + beneficiario.ServiciosAdicionales;
        }
        return this.suma(this.beneficiario, x => x.MedicinaPrepagada + x.ServiciosAdicionales);
    }

    getSubTotal1Nuevo(): number {
        return this.getTotalMedicinaPrepagada() + this.getTotalServiciosAdicionales();
    }

    getTotalValorDescNuevo(beneficiario): number {
        if (beneficiario) {
            return beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
        } else {
            return this.suma(this.beneficiario, x => (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));
        }
    }

    getSubTotal2(): number {
        return this.getSubTotal1(null) - this.getTotalValorDescuento();
    }

    getSubTotal2ConDescuento(beneficiario): number {
        return this.getSubTotal1(beneficiario) - this.getTotalValorDescuentoNuevo(beneficiario);
    }

    getSubTotal2ConDescuentoNuevaFactura(): number {
        return this.getSubTotal1Nuevo() - this.getTotalValorDescuentoNuevaFactura();
    }

    getGastoAdministrativo(): number {
        if (this.beneficiario.length > 0) {
            return this.beneficiario[0].GastoAdministrativo;
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
        return this.getSubTotal3() * (0.005);
    }

    getSSCConDescuento(): number {
        return this.getSubTotal3ConDescuento() * (0.005);
    }

    loadPrefactura(): void {
        this.key = new GetRetencionKey();
        this.key.CodigoProducto = this._contratoKey.CodigoProducto;
        this.key.NumeroContrato = this._contratoKey.NumeroContrato;
        this.key.Region = this._contratoKey.CodigoRegion;
        this.retencionService.getdescuentoRetencionCliente(this.key).subscribe(descuentos => {
            this.beneficiario = descuentos.map(x => {
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
}
