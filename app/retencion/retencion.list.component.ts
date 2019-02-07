import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../common/model/contrato';
import { RetencionService } from '../common/servicios/retencion.service';

@Component({
    templateUrl: 'retencion.list.template.html'
})

export class RetencionListComponent implements OnInit {
    filtro: ContratoEntityFilter;
    contratos: ContratoEntityList[];
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    mappings: [string, string, string][];
    interval: any;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private retencionService: RetencionService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.interval = setInterval(() => {
            this.changeDetector.detectChanges();
            this.changeDetector.detach();
        }, 100);
        this.filtro = new ContratoEntityFilter();
        this.filtro.CodigoRegion = "";
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.currentPage = 1;
        this.mappings = [
            ["Cédula", "Cédula", "NumeroCedula"],
            ["Región", "Región", "CodigoRegion"],
            ["Razón social", "Razón social", "RazonSocial"],
            ["Nombres", "Nombres", "NombrePersona"],
            ["Producto", "Código Producto", "CodigoProducto"],
            ["Número Empresa", "Número Empresa", "NumeroEmpresa"],
            ["Apellidos", "Apellidos", "ApellidoPersona"],
            ["Contrato", "Número Contrato", "NumeroContrato"],
            ["Número Liquidación", "Número Liquidación", "NumeroLiquidacion"], //?
            ["Pasaporte", "Pasaporte", "Pasaporte"],
            ["Cuenta", "Número Cuenta", "NumeroCuenta"],
            ["Número Alcance", "Número Alcance", "NumeroAlcance"],
            ["Número Sobre", "Número Sobre", "NumeroSobre"]
        ];

        this.activatedRoute.queryParams.subscribe(params => {
            if (Object.keys(params).length == 0) {
                return;
            }

            this.filtro = Object.assign(this.filtro, params);
            this.currentPage = params.page || 1;

            this.retencionService.filtrarContratos(this.filtro, this.itemsPerPage, this.currentPage).subscribe(res => {
                if (res) {
                    this.contratos = res.data;
                    this.totalItems = res.total;
                } else {
                    this.contratos = [];
                    this.totalItems = 0;
                }
            });
        });
    }

    ngOnDestroy() {
		clearInterval(this.interval);
	}

    enviar(): void {
        this.router.navigate(['/retencion/list'], { queryParams: this.queryParams() });
    }

    queryParams(): any {
        const sinVacios = this.quitarVacios(this.filtro)
        return Object.assign(sinVacios, { page: this.currentPage });
    }

    quitarVacios(obj: any): any {
        return Object.keys(obj).reduce((xs, x) => {
            const value = obj[x];
            if (value) {
                xs[x] = obj[x];
            }
            return xs;
        }, {});
    }

    limpiar(): void {
        this.filtro = new ContratoEntityFilter();
        this.filtro.CodigoRegion = "";
    }

    pageChange(event): void {
        this.currentPage = event;
        this.enviar();
    }

    crearContratoKey(selected: ContratoEntityList): void {
        console.log('entro en create contrato list component');
        var key = new ContratoKey();
        key.CodigoContrato = selected.CodigoContrato;
        key.CodigoProducto = selected.CodigoProducto;
        key.CodigoRegion = selected.CodigoRegion;
        key.ContratoEstado = selected.EstadoContrato;
        key.CodigoPlan = selected.CodigoPlan;
        key.NumeroContrato = selected.NumeroContrato;
        key.Plan = selected.CodigoPlan;
        key.NombreEmpresa = selected.RazonSocial;
        key.NumeroEmpresa = selected.NumeroEmpresa;
        key.NumeroPersona = selected.NumeroPersona;
        key.NumeroSucursal = selected.NumeroSucursal;
        key.NombreSucursalEmpresa = selected.Sucursal;
        key.Transicion = selected.Transicion;
        key.VersionPlan = selected.VersionPlan;
        key.Observaciones = selected.Observaciones;
        key.CedulaTitular =selected.Cedula;
        key.NombreTitular = selected.NombresApellidos;
        key.PeriodoPago = selected.PeriodoPago;
        key.EsMoroso = selected.EsMoroso;
        key.MontoMora = selected.MontoMora;
        key.FechaFin = selected.FechaFinDate;
        key.FechaInicio = selected.FechaInicioDate;
        key.FechaFinOriginal = selected.FechaFinOriginal;
        key.ContratoCodigoEstado = selected.ContratoCodigoEstado;
        key.CodigoBanco = selected.CodigoBanco;
        key.CodigoMotivoAnulacion = selected.CodigoMotivoAnulacion;
        key.CodigoSucursal = selected.CodigoSucursal;
        key.DireccionPe = selected.DireccionPe;
        key.PagoInteligente = selected.PagoInteligente;
        key.NumeroCuentaCredito = selected.NumeroCuentaCredito;
        key.TipoCuentaCredito = selected.TipoCuentaCredito;
        key.EmailDomicilio = selected.EmailDomicilio;
        key.EmailTrabajo = selected.EmailTrabajo;
        key.Celular = selected.Celular;
        key.EnvioPi = selected.EnvioPi;
        key.FormaPago = selected.FormaPago;
        key.TipoCuenta = selected.TipoCuenta;
        key.FacturarRuc = selected.FacturarRuc;
        key.FacturarCedula = selected.FacturarCedula;
        key.NombreDuenioCuenta = selected.NombreDuenioCuenta;
        key.FechaFinTarjeta = selected.FechaFinTarjeta;
        key.FacturarPasaporte = selected.FacturarPasaporte;
        key.NumeroCuenta = selected.NumeroCuenta;
        key.RucEmpresa =  selected.RucEmpresa;
        key.CodigoDescuento = selected.CodigoDescuento;
        key.AFavor = selected.AFavor;
        key.NumeroCuota = selected.NumeroCuota;
        key.TitularBeneficios = selected.TitularBeneficios;
        key.CobrandoTarjetasAdicionales = selected.CobrandoTarjetasAdicionales;
        key.ValorTarjetasAdicionales = selected.ValorTarjetasAdicionales;
        key.TarjetasAdicionales = selected.TarjetasAdicionales;
        key.NivelReferencia = selected.NivelReferencia;
        key.PrecioBase = selected.PrecioBase;
        key.NombrePlan = selected.NombrePlan;
        key.CodigoBancoCredito = selected.CodigoBancoCredito;
        key.CobradoGastoAdministrativo = selected.CobradoGastoAdministrativo;
        key.MontoGastosAdministrativos = selected.MontoGastosAdministrativos;
        key.ValorRenovacion = selected.ValorRenovacion;
        this.retencionService.setInformacionContratoKey(key);
        
        this.router.navigate(['/retencion/show', selected.CodigoRegion, selected.CodigoProducto, selected.NumeroContrato]);
    }

}