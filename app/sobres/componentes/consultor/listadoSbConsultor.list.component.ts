import { Component, OnInit, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, Subscription } from 'rxjs/Rx';

import { correctHeight } from '../../../app.helpers';
import { AuthService } from '../../../seguridad/auth.service';
import { RegionService } from '../../../common/servicios/region.service';
import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../service/catalogoSobreReembolso.service';


import { Region } from '../../../common/model/region';
import { Catalogo } from '../../../common/model/catalogo';
import { ConstantesSobres } from '../../utils/constantesSobres';

import { ServicioSMS } from '../../../common/servicios/sms.Service';
import { MensajeSMS, TipoSMS } from '../../../common/model/mensajesms';
import { SobreEntity } from '../../model/SobreEntity';
import { SobreFilter } from '../../model/SobreFilter';
import { DetalleSobreEntity } from '../../model/DetalleSobreEntity';
import { TipoCoberturaEntity } from '../../model/TipoCoberturaEntity';
import { TipoDevolucionEntity } from '../../model/TipoDevolucionEntity';
import { MotivoDevolucionEntity } from '../../model/MotivoDevolucionEntity';
import { ClasulaEntity } from '../../model/ClausulaEntity';


@Component({
    providers: [ServicioSMS],
    templateUrl: 'listadoSbConsultor.list.template.html'
})

export class SbConsultorListComponent implements OnInit, OnDestroy {


    listadoSobres: SobreEntity[];
    numeroRegistros = 20;
    isDesplegar: boolean;
    isDesplegarMail: boolean;
    regiones: Region[];
    opcion: string;
    estados: Catalogo[];
    todosEstados: Catalogo[];
    establecimientos: Catalogo[];
    sobreFilter: SobreFilter;
    mensajeSMS: MensajeSMS;
    detallesSobres: DetalleSobreEntity[];

    tipoCarta: Catalogo[];
    tiposCobertura: TipoCoberturaEntity[];
    tiposDevolucion: TipoDevolucionEntity[];
    motivosDevolucion: MotivoDevolucionEntity[];
    clausulas: ClasulaEntity[];
    motivosDevolucionNegativa: MotivoDevolucionEntity[];
    novedad: Catalogo[];
    detalleSobreSelected: DetalleSobreEntity;
    subscription: Subscription;


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
    interval: NodeJS.Timer;

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService, public servicioSMS: ServicioSMS,
        public sobreReembolsoService: SobreReembolsoService, private changeDetector: ChangeDetectorRef,
        public constantesSobres: ConstantesSobres, public catalogoSobreReembolsoService: CatalogoSobreReembolsoService) {

        this.sobreReembolsoService.resetDefaultPaginationConstanst();
        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.estados = [];
        this.todosEstados = [];
        this.tipoCarta = [];
        this.tiposCobertura = [];
        this.tiposDevolucion = [];
        this.clausulas = [];
        this.motivosDevolucion = [];
        this.motivosDevolucionNegativa = [];
        this.novedad = [];
        this.mensajeSMS = new MensajeSMS;
    }

    ngOnInit(): void {
        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.estados = [];
        this.todosEstados = [];
        this.detallesSobres = [];
        this.establecimientos = [];
        this.detalleSobreSelected = new DetalleSobreEntity;
        this.loadTiposDeCobertura();
        this.opcion = "";
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }


    loadTiposDeCobertura() {
        this.catalogoSobreReembolsoService.obtenerTiposDeCobertura().subscribe(
            result => {
                this.tiposCobertura = result;
                this.catalogoSobreReembolsoService.setTiposCobertura(this.tiposCobertura);
                this.loadTiposDeDevolucion();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadTiposDeDevolucion() {
        this.catalogoSobreReembolsoService.obtenerTiposDeDevolucion().subscribe(
            result => {
                this.tiposDevolucion = result;
                this.catalogoSobreReembolsoService.setTiposDevolucion(this.tiposDevolucion);
                this.loadTipoCarta();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadTipoCarta() {
        this.catalogoSobreReembolsoService.obtenerTiposCarta().subscribe(
            result => {
                result.forEach(element => {
                    if (element.Id != 4) {
                        this.tipoCarta.push(element);
                    }
                });

                this.catalogoSobreReembolsoService.setTiposCarta(this.tipoCarta);
                this.loadRegiones();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadRegiones() {
        this.catalogoSobreReembolsoService.obtenerRegiones().subscribe(
            result => {
                this.regiones = result;

                this.catalogoSobreReembolsoService.setRegiones(this.regiones);
                this.obtenerEstablecimientos();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    obtenerEstablecimientos() {
        this.catalogoSobreReembolsoService.obtenerEstablecimientos().subscribe(
            result => {
                this.establecimientos = result;
                this.catalogoSobreReembolsoService.setEstablecimientos(this.establecimientos);
                this.loadMotivosDevolucion();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadMotivosDevolucion() {
        this.catalogoSobreReembolsoService.obtenerMotivosDevolucion(this.constantesSobres.ID_TIPO_CARTA_DEVOLUCION).subscribe(
            result => {
                this.motivosDevolucion = result;
                this.catalogoSobreReembolsoService.setMotivosDevolucion(this.motivosDevolucion);
                this.loadMotivosDeDevolucionNegativa();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadMotivosDeDevolucionNegativa() {
        this.catalogoSobreReembolsoService.obtenerMotivosDevolucion(this.constantesSobres.ID_TIPO_CARTA_NEGATIVA_COBERTURA).subscribe(
            result => {
                this.motivosDevolucionNegativa = result;
                this.catalogoSobreReembolsoService.setMotivosNegativa(this.motivosDevolucionNegativa);

                this.loadClausula();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadClausula() {
        this.catalogoSobreReembolsoService.obtenerClausula().subscribe(
            result => {
                this.clausulas = result;
                this.catalogoSobreReembolsoService.setClausulas(this.clausulas);

                this.loadNovedades();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadNovedades(): void {
        this.catalogoSobreReembolsoService.obtenerNovedades().subscribe(
            result => {
                this.novedad = result;
                this.catalogoSobreReembolsoService.setNovedad(this.novedad);

                this.loadEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadEstados() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE).subscribe(
            result => {
                this.todosEstados = result;
                this.catalogoSobreReembolsoService.setEstados(this.todosEstados);
                this.listarEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    listarEstados() {
        this.estados = [];
        this.todosEstados.forEach(element => {
            if (element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_ANULADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO && element.Id != this.constantesSobres.CODIGO_ESTADO_SOBRE_DEVUELTO) {
                this.estados.push(element);
            }
        });
        this.loadSobres();
    }

    loadSobres() {
        this.sobreFilter.Estados = [];
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_ASIGNADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_REASIGNADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_LIQUIDADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_CODIFICADO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_MORA);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_DEVUELTO);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_DEP_AUDITORIA_MEDICA);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_PENDIENTE);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_AUDITORIA_MEDICA_RF);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_QPRA);
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_EN_PROCESO);
        this.sobreFilter.UsuarioAsignado = this.authService.nombreUsuario;

        clearInterval(this.interval);
        this.subscription = this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, 20).subscribe(
            result => {
                this.listadoSobres = result;
                this.listadoSobres.forEach(sobre => {
                    sobre.DetalleSobre.forEach(element => {
                        if (element.IdNovedad == this.constantesSobres.ID_NOVEDAD_DEVOLUCION)
                            sobre.EnviarMail = true;
                    });
                });

                var inipos = jQuery("#divResultadoBusquedaContratos").position().top;
                jQuery("html, body").animate({ scrollTop: inipos }, 300);

                this.interval = setInterval(() => {
                    this.changeDetector.detectChanges();
                    this.changeDetector.detach();
                }, 100);

            },
            error => this.authService.showErrorPopup(error)
        );
    }


    colapsarTab(): void {
        this.isDesplegar = false;
        this.isDesplegarMail = false;
        var key = new SobreEntity();
        //key.unsuscribe = true;
        this.sobre.next(key);
    }

    pageChanged(): void {
        this.loadSobres();
    }

    inicializarPanelMail(selected: SobreEntity): void {
        this.isDesplegarMail = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelMail").collapse("show");

        this.crearSobreEntity(selected);
        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelMail").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }


    enviarSMS(sobre: SobreEntity) {
        this.mensajeSMS = new MensajeSMS;
        this.mensajeSMS.CelularDestino = sobre.Celular;
        this.mensajeSMS.Data = [""];
        this.mensajeSMS.IDMensaje = TipoSMS.DEVOLUCION;
        this.servicioSMS.postSendSMS(this.mensajeSMS).subscribe(

            result => {
                sobre.SMSDevolucion = true;
                sobre.Accion = this.constantesSobres.ACCION_ENVIAR_MENSAJE_DEVOLUCION;
                this.actualizarSMSDevolucion(sobre);
            },
            error => this.authService.showErrorPopup(error)
        );
    }



    actualizarSMSDevolucion(sobre: SobreEntity) {

        var listaSobre = [];
        listaSobre.push(sobre);

        this.sobreReembolsoService.actualizarSobre(listaSobre).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Mensaje Enviado");
                    sobre = new SobreEntity();
                    sobre.SMSDevolucion = true;
                    this.loadSobres();
                }
                else {
                    this.authService.showErrorPopup("Mensaje No Enviado");
                }
            },
            error => this.authService.showErrorPopup(error));
    }




    inicializarPanelSobres(selected: SobreEntity): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelSobres").collapse("show");

        this.crearSobreEntity(selected);

        correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelSobres").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    crearSobreEntity(selected: SobreEntity): void {
        var key = new SobreEntity();
        key.DetalleSobre = [];
        key = selected;
        key.DetalleSobre = selected.DetalleSobre;
        this.sobre.next(key);
    }

    limpiar() {
        this.sobreFilter.FechaAsignacionDesde = undefined;
        this.sobreFilter.FechaAsignacionHasta = undefined;
        this.sobreFilter.IdEstado = undefined;
        this.sobreFilter.NumeroSobre = undefined;
        this.sobreFilter.NumeroCedula = undefined;

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