import { Component,OnDestroy } from '@angular/core';
import { AuthService } from '../seguridad/auth.service';
import { ReclamoService } from '../common/servicios/reclamo.service';
import { NotificacionPush } from '../common/servicios/notificacionPush.service';
import { BeneficiarioService } from '../common/servicios/beneficiario.service';
import { ConvenioService } from '../common/servicios/convenio.service';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { OdasListComponent } from './odas.list.component';
import { Reclamo,  ReclamoKey,  OdaResumen } from '../common/model/reclamo';
import { Catalogo } from '../common/model/catalogo';
import { OficinaLiquidacion } from '../common/model/oficinaLiquidacion';
import { Beneficiario, BeneficiarioKey } from '../common/model/beneficiario';
import { Convenio, ConvenioFilter } from '../common/model/convenio';
import { Notificacion, NotificacionFilter } from '../common/model/notificacion';
import { ContratoKey } from '../common/model/contrato';
import { ConstantService } from '../utils/constant.service';
import { GoogleAnalyticsEventsService } from '../common/servicios/googleAnalyticsEvents.service';
import { ContratosOdasListComponent } from './contratosOdas.list.component';

@Component({
    selector: 'odaForm',
    providers: [ReclamoService, ConvenioService, CatalogoService, NotificacionPush, GoogleAnalyticsEventsService],
    templateUrl: 'oda.form.template.html'
})

export class OdaFormComponent implements OnDestroy {
    oda: Reclamo;
    odasValor: OdaResumen;
    reclamoKey: ReclamoKey;

    oficinasLiquidacion: OficinaLiquidacion[];

    beneficiarios: Beneficiario[];
    beneficiarioSeleccionado: Beneficiario;
    showSelectBeneficiario?: boolean = null;

    convenioFilter: ConvenioFilter;
    convenios: Convenio[];
    convenioSeleccionado: Convenio;
    ciudades: Catalogo[];
    sectoresCompletos: Catalogo[];
    sectoresFiltrados: Catalogo[];
    especialidades: Catalogo[];
    subEspecialidades: Catalogo[];
    habilitarSolicitar: boolean;
    msgValidacion: string;
    msgEstadoOda: string;
    suscription: any;
    notificacionFilter: NotificacionFilter;
    notificacion: Notificacion;
    contratoKey: ContratoKey;

    countOdas: number;
    OdasConsumidas: number;
    OdasDisponibles: number;

    constructor(private authService: AuthService, public reclamoService: ReclamoService,
        public beneficiarioService: BeneficiarioService, private odasListComponent: OdasListComponent,
        public convenioService: ConvenioService, private catalogoService: CatalogoService,
        private notificacionPush: NotificacionPush, private constantService: ConstantService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        private contratosOdasListComponent: ContratosOdasListComponent) {

        this.initializeAnalytics();

        this.oda = new Reclamo();
        this.odasValor = new OdaResumen();
        this.oda.isEditable = true;
        this.showSelectBeneficiario = true;
        this.oficinasLiquidacion = OficinaLiquidacion.values;
        this.ciudades = [];
        this.sectoresCompletos = [];
        this.sectoresFiltrados = [];
        this.especialidades = [];
        this.subEspecialidades = [];

        this.suscription = this.odasListComponent.selectReclamo$.subscribe(
            (reclamoKey) => {
                if (reclamoKey != undefined && reclamoKey.ReclamoSeleccionado != undefined
                    && (reclamoKey.ReclamoSeleccionado.NumeroReclamo == undefined || reclamoKey.ReclamoSeleccionado.NumeroReclamo == 0)) {
                    this.reclamoKey = reclamoKey;
                    this.loadOdaForm();
                    this.loadBeneficiarios();
                }
            }
        );

        this.contratoKey = new ContratoKey();

        this.suscription = this.contratosOdasListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {
                    if (!contratoKey.unsuscribe) {
                        this.contratoKey = contratoKey;
                    } else {
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    ngOnInit(): void {
        this.beneficiarios = [];
        this.beneficiarioSeleccionado = new Beneficiario();

        this.convenios = [];
        this.convenioSeleccionado = new Convenio();
        this.convenioFilter = new ConvenioFilter();

        this.habilitarSolicitar = true;
        this.msgValidacion = "";
        this.msgEstadoOda = "";
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    loadOdaForm(): void {
        this.oda = new Reclamo();
        this.oda.isEditable = true;
        if (this.reclamoKey != undefined) {
            this.oda = this.reclamoKey.ReclamoSeleccionado;
            this.oda.CodigoContrato = this.reclamoKey.ContratoKey.CodigoContrato;
        }
        this.googleAnalyticsEventsService.emitPageView("/Provider");
    }

    loadResumenBeneficiario(beneficiario: BeneficiarioKey) {
        this.odasValor = new OdaResumen();
        var beneficiarioFilter = this.crearBeneficiarioKey(beneficiario);
        this.beneficiarioService.getValorOdas(beneficiarioFilter).subscribe(
            result => {
                if (result != undefined) {
                    this.odasValor = result;
                }
            },
            error => this.authService.showErrorPopup(error));
    }


    loadBeneficiarios() {
        if (this.reclamoKey != undefined) {
            var beneficiarioFilter = this.createBeneficiarioFilter();
            if (beneficiarioFilter != null) {
                this.beneficiarioService.getBeneficiarioOda(beneficiarioFilter).subscribe(
                    beneficiarios => {
                        this.beneficiarios = beneficiarios;
                    },
                    error => this.authService.showErrorPopup(error));
            }
        }
    }

    createBeneficiarioFilter(): BeneficiarioKey {
        if (this.reclamoKey.ContratoKey.CodigoContrato != undefined && this.reclamoKey.ContratoKey.CodigoProducto != undefined) {
            var beneficiarioFilter = new BeneficiarioKey();
            beneficiarioFilter.CodigoContrato = this.reclamoKey.ContratoKey.CodigoContrato;
            beneficiarioFilter.CodigoProducto = this.reclamoKey.ContratoKey.CodigoProducto;
            beneficiarioFilter.Transicion = this.reclamoKey.ContratoKey.Transicion;
            beneficiarioFilter.CodigoRegion = this.reclamoKey.ContratoKey.CodigoRegion;
            beneficiarioFilter.NumeroContrato = this.reclamoKey.ContratoKey.NumeroContrato;
            return beneficiarioFilter;
        }
        return null;
    }

    crearBeneficiarioKey(beneficiarioSeleccionado: Beneficiario): BeneficiarioKey {
        var beneficiarioFilter = new BeneficiarioKey();
        beneficiarioFilter.CodigoContrato = this.reclamoKey.ContratoKey.CodigoContrato;
        beneficiarioFilter.CodigoProducto = this.reclamoKey.ContratoKey.CodigoProducto;
        beneficiarioFilter.NumeroContrato = this.reclamoKey.ContratoKey.NumeroContrato;
        beneficiarioFilter.NumeroPersona = beneficiarioSeleccionado.NumeroPersona;

        return beneficiarioFilter;
    }

    onChangeBeneficiario(numeroPersona: number) {
        this.habilitarSolicitar = true;
        this.msgValidacion = "";
        if (numeroPersona != undefined) {
            var beneficiario = this.beneficiarios.find(b => b.NumeroPersona == numeroPersona);
            this.beneficiarioSeleccionado = beneficiario;
            // this.loadResumenBeneficiario(this.beneficiarioSeleccionado); 

            this.odasValor = new OdaResumen();
            var beneficiarioFilter = this.crearBeneficiarioKey(beneficiario);
            this.beneficiarioService.getValorOdas(beneficiarioFilter).subscribe(
                result => {
                    if (result != undefined) {
                        this.odasValor = result;
                        this.countOdas = this.odasValor.OdasConsumidas;
                        this.countOdas++;

                        if (this.countOdas >= this.odasValor.OdasDisponibles) {
                            this.showPopup('El usuario ha consumido ' + this.countOdas + ' de ' + this.odasValor.OdasDisponibles, 'info');
                        }



                    }
                },
                error => this.authService.showErrorPopup(error));

            if (beneficiario.Estado != "Activo") {
                this.habilitarSolicitar = false;
                this.msgValidacion = "El beneficiario seleccionado no se encuentra Activo";
            } else if (beneficiario.CarenciasAmbulatorias != undefined && beneficiario.CarenciasAmbulatorias > 0) {
                this.habilitarSolicitar = false;
                this.msgValidacion = "El beneficiario posee carencias";
            } else if (beneficiario.DeducibleDisponible != undefined && beneficiario.DeducibleDisponible > 0) {
                this.habilitarSolicitar = false;
                this.msgValidacion = "El beneficiario requiere $" + beneficiario.DeducibleDisponible + " para cubrir su deducible";
            }

            if (this.reclamoKey.ContratoKey.CodigoProducto.toLowerCase() == 'ind'
                && this.reclamoKey.ContratoKey.NivelReferencia == 8) {
                this.habilitarSolicitar = true;


                this.msgValidacion = "";
            }

            if (this.reclamoKey.ContratoKey.CodigoProducto.toLowerCase() == 'cor'
                || this.reclamoKey.ContratoKey.CodigoProducto.toLowerCase() == 'poo'
                || this.reclamoKey.ContratoKey.Plan.toString() == 'XPR-1M-200'
                || this.reclamoKey.ContratoKey.Plan.toString() == 'XPR-2M-200'
                || this.reclamoKey.ContratoKey.Plan.toString() == 'XPR-3M-200') {
                this.habilitarSolicitar = true;
                this.msgValidacion = "";
            }

            if (this.convenioFilter != undefined)
                this.convenioFilter.NumeroBeneficiario = numeroPersona;

        }
        else {
            this.beneficiarioSeleccionado = undefined;
        }
    }

    //Convenios
    initConvenios() {
        this.convenioFilter = new ConvenioFilter();
        if (this.reclamoKey != undefined && this.reclamoKey.ContratoKey != undefined && this.reclamoKey.ContratoKey.CodigoContrato != undefined) {
            this.convenioFilter.CodigoContrato = this.reclamoKey.ContratoKey.CodigoContrato;
            this.convenioFilter.NumeroBeneficiario = this.beneficiarioSeleccionado.NumeroPersona;
        }
        this.convenioFilter.NivelDesde = 1;
        this.convenioFilter.NivelHasta = 7;
        this.convenios = [];
        this.loadCiudades();
        this.loadSectores();
        this.loadEspecialidades();
        this.loadSubEspecialidades();

        jQuery("#nivelRange").ionRangeSlider({
            type: "double",
            min: 1,
            max: 8,
            from: null,
            to: null,
            step: 1,
            grid: true,
            grid_snap: true,
            scope: this.convenioFilter,
            hide_min_max: true,
            hide_from_to: true,
            force_edges: true
        });
    }

    loadCiudades(): void {
        if (this.ciudades == undefined || this.ciudades.length == 0) {
            this.catalogoService.getCiudadesForOdas().subscribe(
                result => {
                    this.ciudades = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    loadSectores(): void {
        if (this.sectoresCompletos == undefined || this.sectoresCompletos.length == 0) {
            this.catalogoService.getSectoresForOdas().subscribe(
                result => {
                    this.sectoresCompletos = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    onChangeCiudad(codCiudad: string): void {
        this.convenioFilter.Sector = undefined;
        if (codCiudad != undefined && codCiudad != '' && this.sectoresCompletos != undefined) {
            var ciudad = this.ciudades.find(c => c.CodigoProgress == codCiudad);
            if (ciudad != undefined)
                this.sectoresFiltrados = this.sectoresCompletos.filter(s => s.CodigoProgress == ciudad.Codigo);
        }
        else
            this.sectoresFiltrados = [];
    }

    loadEspecialidades(): void {
        if (this.especialidades == undefined || this.especialidades.length == 0) {
            this.catalogoService.getEspecialidadesForOdas().subscribe(
                result => {
                    this.especialidades = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    loadSubEspecialidades(): void {
        if (this.subEspecialidades == undefined || this.subEspecialidades.length == 0) {
            this.catalogoService.getSubEspecialidadesForOdas().subscribe(
                result => {
                    this.subEspecialidades = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    pageConvenioChanged(): void {
        this.filtrarConvenios();
    }

    buscarConvenios() {
        this.convenioService.resetDefaultPaginationConstanst();
        this.filtrarConvenios();
    }

    limpiarConvenios(): void {
        this.convenioService.resetDefaultPaginationConstanst();
        this.initConvenios();
    }

    filtrarConvenios(): void {
        if (this.convenioFilter.CodigoContrato != undefined) {
            this.convenioFilter.NivelDesde = jQuery("#nivelRange").data('from');
            this.convenioFilter.NivelHasta = jQuery("#nivelRange").data('to');
            this.convenioService.getMedicosByFiltersPaginated(this.convenioFilter).subscribe(
                result => {
                    this.convenios = result;
                    this.marcarConvenioSeleccionado();
                    this.googleAnalyticsEventsService.emitPageView("/Doctor");
                    this.googleAnalyticsEventsService.emitPageView("/Doctor/Search");
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    marcarConvenioSeleccionado() {
        if (this.convenios != undefined && this.convenioSeleccionado != undefined && this.convenioSeleccionado.Numero != undefined) {
            this.convenios.forEach(element => {
                if (element.Numero == this.convenioSeleccionado.Numero)
                    element.Selected = true;
                else
                    element.Selected = false;
            });
        }
    }

    seleccionarConvenio(convenioSeleccionado: Convenio): void {
        this.convenioSeleccionado = convenioSeleccionado;
        this.oda.PrestadorNumero = this.convenioSeleccionado.Numero;
        if (convenioSeleccionado.EmiteOdas == true) {
            if (convenioSeleccionado.ObservacionesValorOda != undefined) {
                this.msgEstadoOda = convenioSeleccionado.ObservacionesValorOda.toString();
            }
            jQuery("#prestadorViewModal").modal("hide");
            this.habilitarSolicitar = true;

        } else {
            this.showPopup('Este médico no necesita odas, acude al consultorio y copaga tu consulta', 'info');
            this.habilitarSolicitar = false;
            jQuery("#prestadorViewModal").modal("hide");

        }


    }

    solicitarOda(): void {
        this.googleAnalyticsEventsService.emitPageView("/Doctor/DetailProvider?Source=Search");
        if (this.oda.PrestadorNumero != undefined && this.oda.OficinaLiquidacion != undefined && this.oda.NumeroBeneficiario != undefined
            && this.oda.CodigoContrato != undefined) {
            this.oda.NombreBeneficiario = this.beneficiarioSeleccionado.NombreCompleto;
            this.oda.EmailDomicilio = this.reclamoKey.ContratoKey.EmailDomicilio;
            this.oda.EmailTrabajo = this.reclamoKey.ContratoKey.EmailTrabajo;
            this.oda.ContratoNumero = this.reclamoKey.ContratoKey.NumeroContrato;
            this.oda.CodigoProducto = this.reclamoKey.ContratoKey.CodigoProducto;
            this.oda.CodigoPlan = this.reclamoKey.ContratoKey.Plan;
            this.oda.VersionPlan = this.reclamoKey.ContratoKey.VersionPlan;
            this.reclamoService.crearODA(this.oda).subscribe(
                result => {
                    let respuesta: string = result.toString();
                    this.odasListComponent.verListado();
                    if (respuesta.indexOf('satisfactoriamente') > 0) {
                        toastr.success(respuesta);
                        this.countOdas++;
                        this.generarNotificacionPush(); //descomentar para paso a produccion
                    } else {
                        toastr.error(respuesta);
                    }
                    // toastr.success('La ODA ha sido generada satisfactoriamente.');




                    this.googleAnalyticsEventsService.emitPageView("/Oda/OdaDetail?Source=DetailProvider");
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    generarNotificacionPush(): void {
        if (this.contratoKey.CodigoProducto == 'IND' && this.contratoKey.Deducible == true) {
            this.notificacionFilter = new NotificacionFilter;

            this.notificacionFilter.ApplicationID = this.constantService.PUSH_APLICACION_ID_ODA;//"CSALUD";
            this.notificacionFilter.Category = this.constantService.PUSH_CATEGORIA_ODA;//4;
            this.notificacionFilter.Id = this.contratoKey.CedulaTitular;
            this.notificacionFilter.Message = this.constantService.PUSH_MENSAJE_ODA;//"Se genero la notificacion push para oda";
            this.notificacionFilter.Tittle = this.constantService.PUSH_TITULO_ODA;//"Notificacion Push";

            this.notificacionPush.setMensajePush(this.notificacionFilter).subscribe(
                result => {
                    this.notificacion = result;
                });
        }
    }

    private initializeAnalytics() {
        (function (i, s, o, g, r, a?, m?) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * <any>new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', this.constantService.ID_GOOGLE_ANALITICS, 'auto');

    }

    showPopup(msg: string, type: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: type,
            closeOnConfirm: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
        });
    }
}