import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { BeneficiarioList, Beneficiario } from '../../common/model/beneficiario';
import { PlanFilter } from '../../common/model/plan';
import { CoberturaPlan } from '../../common/model/coberturaPlan';
import { TransaccionQuitarCarencias } from '../../common/model/transacciones';
import { CoberturaCarencia, Carencia, CarenciaFilter } from '../../common/model/carencia';

import { TransaccionService } from '../../common/servicios/transaccion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { CoberturaPlanService } from '../../common/servicios/coberturaPlan.service';
import { CarenciaService } from '../../common/servicios/carencia.service';


@Component({
    selector: 'quitarCarencias',
    providers: [TransaccionService],
    templateUrl: 'quitarCarencias.form.template.html'
})

export class QuitarCarenciasFormComponent {

    suscription: any;
    benficiarios: BeneficiarioList[];
    coberturas: CoberturaPlan[];
    coberturasSeleccionadas: CoberturaPlan[];
    coberturaSelected: CoberturaPlan;
    benficiariosSelected: BeneficiarioList;
    transaccion: TransaccionQuitarCarencias;
    listadoCarenciaBeneficiario: Carencia[];
    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {

        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined)
            this.loadBenficiarios();
        else {
            this._contratoKey = new ContratoKey();
            this.benficiariosSelected = new BeneficiarioList();
            this.coberturas = [];
            this.coberturasSeleccionadas = [];
            this.listadoCarenciaBeneficiario = [];
            this.transaccion = new TransaccionQuitarCarencias();
            this.coberturaSelected = new CoberturaPlan();
        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public planService: PlanService, private coberturaPlanService: CoberturaPlanService, public transaccionService: TransaccionService,
        public carenciaService: CarenciaService) {
        this._contratoKey = new ContratoKey();
        this.benficiariosSelected = new BeneficiarioList();
        this.coberturas = [];
        this.coberturasSeleccionadas = [];
        this.listadoCarenciaBeneficiario = [];
        this.transaccion = new TransaccionQuitarCarencias();
        this.coberturaSelected = new CoberturaPlan();
    }

    loadBenficiarios() {
        this.transaccionService.getTableBenficiarios(this._contratoKey).subscribe(
            result => {
                this.benficiarios = result;
                if (this.benficiarios != undefined && this.benficiarios.length > 0) {
                    this.benficiarios.forEach(element => {
                        if (element.Titular == false) {
                            element.DescripcionTitular = "NO"
                        }
                        else {
                            element.DescripcionTitular = "SI"
                        }
                    });
                    this.seleccionar(this.benficiarios[0]);
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    loadCoberturas(): void {
        if (this.benficiariosSelected != undefined) {

            this.benficiariosSelected.CodigoPlan = this._contratoKey.CodigoPlan;
            this.benficiariosSelected.VersionPlan = this._contratoKey.VersionPlan;
            var planFilter = new PlanFilter();
            planFilter.CodigoContrato = this.benficiariosSelected.CodigoContrato;
            planFilter.NumeroPersona = this.benficiariosSelected.NumeroPersona;
            planFilter.CodigoProducto = this.benficiariosSelected.CodigoProducto;
            planFilter.Region = this.benficiariosSelected.Region;
            planFilter.CodigoPlan = this._contratoKey.CodigoPlan;
            planFilter.Version = this._contratoKey.VersionPlan;
            planFilter.Transicion = this._contratoKey.Transicion;
            planFilter.NumeroContrato = this._contratoKey.NumeroContrato;
            planFilter.Region = this._contratoKey.CodigoRegion;

            this.coberturaPlanService.getCoberturasByPlanPersonaFilter(planFilter).subscribe(
                result => {
                    this.coberturas = result;
                    if (this.coberturas.length != 0 && this.coberturas != undefined) {
                        this.coberturas.forEach(element => {
                            element.DiasCarenciaAmbulatoriaAux = element.DiasCarenciaAmbulatoria;
                            element.DiasCarenciaHospitalariaAux = element.DiasCarenciaHospitalaria;
                        });
                    }
                },
                error => this.authService.showErrorPopup(error));
        } else {
            this.coberturas = [];
        }
    }

    loadCarenciasBeneficiario() {

        this.listadoCarenciaBeneficiario = [];

        var filtroCarencia = new CarenciaFilter();
        filtroCarencia.CodigoContrato = this._contratoKey.CodigoContrato;
        filtroCarencia.PersonaNumero = this.benficiariosSelected.NumeroPersona;

        this.carenciaService.getByFiltersPaginated(filtroCarencia).subscribe(
            result => {
                this.listadoCarenciaBeneficiario = result;
                if (this.listadoCarenciaBeneficiario.length != 0 && this.listadoCarenciaBeneficiario != undefined) {
                    this.listadoCarenciaBeneficiario.forEach(element => {
                        if (element.Estado == undefined) {
                            element.NombreEstado = "No tiene Registro";
                        }
                        else {
                            if (element.Estado == true) {
                                element.NombreEstado = "Activa";
                            }
                            else {
                                element.NombreEstado = "Anulada";
                            }
                        }

                    });
                    $("#modalCarencias").modal();
                }
                else {
                    this.authService.showInfoPopup("El beneficiario no tiene carencias")
                }

            },
            error => this.authService.showErrorPopup(error));

    }

    seleccionar(benficiarios: BeneficiarioList): void {
        if (this.benficiarios != undefined) {
            this.benficiarios.forEach(element => {
                element.Selected = false;
            });
        }
        benficiarios.Selected = true;
        this.benficiariosSelected = benficiarios;
        this.loadCoberturas();
    }

    seleccionarCobertura(cobertura: CoberturaPlan): void {
        if (cobertura.Selected == true) {
            cobertura.Selected = false;
            this.coberturas.forEach(element => {
                if (element.CodigoCobertura == cobertura.CodigoCobertura) {
                    element.Selected = false;
                }
            })
        }
        else {
            cobertura.Selected = true;
            this.coberturas.forEach(element => {
                if (element.CodigoCobertura == cobertura.CodigoCobertura) {
                    element.Selected = true;
                }
            })
        }

        this.coberturasSeleccionadas = [];

        this.coberturas.forEach(element => {
            if (element.Selected == true)
                this.coberturasSeleccionadas.push(element)
        });
    }

    seleccionarTodos() {
        this.coberturasSeleccionadas = [];

        this.coberturas.forEach(element => {
            element.Selected = true;
            this.coberturasSeleccionadas.push(element)
        });

    }


    dias(cobertura: CoberturaPlan) {
        cobertura.DiasCarenciaPreexistencia = 0;

        this.coberturaSelected = cobertura;
        $("#modalDias").modal();

        cobertura.Selected = true;
        this.seleccionarCobertura(cobertura);
    }

    salir() {
        this.coberturas.forEach(element => {
            if (element.CodigoCobertura == this.coberturaSelected.CodigoCobertura) {
                element.DiasCarenciaAmbulatoria = this.coberturaSelected.DiasCarenciaAmbulatoria;
                element.DiasCarenciaHospitalaria = this.coberturaSelected.DiasCarenciaHospitalaria;
            }
        });
        $('#modalDias').modal('hide');
    }

    guardar(): void {
        if (this.validar()) {
            this.transaccionService.quitarCarencias(this.transaccion).subscribe(
                result => {
                    if (result.EstadoTransaccion) {
                        this.authService.showSuccessPopup(result.Mensaje);
                        this.loadCoberturas();
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error");
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    actualizarCarencia() {
        if (this.validar()) {
            if (this.verificarCobertura()) {
                if (this.verificarCoberturaEstado(false)) {

                    this.transaccionService.actualizarCarencias(this.transaccion).subscribe(
                        result => {
                            if (result.EstadoTransaccion) {
                                this.authService.showSuccessPopup(result.Mensaje);
                            }
                            else {
                                this.authService.showErrorPopup("Ha ocurrido un error");
                            }

                        },
                        error => this.authService.showErrorPopup(error));
                }
            }
        }
    }

    reactivarCarencia() {

        if (this.validar()) {
            if (this.verificarCobertura()) {
                if (this.verificarCoberturaEstado(true)) {

                    this.transaccionService.reactivarCarencias(this.transaccion).subscribe(
                        result => {
                            if (result.EstadoTransaccion) {
                                this.authService.showSuccessPopup(result.Mensaje);
                                this.loadCoberturas();
                            }
                            else {
                                this.authService.showErrorPopup("Ha ocurrido un error");
                            }

                        },
                        error => this.authService.showErrorPopup(error));
                }
            }
        }
    }

    validar(): boolean {
        this.transaccion = new TransaccionQuitarCarencias();
        this.transaccion.Region = this._contratoKey.CodigoRegion;
        this.transaccion.CodigoProducto = this._contratoKey.CodigoProducto;
        this.transaccion.ContratoNumero = this._contratoKey.NumeroContrato;
        this.transaccion.CodigoPlan = this._contratoKey.CodigoPlan;
        this.transaccion.VersionPlan = this._contratoKey.VersionPlan;
        this.transaccion.CodigoContrato = this._contratoKey.CodigoContrato;
        this.transaccion.NumeroPersona = this.benficiariosSelected.NumeroPersona;

        this.transaccion.CodigosCoberturas = [];
        this.coberturasSeleccionadas.forEach(element => {
            var cobertura = new CoberturaCarencia();

            cobertura.CodigoCobertura = element.CodigoCobertura;
            cobertura.DiasCarenciaAmbulatoria = element.DiasCarenciaAmbulatoria;
            cobertura.DiasCarenciaHospitalaria = element.DiasCarenciaHospitalaria;
            cobertura.DiasCarenciaPreexistencia = 0;
            this.transaccion.CodigosCoberturas.push(cobertura);
        });

        if (this.transaccion.CodigosCoberturas.length == 0) {
            this.authService.showErrorPopup("Seleccione al menos una cobertura");
            return false;
        }
        else {
            return true;
        }
    }

    verificarCobertura(): boolean {

        var mensaje = "No existe registro para la o las coberturas ";
        var estado = true;
        this.transaccion.CodigosCoberturas.forEach(element => {
            this.coberturas.forEach(coberura => {
                if (coberura.CodigoCobertura == element.CodigoCobertura && coberura.EstadoCar == undefined) {
                    mensaje = mensaje + " " + coberura.CodigoCobertura + ",";
                    estado = false;
                }
            });
        });

        if (estado == true) {
            return true;
        }
        else {
            this.authService.showErrorPopup(mensaje);
            return false;
        }

    }

    verificarCoberturaEstado(estadoCarencia: boolean): boolean {
        var mensaje = "La carencia para la o las coberturas "

        var estado = true;
        this.transaccion.CodigosCoberturas.forEach(element => {
            this.coberturas.forEach(coberura => {
                if (coberura.CodigoCobertura == element.CodigoCobertura && coberura.EstadoCar == estadoCarencia) {
                    mensaje = mensaje + " " + coberura.CodigoCobertura + ",";
                    estado = false;
                }
            });
        });

        if (estadoCarencia == false) {
            mensaje = mensaje + " Deben estar activas";
        }
        else {
            mensaje = mensaje + " Deben estar anuladas";
        }

        if (estado == true) {
            return true;
        }
        else {
            this.authService.showErrorPopup(mensaje);
            return false;
        }

    }

    pageChanged() {
        this.loadBenficiarios();
    }

    pageCarenciaChanged() {
        this.loadCarenciasBeneficiario();
    }

}