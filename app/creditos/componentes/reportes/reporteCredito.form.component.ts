import { Component, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../seguridad/auth.service';

import { RegionService } from '../../../common/servicios/region.service';
import { Catalogo } from '../../../common/model/catalogo';
import { Region } from '../../../common/model/region';
import { ReporteSobreReembolsoService } from '../../../sobres/service/reporteSobreReembolso.service';
import { SobreReembolsoService } from '../../../sobres/service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../sobres/service/catalogoSobreReembolso.service';
import { SobreFilter } from '../../../sobres/model/SobreFilter';
import { SobreEntity } from '../../../sobres/model/SobreEntity';
import { ConsultorEntity } from '../../../sobres/model/ConsultorEntity';
import { ConstantesCreditos } from '../../utils/ConstantesCreditos';
import { ConvenioService } from '../../../common/servicios/convenio.service';
import { ConvenioFilter, Convenio } from '../../../common/model/convenio';

@Component({
    providers: [ReporteSobreReembolsoService,ConvenioService],
    templateUrl: 'reporteCredito.form.template.html'
})

export class ReportarCreditoFormComponent {

    sobreFilter: SobreFilter;
    listadoSobres: SobreEntity[];
    consultores: ConsultorEntity[];
    estados: Catalogo[];
    regiones: Region[];
    listaEstados: string;
    convenios: Convenio[];
    conveniosOriginales: Convenio[];
    
    popupTitle: string;


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, private regionService: RegionService, private constantesCreditos: ConstantesCreditos,private convenioService: ConvenioService,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, public reporteSobreReembolsoService: ReporteSobreReembolsoService) {

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
        this.catalogoSobreReembolsoService.obtenerAuditoresLiquidadoresCredito().subscribe(
            result => {
                this.consultores = result;
                this.loadDatos();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadDatos() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO).subscribe(
            result => {
                this.estados = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadSobres() {
        this.sobreFilter.TipoDocumento = this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO;
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
        this.sobreFilter.TipoDocumento = this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO;
        this.reporteSobreReembolsoService.generarReporteSobres(this.sobreFilter).subscribe(
            result => {
                this.authService.showSuccessPopup(result);
            },
            error => this.authService.showBlobErrorPopup(error)
        );
    }
    seleccionarConvenio(convenioSeleccionado: Convenio): void {

        this.sobreFilter.Clinica = convenioSeleccionado.Nombre;
        this.sobreFilter.idClinica = convenioSeleccionado.Numero;
        jQuery("#prestadorViewModal").modal("hide");
    }


    listarConvenios() {
        var filtro = new ConvenioFilter();
        filtro.Nombre = "*"+this.sobreFilter.Clinica+"*";
        this.convenioService.getMedicosForAutorizacionByFilter(filtro).subscribe(
            convenios => {
                this.convenios = convenios;
                this.conveniosOriginales = convenios;
                this.pintarConvenio();
            },
            error => this.authService.showErrorPopup(error));
    }

    pintarConvenio() {
        //selecciona el prestador o medico escogido anteriormente
        if (this.convenios != undefined && this.sobreFilter.Clinica != undefined) {

            this.convenios.forEach(element => {
                if (element.Numero == this.sobreFilter.idClinica)
                    element.Selected = true;
                else
                    element.Selected = false;
            });
        }
    }

}