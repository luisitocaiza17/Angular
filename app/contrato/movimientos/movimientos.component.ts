import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../seguridad/auth.service';
import { MovimientoService } from '../../common/servicios/movimiento.service';

import { Movimiento, MovimientoFilter } from '../../common/model/movimiento';
import { ContratoKey } from '../../common/model/contrato';

import { ContratoViewComponent } from '../contrato.view.component';
import { TabPanelControl } from '../tabPanelControl';

@Component({
    selector: 'movimientos',
    providers: [MovimientoService],
    templateUrl: 'movimientos.template.html'
})

export class MovimientosComponent extends TabPanelControl implements OnDestroy {

    movimientos: Movimiento[];
    movimientoSelected: Movimiento;

    contratoKey: ContratoKey;
    suscription: any;

    constructor(public movimientoService: MovimientoService, private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        private contratoViewComponent: ContratoViewComponent,
        private chRef: ChangeDetectorRef, private authService: AuthService) {

        super(TabPanelControl.TAB_MOVIMIENTOS);

        this.movimientos = [];
        this.movimientoSelected = new Movimiento();

        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                this.contratoKey = contratoKey;
                this.cargarDatos();
            }
        );
    }

    pageChanged(): void {
        this.loadMovimientos();
    }

    cargarDatos(): void {
        if (this.contratoKey != undefined) {
            if (this.contratoKey.NewKey) {
                this.loaded = false;
                this.movimientos = [];
                this.movimientoSelected = new Movimiento();
            }

            if (this.isActive(this.contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadMovimientos();
                }
            }
        } else {
            this.movimientos = [];
            this.movimientoSelected = new Movimiento();
        }
    }

    loadMovimientos(): void {
        if (this.contratoKey != undefined) {
            var filter = this.createMovimientoFilter(this.contratoKey.CodigoContrato);
            this.movimientoService.getByFiltersPaginated(filter).subscribe(
                result => {
                    this.movimientos = result;
                    if (this.movimientos != undefined && this.movimientos.length > 0) {
                        this.seleccionar(this.movimientos[0]);
                        this.loaded = true;
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.movimientos = [];
            this.movimientoSelected = new Movimiento();
        }
    }

    seleccionar(movimiento: Movimiento): void {
        if (this.movimientos != undefined) {
            this.movimientos.forEach(element => {
                element.Selected = false;
            });
        }
        movimiento.Selected = true;
        this.movimientoSelected = movimiento;
    }

    createMovimientoFilter(codigoContrato: number, numeroMovimiento?: number): MovimientoFilter {
        var filter = new MovimientoFilter();
        filter.CodigoContrato = codigoContrato;
        filter.NumeroMovimiento = numeroMovimiento;
        return filter;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
}