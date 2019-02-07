import { Component, Input, ElementRef } from '@angular/core';
import { DomSanitizer, } from '@angular/platform-browser'
import { AuthService } from '../../../../seguridad/auth.service';

import { ConsultorEntity } from '../../../model/ConsultorEntity';
import { SobreReembolsoService } from '../../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../service/catalogoSobreReembolso.service';

import { ContratoKey } from '../../../../common/model/contrato';
import { Catalogo } from '../../../../common/model/catalogo';
import { SobreFilter } from '../../../model/SobreFilter';
import { SobreEntity } from '../../../model/SobreEntity';
import { DetalleSobreEntity } from '../../../model/DetalleSobreEntity';
import { ConstantesSobres } from '../../../utils/constantesSobres';

@Component({
    selector: 'consultarSobre',
    providers: [],
    templateUrl: 'consultarSobre.form.template.html'
})

export class ConsultarSobreFormComponent {

    _contratoKey: ContratoKey;
    sobreFilter: SobreFilter;

    consultores: ConsultorEntity[];
    estados: Catalogo[];
    listadoSobres: SobreEntity[];
    detallesSobres: DetalleSobreEntity[];
    detalleSobreSelected: DetalleSobreEntity;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.limpiar();
        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public sobreReembolsoService: SobreReembolsoService, public catalogoSobreReembolsoService: CatalogoSobreReembolsoService,
        public constantesSobres: ConstantesSobres) {
        this.setear();
        this.loadConsultores();
    }

    setear() {
        this._contratoKey = new ContratoKey();
        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.consultores = [];
        this.estados = [];
        this.detallesSobres= [];
        this.detalleSobreSelected= new DetalleSobreEntity;
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
                this.loadSobres();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadSobres() {
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
        this.sobreFilter.CodigoContrato = this._contratoKey.CodigoContrato;
        this.sobreFilter.NumeroContrato = this._contratoKey.NumeroContrato;
        this.sobreFilter.CodigoRegion = this._contratoKey.CodigoRegion;
        this.sobreFilter.CodigoProducto = this._contratoKey.CodigoProducto;
    }
    abrirModalDetalles(sobre: SobreEntity) {

        if(sobre.DetalleSobre.length == 0){
            this.authService.showInfoPopup("Este sobre no posee detalles");
        }
        else{
        this.detallesSobres = sobre.DetalleSobre;
        this.detalleSobreSelected = new DetalleSobreEntity();
        var listaDetalles = [];
        listaDetalles = sobre.DetalleSobre;
        if(listaDetalles.length !=0){
            this.detalleSobreSelected = listaDetalles[0];
        }
        $("#ModalDetalles").modal();
    }
    }

    cambiarBeneficiario(index:number){
        this.detalleSobreSelected = new DetalleSobreEntity();
        this.detalleSobreSelected  = this.detallesSobres[index];
    }
    //historial

    cerrarModal(modal: string) {
        $('#' + modal).modal('hide');

    }
}