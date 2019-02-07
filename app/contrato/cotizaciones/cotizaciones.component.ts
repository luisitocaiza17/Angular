import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

import { AuthService } from '../../seguridad/auth.service';
import { CotizacionService } from '../../common/servicios/cotizacion.service';

import { ContratoViewComponent } from '../contrato.view.component';
import { ContratoKey } from '../../common/model/contrato';
import { Cotizacion, CotizacionFilter } from '../../common/model/cotizacion';
import { TabPanelControl } from '../tabPanelControl';
import { FacturacionService } from '../../common/servicios/facturacion.service';
import { FacturacionPDF } from '../../common/model/facturacion';
import { ConstantService } from '../../utils/constant.service';
import { SpinnerService } from '../../utils/spinner.service';

import { Permiso } from '../../seguridad/usuario';

@Component({
    selector: 'cotizaciones',
    providers: [CotizacionService, FacturacionService],
    templateUrl: 'cotizaciones.template.html'
})

export class CotizacionesComponent extends TabPanelControl implements OnDestroy {

    cotizaciones: Cotizacion[];
    cotizacionSelected: Cotizacion;
    numeroRemesa:string;
    verRecaudo: boolean;
    contratoKey: ContratoKey;
    facturaDetalle: FacturacionPDF[];
    numerosFacturaFromFacturaDetalle: string[]; 
    cotizacionFilter:CotizacionFilter
        
    consultaVendedor: boolean;

    pdfLoaded: boolean; 
   
    suscription: any;

    constructor(public cotizacionService: CotizacionService, private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        private contratoViewComponent: ContratoViewComponent, private constantService: ConstantService,
        private chRef: ChangeDetectorRef, private authService: AuthService, public facturacionService:FacturacionService, 
        private spinner: SpinnerService) {

        super(TabPanelControl.TAB_COTIZACIONES);
        this.numerosFacturaFromFacturaDetalle = []; 
        this.pdfLoaded = false; 
        this.verRecaudo = true;
        this.cotizaciones = [];
        this.cotizacionSelected = new Cotizacion();
        this.cotizacionFilter=new CotizacionFilter();
        this.facturaDetalle=[];
        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                this.contratoKey = contratoKey;
                this.cargarDatos(); 
            }
            
        );
    }

    verificarPermisos(): void {
            if (this.authService.tipoPermiso == Permiso.CONSULTA_VENDEDOR) {
                console.log("ALLOW SOME TABS TO THE SELLER");
                this.consultaVendedor = true;
            }
            else {
                this.consultaVendedor = false;
            }

    }

    pageChanged(): void {
        this.loadContratos();
    }

    cargarDatos(): void {
        this.verificarPermisos();
        if (this.contratoKey != undefined) {
            if (this.contratoKey.NewKey) {
                this.loaded = false;
                this.cotizaciones = [];
                this.cotizacionSelected = new Cotizacion();
                this.facturaDetalle = []; 
                this.cotizacionFilter = new CotizacionFilter(); 
            }

            if (this.isActive(this.contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadFactutasPDF();          
                }
            }
        } else {
            this.cotizaciones = [];
            this.cotizacionSelected = new Cotizacion();
            this.facturaDetalle = []; 
            this.cotizacionFilter = new CotizacionFilter(); 
        }
    }

    loadFactutasPDF(){ 
        this.loadContratos(); 
    }

    loadContratos(): void {
        if (this.contratoKey != undefined) {
            var filter = this.createCotizacionFilter(this.contratoKey.CodigoContrato);
            this.cotizacionService.getByFiltersPaginated(filter).subscribe(
                result => {
                    this.cotizaciones = result;
                    if (this.cotizaciones != undefined && this.cotizaciones.length > 0) {                
                        this.seleccionar(this.cotizaciones[0], false);
                        this.loaded = true;
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.cotizaciones = [];
            this.cotizacionSelected = new Cotizacion();
        }
    }

  


    descargarDocumentoPdf(cotizacion: Cotizacion): void {
        this.facturacionService.descgargarDocumentoPdf(cotizacion)
              .subscribe(
                result => {
                  var blob: Blob = null;
                  blob = new Blob([result._body], { type: 'application/pdf' });
                  if (blob != null) {
                      var fileName = result.headers._headers.get("file-name")[0];
                      var url = window.URL.createObjectURL(blob);
                      var link = document.createElement('a');
                      document.body.appendChild(link);
                      link.href = url;
                      link.download = fileName;
                      link.click();
                  }
              },
              error => this.authService.showBlobErrorPopup(error)
            )
      }

    seleccionar(cotizacion: Cotizacion, irADetalles: boolean): void {
        if (this.cotizaciones != undefined) {
            this.cotizaciones.forEach(element => {
                element.Selected = false;
                if(element.TipoDocumento == "F"){
                    element.TipoDocumentoNumero = 1;
                }else{
                    element.TipoDocumentoNumero = 4;
                }
            });
        }

        var filter = this.createCotizacionFilter(this.contratoKey.CodigoContrato, cotizacion.NumeroCuota);
        this.cotizacionService.getOneByKey(filter).subscribe(
            result => {
                cotizacion.Selected = true;
                this.cotizacionSelected = result;
                this.numeroRemesa= this.cotizacionSelected.NumeroRemesa+"   -    "+this.cotizacionSelected.NumeroLineaRemesa;
                this.cotizacionSelected.BancoCaja = cotizacion.BancoCaja;
                this.verRecaudo = true;
                if (this.cotizacionSelected != undefined && this.cotizacionSelected.Estado == 'Por Cobrar')
                    this.verRecaudo = false;
                if (irADetalles)
                    this.goToDetails();
            },
            error => this.authService.showErrorPopup(error));


    }

    goToDetails(): void {
        var inipos = jQuery("#divDetallesCotizacion").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 274 }, 300);
    }

    createCotizacionFilter(codigoContrato: number, numeroCuota?: number): CotizacionFilter {
        var filter = new CotizacionFilter();
        filter.CodigoContrato = codigoContrato;
        filter.NumeroCuota = numeroCuota;
        return filter;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    ngOnInit(): void {
 
    }
}