
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { AuthService } from '../../../seguridad/auth.service';
import { CatalogoComercialService } from '../../../comercial/service/catalogoComercial.service';
import { ServicioPagoService } from '../../services/servicioPago.service';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { VariablesConstantService } from '../../../utils/variableConstant.service.';

import { RegionEntity, FilterBancos, BancoEntity, FilterBancoTarjeta, ProductosReporteMorosoEntity } from '../../../common/model/genericos';
import { VendedorSucursalEntity } from '../../../comercial/model/vendedorSucursalEntity';
import { CreaPagoEntity, ListaTablaPagoRecaudo } from '../../model/creaPagoEntity';
import { CreaFormaPagoEntity } from '../../model/creaFormaPagoEntity';
import { FormaPagoEntity } from '../../model/FormaPagoEntity';
import { ListaCajas } from '../../../transacciones/utils/constantesIngresoCaja';

@Component({
    providers: [CatalogoComercialService, ServicioPagoService, GenericosService],
    templateUrl: 'ingresoCaja.form.template.html'
})

export class IngresoCajaFormComponent {

    desabilitaAgregar: boolean;

    listaTablaPagos: ListaTablaPagoRecaudo[];
    pagoSelected: ListaTablaPagoRecaudo;

    filter: CreaPagoEntity;
    enviarDatosPago: CreaPagoEntity;

    listaRegiones: RegionEntity[];
    listaSucursales: VendedorSucursalEntity[];
    listaFormaPago: FormaPagoEntity[];
    listaBancos: BancoEntity[];
    listaTarjetas: FilterBancoTarjeta[];
    listaProductos: ProductosReporteMorosoEntity[];
    listaCajas: ListaCajas[];
    subTotalRecibido: number;
    auxTarjeta: boolean;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService,
        public catalogoComercialService: CatalogoComercialService, public servicioPagoService: ServicioPagoService,
        public variablesConstantService: VariablesConstantService, public genericosService: GenericosService) {

        this.desabilitaAgregar = true;

        this.filter = new CreaPagoEntity();
        this.enviarDatosPago = new CreaPagoEntity();
        this.pagoSelected = new ListaTablaPagoRecaudo();
        this.auxTarjeta = true;
        this.listaTablaPagos = [];

        this.listaRegiones = [];
        this.listaSucursales = [];
        this.listaFormaPago = [];
        this.listaBancos = [];
        this.listaTarjetas = [];
        this.listaProductos = [];
        this.listaCajas = [];
        this.subTotalRecibido = 0;

        this.cargarCombos();
        this.loadSucursales();
    }

    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
        if (this.listaProductos.length == 0) {
            this.listaProductos = ProductosReporteMorosoEntity.values;
        }
        if (this.listaCajas.length == 0) {
            this.listaCajas = ListaCajas.values;
        }
    }

    datosTarjeta() {
        this.listaTarjetas.forEach(element => {
            if (this.pagoSelected.CodBancoTarjeta == element.CodigoBanco.toString()) {
                this.pagoSelected.NombreBancoTarjeta = element.NombreBanco;
            }
        });
    }

    loadSucursales() {
        this.catalogoComercialService.VendedorSucursal(1, 0).subscribe(
            result => {
                this.listaSucursales = result;
                this.loadFormasPago();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadFormasPago() {
        var filtro = new CreaFormaPagoEntity();
        filtro.Estado = this.variablesConstantService.CODIGO_ESTADO_ACTIVO;
        this.servicioPagoService.obtenerPago(filtro, 1, 0).subscribe(
            result => {
                this.listaFormaPago = result;
                this.obtenerBanco();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    obtenerBanco() {
        var filtroBancos = new FilterBancos();
        filtroBancos.Estado = this.variablesConstantService.CODIGO_ESTADO_ACTIVO;
        this.genericosService.GetCargarBancos(filtroBancos).subscribe(
            result => {
                this.listaBancos = result;
            }
        );
    }

    obtenerTarjetaBanco() {
        this.genericosService.getBancosEmisorTarjeta().subscribe(
            result => {
                this.listaTarjetas = result;
            }, error => {
                this.authService.showErrorPopup(error);
            }
        );
    }

    obtieneFunPagoPrimeraCuota() {
        this.borrarTodo();
        if (this.filter.ContratoNumero != undefined && this.filter.ContratoNumero > 0) {
            this.servicioPagoService.obtieneFunPagoPrimeraCuota(this.filter.ContratoNumero).subscribe(
                result => {
                    this.filter.ContratoNumero = result.NumeroFun;
                    this.filter.CodigoProducto = result.CodigoProducto;
                    this.filter.AuxNumeroSerie = result.NumeroSerie;
                    this.servicioPagoService.obtieneSerieNumeroSerie(result.NumeroSerie).subscribe(
                        result => {
                            this.filter.Region = result.Region;
                            this.filter.SucursalNombre = result.CodigoSucursal;
                        }, error => {
                            this.authService.showErrorPopup(error);
                        }
                    );
                    this.desabilitaAgregar = false;
                },
                error => {
                    this.filter.ContratoNumero = undefined;
                    this.desabilitaAgregar = true;
                    this.subTotalRecibido = 0;
                    this.authService.showErrorPopup(error);
                }
            );
        }
    }

    borrarTodo() {
        if (this.filter.CodigoProducto != undefined) {
            for (var i = this.listaTablaPagos.length - 1; i >= 0; i--) {
                this.listaTablaPagos.splice(i, 1);
            }
            this.filter.Region = undefined;
            this.filter.SucursalNombre = undefined;
            this.filter.CodigoProducto = undefined;
            this.filter.ValorNoAplicaIva = 0;//ValorTarjeta
            this.filter.ValorAplicaIva = 0;//GastoAdministrativo
            this.subTotalRecibido = 0;
        }
    }

    abrirModalPago(pago: ListaTablaPagoRecaudo) {
        if (this.desabilitaAgregar == false) {
            this.pagoSelected = new ListaTablaPagoRecaudo();
            if (pago != undefined)
                this.pagoSelected = pago;
            $('#myModalPago').modal();
        }
    }

    salirModalPago() {
        jQuery("#myModalPago").modal("hide");
    }

    agregarPago() {
        this.pagoSelected.NumeroPago = this.listaTablaPagos.length + 1;
        this.listaTablaPagos.push(this.pagoSelected);
        this.getSumaDetalleValores();
        this.salirModalPago();
    }

    cambiarFormaPago() {
        this.listaFormaPago.forEach(element => {
            if (this.pagoSelected.CodFormaPago == element.Codigo) {
                this.pagoSelected.CodFormaPago = element.Codigo;//FormaTipoPago "69"
                this.pagoSelected.NombreFormaPago = element.Nombre;//TipoPago "EFECTIVO"
                if (this.pagoSelected.NombreFormaPago.toString() == "TARJETA") {
                    this.auxTarjeta = false;
                    this.obtenerTarjetaBanco();
                } else {
                    this.auxTarjeta = true;
                }
            }
        });
    }

    cambiarBanco() {
        this.listaBancos.forEach(element => {
            if (this.pagoSelected.CodBanco == element.CodigoBanco) {
                this.pagoSelected.CodBanco = element.CodigoBanco;
                this.pagoSelected.NombreBanco = element.NombreBanco;
            }
        });
    }

    borraPago(pago: ListaTablaPagoRecaudo) {
        for (var i = this.listaTablaPagos.length - 1; i >= 0; i--) {
            if (pago.NumeroPago === this.listaTablaPagos[i].NumeroPago)
                this.listaTablaPagos.splice(i, 1);
        }
        this.getSumaDetalleValores();
        var numero = 1;
        this.listaTablaPagos.forEach(element => {
            element.NumeroPago = numero;
            numero++;
        });
    }

    colapsarTab() {

    }

    grabar() {
        const usrData = this.authService.getDatosUsuarioAutenticado();//se obtiene datos del usuario
        console.log(usrData.NombreUsuario);
        if (this.listaTablaPagos.length > 0) {
            this.enviarDatosPago = new CreaPagoEntity();
            //datos unicos en filtro
            this.enviarDatosPago = this.filter;
            this.enviarDatosPago.TablaFormaPago = this.listaTablaPagos;
            this.servicioPagoService.crearPago(this.enviarDatosPago).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Proceso realizado con éxito");
                    }
                }, error => {
                    this.authService.showErrorPopup(error);
                }
            );
        } else {
            this.authService.showErrorPopup("Ingrese mínimo un pago");
        }
    }

    getSumaDetalleValores() {
        this.subTotalRecibido = 0;
        this.listaTablaPagos.forEach(element => {
            this.subTotalRecibido = Number(this.subTotalRecibido) + Number(element.ValorRecibido);
        });
    }

}