import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../seguridad/auth.service';
import { PlanService } from '../../common/servicios/plan.service';
import { CoberturaPlanService } from '../../common/servicios/coberturaPlan.service';

import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../../common/model/contrato';
import { Plan, PlanFilter } from '../../common/model/plan';
import { CoberturaPlan } from '../../common/model/coberturaPlan';

import { ContratoViewComponent } from '../contrato.view.component';
import { TabPanelControl } from '../tabPanelControl';

@Component({
    selector: 'planes',
    providers: [PlanService, CoberturaPlanService],
    templateUrl: 'plan.template.html'
})

export class PlanComponent extends TabPanelControl implements OnDestroy {

    planes: Plan[];
    contratoKey: ContratoKey;
    planSelected: Plan;
    coberturas: CoberturaPlan[];

    suscription: any;


    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService, private contratoViewComponent: ContratoViewComponent,
        public planService: PlanService, private coberturaPlanService: CoberturaPlanService) {

        super(TabPanelControl.TAB_PLANES);

        this.planes = [];
        this.coberturas = [];
        this.planSelected = new Plan();

        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                this.contratoKey = contratoKey;
                this.cargarDatos();
            }
        );
    }

    pageChanged(): void {
        this.loadPlanes();
    }

    cargarDatos(): void {
        if (this.contratoKey != undefined) {
            if (this.contratoKey.NewKey) {
                this.loaded = false;
                this.planes = [];
                this.coberturas = [];
                this.planSelected = new Plan();
            }

            if (this.isActive(this.contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadPlanes();
                }
            }
        } else {
            this.planes = [];
            this.coberturas = [];
            this.planSelected = new Plan();
        }
    }

    loadPlanes(): void {
        if (this.contratoKey != undefined) {
            var filter = this.createPlanFilter(this.contratoKey.CodigoContrato);
            this.planService.getByFiltersPaginated(filter).subscribe(
                result => {
                    this.planes = result;
                    if (this.planes != undefined && this.planes.length > 0) {
                        this.seleccionar(this.planes[0], false);
                        this.loaded = true;
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.planes = [];
            this.coberturas = [];
            this.planSelected = new Plan();
        }
    }

    seleccionar(plan: Plan, irADetalles: boolean): void {
        if (this.planes != undefined) {
            this.planes.forEach(element => {
                element.Selected = false;
            });
        }

        var filter = new PlanFilter();
        filter.CodigoContrato = this.contratoKey.CodigoContrato;
        filter.CodigoPlan = plan.CodigoPlan;
        filter.CodigoProducto = plan.CodigoProducto;
        filter.Region = this.contratoKey.CodigoRegion;
        filter.Version = plan.CodigoVersion;

        this.coberturaPlanService.getCoberturasByPlanFilter(filter).subscribe(
            result => {
                plan.Selected = true;
                this.coberturas = result;
                if (irADetalles)
                    this.goToDetails();
            },
            error => this.authService.showErrorPopup(error));
    }

    createPlanFilter(codigoContrato: number): PlanFilter {
        var filter = new PlanFilter();
        filter.CodigoContrato = codigoContrato;
        return filter;
    }

    goToDetails(): void {
        var inipos = jQuery("#divCoberturaPlan").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 274 }, 300);
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
}