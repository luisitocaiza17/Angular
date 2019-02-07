import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../../seguridad/auth.service';
import { CarenciaService } from '../../../common/servicios/carencia.service';

import { TabPanelControl } from '../../tabPanelControl';
import { Carencia, CarenciaFilter } from '../../../common/model/carencia';
import { BeneficiariosComponent } from '../beneficiarios.component';
import { Beneficiario, BeneficiarioKey } from '../../../common/model/beneficiario';

@Component({
    selector: 'carencias',
    providers: [CarenciaService],
    templateUrl: 'carencia.template.html'
})

export class CarenciaComponent extends TabPanelControl implements OnDestroy {

    carencias: Carencia[];
    beneficiarioKey: BeneficiarioKey;
    carenciaSelected: Carencia;

    suscription: any;

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private beneficiariosComponent: BeneficiariosComponent, public carenciaService: CarenciaService) {

        super(TabPanelControl.TAB_CARENCIAS);

        this.carencias = [];
        this.carenciaSelected = new Carencia();

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                this.beneficiarioKey = beneficiarioKey;
                this.cargarDatos();
            }
        );
    }

    pageChanged(): void {
        this.loadPlanes();
    }

    cargarDatos(): void {
        if (this.beneficiarioKey != undefined) {
            if (this.beneficiarioKey.NewKey) {
                this.loaded = false;
                this.carencias = [];
                this.carenciaSelected = new Carencia();
            }

            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadPlanes();
                }
            }
        } else {
            this.carencias = [];
            this.carenciaSelected = new Carencia();
        }
    }

    loadPlanes(): void {
        if (this.beneficiarioKey != undefined) {
            var filter = this.createCarenciaFilter(this.beneficiarioKey.CodigoContrato);
            this.carenciaService.getByFiltersPaginated(filter).subscribe(
                result => {
                    this.carencias = result;
                    if (this.carencias != undefined && this.carencias.length > 0) {
                        this.seleccionar(this.carencias[0], false);
                    }
                    this.loaded = true;
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.carencias = [];
            this.carenciaSelected = new Carencia();
        }
    }

    seleccionar(carencia: Carencia, irADetalles: boolean): void {
        if (this.carencias != undefined) {
            this.carencias.forEach(element => {
                element.Selected = false;
            });
        }
    }

    createCarenciaFilter(codigoContrato: number): CarenciaFilter {
        var filter = new CarenciaFilter();
        filter.CodigoContrato = codigoContrato;
        filter.PersonaNumero = this.beneficiarioKey.NumeroPersona;
        return filter;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
}