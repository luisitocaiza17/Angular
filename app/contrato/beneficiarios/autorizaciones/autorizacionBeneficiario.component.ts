import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../../seguridad/auth.service';

import { TabPanelControl } from '../../tabPanelControl';
import { BeneficiarioKey } from '../../../common/model/beneficiario';
import { BeneficiariosComponent } from '../beneficiarios.component';
import { AutorizacionFilter } from '../../../common/model/autorizacion';

@Component({
    selector: 'autorizacion',
    providers: [],
    templateUrl: 'autorizacionBeneficiario.template.html'
})

export class AutorizacionBeneficiarioComponent extends TabPanelControl implements OnDestroy {

    beneficiarioKey: BeneficiarioKey;
    autorizacionFilter: AutorizacionFilter;

    suscription: any;

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private beneficiariosComponent: BeneficiariosComponent) {

        super(TabPanelControl.TAB_BENEFICIARIOS_AUTORIZACION);

        this.autorizacionFilter = undefined;

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                if (beneficiarioKey != undefined) {
                    this.beneficiarioKey = beneficiarioKey;
                    this.loadAutorizaciones();
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

    loadAutorizaciones(): void {
        if (this.beneficiarioKey != undefined) {
            if (this.beneficiarioKey.NewKey)
                this.loaded = false;

            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded)
                    this.createAutorizacionFilter();
            }
        } else {
            this.autorizacionFilter = undefined;
        }
    }

    createAutorizacionFilter(): void {
        this.autorizacionFilter = new AutorizacionFilter();
        this.autorizacionFilter.CodigoContrato = this.beneficiarioKey.CodigoContrato;
        this.autorizacionFilter.NumeroPersona = this.beneficiarioKey.NumeroPersona;
    }

    onLoadAutorizaciones(loaded: boolean) {
        this.loaded = loaded;
    }
}