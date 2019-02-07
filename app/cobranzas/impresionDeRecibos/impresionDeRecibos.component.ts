import { Component, OnInit } from "@angular/core";
import { DetalleRemesaFilter, DetalleRemesa } from "../../common/model/detalleRemesa";
import { ContratoKey, ContratoEntityFilter, ContratoEntityList } from "../../common/model/contrato";
import { GenericosService } from "../../common/servicios/genericos.service";
import { SucursalDeRegion, OficinaerieFActuraEntity } from "../../common/model/genericos";
import { Region } from "../../common/model/region";
import { RegionService } from "../../common/servicios/region.service";
import { AuthService } from "../../seguridad/auth.service";
import { utilidadesGenericasService } from "../../utils/utilidadesGenericas";
import { DetalleRemesaService } from "../../common/servicios/detalleRemesa.service";
import { BusquedaContratosComponentForRecibos } from "./busquedaContratos/busquedaContratos.component";
import { CobranzaService } from "../../common/servicios/cobranza.service";
import { ControlFacturaFilter } from "../../common/model/controlFactura";
import { ReciboCobranzaPdfIndividual } from "../../common/model/cobranza";
import { PdfService } from "../../common/servicios/pdf.service";

@Component({
    selector: 'impresionDeRecibosCobranza',
    providers: [GenericosService, PdfService],
    templateUrl: 'impresionDeRecibos.template.html'
})

export class impresionDeRecibosCobranzaComponent implements OnInit { 

    filtroDetalleRemesa: DetalleRemesaFilter; 
    detallesRemesa: DetalleRemesa[];
    sucursalesDeRegion: SucursalDeRegion[];
    regiones: Region[]; 
    datepickerOpts: {}; 
    fechaHoy: Date; 
    codigoSucursal: number; 
    codigoRegion: string;
    contratoEntityList: ContratoEntityList[];
    contratoEntityFilter: ContratoEntityFilter; 
    contrato: ContratoKey; 
    detalleRemesaSelected: DetalleRemesa; 
    oficinaSerieFactura: OficinaerieFActuraEntity; 
    ofSerie: string; 
    serieFactura: string; 
    numeroFactura: string;
    lImprimir: boolean; 
    reciboPdf: ReciboCobranzaPdfIndividual; 
    tieneControlFacturaTipoReciboParaCuota: boolean; 
    codigoSucursalDependiendoDeEmpresaNumero: number; 

    constructor(
        public genericosService: GenericosService, 
        public regionService: RegionService, 
        public authService: AuthService, 
        public utilidadesGenericas: utilidadesGenericasService, 
        public detalleRemesaService: DetalleRemesaService, 
        public busquedaContratosComponentForRecibos: BusquedaContratosComponentForRecibos, 
        public cobranzaService: CobranzaService, 
        public pdfService: PdfService
    ){

    }

    ngOnInit(){
        this.datepickerOpts = Object.assign({},this.utilidadesGenericas.datepickerOpts);
        this.filtroDetalleRemesa = new DetalleRemesaFilter(); 
        this.regiones = []; 
        this.sucursalesDeRegion = []; 
        this.loadRegiones(); 
        this.fechaHoy = this.utilidadesGenericas.getTodayDate();    
        this.contratoEntityList = []; 
        this.contrato = new ContratoKey();  
        this.detallesRemesa = []; 
        this.getDatosContratoFromParent(); 
        this.codigoRegion = this.contrato.CodigoRegion.toUpperCase();
        this.loadSucursalesDeRegion();
        this.getDetallesRemesaDeContrato(); 
        this.detalleRemesaSelected = new DetalleRemesa(); 
        this.oficinaSerieFactura = new OficinaerieFActuraEntity(); 
        this.tieneControlFacturaTipoReciboParaCuota = false; 
    }
    
    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
                this.regiones.splice(3,3);
                this.regiones.forEach( r => {
                    r.Codigo = r.Codigo.toUpperCase();
                });
            },
                error => this.authService.showErrorPopup(error));
    }

    verificarEmpresaNumeroParaSetearCodigoSucursal(){
        if(Number(this.contrato.NumeroEmpresa) == 1 || Number(this.contrato.NumeroEmpresa) == 5000001 )
            this.codigoSucursalDependiendoDeEmpresaNumero = 4;
        else 
            this.codigoSucursalDependiendoDeEmpresaNumero = 3;
    }

    loadSucursalesDeRegion() {  
        this.sucursalesDeRegion = []; 
        if(this.codigoRegion.toUpperCase() == 'SIERRA')
            this.SetearSucursalesSierra();  
        if(this.codigoRegion.toUpperCase() == 'COSTA')
            this.SetearSucursalesCosta();   
        if(this.codigoRegion.toUpperCase() == 'AUSTRO')
            this.SetearSucursalessAustro(); 
        this.setSucursalPorDefecto(); 
     }

    SetearSucursalesSierra(){ 
        var sucs = [{ CodigoSucursal: 20, NombreSucursal: 'Ambato'}, 
                    { CodigoSucursal: 40, NombreSucursal: 'Ibarra'}, 
                    { CodigoSucursal: 30, NombreSucursal: 'Santo Domingo'}, 
                    { CodigoSucursal: this.codigoSucursalDependiendoDeEmpresaNumero, NombreSucursal: 'Quito'}
                    ]; 

        sucs.forEach( su => {
            var sucursal = new SucursalDeRegion(); 
            sucursal.CodigoSucursal = su.CodigoSucursal; 
            sucursal.NombreSucursal = su.NombreSucursal; 
            this.sucursalesDeRegion.push(sucursal);
        });    
    }

    SetearSucursalesCosta(){ 
        var sucs = [
                    { CodigoSucursal: this.codigoSucursalDependiendoDeEmpresaNumero, NombreSucursal: 'Guayaquil'}
                    ]; 

        sucs.forEach( su => {
            var sucursal = new SucursalDeRegion(); 
            sucursal.CodigoSucursal = su.CodigoSucursal; 
            sucursal.NombreSucursal = su.NombreSucursal; 
            this.sucursalesDeRegion.push(sucursal);
        });    
    }

    SetearSucursalessAustro(){ 
        var sucs = [ { CodigoSucursal: this.codigoSucursalDependiendoDeEmpresaNumero, NombreSucursal: 'Cuenca'} ]; 

        sucs.forEach( su => {
            var sucursal = new SucursalDeRegion(); 
            sucursal.CodigoSucursal = su.CodigoSucursal; 
            sucursal.NombreSucursal = su.NombreSucursal; 
            this.sucursalesDeRegion.push(sucursal);
        });    
    }

    setSucursalPorDefecto(){ 
        this.codigoSucursal = this.sucursalesDeRegion[0].CodigoSucursal; 
    }

    getDatosContratoFromParent(){ 
        this.busquedaContratosComponentForRecibos.selectContrato$
                .subscribe(
                    res => { 
                        this.contrato = res; 
                        this.verificarEmpresaNumeroParaSetearCodigoSucursal(); 
                    }
                ); 
    }

    getDetallesRemesaDeContrato(){ 
        this.filtroDetalleRemesa.codigoProducto = this.contrato.CodigoProducto; 
        this.filtroDetalleRemesa.region = this.contrato.CodigoRegion; 
        this.filtroDetalleRemesa.contratoNumero = this.contrato.NumeroContrato; 
        this.detalleRemesaService.getDetallesRemesasForImpresionRecibosPaginated(this.filtroDetalleRemesa)
                .subscribe( res => { 
                    this.detallesRemesa = res; 
                }, 
                error => this.authService.showErrorPopup('No existen cuotas para el contrato buscado') 
            );
    }

    pageChanged(): void {
        this.getDetallesRemesaDeContrato();
    }

    seleccionar(detalleRemesa: DetalleRemesa): void {
        this.detalleRemesaSelected = new DetalleRemesa(); 
        if (this.detallesRemesa != undefined) {
            this.detallesRemesa.forEach(element => {
                element.Selected = false;
            });
        }
        detalleRemesa.Selected = true;
        this.detalleRemesaSelected = detalleRemesa;

        if(this.detalleRemesaSelected.Ofserie != 0 && this.detalleRemesaSelected.SerieFactura !=0 && this.detalleRemesaSelected.NumeroFactura != 0 )
        { 
            this.ofSerie = this.utilidadesGenericas.zeroPad(this.detalleRemesaSelected.Ofserie, 3); 
            this.serieFactura = this.utilidadesGenericas.zeroPad(this.detalleRemesaSelected.SerieFactura, 3); 
            this.numeroFactura = this.utilidadesGenericas.zeroPad(this.detalleRemesaSelected.NumeroFactura, 9); 
        } 
        else{ 
            this.ofSerie = this.utilidadesGenericas.zeroPad(0, 3); 
            this.serieFactura = this.utilidadesGenericas.zeroPad(0, 3); 
            this.numeroFactura = this.utilidadesGenericas.zeroPad(0, 9); 
        }
        this.verificarSiExisteControlFacturaTipoReciboParaLaCuota();
    }

    generarRecibo(event: Event){ 
        this.verificarSiSePuedeImprimirElrecibo(); 
        if(this.lImprimir == true){
            this.getOficinaSERIEFactura();    
        }          
    }

    getOficinaSERIEFactura(): void { 
        this.genericosService.OficinaSERIEFactura(this.codigoRegion, this.codigoSucursal) 
                .subscribe(
                    res => { 
                        this.oficinaSerieFactura = res; 
                        this.ofSerie = this.utilidadesGenericas.zeroPad(this.oficinaSerieFactura.iofSerie, 3); 
                        this.serieFactura = this.utilidadesGenericas.zeroPad(this.oficinaSerieFactura.iserieFactura, 3); 
                        if(!(res.error == null || res.error == undefined))
                            this.authService.showErrorPopup(res.error);
                        else{
                            this.detalleRemesaSelected.Ofserie = this.oficinaSerieFactura.iofSerie;
                            this.detalleRemesaSelected.SerieFactura = this.oficinaSerieFactura.iserieFactura; 
                            this.imprimirReciboEnBack(event); 
                        }
                    }, 
                    error => this.authService.showErrorPopup(error)
                ); 
    }

    imprimirReciboEnBack(event: Event){
        this.cobranzaService.ImprimirReciboCobranza(this.detalleRemesaSelected)
                    .subscribe(
                        res => { 
                            this.authService.showInfoPopup(res) 
                            this.generarPdfReciboCobranzaIndividual(event);
                            this.getDetallesRemesaDeContrato();
                            this.detalleRemesaSelected = new DetalleRemesa();
                        }, 
                        error => this.authService.showErrorPopup(error)
                    ); 
    }

    verificarSiSePuedeImprimirElrecibo(){ 
        if(this.detalleRemesaSelected.EmpresaNumero == 1 || this.detalleRemesaSelected.EmpresaNumero == 5000001)
            this.lImprimir = true;
        else{ 
            if(this.detalleRemesaSelected.MotivoCreacion.startsWith('DEP')){
                this.lImprimir = true; 
            }
            else{ 
                if(this.detalleRemesaSelected.NumeroCuota != '1'){ 
                    this.authService.showErrorPopup("La cuota seleccionada pertenece a un contrato contrato grupal, deberia emitir la factura desde la pantalla para la emision de facturas grupales. empresa-numero = " +  this.detalleRemesaSelected.EmpresaNumero); 
                } 
                else{
                    this.lImprimir = true; 
                }
            }
        }
    }

    generarPdfReciboCobranzaIndividual(event: Event): void {
        event.stopPropagation();

        if(this.verificarRazonSocial)
        {
            this.setReciboCobranzaPdfIndividual(); 
            this.modificarValorSiExisteDiferenciasEnDetalleRemesaVsCotizaciones(); 
             this.pdfService.GenerarPdfReciboCobranzaIndividual(this.reciboPdf)
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
        else{ 
            this.authService.showErrorPopup("No se puede imprimir el recibo por que no existe razón social para el contrato");
        }
        
    }

    setReciboCobranzaPdfIndividual() { 
        this.reciboPdf = new ReciboCobranzaPdfIndividual(); 

        this.reciboPdf.ContratoNumero = this.contrato.NumeroContrato; 
        this.reciboPdf.CodigoProducto = this.contrato.CodigoProducto; 
        this.reciboPdf.Region = this.contrato.CodigoRegion; 
        this.reciboPdf.NumeroCuota =  Number(this.detalleRemesaSelected.NumeroCuota); 
        this.reciboPdf.ValorAFavor = this.detalleRemesaSelected.ValorAFavor; 
        this.reciboPdf.AFavorContrato = this.contrato.AFavor; 
        this.reciboPdf.FechaDesde = this.detalleRemesaSelected.FacturadoDesde;
        this.reciboPdf.FechaHasta = this.detalleRemesaSelected.FacturadoHasta; 
        this.reciboPdf.Cuenta = this.detalleRemesaSelected.NumeroCuenta;
        this.reciboPdf.Empresa = this.detalleRemesaSelected.EmpresaNumero; 
        this.reciboPdf.Periodo = this.detalleRemesaSelected.PeriodoPago; 
        this.reciboPdf.FechaPago = this.detalleRemesaSelected.FechaPago; 
        this.reciboPdf.Impreso = this.detalleRemesaSelected.Impreso; 
        this.reciboPdf.DuenioCuenta = this.detalleRemesaSelected.NombreDuenioCuenta; 
        this.reciboPdf.FacturadoARuc = this.contrato.FacturarRuc; 
        this.reciboPdf.FacturadoAPasaporte = this.contrato.FacturarPasaporte; 
        this.reciboPdf.FacturadoACedula = this.contrato.FacturarCedula; 
        this.reciboPdf.Empresa = Number(this.contrato.NumeroEmpresa); 
        this.reciboPdf.CalleCorrespondencia = this.contrato.CalleCorrespondencia; 
        this.reciboPdf.FechaInicioContrato = this.contrato.FechaInicio;
        this.reciboPdf.FechaFinContrato = this.contrato.FechaFin; 
        this.reciboPdf.TipoCuenta = this.contrato.TipoCuenta; 
        this.reciboPdf.ValorCuota = Number(this.detalleRemesaSelected.ValorCuota); 
        this.reciboPdf.EsCopia = this.tieneControlFacturaTipoReciboParaCuota; 
       
    }

    verificarRazonSocial(): boolean{ 
        var res = true;

        this.contrato.FacturarCedula = this.contrato.FacturarCedula.trim() == "" ? undefined :  this.contrato.FacturarCedula.trim(); 
        this.contrato.FacturarPasaporte = this.contrato.FacturarPasaporte.trim() == "" ? undefined :  this.contrato.FacturarPasaporte.trim(); 
        this.contrato.FacturarRuc = this.contrato.FacturarRuc.trim() == "" ? undefined :  this.contrato.FacturarRuc.trim(); 

        if(this.contrato.FacturarCedula == undefined && this.contrato.FacturarPasaporte == undefined && this.contrato.FacturarRuc == undefined)
            res = false; 

        return res; 
    }

    verificarSiExisteControlFacturaTipoReciboParaLaCuota(){ 
        var cfFilter = new ControlFacturaFilter(); 
        cfFilter.CodigoProducto = this.detalleRemesaSelected.CodigoProducto; 
        cfFilter.ContratNumero = this.detalleRemesaSelected.ContratoNumero; 
        cfFilter.NumeroCuota = Number(this.detalleRemesaSelected.NumeroCuota);
        cfFilter.Region = this.detalleRemesaSelected.Region; 
        cfFilter.TipoDocumento = 'R';  
        this.genericosService.GetFirstControlFacturaByFilters(cfFilter) 
                .subscribe( data => { 
                    this.tieneControlFacturaTipoReciboParaCuota = true; 
                    }, error => {
                        this.tieneControlFacturaTipoReciboParaCuota = false; 
                    }
                );
    }

    modificarValorSiExisteDiferenciasEnDetalleRemesaVsCotizaciones(){
        this.cobranzaService.ModificarValorSiExisteDiferenciasEnDetalleRemesaVsCotizaciones(this.reciboPdf)
                .subscribe( res => {
                })
    }
}