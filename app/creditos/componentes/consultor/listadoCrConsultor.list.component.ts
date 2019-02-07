import { Component, OnInit, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, Subscription } from 'rxjs/Rx';

import { correctHeight } from '../../../app.helpers';
import { AuthService } from '../../../seguridad/auth.service';
import { RegionService } from '../../../common/servicios/region.service';

import { Region } from '../../../common/model/region';
import { Catalogo } from '../../../common/model/catalogo';


import { ServicioSMS } from '../../../common/servicios/sms.Service';
import { MensajeSMS, TipoSMS } from '../../../common/model/mensajesms';
import { SobreReembolsoService } from '../../../sobres/service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../sobres/service/catalogoSobreReembolso.service';
import { ConstantesCreditos } from '../../utils/ConstantesCreditos';
import { SobreEntity } from '../../../sobres/model/SobreEntity';
import { SobreFilter } from '../../../sobres/model/SobreFilter';
import { DetalleSobreEntity } from '../../../sobres/model/DetalleSobreEntity';
import { EstadoCargaRespuestasService } from '../../../recaudos/menuCargaRespuestas/services/estadoCargaRespuestas.service';


@Component({
    providers: [ServicioSMS],
    templateUrl: 'listadoCrConsultor.list.template.html'
})

export class CrConsultorListComponent implements OnInit, OnDestroy {


    listadoSobres: SobreEntity[];
    numeroRegistros = 20;
    isDesplegar: boolean;
    isDesplegarMail: boolean;
    regiones: Region[];
    opcion: string;
    estados: Catalogo[];
    todosEstados: Catalogo[];
    sobreFilter: SobreFilter;
    mensajeSMS: MensajeSMS;
    detallesSobres: DetalleSobreEntity[];
    detalleSobreSelected: DetalleSobreEntity;
    subscription: Subscription;
    listaEstados: string;


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
        public constantesCreditos: ConstantesCreditos, public catalogoSobreReembolsoService: CatalogoSobreReembolsoService) {
    }

    ngOnInit(): void {
        this.sobreReembolsoService.resetDefaultPaginationConstanst();

        this.sobreFilter = new SobreFilter();
        this.sobreFilter.Estados = [];
        this.listadoSobres = [];
        this.estados = [];
        this.todosEstados = [];
        this.detallesSobres = [];
        this.detalleSobreSelected = new DetalleSobreEntity;
        this.loadRegiones();
        this.opcion = "";
        this.listaEstados = undefined;
        this.sobreFilter.Estados.push(this.constantesCreditos.CODIGO_ESTADO_CREDITO_CODIFICADO);
        this.sobreFilter.Estados.push(this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA);
        this.sobreFilter.Estados.push(this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
                this.loadEstados();
            },
                error => this.authService.showErrorPopup(error));
    }

    loadEstados() {
        this.catalogoSobreReembolsoService.obtenerEstadosSobre(this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO).subscribe(
            result => {
                this.todosEstados = result;
                this.listarEstados();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    listarEstados() {
        this.estados = [];
        this.todosEstados.forEach(element => {
            if (element.Id != this.constantesCreditos.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR) {
                this.estados.push(element);
            }
        });
        this.loadSobres();
    }

    loadSobres() {
        this.sobreFilter.TipoDocumento = this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO;
        this.sobreFilter.UsuarioLogueado = this.authService.nombreUsuario;
        if (this.sobreFilter.Estados.length == 0 && this.sobreFilter.NumeroSobre == undefined &&  this.sobreFilter.FechaAsignacionDesde == undefined && this.sobreFilter.FechaAsignacionHasta == undefined) {
            this.sobreFilter.Estados.push(this.constantesCreditos.CODIGO_ESTADO_CREDITO_CODIFICADO);
            this.sobreFilter.Estados.push(this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_AUDITORIA);
            this.sobreFilter.Estados.push(this.constantesCreditos.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION);
        }
        clearInterval(this.interval);
        this.subscription = this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, 20).subscribe(
            result => {
                this.listadoSobres = result;

                this.interval = setInterval(() => {
                    this.changeDetector.detectChanges();
                    this.changeDetector.detach();
                }, 100);
            },
            error => this.authService.showErrorPopup(error)
        );
        this.sobreFilter.Estados = [];
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
                sobre.Accion = this.constantesCreditos.ACCION_ENVIAR_MENSAJE_DEVOLUCION;
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
        this.listaEstados = undefined;
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
    abrirModalEstados() {
        $("#estadosViewModal").modal();
    }
}