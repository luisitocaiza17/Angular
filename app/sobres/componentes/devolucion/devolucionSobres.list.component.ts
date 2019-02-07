import { Component, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../../../app.helpers';
import { AuthService } from '../../../seguridad/auth.service';

import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../service/catalogoSobreReembolso.service';

import { ConstantesSobres } from '../../utils/constantesSobres';
import { SobreFilter } from '../../model/SobreFilter';
import { ConsultorEntity } from '../../model/ConsultorEntity';
import { SobreEntity } from '../../model/SobreEntity';

@Component({
    providers: [],
    templateUrl: 'devolucionSobres.list.template.html'
})

export class DevolucionSobresListComponent {

    isDesplegarDevolucion: boolean;
    sobreFilter: SobreFilter;
    consultores: ConsultorEntity[];
    listadoSobres: SobreEntity[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    private sobre: BehaviorSubject<SobreEntity> = new BehaviorSubject<SobreEntity>(null);
    selectSobre$: Observable<SobreEntity> = this.sobre.asObservable();

    constructor(private chRef: ChangeDetectorRef,
        private authService: AuthService,
        public sobreReembolsoService: SobreReembolsoService,
        private constantesSobres: ConstantesSobres,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService) {

        this.setear();
        this.limpiar();
        this.loadConsultores();
    }

    setear() {
        this.listadoSobres = [];
        this.consultores = [];
        this.sobreReembolsoService.resetDefaultPaginationConstanst();
    }

    colapsarTab(): void {
        this.isDesplegarDevolucion = false;
        var key = new SobreEntity();
        key.unsuscribe = true;
        this.sobre.next(key);
    }

    inicializarPanelSobres(selected: SobreEntity): void {
        this.crearSobreEntity(selected);
        this.isDesplegarDevolucion = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelDevolucionSobres").collapse("show");

        correctHeight();
        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelDevolucionSobres").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    crearSobreEntity(selected: SobreEntity): void {
        var key = new SobreEntity();
        key.DetalleSobre = [];

        key = selected;
        key.DetalleSobre = selected.DetalleSobre;
        this.sobre.next(key);
    }


    loadConsultores() {
        this.catalogoSobreReembolsoService.obtenerConsultores().subscribe(
            result => {
                this.consultores = result;
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
        this.sobreFilter.IdEstado = this.constantesSobres.CODIGO_ESTADO_SOBRE_LIQUIDADO;
        this.sobreFilter.Devuelto = true;
    }

}