import { Component, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../seguridad/auth.service';

import { RegionService } from '../../../common/servicios/region.service';
import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { ReporteSobreReembolsoService } from '../../service/reporteSobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../service/catalogoSobreReembolso.service';

import { Catalogo } from '../../../common/model/catalogo';
import { Region } from '../../../common/model/region';
import { SobreFilter } from '../../model/SobreFilter';
import { SobreEntity } from '../../model/SobreEntity';
import { ConsultorEntity } from '../../model/ConsultorEntity';
import { ConstantesSobres } from '../../utils/constantesSobres';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    providers: [ReporteSobreReembolsoService],
    templateUrl: 'reporteSobres.form.template.html'
})

export class ReportarSobreFormComponent {

    sobreFilter: SobreFilter;
    listadoSobres: SobreEntity[];
    consultores: ConsultorEntity[];
    estados: Catalogo[];
    regiones: Region[];
    listaEstados: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, private regionService: RegionService,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, public reporteSobreReembolsoService: ReporteSobreReembolsoService,
        public constantesSobres: ConstantesSobres) {

        this.setear();
        this.loadConsultores();
        this.loadRegiones();
    }

    setear() {
        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.consultores = [];
        this.sobreFilter.Estados = [];
        this.estados = [];
        this.listaEstados = undefined;
        this.sobreReembolsoService.resetDefaultPaginationConstanst();
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
                error => this.authService.showErrorPopup(error));
    }

    loadConsultores() {
        this.catalogoSobreReembolsoService.obtenerConsultores().subscribe(
            result => {
                this.consultores = result;
                this.loadDatos();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadDatos() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE).subscribe(
            result => {
                this.estados = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadSobres() {
        this.sobreFilter.TipoDocumento = this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE;
        this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, 20).subscribe(
            result => {
                this.listadoSobres = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    pageChanged(): void {
        this.loadSobres();
    }

    limpiar() {
        this.sobreFilter = new SobreFilter();
        this.sobreFilter.Estados = [];
        this.listaEstados = undefined;
        this.estados.forEach(element => {
            element.Selected = false;
        });
    }

    abrirModalEstados() {
        $("#estadosViewModal").modal();
    }

    seleccionarEstado(estado: Catalogo) {
        if (estado.Selected) {
            estado.Selected = false;

            this.sobreFilter.Estados = [];
            this.listaEstados = undefined;

            this.estados.forEach(element => {
                if (element.Selected) {
                    this.sobreFilter.Estados.push(element.Id);
                    if (this.listaEstados != undefined)
                        this.listaEstados = this.listaEstados + ", " + element.Valor;
                    else
                        this.listaEstados = element.Valor;
                }
            });
        }
        else {
            estado.Selected = true;
            this.sobreFilter.Estados.push(estado.Id);
            if (this.listaEstados != undefined)
                this.listaEstados = this.listaEstados + ", " + estado.Valor;
            else
                this.listaEstados = estado.Valor;
        }
    }

    generarReporte(): void {
        this.sobreFilter.TipoDocumento = this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE;
        this.reporteSobreReembolsoService.generarReporteSobres(this.sobreFilter).subscribe(
            result => {
                this.authService.showSuccessPopup(result);
            },
            error => this.authService.showBlobErrorPopup(error)
        );
    }
}