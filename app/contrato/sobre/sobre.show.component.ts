import { Component, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../seguridad/auth.service';
import { SobreReembolsoService } from '../../sobres/service/sobreReembolso.service';

import { ContratoKey } from '../../common/model/contrato';

import { ContratoViewComponent } from '../contrato.view.component';
import { TabPanelControl } from '../tabPanelControl';
import { SobreEntity } from '../../sobres/model/SobreEntity';
import { SeguimientoSobreEntity } from '../../sobres/model/SeguimientoSobreEntity';
import { SobreFilter } from '../../sobres/model/SobreFilter';

import { HistorialEntity } from '../../sobres/model/HistorialEntity';
import { DetalleSobreEntity } from '../../sobres/model/DetalleSobreEntity';
import { ConstantesSobres } from './../../sobres/utils/constantesSobres';



@Component({
    selector: 'sobrereembolso',
    providers: [ConstantesSobres],
    templateUrl: './sobre.show.component.html'
})

export class SobreShowComponent extends TabPanelControl implements OnDestroy {

    sobresReembolso: SobreEntity[];
    sobreReembolsoSelected: SobreEntity;
    seguimientosSobre: SeguimientoSobreEntity[];
    historia: HistorialEntity[];
    contratoKey: ContratoKey;
    suscription: any;
    detalle1: string;
    detalle2: string;
    detalles: DetalleSobreEntity;
    detallesSobres: DetalleSobreEntity[];
    detalleSobreSelected: DetalleSobreEntity;

    historialSobre: SobreEntity[];



    constructor(public sobreReembolsoService: SobreReembolsoService,
        private contratoViewComponent: ContratoViewComponent,
        private authService: AuthService,
        public constantesSobres: ConstantesSobres
    ) {

        super(TabPanelControl.TAB_SOBRES);

        this.sobresReembolso = [];
        this.sobreReembolsoSelected = new SobreEntity();
        this.detalleSobreSelected = new DetalleSobreEntity();


        this.seguimientosSobre = [];
        this.historia = [];
        this.historialSobre = [];


        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {

                    this.contratoKey = contratoKey;
                    this.cargarDatos();
                }
            }
        );
    }

    pageChanged(): void {
        this.loadSobresReembolso();
    }

    cargarDatos(): void {
        if (this.contratoKey != undefined) {
            if (this.contratoKey.NewKey) {
                this.loaded = false;
                this.sobresReembolso = [];
                this.sobreReembolsoSelected = new SobreEntity();
            }

            if (this.isActive(this.contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadSobresReembolso();
                }
            }
        } else {
            this.sobresReembolso = [];
            this.sobreReembolsoSelected = new SobreEntity();
        }
    }

    loadSobresReembolso(): void {
        console.log(this.sobresReembolso);
        console.log("Hola2");
        this.detalles = new DetalleSobreEntity();
        this.detallesSobres = [];
        if (this.contratoKey != undefined) {
            var filter = this.createSobreReembolsoFilter(this.contratoKey.NumeroContrato, this.contratoKey.CodigoRegion, this.contratoKey.CodigoProducto);
            this.sobreReembolsoService.getSobresByFiltersPaginated(filter, 5).subscribe(
                result => {
                    this.sobresReembolso = result;
                    if (this.sobresReembolso != undefined && this.sobresReembolso.length > 0) {
                        if (this.contratoKey.NumeroSobre == null) {
                            this.seleccionar(this.sobresReembolso[0]);
                        }
                        else {
                            var positionSobre = 0;
                            for (var i = 0; i < this.sobresReembolso.length; i++) {
                                if (this.sobresReembolso[i].NumeroSobre == this.contratoKey.NumeroSobre) {
                                    positionSobre = i;
                                }
                            }
                            this.seleccionar(this.sobresReembolso[positionSobre]);
                        }
                        this.loaded = true;
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.sobresReembolso = [];
            this.sobreReembolsoSelected = new SobreEntity();
        }

    }

    loadSeguimientosSobre(): void {

        this.sobreReembolsoService.getSeguimientosSobresByNumeroSobrePaginated(this.sobreReembolsoSelected.NumeroSobre).subscribe(
            result => {
                this.historialSobre = [];
                this.historia = result;
                this.historia.forEach(element => {
                    element.Sobre.FechaModificacion = element.FechaModificacion;
                    element.Sobre.HoraModificacion = element.HoraModificacion;
                    element.Sobre.Accion = element.Accion;
                    element.Sobre.UsuarioModificacion = element.UsuarioModificacion;
                    this.historialSobre.push(element.Sobre);

                });

            },
            error => this.authService.showErrorPopup(error));
    }

    seleccionar(sobreReembolso: SobreEntity): void {
        if (this.sobresReembolso != undefined) {
            this.sobresReembolso.forEach(element => {
                element.Selected = false;
            });
        }
        sobreReembolso.Selected = true;
        this.sobreReembolsoSelected = sobreReembolso;
        this.loadSeguimientosSobre();
    }

    createSobreReembolsoFilter(numeroContrato: number, codigoRegion, codigoProducto, numeroSobre?: string): SobreFilter {
        var filter = new SobreFilter();
        filter.NumeroContrato = numeroContrato;
        filter.CodigoRegion = codigoRegion;
        filter.CodigoProducto = codigoProducto;
        filter.NumeroSobre = numeroSobre;
        return filter;
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
    abrirModalDetalles(sobre: SobreEntity) {
        if (sobre.DetalleSobre.length == 0) {
            this.authService.showInfoPopup("Este sobre no posee detalles");
        }
        else {
            this.detallesSobres = sobre.DetalleSobre;
            this.detalleSobreSelected = new DetalleSobreEntity();
            var listaDetalles = [];
            listaDetalles = sobre.DetalleSobre;
            if (listaDetalles.length != 0) {
                this.detalleSobreSelected = listaDetalles[0];
            }
            $("#ModalDetalles").modal();
        }
    }

    cambiarBeneficiario(index: number) {
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.detalleSobreSelected = this.detallesSobres[index];
    }
    //historial

    cerrarModal(modal: string) {
        $('#' + modal).modal('hide');

    }

}
