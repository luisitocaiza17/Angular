import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { BeneficiarioList, Beneficiario, BeneficiarioKey, BeneficiarioPrecios } from '../../common/model/beneficiario';
import { ExclusionEntityList, ExclusionFilter } from '../../common/model/exclusion';
import { Diagnostico } from '../../common/model/diagnostico';

import { BeneficiarioService } from '../../common/servicios/beneficiario.service';
import { ExclusionesService } from '../../common/servicios/exclusiones.service';
import { DiagnosticoService } from '../../common/servicios/diagnostico.service';
import { Catalogo } from '../../common/model/catalogo';


@Component({
    selector: 'ingresoPreexistencias',
    providers: [BeneficiarioService, ExclusionesService],
    templateUrl: 'ingresoPreexistencias.form.template.html'
})

export class IngresoPreexistenciasFormComponent {

    suscription: any;
    beneficiarioKey: BeneficiarioKey;
    beneficiarios: Beneficiario[];
    benficiariosSelected: Beneficiario;
    precioAntiguo: number;
    _contratoKey: ContratoKey;
    exclusiones: ExclusionEntityList[];
    _filter: ExclusionFilter;
    diagnostico: ExclusionEntityList;
    diagnosticos: Diagnostico[];
    diagnosticosOriginales: Diagnostico[];
    msgValidacionDiagnostico: string;
    enfermedades: Catalogo[];


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public beneficiarioService: BeneficiarioService, private contratosTxListComponent: ContratosTxListComponent,
        public exclusionesService: ExclusionesService, private diagnosticoService: DiagnosticoService) {

        this._contratoKey = new ContratoKey();
        this.beneficiarioKey = new BeneficiarioKey();
        this.beneficiarios = [];
        this.exclusiones = [];
        this.benficiariosSelected = new Beneficiario();
        this.diagnostico = new ExclusionEntityList();
        this.diagnostico.CabeceraDiagnostico = " ";
        this.diagnosticos = [];
        this.diagnosticosOriginales = [];
        this.enfermedades = [];

        this.suscription = this.contratosTxListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this._contratoKey = contratoKey;
                    this.loadEnfermedades();
                } else {
                    this._contratoKey = new ContratoKey();
                }
            }
        );
    }


    loadBeneficiarios(): void {
        if (this._contratoKey.EsMoroso == true) {
            this.authService.showInfoPopup("Imposible Realizar esta Modificación, Contrato Moroso");
        }
        else {
            this.beneficiarioKey.NumeroContrato = this._contratoKey.NumeroContrato;
            this.beneficiarioKey.CodigoRegion = this._contratoKey.CodigoRegion;
            this.beneficiarioKey.CodigoProducto = this._contratoKey.CodigoProducto;
            this.beneficiarioService.getBeneficiariosForPrecios(this.beneficiarioKey).subscribe(
                result => {
                    this.beneficiarios = result;
                    if (this.beneficiarios != undefined && this.beneficiarios.length > 0) {
                        this.seleccionar(this.beneficiarios[0]);
                    }

                },
                error => this.authService.showErrorPopup(error));
        }
    }

    loadEnfermedades(): void {
        this.enfermedades = [];
        this.diagnosticoService.getenfermedades().subscribe(
            result => {
                this.enfermedades = result;
                this.loadBeneficiarios();
            },
            error => {
                this.authService.showErrorPopup(error);
            }
        )

    }

    pageChanged(): void {
        this.loadExclusionList();
    }

    loadExclusionList(): void {
        this._filter = new ExclusionFilter();
        this._filter.CodigoProducto = this._contratoKey.CodigoProducto;
        this._filter.CodigoRegion = this._contratoKey.CodigoRegion;
        this._filter.NumeroContrato = this._contratoKey.NumeroContrato;
        this._filter.NumeroPersona = this.benficiariosSelected.NumeroPersona;

        if (this._filter.CodigoProducto != undefined && this._filter.CodigoRegion != undefined
            && this._filter.NumeroContrato != undefined && this._filter.NumeroPersona != undefined) {
            this.exclusionesService.getExclusionListByFilter(this._filter).subscribe(
                exclusiones => {
                    this.exclusiones = exclusiones;
                    if (this.exclusiones != undefined && this.exclusiones.length > 0) {
                        this.seleccionarExclusion(this.exclusiones[0]);
                    }
                },
                error => {
                    this.authService.showErrorPopup(error)
                });
        }
        else {
            this.exclusiones = [];
        }
    }

    seleccionar(ben: Beneficiario): void {
        this.limpiar();
        if (this.beneficiarios != undefined) {
            this.beneficiarios.forEach(element => {
                element.Selected = false;
            });
        }
        ben.Selected = true;
        this.benficiariosSelected = ben;
        this.loadExclusionList();
    }



    seleccionarExclusion(exclu: ExclusionEntityList): void {
        this.limpiarExclusion();
        if (this.exclusiones != undefined) {
            this.exclusiones.forEach(element => {
                element.Selected = false;
            });
        }
        exclu.Selected = true;
        this.diagnostico = exclu;
        this.diagnostico.FechaUltimaDeclaracionDate = this.authService.transformarFecha(this.diagnostico.FechaUltimaDeclaracion);
        this.diagnostico.FechaInicioDate = new Date(this.diagnostico.FechaInicioDate);
        if (this.diagnostico.FechaFinDate != undefined) {
            this.diagnostico.FechaFinDate = new Date(this.diagnostico.FechaFinDate);
        }
    }

    limpiar(): void {
        this.benficiariosSelected = new Beneficiario();
    }

    limpiarExclusion(): void {
        this.diagnostico = new ExclusionEntityList();
    }



    listarDiagnosticos() {
        this.diagnosticos = [];
        this.diagnosticosOriginales = [];
        this.diagnosticoService.getAllByIniciales(this.diagnostico.Diagnostico).subscribe(
            diagnosticos => {
                this.diagnosticos = diagnosticos;
                this.diagnosticosOriginales = diagnosticos;
                console.log(this.diagnosticos)
            },
            error => this.authService.showErrorPopup(error));
    }

    filtrarDiagnostico(searchValue: string) {
        if (this.diagnosticos != undefined && this.diagnosticos.length > 0) {
            var a = this.diagnosticosOriginales.filter(item => item.Diagnostico.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.diagnosticos = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.diagnosticos = this.diagnosticosOriginales;
        }
    }

    seleccionarDiagnostico(diagnosticoSeleccionado: Diagnostico): void {
        this.diagnostico.Diagnostico = diagnosticoSeleccionado.Diagnostico;
        this.diagnostico.CabeceraDiagnostico = diagnosticoSeleccionado.CabeceraDiagnostico;
        this.diagnostico.CodigoDiagnostico = diagnosticoSeleccionado.CodigoDiagnostico;
        this.diagnostico.EsCongenito = diagnosticoSeleccionado.EsCongenito;
        jQuery("#diagnosticoViewModal").modal("hide");
    }

    Nuevo(): void {
        this.limpiarExclusion();
        this.diagnostico.FechaInicioDate = this.authService.transformarFecha(this.benficiariosSelected.FechaInclusion);
        this.diagnostico.FechaFinDate = this.authService.transformarFecha(this.benficiariosSelected.FechaExclusion);
        this.diagnostico.FechaUltimaDeclaracionDate = new Date();
        this.diagnostico.CodigoTipoEnf = 1;
        this.diagnostico.PorcentajeDiscapacidad = 0;
        this.diagnostico.DiasCarenciaDiagnostico = 365;
    }

    Grabar(): void {
        var pasar = 0;
        this.msgValidacionDiagnostico = undefined;
        if (this.diagnostico.Diagnostico == undefined || this.diagnostico.CabeceraDiagnostico == undefined) {
            this.msgValidacionDiagnostico = "El diagnóstico no puede quedar vacío";
            pasar = 1;
        }

        if (pasar == 0) {

            this.diagnostico.CodigoProducto = this._contratoKey.CodigoProducto;
            this.diagnostico.CodigoRegion = this._contratoKey.CodigoRegion;
            this.diagnostico.ContratoNumero = this._contratoKey.NumeroContrato;
            this.diagnostico.PersonaNumero = this.benficiariosSelected.NumeroPersona;
            this.diagnostico.NumeroEmpresa = this._contratoKey.NumeroEmpresa;
            this.diagnostico.NumeroSucursal = this._contratoKey.NumeroSucursal;
            this.diagnostico.CodigoContrato = this._contratoKey.CodigoContrato;

            this.diagnosticoService.insertPreexistencia(this.diagnostico).subscribe(
                result => {
                    this.authService.showSuccessPopup("Finalizado Correctamente")
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    GrabarCoberturaEspecial(): void {
        this.diagnostico.CodigoProducto = this._contratoKey.CodigoProducto;
        this.diagnostico.CodigoRegion = this._contratoKey.CodigoRegion;
        this.diagnostico.ContratoNumero = this._contratoKey.NumeroContrato;
        this.diagnostico.PersonaNumero = this.benficiariosSelected.NumeroPersona;
        this.diagnostico.NumeroEmpresa = this._contratoKey.NumeroEmpresa;
        this.diagnostico.NumeroSucursal = this._contratoKey.NumeroSucursal;
        this.diagnostico.CodigoContrato = this._contratoKey.CodigoContrato;

        this.diagnosticoService.insertCoberturaEspecialDiagnostico(this.diagnostico).subscribe(
            result => {
                this.authService.showSuccessPopup("Finalizado Correctamente")
            },
            error => this.authService.showErrorPopup(error));

    }
}
