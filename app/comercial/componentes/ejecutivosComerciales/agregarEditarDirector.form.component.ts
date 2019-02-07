import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { DirectoresListComponent } from '../ejecutivosComerciales/directores.list.component';
import { AuthService } from '../../../seguridad/auth.service';
import { DirectorVendedorEntity, InputCambioDirectores } from '../../model/DirectorVendedorEntity';
import { RegionEntity, ComboSiNo, SucursalDeRegion } from '../../../common/model/genericos';
import { VendedorSucursalEntity } from '../../model/vendedorSucursalEntity';
import { GrupoVendedorEntity } from '../../model/grupoVendedorEntity';
import { TipoVendedorEntity } from '../../model/tipoVendedorEntity';
import { PersonaEntity, FilterPersona } from '../../../common/model/persona';
import { EmpresaFilter, Empresa } from '../../../common/model/empresa';

import { ServicioVentasService } from '../../service/servicioVentas.service';
import { CatalogoComercialService } from '../../service/catalogoComercial.service';
import { PersonaService } from '../../../common/servicios/persona.service';
import { ConstantesComercialService } from '../../utils/constantesComercial.service.';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { EmpresaService } from '../../../common/servicios/empresa.service';
import { Tipo } from '../../../comisiones/tipo/model/Tipo';
import { Subtipo, SubtipoSoloEntity } from '../../../comisiones/subtipo/model/subtipo';
import { Salas } from '../../../comisiones/salas/model/salas';
import { TipoService } from '../../../comisiones/tipo/service/tipo.service';
import { SalasService } from '../../../comisiones/salas/service/salas.service';
import { SubtipoService } from '../../../comisiones/subtipo/service/subtipo.service';
import { RegionService } from '../../../common/servicios/region.service';
import { ContratoKey } from '../../../common/model/contrato';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { SubtipoFilter } from '../../../comisiones/subtipo/model/subtipoFilter';
import { FiltroAgenteVenta } from '../../../comisiones/model/agenteVenta.model';





@Component({
    selector: 'agregarEditarDirectorForm',
    providers: [ServicioVentasService, PersonaService, ConstantesComercialService, EmpresaService, CatalogoComercialService],
    templateUrl: 'agregarEditarDirector.form.template.html'
})

export class AgregarEditarDirectorFormComponent implements OnInit, OnDestroy {

    suscription: any;
    opcion: string;

    fechaSalida: Date;
    nombreDirector: string;

    director: DirectorVendedorEntity;
    filterPersona: FilterPersona;
    filterEmpresa: EmpresaFilter;
    persona: PersonaEntity;
    empresa: Empresa;

    comboSiNo: ComboSiNo[] = [];
    listaSucursales: SucursalDeRegion[] = [];
    listaTipoCompleta: TipoVendedorEntity[] = [];
    listaTipo: Tipo[] = [];
    listaSubtipo: Subtipo[] = [];
    listaSalas: Salas[] = [];
    listaRegiones: RegionEntity[] = [];
    listaPersonas: PersonaEntity[] = [];
    listaEmpresas: Empresa[] = [];

    subtipos: SubtipoSoloEntity; 
    filtroAgenteVenta: FiltroAgenteVenta; 
    directorSiSalaLoTiene: DirectorVendedorEntity; 

    respuestas: object =
    [
        {
            mensaje: 'SI',
            codigo: 1
        }, {
            mensaje: 'NO',
            codigo: 0
        }
    ];


    contratoKey: ContratoKey = new ContratoKey();

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public directorService: DirectoresListComponent, public ventasService: ServicioVentasService, public personaService: PersonaService,
        public constCom: ConstantesComercialService, public utils: utilidadesGenericasService, private empresaService: EmpresaService,
        public catalogoComercialService: CatalogoComercialService, public tipoService: TipoService, public salasService: SalasService,
        public subtipoService: SubtipoService, public regionService: RegionService, public genericosService: GenericosService) {

        this.director = new DirectorVendedorEntity();
        this.filterPersona = new FilterPersona();
        this.filterEmpresa = new EmpresaFilter();
        this.persona = new PersonaEntity();
        this.empresa = new Empresa();
        this.filtroAgenteVenta = new FiltroAgenteVenta(); 

        this.suscription = this.directorService.selectDirector$.subscribe(
            (director) => {
                this.setear();  
                if (director != undefined && director.TipoTransaccion != undefined) {
                                   
                    this.director.TipoTransaccion = director.TipoTransaccion; 

                    if (this.director.TipoTransaccion == this.constCom.TIPO_TRANSACCION_INGRESAR) 
                    {
                        this.director.CodigoDirector = 0;
                        this.cargarCombos();
                    }
                    if (this.director.TipoTransaccion == this.constCom.TIPO_TRANSACCION_ACTUALIZAR)
                    {
                        this.filtroAgenteVenta.CodigoAgenteVenta = director.Codigo;

                        this.ventasService.GetAgentesVentaByFiltersPaginated(this.filtroAgenteVenta, 10).subscribe(
                            res => {                           
                                res.forEach(element => {
                                    if (element.FechaIngreso != undefined && element.FechaIngreso != null) {
                                        element.FechaIngreso = this.utils.GetDateTimeUTCTimeZone(element.FechaIngreso);
                                    }
                                    if (element.FechaSalida != undefined && element.FechaSalida != null) {
                                        element.FechaSalida = this.utils.GetDateTimeUTCTimeZone(element.FechaSalida);
                                    }
                                    if (element.FechaProduccionAgente != undefined && element.FechaProduccionAgente != null) {
                                        element.FechaProduccionAgente = this.utils.GetDateTimeUTCTimeZone(element.FechaProduccionAgente);
                                    }
                                });
    
                                this.director = res[0];                                                  
                                this.director.TipoTransaccion = director.TipoTransaccion;      
                                this.buscarPersona();

                                console.log(this.director);

                                if(this.director.ProgramaCreacion == 'Aplicacion_WEB' || this.director.ProgramaModificacion == 'Aplicacion_WEB')
                                    this.cargarCombosSiEsActualizacion();     
                                else{
                                    this.cargarCombos();
                                    this.director.Region = undefined; 
                                    this.director.CodigoSucursal = undefined; 
                                    this.director.CodigoSala = undefined; 
                                    this.director.Tipo = undefined; 
                                    this.director.CodigoSubtipo = undefined; 
                                }
                                   
                            }
                        );                                  
                    }                                                 
                }
            }
        );
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }


    ngOnInit(): void {
        this.directorSiSalaLoTiene = new DirectorVendedorEntity(); 
        this.opcion = "";
        this.cargarCombos();
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    setear() {
        //this.fechaSalida = new Date();
        this.nombreDirector = this.director.Nombre;

        this.comboSiNo = [];
        this.listaSucursales = [];
        this.listaSalas = [];
        this.listaTipoCompleta = [];
        this.listaTipo = [];
        this.listaSubtipo = [];
        this.listaRegiones = [];
        this.listaPersonas = [];
        this.listaEmpresas = [];
    }

    /*Carga de Datos Iniciales*/
    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.loadRegiones();
        }

        if (this.listaTipo.length == 0) {
            this.loadTipo();
        }

        if (this.comboSiNo.length == 0) {
            this.comboSiNo = ComboSiNo.values;
        }
    }

    cargarCombosSiEsActualizacion(){ 
        this.loadRegiones();
        this.cargarSucursal();
        this.loadSalas(); 
        this.loadTipoFromSubtipo(); 
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.listaRegiones = regiones;
            },
                error => this.authService.showErrorPopup(error));
    }

    cargarSucursal() {
        this.contratoKey.CodigoRegion = this.director.Region;
        this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result) => {
            this.listaSucursales = result;
        });
    }

    buscarPersona() {
        if (this.director.NumeroPersona != 0 && this.director.NumeroPersona != null && this.director.NumeroPersona != undefined) {
            var filterPersona = new FilterPersona();
            filterPersona.PersonaNumero = this.director.NumeroPersona;
            this.personaService.buscarPersona(filterPersona).subscribe(
                result => {
                    this.persona = result[0];
                },
                error => this.authService.showErrorPopup(error)
            )
        }
    }

    loadTipo() {
        this.tipoService.consultarTiposPadre().subscribe((result) => {
            this.listaTipo = result;
        });
    }

    loadSalas() {
        this.salasService.getSalas(this.director.CodigoSucursal).subscribe((result) => {
            this.listaSalas = result;
        });
    }

    loadSubtipos() {
        let codigoTipo = this.director.CodigoTipo != undefined ? this.director.CodigoTipo : 0;

        this.subtipoService.getSubtipoByTipos(codigoTipo).subscribe((result) => {
            this.listaSubtipo = result;
        });
    }

    loadTipoFromSubtipo(){ 
        let filtroSubtipo = new SubtipoFilter(); 
        filtroSubtipo.Codigo = Number(this.director.CodigoSubtipo); 

        this.subtipoService.getSubtipoByFilters(filtroSubtipo).subscribe(
            res => {               
                this.loadTipo(); 
                this.director.CodigoTipo = res.CodigoTipo; 
                this.loadSubtipos(); 
                this.director.CodigoSubtipo =  '' + res.Codigo; 
            }, 
            error => { 

            }
        );
    }

    /*Fin Carga de Datos Iniciales*/

    /*Actualizar Director*/
    actualizaDirector() {
        this.ventasService.ActualizaVendedor(this.director).subscribe(
            result => {
                this.authService.showSuccessPopup("Los datos del Director " + this.director.Nombre + " han sido actualizados");
                this.volverMenuPrincipal();       
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    validar(): boolean {
        if ((this.director.NumeroPersona == undefined && this.director.CodigoTipo != this.constCom.CODIGO_TIPO_BROKER && (this.director.Nombre == undefined || this.director.Nombre == null)) || (this.director.NumeroEmpresa == undefined && this.director.CodigoTipo == this.constCom.CODIGO_TIPO_BROKER) || this.director.GrupoVenta == undefined || this.director.GrupoVenta == "") {
            this.authService.showErrorPopup("Completar todos los campos");
            return false;
        }

        if (this.director.NumeroEmpresa != 0 && this.director.NumeroEmpresa != undefined && this.director.CodigoTipo != this.constCom.CODIGO_TIPO_BROKER) {
            this.authService.showErrorPopup("Una empresa no puede pertenecer al grupo " + this.director.Tipo);
            return false;
        }

        if (this.director.NumeroPersona != 0 && this.director.NumeroPersona != undefined && this.director.CodigoTipo == this.constCom.CODIGO_TIPO_BROKER) {
            this.authService.showErrorPopup("Una persona no puede pertenecer al grupo " + this.director.Tipo);
            return false;
        }

        return true;
    }
    /*Actualizar Director*/


    /*Crear Director*/
    modalBusquedaEmpresa() {
        this.filterEmpresa = new EmpresaFilter
        $('#myModalBusquedaEmpresas').modal();
    }

    salirModalBusquedaEmpresas() {
        $('#myModalBusquedaEmpresas').modal('hide');
    }

    buscarEmpresaNuevo() {
        if (this.filterEmpresa.RazonSocial == "") {
            this.filterEmpresa.RazonSocial = undefined;
        }

        if (this.filterEmpresa.RucEmpresa == "") {
            this.filterEmpresa.RucEmpresa = undefined;
        }

        this.empresaService.buscarEmpresa(this.filterEmpresa).subscribe(
            result => {
                this.listaEmpresas = result;
                this.salirModalBusquedaEmpresas();
                $('#myModalListadoEmpresas').modal();

            },
            error => this.authService.showErrorPopup(error)
        )
    }

    seleccionarEmpresa(empresa: Empresa) {
        this.empresa = new Empresa();
        this.persona = new PersonaEntity();
        this.empresa = empresa;

        this.director.NumeroPersona = undefined;
        this.director.NumeroEmpresa = this.empresa.EmpresaNumero;
        this.director.RucBroker = this.empresa.RucEmpresa;
        this.director.RazonSocialBroker = this.empresa.RazonSocial;
        $('#myModalListadoEmpresas').modal('hide');
    }


    modalBusquedaPersonas() {
        this.filterPersona = new FilterPersona
        $('#myModalBusquedaPersonas').modal();
    }

    salirModalBusquedaPersonas() {
        $('#myModalBusquedaPersonas').modal('hide');
    }

    buscarPersonaNuevo() {
        this.personaService.buscarPersona(this.filterPersona).subscribe(
            result => {
                this.listaPersonas = result;
                this.salirModalBusquedaPersonas();
                $('#myModalListadoPersonas').modal();
            },
            error => this.authService.showErrorPopup(error)
        )
    }

    seleccionarPersona(persona: PersonaEntity) {
        this.persona = new PersonaEntity();
        this.empresa = new Empresa();

        this.persona = persona;

        this.director.NumeroEmpresa = undefined;
        this.director.RazonSocialBroker = undefined;
        this.director.RucBroker = undefined;
        this.director.NumeroPersona = this.persona.NumeroPersona;
        this.director.Nombre = this.persona.NombresCompletos;
        this.director.EmailBroker = this.persona.DomicilioEmail;
        this.director.Cedula = this.persona.CedulaPersona;

        let login = this.persona.DomicilioEmail.split('@')[0];

        this.director.LoginUsuario = login;
        $('#myModalListadoPersonas').modal('hide');
    }

    confirmarCrearDirector() {
        swal({
            title: "",
            text: "<h3>Está seguro que desea ingresar a " + this.director.Nombre + " como Director</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {
                if (confirmed) {
                    this.crearDirector();
                }
            });
    }

    crearDirector() {
        this.director.CodigoDirector = this.director.Codigo;
        this.director.TipoAgenteVenta = 'Director'; 
        this.ventasService.CrearAgenteVenta(this.director).subscribe(
            result => {
                this.authService.showSuccessPopup("El Director " + this.director.Nombre + " han sido ingresado con el código " + result);
                this.director = new DirectorVendedorEntity();
                this.persona = new PersonaEntity();
                this.volverMenuPrincipal();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    /*Fin crea Director */
   
    volverMenuPrincipal() {
        this.ngOnDestroy();
        this.directorService.colapsarTab();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelVendedores").collapse("hide");
        jQuery("#divPanelDirectores").collapse("hide");
        jQuery("#divConsultar").collapse("show");
    }

    verificarSiSalaTieneDirector(){ 

        if(this.director.TipoTransaccion == this.constCom.TIPO_TRANSACCION_INGRESAR)

            this.ventasService.verificarSiSalaTieneDirector(this.director.CodigoSala).subscribe(
                res => { 
                    this.directorSiSalaLoTiene = res; 
                    if(this.directorSiSalaLoTiene.Codigo != undefined)
                    {
                        this.openDespacharDirectorModal();               
                    }
                    else{
                        this.crearDirector(); 
                    }                  
                }
            ); 

        if(this.director.TipoTransaccion == this.constCom.TIPO_TRANSACCION_ACTUALIZAR)
            this.ventasService.verificarSiSalaTieneDirector(this.director.CodigoSala, this.director.Codigo).subscribe(
                res => { 
                this.directorSiSalaLoTiene = res; 
                if(this.directorSiSalaLoTiene.Codigo != undefined)
                {
                    this.openDespacharDirectorModal();               
                }
                else{
                    this.actualizaDirector(); 
                }          
            }
        ); 

    }

    DecideSiEsActualizacionOCreacion(){ 
        if(this.director.TipoTransaccion == this.constCom.TIPO_TRANSACCION_INGRESAR)
            this.crearNuevoDirectorEnSalaConDirectorAsignado();

        if(this.director.TipoTransaccion == this.constCom.TIPO_TRANSACCION_ACTUALIZAR)   
            this.directorExistenteEnSalaConDirectorAsignado();      
    }

    crearNuevoDirectorEnSalaConDirectorAsignado(){ 

        let directoresC = new InputCambioDirectores(); 
        directoresC.DirectorNuevo = this.director; 
        directoresC.DirectorAntiguo = this.directorSiSalaLoTiene; 

        this.ventasService.CrearNuevoDirectorEnSalaConDirectorAsignado(directoresC).subscribe(
            res => { 
                if(res.includes('ERROR'))
                    this.authService.showErrorPopup(res.replace('ERROR:',''));
                else
                    this.authService.showSuccessPopup(res);
                    
                this.salirDespacharDirectorModal(); 
            },
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }

    directorExistenteEnSalaConDirectorAsignado(){ 

        let directoresC = new InputCambioDirectores(); 
        directoresC.DirectorNuevo = this.director; 
        directoresC.DirectorAntiguo = this.directorSiSalaLoTiene; 

        this.ventasService.directorExistenteEnSalaConDirectorAsignado(directoresC).subscribe(
            res => { 
                if(res.includes('ERROR'))
                    this.authService.showErrorPopup(res.replace('ERROR:',''));
                else
                    this.authService.showSuccessPopup(res);
                    
                this.salirDespacharDirectorModal(); 
            },
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }

    escogerCrearModificarDirectorSala(){
        
    }

    openDespacharDirectorModal() {
        $('#modalDespachaDirector').modal();
    }

    salirDespacharDirectorModal() {
        $('#modalDespachaDirector').modal('hide');
    }
}