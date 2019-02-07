import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from '../../seguridad/auth.service';
import { PlanService } from '../../common/servicios/plan.service';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';

import { ExclusionFilter } from '../../common/model/exclusion';
import { Autorizacion, AutorizacionKey, AutorizacionFilter } from '../../common/model/autorizacion';
import { Beneficiario, BeneficiarioKey } from '../../common/model/beneficiario';

@Component({
    selector: 'encabezadoAutorizacionForm',
    providers: [BeneficiarioService],
    templateUrl: 'encabezado.form.template.html'
})

export class EncabezadoFormComponent {

    exclusionFilter: ExclusionFilter;
    autorizacionFilter: AutorizacionFilter;

    msgCambioPlan: string;

    _showSelectBeneficiario?: boolean = null;
    @Input()
    set showSelectBeneficiario(showSelectBeneficiarios: boolean) {
        this._showSelectBeneficiario = showSelectBeneficiarios;
        this.loadBeneficiarios();
    }

    get showSelectBeneficiario() {
        return this._showSelectBeneficiario;
    }

    _autorizacion: Autorizacion;
    beneficiarios: Beneficiario[];

    @Input()
    set autorizacion(autorizacionObj: Autorizacion) {
        this._autorizacion = autorizacionObj;
        this.loadBeneficiarios();
        this.validarCambioPlan();
    }

    get autorizacion() {
        return this._autorizacion;
    }

    constructor(public beneficiarioService: BeneficiarioService, private authService: AuthService,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef,
        private planService: PlanService) {
        this.showSelectBeneficiario = null;
        this._autorizacion = new Autorizacion();
        this.exclusionFilter = undefined;
        this.autorizacionFilter = undefined;
    }

    ngOnInit(): void {
        this.beneficiarios = [];
    }

    loadBeneficiarios() {
        if (this._autorizacion != undefined && this.showSelectBeneficiario
            && (this._autorizacion.Id == undefined || this._autorizacion.Id == 0)) {
            var beneficiarioFilter = this.createBeneficiarioFilter();
            if (beneficiarioFilter != null) {
                this.beneficiarioService.getBeneficiarioAutorizacion(beneficiarioFilter).subscribe(
                    beneficiarios => {
                        this.beneficiarios = beneficiarios;
                    },
                    error => this.authService.showErrorPopup(error));
            }
        }
    }

    validarCambioPlan(): void {
        if (this._autorizacion.CodigoContrato != undefined && this._autorizacion.CodigoPlan != undefined) {
            this.planService.getPlanAnteriorContrato(this._autorizacion.CodigoContrato, this._autorizacion.CodigoPlan).subscribe(
                result => {
                    if (result != undefined)
                        this.msgCambioPlan = "Plan Anterior: " + result.CodigoPlan + "-" + result.NombrePlan + ", Versión: " + result.CodigoVersion
                            + ", Fecha Inicio: " + result.FechaInicio + ", Fecha Fin: " + result.FechaFin;
                    else
                        this.msgCambioPlan = "No Existe Cambio de Plan";
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    createBeneficiarioFilter(): BeneficiarioKey {
        if (this._autorizacion.CodigoContrato != undefined && this._autorizacion.CodigoProducto != undefined) {
            var beneficiarioFilter = new BeneficiarioKey();
            beneficiarioFilter.CodigoContrato = this._autorizacion.CodigoContrato;
            beneficiarioFilter.CodigoProducto = this._autorizacion.CodigoProducto;
            beneficiarioFilter.Transicion = this._autorizacion.Transicion;
            return beneficiarioFilter;
        }
        return null;
    }

    onChangeSelection(numeroPersona: number) {
        if (numeroPersona != undefined) {
            var beneficiario = this.beneficiarios.find(b => b.NumeroPersona == numeroPersona);
            this._autorizacion.NombreBeneficiario = beneficiario.NombreCompleto;
            this._autorizacion.CedulaBeneficiario = beneficiario.NumeroCedula;
            this._autorizacion.EstadoPersona = beneficiario.Estado;
            this._autorizacion.GeneroPersona = beneficiario.Genero;
            this._autorizacion.CupoPersona = beneficiario.CupoBeneficiario;
            this._autorizacion.NumeroHistoriaPersona = beneficiario.NumeroHistoria;
            this._autorizacion.EdadPersona = beneficiario.Edad;
            this._autorizacion.CantidadExclusiones = beneficiario.CantidadExclusiones;
            this._autorizacion.CantidadAutorizaciones = beneficiario.CantidadAutorizaciones;
            this._autorizacion.FechaExclusionPersona = beneficiario.FechaExclusionPersona;
            this._autorizacion.Nombre = beneficiario.PrimerNombre;
            this._autorizacion.Apellido = beneficiario.PrimerApellido;
            if (beneficiario.NumeroHistoria > 0) {
                this.autorizacion.ObservacionHistoriaClinica = "Historia Clínica: " + beneficiario.NumeroHistoria;
            }
            else {
                this.autorizacion.ObservacionHistoriaClinica = "";
            }
        } else {
            this._autorizacion.NombreBeneficiario = null;
            this._autorizacion.CedulaBeneficiario = null;
            this._autorizacion.EstadoPersona = null;
            this._autorizacion.GeneroPersona = null;
            this._autorizacion.CupoPersona = null;
            this._autorizacion.NumeroHistoriaPersona = null;
            this._autorizacion.EdadPersona = null;
            this.autorizacion.ObservacionHistoriaClinica = null;
            this._autorizacion.CantidadExclusiones = 0;
            this._autorizacion.CantidadAutorizaciones = 0;
            this._autorizacion.FechaExclusionPersona = null;
        }
    }

    createExclusionesFilter(): void {
        this.exclusionFilter = new ExclusionFilter();
        this.exclusionFilter.NumeroContrato = this._autorizacion.ContratoNumero;
        this.exclusionFilter.CodigoProducto = this._autorizacion.CodigoProducto;
        this.exclusionFilter.CodigoRegion = this._autorizacion.Region;
        this.exclusionFilter.NumeroPersona = this._autorizacion.PersonaNumero;
    }

    createAutorizacionesFilter(): void {
        this.autorizacionFilter = new AutorizacionFilter();
        this.autorizacionFilter.CodigoContrato = this._autorizacion.CodigoContrato;
        this.autorizacionFilter.NumeroPersona = this._autorizacion.PersonaNumero;
    }
}