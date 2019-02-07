import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../seguridad/auth.service';
import { RegionService } from '../../common/servicios/region.service';
import { PagoService } from '../../common/servicios/pago.service';
import { DetallePagoService } from '../../common/servicios/detallePago.service';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';

import { ContratoKey } from '../../common/model/contrato';
import { ConstantService } from '../../utils/constant.service';
import { NotasCreditoContratoListComponent } from './notasCreditoContrato.list.component';
import { TransaccionKey } from '../../common/model/transacciones';
import { CabeceraPagoEntity, DetallePagoEntity, DetallePagoFilter, EmitirNotaEntity } from '../../common/model/pago';
import { Catalogo } from '../../common/model/catalogo';
import { ConstantesFacturacion } from '../utils/constantesFacturacion';


@Component({
    selector: 'notasCredito',
    providers: [PagoService, DetallePagoService, ConstantesFacturacion],
    templateUrl: 'notasCredito.form.template.html'
})

export class NotasCredito implements OnInit, OnDestroy {

    desabilitar: boolean;
    suscription: any;
    contratoKey: ContratoKey;
    opcion: string;
    cabeceraPago: CabeceraPagoEntity[];
    cabeceraPagoSelected: CabeceraPagoEntity;
    listadetallePago: DetallePagoEntity[];
    detallePagoSelected: DetallePagoEntity;
    motivosNotaCredito: Catalogo[];
    motivosSalud: Catalogo[];
    filterEmitir: EmitirNotaEntity;


    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public pagoService: PagoService, public detallePagoService: DetallePagoService, private constantService: ConstantService,
        private detalleRemesaService: DetalleRemesaService,
        private notasCreditoListComponent: NotasCreditoContratoListComponent,
        public constantesFacturacion: ConstantesFacturacion) {

        this.desabilitar = false;
        this.cabeceraPago = [];
        this.cabeceraPagoSelected = new CabeceraPagoEntity();
        this.listadetallePago = [];
        this.detallePagoSelected = new DetallePagoEntity();
        this.motivosNotaCredito = [];
        this.motivosSalud = [];

        this.contratoKey = new ContratoKey();
        this.filterEmitir = new EmitirNotaEntity();
        this.filterEmitir.ValorAcreditado = 0;

        this.suscription = this.notasCreditoListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                    this.getMotivosNotaCredito();
                }
            }
        );
    }

    ngOnInit(): void {
        this.opcion = "";
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    getMotivosNotaCredito(): void {
        this.pagoService.obtenerMotivosNotaCredito()
            .subscribe(result => {
                this.motivosNotaCredito = result;
                this.getMotivosSalud();

            },
                error => this.authService.showErrorPopup(error));
    }


    getMotivosSalud(): void {
        this.pagoService.obtenerMotivosSalud()
            .subscribe(result => {
                this.motivosSalud = result;
                this.obtenerCabecerasPago();

            },
                error => this.authService.showErrorPopup(error));
    }

    obtenerCabecerasPago() {
        var filter = new TransaccionKey();
        filter.CodigoRegion = this.contratoKey.CodigoRegion;
        filter.CodigoProducto = this.contratoKey.CodigoProducto;
        filter.NumeroContrato = this.contratoKey.NumeroContrato;
        filter.EmpresaNumero = parseInt(this.contratoKey.NumeroEmpresa);
        filter.SusursalEmpresa = parseInt(this.contratoKey.NumeroSucursal);
        this.listadetallePago = [];

        this.pagoService.obtenerCabeceraPagoByContratoPaginated(filter)
            .subscribe(result => {
                this.cabeceraPago = result;
                if (this.cabeceraPago != undefined && this.cabeceraPago.length != 0) {
                    this.seleccionarPago(this.cabeceraPago[0]);
                }
            },
                error => this.authService.showErrorPopup(error));
    }

    obtenerDetallePago() {
        var filter = new DetallePagoFilter();
        filter.NumeroPago = this.cabeceraPagoSelected.NumeroPago;
        filter.NumeroContrato = this.contratoKey.NumeroContrato;
        filter.CodigoProducto = this.contratoKey.CodigoProducto;
        filter.Region = this.contratoKey.CodigoRegion;
        filter.EmpresaNumero = parseInt(this.contratoKey.NumeroEmpresa);

        this.detallePagoService.obtenerDetallePagoContrato(filter)
            .subscribe(result => {
                this.listadetallePago = result;
                if (this.listadetallePago != undefined && this.listadetallePago.length != 0) {
                    this.seleccionardetallePago(this.listadetallePago[0]);
                }
            },
                error => this.authService.showErrorPopup(error));
    }

    seleccionarPago(pago: CabeceraPagoEntity) {

        this.listadetallePago = [];
        this.filterEmitir.GMaximo = pago.ValorRecibido;
        this.filterEmitir.ValorAcreditado = 0;
        if (this.cabeceraPago != undefined) {
            this.cabeceraPago.forEach(element => {
                element.Selected = false;
            });
        }
        pago.Selected = true;
        this.cabeceraPagoSelected = pago;

        if (this.cabeceraPagoSelected.TipoDocumento == "NC") {
            this.desabilitar = true;
        }
        else {
            this.desabilitar = false;
        }

        if (pago.EsGrupal) {
            this.listadetallePago = [];
            var detallePago = new DetallePagoEntity();
            detallePago.NumeroCuota = pago.NumeroCuota;
            detallePago.FacturadoDesde = new Date (pago.FacturadoDesde);
            detallePago.FacturadoHasta = new Date (pago.FacturadoHasta);
            detallePago.NumeroRemesa = pago.NumeroRemesa;
            detallePago.FechaCaja = new Date(pago.FechaCaja);
            detallePago.NumeroFactura = pago.NumeroFactura;
            detallePago.ValorRemitido = pago.ValorRecibido;
            detallePago.TotalAbonado = pago.ValorRecibido;

            this.listadetallePago.push(detallePago);

            this.seleccionardetallePago(this.listadetallePago[0]);
        }
        else {
            this.detallePagoService.resetDefaultPaginationConstanst();
            this.obtenerDetallePago();
        }
    }

    seleccionardetallePago(detallePago: DetallePagoEntity) {
        this.filterEmitir.ValorAcreditado = detallePago.ValorRemitido;
        this.filterEmitir.NumeroPago = detallePago.NumeroPago;
        this.filterEmitir.NumeroLineaPago = detallePago.NumeroLineaPago;

        if (this.listadetallePago != undefined) {
            this.listadetallePago.forEach(element => {
                element.Selected = false;
            });
        }
        detallePago.Selected = true;
        this.detallePagoSelected = detallePago;
    }

    emitir() {

        this.filterEmitir.CodigoProducto = this.detallePagoSelected.CodigoProducto;
        this.filterEmitir.Region = this.detallePagoSelected.Region;
        this.filterEmitir.ContratoNumero = this.detallePagoSelected.NumeroContrato;
        this.filterEmitir.NumeroCuota = this.detallePagoSelected.NumeroCuota;
        this.filterEmitir.TipoDocumento = this.detallePagoSelected.TipoDocumento;
        this.filterEmitir.EmisionReplica = true;

        if (this.filterEmitir.MotivoNota != "ANULACION DE OPERACIONES (PROTESTO)") {
            this.showPopupResultadoConfirmEmision("DESEA EMITIR REPLICA DE IGUAL VALOR POR LA NC");
        }
        else {
            this.showPopupResultadoConfirm("Está seguro de emitir una Nota de Crédito por $ " + this.filterEmitir.ValorAcreditado);
        }
    }

    pageDetalleChanged() {
        this.obtenerDetallePago();
    }

    pageChanged() {
        this.obtenerCabecerasPago();
    }

    showPopupResultadoConfirm(msg: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "SI",
            cancelButtonText: "NO",
            closeOnConfirm: true,

        },
            confirmed => {

                if (confirmed) {
                    this.detalleRemesaService.emitirNotaCredito(this.filterEmitir)
                        .subscribe(result => {
                            this.authService.showSuccessPopup("Nota de Crédito emitida Correctamente");
                            this.desabilitar = true;
                            this.obtenerCabecerasPago();
                        },
                            error => this.authService.showErrorPopup(error)
                        );
                }
            });
    }



    showPopupResultadoConfirmEmision(msg: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "SI",
            cancelButtonText: "NO",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            confirmed => {
                if (confirmed) {

                    this.filterEmitir.EmisionReplica = true;
                    this.showPopupResultadoConfirm("Está seguro de emitir una Nota de Crédito por $ " + this.filterEmitir.ValorAcreditado);
                }
                else {
                    this.filterEmitir.EmisionReplica = false;
                    this.showPopupResultadoConfirm("Está seguro de emitir una Nota de Crédito por $ " + this.filterEmitir.ValorAcreditado);
                }
            });
    }

    limpiarCuota() {
        this.filterEmitir.MotivoNota = undefined;
        this.filterEmitir.MotivoSalud = undefined;
        this.filterEmitir.FormaPago = undefined;
        this.filterEmitir.ValorAcreditado = 0;
        this.filterEmitir.Ciudad = undefined;
        this.filterEmitir.Oficina = undefined;
        //this.filterEmitir.RegionFacturacion = undefined;
    }
}

