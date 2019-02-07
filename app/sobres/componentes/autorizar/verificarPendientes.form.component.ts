import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../seguridad/auth.service';

import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../service/catalogoSobreReembolso.service';

import { ContratoKey } from '../../../common/model/contrato';
import { Catalogo } from '../../../common/model/catalogo';
import { SobreFilter } from '../../model/SobreFilter';
import { ConsultorEntity } from '../../model/ConsultorEntity';
import { SobreEntity } from '../../model/SobreEntity';

import { ConstantesSobres } from '../../utils/constantesSobres';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';

@Component({
    selector: 'verificarSobresPendientes',
    providers: [],
    templateUrl: 'verificarPendientes.form.template.html'
})

export class VerificarPendientesSobresFormComponent {

    _contratoKey: ContratoKey;
    sobreFilter: SobreFilter;

    consultores: ConsultorEntity[];
    estados: Catalogo[];
    listadoSobres: SobreEntity[];
    todosEstados: Catalogo[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService,
        public sobreReembolsoService: SobreReembolsoService, public constantesSobres: ConstantesSobres,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, public genericas: utilidadesGenericasService,
    ) {

        this.setear();
        this.loadConsultores();
    }

    setear() {
        this._contratoKey = new ContratoKey();
        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.consultores = [];
        this.estados = [];
        this.todosEstados = [];
        this.sobreFilter.FechaAsignacion = new Date();

        this.sobreReembolsoService.resetDefaultPaginationConstanst();
    }

    loadConsultores() {
        this.catalogoSobreReembolsoService.obtenerConsultores().subscribe(
            result => {
                this.consultores = result;
                this.loadEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadEstados() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE).subscribe(
            result => {
                this.todosEstados = result;
                this.listaEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    listaEstados() {
        this.todosEstados.forEach(element => {
            if (element.Id == this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO || element.Id == this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO || element.Id == this.constantesSobres.CODIGO_ESTADO_SOBRE_EN_PROCESO || element.Id == this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO) {
                this.estados.push(element);
            }
        });
        this.loadSobres();
    }

    loadSobres() {
        this.sobreFilter.OrdenarPorFechaDigitacion = true;
        this.sobreFilter.Estados = [];
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_EN_PROCESO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_CODIFICADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_MORA);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_DEP_AUDITORIA_MEDICA);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_PENDIENTE);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_AUDITORIA_MEDICA_RF);
        this.sobreFilter.TipoDocumento = this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE;

        this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, 20).subscribe(
            result => {
                this.listadoSobres = result;
                this.listadoSobres.forEach(element => {
                    element.DiasDesdeDigitacion = this.genericas.getNumberOfDays(new Date(element.FechaDigitacion), new Date());

                    if (element.DiasDesdeDigitacion >= 3)
                        element.PendientesUrgente = true;
                });
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    limpiar() {
        this.sobreFilter = new SobreFilter();
        this.sobreFilter.FechaAsignacion = new Date();
    }

    pageChanged(): void {
        this.loadSobres();
    }
}