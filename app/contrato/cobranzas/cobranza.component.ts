import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../seguridad/auth.service';

import { ContratoViewComponent } from '../contrato.view.component';
import { ContratoKey } from '../../common/model/contrato';
import { TabPanelControl } from '../tabPanelControl';

import { CobranzaService } from '../../common/servicios/cobranza.service';
import { Cobranza, CobranzaFilter } from '../../common/model/cobranza';

@Component({
    selector: 'cobranzas',
    providers: [CobranzaService],
    templateUrl: 'cobranza.template.html'
})

export class CobranzaComponent extends TabPanelControl implements OnDestroy {

    cobranzas: Cobranza[];
    contratoKey: ContratoKey;

    suscription: any;

    constructor(public cobranzaService: CobranzaService, private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        private contratoViewComponent: ContratoViewComponent,
        private chRef: ChangeDetectorRef, private authService: AuthService) {

        super(TabPanelControl.TAB_COBRANZAS);

        this.cobranzas = [];

        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                this.contratoKey = contratoKey;
                this.cargarDatos();
            }
        );
    }

    pageChanged(): void {
        this.loadCobranzas();
    }

    cargarDatos(): void {
        if (this.contratoKey != undefined) {
            if (this.contratoKey.NewKey) {
                this.loaded = false;
                this.cobranzas = [];
            }

            if (this.isActive(this.contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadCobranzas();
                }
            }
        } else {
            this.cobranzas = [];
        }
    }

    loadCobranzas(): void {
        if (this.contratoKey != undefined) {
            var filter = this.createCobranzaFilter(this.contratoKey.CodigoContrato);
            this.cobranzaService.getByFiltersPaginated(filter).subscribe(
                result => {
                    this.cobranzas = result;
                    this.loaded = true;
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.cobranzas = [];
        }
    }

    createCobranzaFilter(codigoContrato: number, numeroCuota?: number): CobranzaFilter {
        var filter = new CobranzaFilter();
        filter.CodigoContrato = codigoContrato;
        return filter;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
}