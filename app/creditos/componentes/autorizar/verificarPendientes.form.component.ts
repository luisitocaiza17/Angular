import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../seguridad/auth.service';

import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { ContratoKey } from '../../../common/model/contrato';
import { SobreFilter } from '../../../sobres/model/SobreFilter';
import { ConsultorEntity } from '../../../sobres/model/ConsultorEntity';
import { Catalogo } from '../../../common/model/catalogo';
import { SobreEntity } from '../../../sobres/model/SobreEntity';
import { SobreReembolsoService } from '../../../sobres/service/sobreReembolso.service';
import { ConstantesCreditos } from '../../utils/ConstantesCreditos';
import { CatalogoSobreReembolsoService } from '../../../sobres/service/catalogoSobreReembolso.service';

@Component({
    selector: 'verificarCreditoPendiente',
    providers: [],
    templateUrl: 'verificarPendientes.form.template.html'
})

export class VerificarPendientesCreditoFormComponent {

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
        public sobreReembolsoService: SobreReembolsoService, public constantesSobres: ConstantesCreditos,
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
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesSobres.ID_TIPO_DOCUMENTO_CREDITO).subscribe(
            result => {
                this.todosEstados = result;
                this.listaEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    listaEstados() {
        this.todosEstados.forEach(element => {
            if (element.Id == this.constantesSobres.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR ||  element.Id == this.constantesSobres.CODIGO_ESTADO_CREDITO_LIQUIDADO) {
                this.estados.push(element);
            }
        });
        this.loadSobres();
    }

    loadSobres() {
        this.sobreFilter.OrdenarPorFechaDigitacion = true;
        this.sobreFilter.Estados = [];
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_CREDITO_EN_AUDITORIA);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_CREDITO_CODIFICADO);
        this.sobreFilter.TipoDocumento = this.constantesSobres.ID_TIPO_DOCUMENTO_CREDITO;
        


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