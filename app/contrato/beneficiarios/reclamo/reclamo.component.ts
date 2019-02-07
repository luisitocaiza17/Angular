import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { ContratoViewComponent } from '../../contrato.view.component';
import { BeneficiariosComponent } from '../beneficiarios.component';

import { AuthService } from '../../../seguridad/auth.service';
import { ReclamoService } from '../../../common/servicios/reclamo.service';
import { DetalleReclamoService } from '../../../common/servicios/detalleReclamo.service';

import { ReclamoEntityFilter, Reclamo } from '../../../common/model/reclamo';
import { DetalleReclamo, DetalleReclamoEntityList } from '../../../common/model/detalleReclamo';
import { Beneficiario, BeneficiarioKey } from '../../../common/model/beneficiario';
import { TabPanelControl } from '../../tabPanelControl';
import { PagoInteligente, PagoInteligenteFilter } from '../../../common/model/pagoInteligente';

@Component({
    selector: 'reclamo',
    providers: [ReclamoService, DetalleReclamoService],
    templateUrl: 'reclamo.template.html'
})

export class ReclamoComponent extends TabPanelControl implements OnDestroy {

    reclamos: Reclamo[];
    reclamoSeleccionado: Reclamo;

    detalleReclamos: DetalleReclamoEntityList[];
    beneficiarioKey: BeneficiarioKey;
    beneficiario: Beneficiario;
    pagoInteligentefilter : PagoInteligenteFilter;
    infoPagos : PagoInteligente[];

    suscription: any;

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService, public reclamoService: ReclamoService,
        public detalleReclamoService: DetalleReclamoService, private contratoViewComponent: ContratoViewComponent,
        private beneficiariosComponent: BeneficiariosComponent
    ) {

        super(TabPanelControl.TAB_BENEFICIARIOS_RECLAMOS);

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                if (beneficiarioKey != undefined) {
                    this.beneficiarioKey = beneficiarioKey;
                    this.loadReclamoList();
                }
            }
        );
    }

    ngOnInit(): void {
        this.reclamos = [];
        this.detalleReclamos = [];
        this.loaded = false;
        this.reclamoSeleccionado = new Reclamo();
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    pageChanged(): void {
        this.loaded = false;
        this.loadReclamoList();
    }

    loadReclamoList(): void {
        if (this.beneficiarioKey != undefined) {
            if (this.beneficiarioKey.NewKey) {
                this.loaded = false;
                this.reclamos = [];
                this.detalleReclamos = [];
                this.reclamoSeleccionado = new Reclamo();
            }
            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded) {
                    this.reclamoService.getReclamoList(this.beneficiarioKey).subscribe(
                        reclamos => {
                            this.loadData(reclamos, this.beneficiarioKey);
                            this.loaded = true;
                        },
                        error => this.authService.showErrorPopup(error));
                }
            }
        }
        else {
            this.reclamos = [];
            this.detalleReclamos = [];
            this.reclamoSeleccionado = new Reclamo();
        }
    }

    loadData(reclamos: Reclamo[], beneficiarioKey: BeneficiarioKey): void {
        this.reclamos = reclamos;
        if (beneficiarioKey != undefined && beneficiarioKey.filterByLiquidacion && beneficiarioKey.NumeroAlcance != undefined && beneficiarioKey.NumeroReclamo != undefined) {
            var reclamoLiq = this.seleccionarFiltroLiquidacion(beneficiarioKey.NumeroAlcance, beneficiarioKey.NumeroReclamo);
            if (reclamoLiq != undefined && reclamoLiq.NumeroReclamo != undefined && reclamoLiq.NumeroAlcance != undefined)
                this.seleccionar(reclamoLiq, true);
            else {
                if (this.reclamos != undefined && reclamos.length > 0) {
                    this.seleccionar(this.reclamos[0], false);
                    this.loaded = true;
                }
            }
        } else {
            if (this.reclamos != undefined && reclamos.length > 0) {
                this.seleccionar(this.reclamos[0], false);
                this.loaded = true;
            }
        }
    }

    seleccionar(reclamo: Reclamo, irADetalles: boolean): void {
        if (this.reclamos != undefined) {
            this.reclamos.forEach(element => {
                element.Selected = false;
            });
        }

        if (reclamo != undefined) {
            this.reclamoSeleccionado = reclamo;
            this.reclamoSeleccionado.Selected = true;
            this.chRef.detectChanges();
            if (irADetalles) {
                var pos = this.reclamos.findIndex(p => p.NumeroAlcance == this.reclamoSeleccionado.NumeroAlcance
                    && p.NumeroReclamo == this.reclamoSeleccionado.NumeroReclamo);
                if (pos >= 0)
                    this.goToDetails(pos);
                else
                    this.goToDetails(pos);
            }


            var reclamoFilter = new ReclamoEntityFilter();
            reclamoFilter.NumeroContrato = this.beneficiarioKey.NumeroContrato;
            reclamoFilter.NumeroAlcance = reclamo.NumeroAlcance;
            reclamoFilter.NumeroReclamo = reclamo.NumeroReclamo;
            reclamoFilter.CodigoContrato = this.beneficiarioKey.CodigoContrato;

            this.detalleReclamoService.getDetalleReclamoListByReclamoFilter(reclamoFilter).subscribe(
                detalleReclamos => {
                    this.detalleReclamos = detalleReclamos;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    seleccionarFiltroLiquidacion(numeroAlcance: number, numeroReclamo: number): Reclamo {
        var reclamoLiq: Reclamo;
        if (this.reclamos != undefined && numeroAlcance != undefined && numeroReclamo != undefined) {
            reclamoLiq = this.reclamos.find(element => element.NumeroAlcance == numeroAlcance && element.NumeroReclamo == numeroReclamo);
        }
        return reclamoLiq;
    }

    goToDetails(index: number): void {
        var inipos = jQuery("#divListaDetalleReclamo").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 700 }, 300);

        var topIni = jQuery("#reclamo" + (index)).position().top;
        topIni = topIni - jQuery("#bodyReclamos").position().top;
        jQuery("html, #bodyReclamos").animate({ scrollTop: topIni }, 300);
    }

    generarPdf(reclamo: Reclamo, event: Event): void {
        event.stopPropagation();

        var reclamoFilter = new ReclamoEntityFilter();
        reclamoFilter.CodigoContrato = this.beneficiarioKey.CodigoContrato;
        reclamoFilter.NumeroAlcance = reclamo.NumeroAlcance;
        reclamoFilter.NumeroReclamo = reclamo.NumeroReclamo;
        reclamoFilter.TipoReclamo = reclamo.TipoReclamo;

        this.reclamoService.generarPdf(reclamoFilter)
            .subscribe(
            resp => {
                var blob = new Blob([resp._body], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(blob);
                window.open(fileURL);
            },
            err => {
                this.authService.showBlobErrorPopup(err);
            });

        this.seleccionar(reclamo, false);
    }

    loadInfoPagoInteligente(reclamo: Reclamo, event: Event): void{
        event.stopPropagation();
        this.pagoInteligentefilter = new  PagoInteligenteFilter();
        this.infoPagos = [];

        this.pagoInteligentefilter.NumeroReclamo = reclamo.NumeroReclamo;
        this.pagoInteligentefilter.NumeroAlcance = reclamo.NumeroAlcance;


        this.reclamoService.obtenerInfoPagoInteligente(this.pagoInteligentefilter).subscribe(
            pagos => {
                this.infoPagos = pagos;
                jQuery("#infoPagosViewModal").modal("show");
            },
            error => this.authService.showErrorPopup(error));
    }
}