import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { CentroMedicoService } from '../common/servicios/centroMedico.service';
import { PrestadorService } from '../common/servicios/prestador.service';
import { BeneficiarioService } from '../common/servicios/beneficiario.service';

import { Ciudad } from '../common/model/ciudad';
import { Catalogo } from '../common/model/catalogo';
import { ContratoKey } from '../common/model/contrato';
import { PrestadorFilter, Prestador, PrestadorKey } from '../common/model/prestador';
import { EspecialidadVeris, EspecialidadVerisFilter } from '../common/model/especialidadVeris';
import { CentroMedico } from '../common/model/centroMedico';
import { ContratosAgendarCitaListComponent } from './contratosAgendarCita.list.component';
import { BeneficiarioKey, Beneficiario, BeneficiarioPaciente } from '../common/model/beneficiario';
import { ConstantService } from '../utils/constant.service';
import { GoogleAnalyticsEventsService } from '../common/servicios/googleAnalyticsEvents.service';

@Component({
    selector: 'agendarCitaList',
    providers: [GoogleAnalyticsEventsService],
    templateUrl: 'agendarCita.list.template.html'
})

export class AgendarCitaListComponent implements OnInit {

    isDesplegar: boolean;
    filter: PrestadorFilter;

    ciudades: Ciudad[];
    especialidades: Catalogo[];
    centrosMedicosAll: CentroMedico[];
    centrosMedicos: CentroMedico[];
    prestadores: Prestador[];
    contratoKey: ContratoKey;
    suscription: any;
    beneficiarios: Beneficiario[];
    especialidadVerisFilter: EspecialidadVerisFilter;
    especialidadVeris: EspecialidadVeris;

    private prestadorKey: BehaviorSubject<PrestadorKey> = new BehaviorSubject<PrestadorKey>(null);
    selectPrestador$: Observable<PrestadorKey> = this.prestadorKey.asObservable();

    private beneficiarioKey: BehaviorSubject<BeneficiarioPaciente> = new BehaviorSubject<BeneficiarioPaciente>(null);
    selectBeneficiario$: Observable<BeneficiarioPaciente> = this.beneficiarioKey.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private catalogoService: CatalogoService,
        private centroMedicoService: CentroMedicoService,
        private prestadorService: PrestadorService,
        private contratosAgendarCitaListComponent: ContratosAgendarCitaListComponent,
        private beneficiarioService: BeneficiarioService,
        private constantService: ConstantService,
        public googleAnalyticsEventsService : GoogleAnalyticsEventsService) {

        this.initializeAnalytics();
        this.filter = new PrestadorFilter();
        this.especialidadVerisFilter = new EspecialidadVerisFilter();
        this.especialidadVeris = new EspecialidadVeris();

        this.suscription = this.contratosAgendarCitaListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {
                    if (!contratoKey.unsuscribe) {
                        this.contratoKey = contratoKey;
                        this.createFilter();
                        this.loadBeneficiario();
                    } else {
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    ngOnInit(): void {
        this.loadEspecialidades();
        this.loadCiudades();
        this.loadCentrosMedicosAll();
        this.prestadores = [];
        this.contratoKey = new ContratoKey();
    }

    createFilter() {
        this.filter = new PrestadorFilter();
        this.filter.CodigoContrato = this.contratoKey.CodigoContrato;
        this.filter.NumeroContrato = this.contratoKey.NumeroContrato;
        this.filter.CodigoCiudad = "0";
    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    loadBeneficiario() {
        if (this.filter != undefined) {
            this.beneficiarioService.getBeneficiarioAutorizacion(this.filter).subscribe(
                beneficiarios => {
                    this.beneficiarios = beneficiarios;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    colapsarTab(): void {
        this.isDesplegar = false;
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

    loadCiudades(): void {
        if (this.ciudades == undefined) {
            this.ciudades = Ciudad.values;
        }
    }

    loadCentrosMedicosAll(): void {
        if (this.centrosMedicosAll == undefined) {
            this.centroMedicoService.getAllForCatalogos().subscribe(
                result => {
                    this.centrosMedicosAll = result;
                    this.loadCentrosMedicos();
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    loadCentrosMedicos(): void {
        this.centrosMedicos = [];
        //this.centrosMedicos = this.centrosMedicosAll;
        if (this.filter.CodigoCiudad != undefined && this.filter.CodigoCiudad != '') {
            this.centrosMedicos = this.centrosMedicosAll.filter(c => c.IdCiudad == this.filter.CodigoCiudad);
        }
        if(this.filter.CodigoCiudad == "0"){
            this.centrosMedicos = this.centrosMedicosAll;
        }
    }

    buscar(): void {
        this.prestadorService.getByFilters(this.filter).subscribe(
            result => {
                this.prestadores = result;
                this.googleAnalyticsEventsService.emitPageView("/Provider");
                this.googleAnalyticsEventsService.emitPageView("/Doctor");
            },
            error => this.authService.showErrorPopup(error)
        );
    }


    limpiar(): void {
        this.filter = new PrestadorFilter();
        this.prestadores = [];
        this.filter.CodigoCiudad = "0";
    }

    inicializarPanelPrestador(selected: Prestador): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelAgendarCita").collapse("show");

        this.loadCodigoEspecialidad(this.filter.CodigoEspecialidad, selected.IdMedico.toString(), selected);
        correctHeight();
        this.googleAnalyticsEventsService.emitPageView("/Doctor/Search");

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelAgendarCita").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    salir():void{
        this.isDesplegar = false;
    }

    crearPrestadorKey(selected: Prestador): void {
     
        var key = new Prestador();
        key.PrimerNombre = selected.PrimerNombre;
        key.SegundoNombre = selected.SegundoNombre;
        key.PrimerApellido = selected.PrimerApellido;
        key.SegundoApellido = selected.SegundoApellido;
        key.CentralMedical = selected.CentralMedical;
        key.Horario = selected.Horario;
        key.Ciudad = selected.Ciudad;
        key.Sector = selected.Sector;
        key.Especialidad = this.getNombreEspecialidad();
        key.ValorAPagar = "4.50";
        key.Calificacion = selected.Calificacion;
        key.NumeroCedula = this.filter.NumeroCedula;
        key.IdMedico = selected.IdMedico;
        key.CodigoEspecialidad = this.especialidadVeris.IdEspecialidad;
        key.CodigoCentroMedico = this.getCodigoCentroMedico(selected.CentralMedical);//this.filter.CodigoCentroMedico;
        key.Ipn = selected.Ipn;
        key.NewKey = true;
        this.prestadorKey.next(key);
    }

    crearBeneficiarioKey(): void {
        var key = new BeneficiarioPaciente();
        var ben = this.getBeneficiarioSeleccionado();

        key.FechaNacimiento = ben.FechaNacimiento;
        if (this.contratoKey.EmailDomicilio != null) {
            key.Mail = this.contratoKey.EmailDomicilio;
        } else {
            key.Mail = this.contratoKey.EmailTrabajo;
        }

        key.NumeroIdentificacion = ben.NumeroCedula;
        key.PrimerApellido = ben.PrimerApellido;
        key.PrimerNombre = ben.PrimerNombre;
        key.SegundoApellido = ben.SegundoApellido;
        key.TelefonoMovil = ben.TelefonoMovil;
        key.Genero = ben.Genero;

        if (ben.TipoIdentificacion == "CEDULA") {
            key.TipoIdentificacion = "2";
        } else {
            key.TipoIdentificacion = "3";
        }
        
        this.beneficiarioKey.next(key);
    }

    getBeneficiarioSeleccionado(): Beneficiario {
        for (let ben of this.beneficiarios) {
            if (ben.NumeroCedula == this.filter.NumeroCedula) {
                return ben;
            }
        }
        return null;
    }

    getCodigoCentroMedico(nombreCentro : string): string {
        if ( this.filter.CodigoCentroMedico == undefined){          
            for (let centro of this.centrosMedicos){
                if (centro.Nombre == nombreCentro){
                    return centro.IdCentroMedico;
                }
            }
        } else {
            return this.filter.CodigoCentroMedico;
        }        
    }

    loadCodigoEspecialidad(codigoEspecialidad: string, IdMedico: string, selected: Prestador): void {

        this.especialidadVerisFilter.CodigoEspecialidad = codigoEspecialidad;//"CAR";
        this.especialidadVerisFilter.IdMedico = IdMedico;//"1051"

        this.prestadorService.getEspecialidad(this.especialidadVerisFilter).subscribe(
            result => {
                this.especialidadVeris = result;
                this.crearPrestadorKey(selected);
                this.crearBeneficiarioKey();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    getNombreEspecialidad(): string {
        for (let esp of this.especialidades) {
            if (esp.CodigoProgress == this.filter.CodigoEspecialidad) {
                return esp.Valor.toUpperCase();
            }
        }
        return "";
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

}
