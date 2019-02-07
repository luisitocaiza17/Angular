import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../../../app.helpers';
import { AuthService } from '../../../seguridad/auth.service';
import { RegionService } from '../../../common/servicios/region.service';
import { ContratoService } from '../../../common/servicios/contrato.service';
import { Region } from '../../../common/model/region';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../../../common/model/contrato';
import { ConstantService } from '../../../utils/constant.service';
import { SobreReembolsoService } from '../../../sobres/service/sobreReembolso.service';
import { TransaccionKey } from '../../../common/model/transacciones';
import { BeneficiarioKey, Beneficiario } from '../../../common/model/beneficiario';
import { BeneficiarioService } from '../../../common/servicios/beneficiario.service';
import { DetalleSobreEntity } from '../../../sobres/model/DetalleSobreEntity';


@Component({
    providers: [ContratoService],
    templateUrl: 'contratosCr.list.template.html'
})

export class ContratosCrListComponent implements OnInit {

    contratos: ContratoEntityList[];
    filter: ContratoEntityFilter;
    regiones: Region[];
    opcion: string;
    contratoKey1: ContratoKey;
    detalleSobreTemporal: DetalleSobreEntity[];
    beneficiarios: Beneficiario[];

    isDesplegar: boolean;

    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public sobreReembolsoService: SobreReembolsoService, private constantService: ConstantService,
        public contratoService: ContratoService,public beneficiarioService: BeneficiarioService) {
    }

    ngOnInit(): void {
        this.filter = new ContratoEntityFilter();
        this.contratos = [];
        this.loadRegiones();
        this.opcion = "";
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
                error => this.authService.showErrorPopup(error));
    }

    pageChanged(): void {
        this.filtrar();
    }

    buscar(): void {
        this.contratos = [];
        this.filtrar();
    }

    limpiar(): void {
        this.filter = new ContratoEntityFilter();
        this.contratos = [];
    }

    filtrar(): void {
        this.contratoService.getByFiltersSobrePaginated(this.filter)
            .subscribe(contratos => {
                this.loadData(contratos);
            },
                error => this.authService.showErrorPopup(error));
    }

    loadData(contratos: ContratoEntityList[]): void {
        this.contratos = contratos;
        var inipos = jQuery("#divResultadoBusquedaContratos").position().top;
        jQuery("html, body").animate({ scrollTop: inipos }, 300);

        /* if (this.contratos != undefined && this.contratos.length > 0)
             this.crearContratoKey(this.contratos[0]);*/
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new ContratoKey();
        key.unsuscribe = true;
        this.contratoKey.next(key);
    }

    inicializarPanelSobres(selected: ContratoEntityList): void {
     
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelSobres").collapse("show");

        this.crearContratoKey(selected);

        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelSobres").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
        this.loadContratoKey(selected);
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    crearContratoKey(selected: ContratoEntityList): void {
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
        key.CedulaTitular = selected.Cedula;
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
        key.RucEmpresa = selected.RucEmpresa;
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
        key.NombresApellidos = selected.NombresApellidos;
        key.NombreBancoPI = selected.NombreBancoPI;

        this.contratoKey.next(key);
    }
    loadContratoKey(contrato: ContratoEntityList) {
    
        var filter = new TransaccionKey();
        filter.CodigoProducto = contrato.CodigoProducto;
        filter.CodigoRegion = contrato.CodigoRegion;
        filter.NumeroContrato = contrato.NumeroContrato;
        this.contratoService.getContratoKey(filter).subscribe(
            result => {
                this.contratoKey1 = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    

   /* migrarBeneficiarios() {
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
    }*/
}
