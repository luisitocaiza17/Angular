import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { PlanService } from '../../../common/servicios/plan.service';
import { CoberturaPlanService } from '../../../common/servicios/coberturaPlan.service';

import { TabPanelControl } from '../../tabPanelControl';
import { Beneficiario, BeneficiarioKey } from '../../../common/model/beneficiario';
import { BeneficiariosComponent } from '../beneficiarios.component';
import { PlanFilter } from '../../../common/model/plan';
import { CoberturaPlan } from '../../../common/model/coberturaPlan';

@Component({
    selector: 'coberturaBeneficiario',
    providers: [PlanService],
    templateUrl: 'coberturaBeneficiario.template.html'
})

export class CoberturaBeneficiarioComponent extends TabPanelControl implements OnDestroy {

    beneficiarioKey: BeneficiarioKey;
    coberturas: CoberturaPlan[];

    suscription: any;

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private beneficiariosComponent: BeneficiariosComponent, public planService: PlanService,
        private coberturaPlanService: CoberturaPlanService) {

        super(TabPanelControl.TAB_BENEFICIARIOS_COBERTURAS);

        this.coberturas = [];

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                if (beneficiarioKey != undefined) {
                    this.beneficiarioKey = beneficiarioKey;
                    this.loadCoberturas();
                }
            }
        );
    }

    ngOnInit(): void {
        this.loaded = false;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    loadCoberturas(): void {
        if (this.beneficiarioKey != undefined) {
            if (this.beneficiarioKey.NewKey) {
                this.loaded = false;
                this.coberturas = [];
            }

            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded) {
                    var planFilter = new PlanFilter();
                    planFilter.CodigoContrato = this.beneficiarioKey.CodigoContrato;
                    planFilter.NumeroPersona = this.beneficiarioKey.NumeroPersona;
                    planFilter.CodigoProducto = this.beneficiarioKey.CodigoProducto;
                    planFilter.Region = this.beneficiarioKey.CodigoRegion;
                    planFilter.CodigoPlan = this.beneficiarioKey.CodigoPlan;
                    planFilter.Version = this.beneficiarioKey.VersionPlan;
                    planFilter.Transicion = this.beneficiarioKey.Transicion;

                    this.coberturaPlanService.getCoberturasByPlanPersonaFilter(planFilter).subscribe(
                        result => {
                            this.coberturas = result;
                            this.loaded = true;
                        },
                        error => this.authService.showErrorPopup(error));
                }
            }
        } else {
            this.coberturas = [];
        }
    }
}