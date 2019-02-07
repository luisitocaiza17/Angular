import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from '../../../seguridad/auth.service';
import { ServicioAdicionalPersonaService } from '../../../common/servicios/servicioAdicionalPersona.service';

import { BeneficiariosComponent } from '../beneficiarios.component';

import { ServicioAdicionalPersona } from '../../../common/model/servicioAdicionalPersona';
import { BeneficiarioKey } from '../../../common/model/beneficiario';
import { TabPanelControl } from '../../tabPanelControl';

@Component({
    selector: 'servicioAdicionalPersona',
    providers: [ServicioAdicionalPersonaService],
    templateUrl: 'servicioAdicionalPersona.template.html'
})

export class ServicioAdicionalPersonaComponent extends TabPanelControl implements OnDestroy {

    beneficiarioKey: BeneficiarioKey;
    servicioAdicionalPersonas: ServicioAdicionalPersona[];
    suscription: any;

    constructor(public servicioAdicionalPersonaService: ServicioAdicionalPersonaService,
        private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        private beneficiariosComponent: BeneficiariosComponent,
        private chRef: ChangeDetectorRef, private authService: AuthService) {

        super(TabPanelControl.TAB_BENEFICIARIOS_SERVICIOS_ADICIONALES);

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                if (beneficiarioKey != undefined) {
                    this.beneficiarioKey = beneficiarioKey;
                    this.loadServicioAdicionalPersonaList();
                }
            }
        );
    }

    ngOnInit(): void {
        this.servicioAdicionalPersonas = [];
        this.loaded = false;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    pageChanged(): void {
        this.loadLista();
    }

    loadServicioAdicionalPersonaList(): void {
        if (this.beneficiarioKey != undefined) {

            if (this.beneficiarioKey.NewKey) {
                this.loaded = false;
                this.servicioAdicionalPersonas = [];
            }

            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadLista();
                }
            }
        } else {
            this.servicioAdicionalPersonas = [];
        }
    }

    loadLista(): void {
        this.servicioAdicionalPersonaService.getServicioAdicionalListByContratoKey(this.beneficiarioKey).subscribe(
            servicioAdicionalPersonas => {
                this.servicioAdicionalPersonas = servicioAdicionalPersonas;
                this.loaded = true;
            },
            error => this.authService.showErrorPopup(error));
    }
}