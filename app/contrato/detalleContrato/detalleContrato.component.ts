import { Component, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../seguridad/auth.service';
import { ContratoService } from '../../common/servicios/contrato.service';
import { ContratoViewComponent } from '../contrato.view.component';
import { ContratoKey, Contrato, ClaveContratoEntity } from '../../common/model/contrato';
import { TabPanelControl } from '../tabPanelControl';
import { Movimiento, MovimientoFilter, MovimientoWithNombreTransaccion } from '../../common/model/movimiento';
import { CondicionParticularService } from '../../common/servicios/condicionParticular.service';

@Component({
    selector: 'detalleContrato',
    providers: [ContratoService],
    templateUrl: 'detalleContrato.template.html'
})

export class DetalleContratoComponent extends TabPanelControl implements OnDestroy {
    contrato: Contrato;
    contratoKey: ContratoKey;
    claveContrato: ClaveContratoEntity;
    suscription: any;
    condicionParticularSelected: Movimiento;
    condicionesParticulares: Movimiento[];
    vercondicionesParticulares: boolean;
    verMontoMora: boolean;
    lastMovTipo1: MovimientoWithNombreTransaccion;
    lastMovTipo2: MovimientoWithNombreTransaccion;

    constructor(private contratoService: ContratoService, private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        public condicionParticularService: CondicionParticularService,
        private contratoViewComponent: ContratoViewComponent,
        private chRef: ChangeDetectorRef, private authService: AuthService) {

        super(TabPanelControl.TAB_DATOS_GENERALES);
        this.lastMovTipo1 = new MovimientoWithNombreTransaccion();
        this.lastMovTipo2 = new MovimientoWithNombreTransaccion();
        this.claveContrato = new ClaveContratoEntity();
        this.contratoKey = new ContratoKey();
        this.contrato = new Contrato();
        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                this.loadContrato(contratoKey);
            }
        );
    }

    loadContrato(contratoKey: ContratoKey): void {
        if (contratoKey != undefined) {
            if (contratoKey.NewKey) {
                this.loaded = false;
                this.contrato = new Contrato();
            }

            if (this.isActive(contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.contratoService.getOneByKey(contratoKey).subscribe(
                        contrato => {
                            this.contrato = contrato;
                            this.contrato.EjecutivoCuenta = null;

                            if (this.contrato.EjecutivoCuenta == null) {
                                this.contrato.EjecutivoCuenta = "N/A";
                            }

                            if (this.contrato.NumeroLista == null) {
                                this.contrato.NumeroLista = "N/A";
                            }

                            this.loaded = true;
                            this.loadMovimientos();
                            this.obtenerUltimoMovimientoByClaveContratoAndEstados();
                        },
                        error => this.authService.showErrorPopup(error));
                }
            }
        }
        else
            this.contrato = new Contrato();

        this.contratoKey = contratoKey;
    }

    loadMovimientos() {
        this.vercondicionesParticulares = false;
        this.verMontoMora = true;
        this.condicionesParticulares = [];
        this.condicionParticularSelected = new Movimiento();
        if (this.contrato != undefined && this.contrato.CodigoContrato != undefined
            && (this.contrato.CodigoProducto == 'COR') || (this.contrato.CodigoProducto == 'POO') || (this.contrato.CodigoProducto == 'CPO')) {
            var filter = new MovimientoFilter();
            filter.CodigoContrato = this.contrato.CodigoContrato;
            this.condicionParticularService.getByFiltersPaginated(filter).subscribe(
                movimientos => {
                    this.condicionesParticulares = movimientos;
                    this.vercondicionesParticulares = true;
                    if (this.condicionesParticulares != undefined && this.condicionesParticulares.length > 0) {
                        this.seleccionar(this.condicionesParticulares[0]);
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
        if (this.contrato.CodigoContrato != undefined
            && (this.contrato.CodigoProducto == 'CPO')
            || (this.contrato.CodigoProducto == 'EXE')
            || (this.contrato.CodigoProducto == 'POO')
            || (this.contrato.CodigoProducto == 'DEN')
            || (this.contrato.CodigoProducto == 'COR')) {
            this.verMontoMora = false;
        }
    }

    seleccionar(movimiento: Movimiento): void {
        if (this.condicionesParticulares != undefined) {
            this.condicionesParticulares.forEach(element => {
                element.Selected = false;
            });
        }
        movimiento.Selected = true;
        this.condicionParticularSelected = movimiento;
    }

    descargar() {
        if (this.condicionParticularSelected != undefined) {
            let resp = this.condicionParticularService.descargarCondicionParticular(this.condicionParticularSelected)
                .subscribe(
                    resp => {
                        var blob = new Blob([resp._body], { type: 'application/msword' });
                        var fileURL = URL.createObjectURL(blob);
                        window.open(fileURL);
                    },
                    err => {
                        this.authService.showBlobErrorPopup(err);
                    });
        }
    }

    pageChanged(): void {
        this.loadMovimientos();
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    obtenerUltimoMovimientoByClaveContratoAndEstados(): void {
        this.claveContrato.Region = this.contratoKey.CodigoRegion;
        this.claveContrato.CodigoProducto = this.contratoKey.CodigoProducto;
        this.claveContrato.NumeroContrato = this.contratoKey.NumeroContrato;

        var codigos1 = [38, 39, 40];
        var codigos2 = [26];

        this.contratoService.getUltimoMovimientoByClaveContratoAndEstados(this.claveContrato, codigos1)
            .subscribe(res => {
                this.lastMovTipo1 = res;
            });

        this.contratoService.getUltimoMovimientoByClaveContratoAndEstados(this.claveContrato, codigos2)
            .subscribe(res => {
                this.lastMovTipo2 = res;
            });
    }
}