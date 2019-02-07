import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../../seguridad/auth.service';

import { ExclusionFilter } from '../../../common/model/exclusion';
import { BeneficiarioKey } from '../../../common/model/beneficiario';
import { TabPanelControl } from '../../tabPanelControl';
import { BeneficiariosComponent } from '../beneficiarios.component';

@Component({
    selector: 'exclusionBeneficiario',
    providers: [],
    templateUrl: 'exclusionBeneficiario.template.html'
})

export class ExclusionBeneficiarioComponent extends TabPanelControl implements OnDestroy {

    beneficiarioKey: BeneficiarioKey;

    exclusionFilter: ExclusionFilter;

    suscription: any;

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private beneficiariosComponent: BeneficiariosComponent) {

        super(TabPanelControl.TAB_BENEFICIARIOS_EXCLUSIONES);

        this.exclusionFilter = undefined;

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                if (beneficiarioKey != undefined) {
                    this.beneficiarioKey = beneficiarioKey;
                    this.loadExclusiones();
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

    loadExclusiones(): void {
        if (this.beneficiarioKey != undefined) {
            if (this.beneficiarioKey.NewKey)
                this.loaded = false;

            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded)
                    this.createExclusionesFilter();
            }
        } else {
            this.exclusionFilter = undefined;
        }
    }

    createExclusionesFilter(): void {
        this.exclusionFilter = new ExclusionFilter();
        this.exclusionFilter.NumeroContrato = this.beneficiarioKey.NumeroContrato;
        this.exclusionFilter.CodigoProducto = this.beneficiarioKey.CodigoProducto;
        this.exclusionFilter.CodigoRegion = this.beneficiarioKey.CodigoRegion;
        this.exclusionFilter.NumeroPersona = this.beneficiarioKey.NumeroPersona;
    }

    onLoadExclusiones(loaded: boolean) {
        this.loaded = loaded;
    }
}