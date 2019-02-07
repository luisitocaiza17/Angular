import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { RegionService } from '../common/servicios/region.service';
import { CorporativoService } from '../common/servicios/corporativo.service';

import { Region } from '../common/model/region';
import { EmpresaCoorporativo, CorporativoList, CorporativoFilter } from '../common/model/corporativo';
import { Sucursal, SucursalNombre, SucursalFilter, SucursarList } from '../common/model/sucursal';
import { ConstantService } from '../utils/constant.service';
import { CorporativoComponent } from './corporativo.component';


import { Permiso } from '../seguridad/usuario';
import { SucursalService } from '../common/servicios/sucursal.service';
import { Ciudad } from '../common/model/ciudad';
import { FormaDePago } from '../common/model/autorizacion.constant';

import {Grupo} from '../common/model/grupo';
import {GrupoService} from '../common/servicios/grupo.service';
import { ActividadService } from '../common/servicios/actividad.service';
import { Actividad } from '../common/model/actividad';
import { SociedadService } from '../common/servicios/sociedad.service';
import { Sociedad } from '../common/model/sociedad';


@Component({
    selector: 'corporativoForm',
    providers: [SucursalService],
    templateUrl: 'corporativo.form.template.html'
})

export class CorporativoFormComponent implements OnInit {

    suscription: any;
    corporativokey: CorporativoList;
    opcion: string;
    accessCorporativoCambios: boolean;
    accessSubDatosCorporativo: boolean;
    sucursal: Sucursal;
    sucursales: Sucursal [];
    sucursalnombre: SucursalNombre;
    sucursalnombres: SucursalNombre [];
    filter: SucursalFilter;
    isDesplegarSucursal: boolean;
    grupos: Grupo[];
    actividades: Actividad[];
    sociedades: Sociedad[];


    private Sucursalkey: BehaviorSubject<SucursarList> = new BehaviorSubject<SucursarList>(null);
        selectSucursal$: Observable<SucursarList> = this.Sucursalkey.asObservable();
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        private sucursalservice: SucursalService,
        private constantService: ConstantService, public corporativoService: CorporativoService,
        private CorporativoComponent: CorporativoComponent,
        private grupoService: GrupoService, private actividadService: ActividadService,
        private sociedadService: SociedadService) {



        this.verificarPermisos();

        this.sucursal = new Sucursal();

        this.corporativokey = new CorporativoList();


        this.suscription = this.CorporativoComponent.selectCorporativo$.subscribe(
            (corporativokey) => {

                if (corporativokey != undefined && corporativokey.Numero != undefined) {
                    this.corporativokey = corporativokey;
                    this.filter.Numero = corporativokey.Numero;
                  //  console.log(this.corporativokey);
                   this.buscarSucursales();
                }
            }
        );
    }



    ngOnInit(): void {
        this.opcion = "";
        this.sucursales = [];
        this.filter = new SucursalFilter();
        this.actividades = [];
        this.sociedades = [];
        this.grupos = [];
        this.loadActividades();
        this.loadSociedades();
        this.loadGrupos();
   }

    loadSociedades(): void {
        this.sociedadService.getAll()
            .subscribe(sociedades => {
                    console.log(sociedades)
                    this.sociedades = sociedades;
                },
            error => this.authService.showErrorPopup(error));
    }

    loadActividades(): void {
        this.corporativoService.getCatalogoGen("TIPACTIV")
            .subscribe(actividades => {
                    console.log(actividades)
                    this.actividades = actividades;
                },
            error => this.authService.showErrorPopup(error));
    }

    loadGrupos(): void {
        this.grupoService.GetGrupos()
            .subscribe(grupos => {
                    console.log(grupos)
                    this.grupos = grupos;
                },
            error => this.authService.showErrorPopup(error));
            }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
        return true;

        return false;
    }


    activar(opcion: string) {
        this.opcion = opcion;
        this.colapsarTabSucursales();
        jQuery("#divSucursal").collapse("hide");
    }

    verificarPermisos(): void {
        this.accessCorporativoCambios = false;


        this.accessSubDatosCorporativo = false;
        }

        buscarSucursales(): void {
            this.sucursalservice.getByFiltersPaginatedSucursal(this.filter)
                .subscribe(sucursal => {
                    this.loadDataSucursales(sucursal);
                    if (sucursal != undefined && sucursal.length > 0) {
                        var inipos = jQuery("#ResultadoBusquedaSucursal").position().top;
                        jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                    }
                },
                    error => this.authService.showErrorPopup(error));
        }

        consultarSucursal(): void {
            this.sucursalservice.resetDefaultPaginationConstanst();
            this.buscarSucursales();
        }

        pageChangedSucursales(): void {
            this.buscarSucursales();
        }
        loadDataSucursales(sucursal: Sucursal[]): void {

            sucursal.forEach(element => {
                element.NumeroEmpresa = this.corporativokey.Numero;
                this.sucursales.push(element);
            });
            console.log(this.sucursales);
            //this.Sucursales = Sucursal;
        }

        colapsarTabSucursales(): void {
            this.isDesplegarSucursal = false;
            var key = new SucursarList();
            this.Sucursalkey.next(key);

        }

        inicializarPanelSucursal(selected: Sucursal): void {
            this.isDesplegarSucursal = true;
            this.chRef.detectChanges();
            jQuery("#divConsultar").collapse("hide");
            jQuery("#divSucursal").collapse("hide");
           jQuery("#panelSucursalCompleto").collapse("hide");
            //jQuery("#PanelDatosGeneralesCorporativo").collapse("hide");
            jQuery("#divPanelCorporativo").collapse("show");
            jQuery("#divPanelSucursal").collapse("show");
            this.crearSucursalKey(selected);

            // scroll top
            this.chRef.detectChanges();
            var inipos = jQuery("#divPanelSucursal").position().top;
            jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
            this.chRef.detectChanges();

        }

        crearSucursalKey(selected: Sucursal): void {
            var key = new SucursarList();
            key.NumeroEmpresa = selected.NumeroEmpresa;
            key.Empresa = selected.Empresa;
            key.Numero = selected.Numero;
            key.CodigoAgenteVenta = selected.CodigoAgenteVenta;
            key.AgenteVenta = selected.AgenteVenta;
            key.Nombre = selected.Nombre;
            key.CodigoCiudad = selected.CodigoCiudad;
            key.Ciudad = selected.Ciudad;
            key.Barrio = selected.Barrio;
            key.Calle = selected.Calle;
            key.Zona = selected.Zona;
            key.Casilla = selected.Casilla;
            key.Telefono = selected.Telefono;
            key.   Fax = selected.Fax;
            key.   Email = selected.Email;
            key.   NombresRepresentante = selected.NombresRepresentante;
            key.   ApellidosRepresentante = selected.ApellidosRepresentante;
            key.   CargoRepresentante = selected.CargoRepresentante;
            key.   CedulaRepresentante = selected.CedulaRepresentante;
            key.   CodigoSucursal = selected.CodigoSucursal;
            key.   Sucursal = selected.Sucursal;
            key.   PresentaGarantia = selected.PresentaGarantia;
            key.   FormaPago = selected.FormaPago;
            key.   TipoCuenta = selected.TipoCuenta;
            key.   Moneda = selected.Moneda;
            key.   CodigoBanco = selected.CodigoBanco;
            key.   Banco = selected.Banco;
            key.   PeriodoPago = selected.PeriodoPago;
            key.   NumeroCuenta = selected.NumeroCuenta;
            key.   NumeroContratoDebito = selected.NumeroContratoDebito;
            key.   NombreDuenioCuenta = selected.NombreDuenioCuenta;
            key.   FacturarACedula = selected.FacturarACedula;
            key.   FacturarARuc = selected.FacturarARuc;
            key.   NumeroContratos = selected.NumeroContratos;
            key.   FechaInicio = selected.FechaInicio;
            key.   FechaFin = selected.FechaFin;
            key.   CodigoUnidadResponsable = selected.CodigoUnidadResponsable;
            key.   UnidadResponsable = selected. UnidadResponsable;
            key.   FechaFinTarjeta = selected. FechaFinTarjeta;
            key.   CodigoProducto = selected. CodigoProducto;
            key.   ValorTarjetas = selected. ValorTarjetas;
            key.   TarjetasAdicionales = selected. TarjetasAdicionales;
            key.   ValorTarjetasAdicionales = selected. ValorTarjetasAdicionales;
            key.   Region = selected. Region;
            key.   FechaUltimoPeriodo = selected. FechaUltimoPeriodo;
            key.   MesesFormaPago = selected. MesesFormaPago;
            key.   EsBloqueada = selected. EsBloqueada;
            key.   FechaBloqueo = selected. FechaBloqueo;
            key.   CodigoEstado = selected. CodigoEstado;
            key.   Estado = selected. Estado;
            key.   ProductoAfectaCosto = selected. ProductoAfectaCosto;
            key.   PagaComision = selected. PagaComision;
            key.   EsSuscripcion = selected. EsSuscripcion;
            key.   PorcentajeComisionBroker = selected. PorcentajeComisionBroker;
            key.   AtiendeReembolsosLocales = selected. AtiendeReembolsosLocales;
            key.   NumeroOdas = selected. NumeroOdas;
            key.   CodigoEjecutivo = selected. CodigoEjecutivo;
            key.   Ejecutivo = selected. Ejecutivo;
            key.   TelefonoLista = selected. TelefonoLista;
            key.   FaxLista = selected. FaxLista;
            key.   DigitadorCreacion = selected. DigitadorCreacion;
            key.   FechaCreacion = selected. FechaCreacion;
            key.   HoraCreacion = selected. HoraCreacion;
            key.   FechaModificacion = selected. FechaModificacion;
            key.   DigitadorModificacion = selected. DigitadorModificacion;
            key.   HoraModificacion = selected. HoraModificacion;
            key.   FechaAnulacion = selected. FechaAnulacion;
            key.   DigitadorAnulacion = selected. DigitadorAnulacion;
            key.   HoraAnulacion = selected. HoraAnulacion;
            key.   CodigoUnidadAgente = selected. CodigoUnidadAgente;
            key.   CodigoAgente = selected. CodigoAgente;
            key.   MontoMora = selected. MontoMora;
            key.   FechaFinOriginal = selected. FechaFinOriginal;
            key.   FechaInicioOriginal = selected. FechaInicioOriginal;
            key.   EsFacturadoSaludsa = selected. EsFacturadoSaludsa;
            key.   CodigoMotivoBloqueo = selected. CodigoMotivoBloqueo;
            key.   MotivoBloqueo = selected. MotivoBloqueo;
            key.   CodigoAgenteContacto = selected. CodigoAgenteContacto;
            key.   AgenteContacto = selected. AgenteContacto;
            key.   EsPagoInteligente = selected. EsPagoInteligente;
            key.   EmailRrhh = selected. EmailRrhh;
            key.   EmailBroker = selected. EmailBroker;
            key.   BloqueoOdas = selected. BloqueoOdas;
            key.   BloqueoReclamos = selected. BloqueoReclamos;
            key.   BloqueoCheques = selected. BloqueoCheques;
            key.   BloqueoCreditos = selected. BloqueoCreditos;
            key.   AdmiteOdas = selected. AdmiteOdas;
            key.   TipoTarjeta = selected. TipoTarjeta;
            key.   EsMedicoDomicilio = selected. EsMedicoDomicilio;
            key.   NombreTarjeta = selected. NombreTarjeta;
            key.   AtencionBiored = selected. AtencionBiored;
            key.   ReferenciaEnvio = selected. ReferenciaEnvio;
            key.   EsServiciosAdicionales = selected. EsServiciosAdicionales;
            key.   TieneTarjeta = selected. TieneTarjeta;
            key.   ContactoDocumentosElectronicos = selected. ContactoDocumentosElectronicos;
            key.   EmailContactoDocumentosElectronicos = selected. EmailContactoDocumentosElectronicos;
            key.   EmailBrokerDocumentosElectronicos = selected. EmailBrokerDocumentosElectronicos;
            key.   EmailDocumentosElectronicos = selected. EmailDocumentosElectronicos;
            key.   CedulaPagoReclamos = selected. CedulaPagoReclamos;
            key.   NombrePagoReclamos = selected. NombrePagoReclamos;
            key.   TipoLista = selected. TipoLista;
            key.   RucPagoReclamos = selected. RucPagoReclamos;
            key.   CodigoBancoPagoReclamo = selected. CodigoBancoPagoReclamo;
            key.   BancoPagoReclamo = selected. BancoPagoReclamo;
            key.   TipoCuentaReclamo = selected. TipoCuentaReclamo;
            key.   CuentaPagoReclamo = selected. CuentaPagoReclamo;
            key.   Linea1 = selected. Linea1;
            key.   Linea2 = selected. Linea2;
            key.   Linea3 = selected. Linea3;
            key.   TieneRetencion = selected. TieneRetencion;
            key.   TipoGrupal = selected. TipoGrupal;
            key.   PorcentajeDescuento = selected. PorcentajeDescuento;
            key.   CodigoMotivoAnulacion = selected. CodigoMotivoAnulacion;
            key.   MotivoAnulacion = selected. MotivoAnulacion;
            key.   EmailSucursalDocumentosElectronicos = selected. EmailSucursalDocumentosElectronicos;
            key.   EsTransicion = selected. EsTransicion;
            key.   FechaInicioVigencia = selected. FechaInicioVigencia;
            key.   FechaFinVigencia = selected. FechaFinVigencia;
            key.   EsAplicadoTransicion = selected. EsAplicadoTransicion;
            this.Sucursalkey.next(key);
        }

}

