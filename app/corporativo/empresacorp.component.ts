import { Component, OnInit, ElementRef, ChangeDetectorRef, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { GrupoService } from '../common/servicios/grupo.service';
import { Grupo, GrupoSearch } from '../common/model/grupo';
import { ConstantService } from '../utils/constant.service';
import { CorporativoService } from '../common/servicios/corporativo.service';
import { AgenteService } from '../common/servicios/agente.service';
import { CorporativoEntity, CorporativoFilter, EmpresaCoorporativo, EmpresaDireccion, PersonaEntity } from '../common/model/corporativo';
import { Actividad } from '../common/model/actividad';
import { Usuario } from '../common/model/usuario';
import { ContratoEntityFilter, ContratoEntityList } from '../common/model/contrato';
import { Agente } from '../common/model/agente';
import { Sociedad } from '../common/model/sociedad';
import { SubSucursal, Sucursal, SucursalNombre } from '../common/model/sucursal';
import { Catalogo, TraslateCiudades } from '../common/model/catalogo';
import { Rol } from '../common/model/rol';
import { Region } from '../common/model/region';
import { Unidad } from '../common/model/unidad';
import { TransaccionService } from '../common/servicios/transaccion.service';
import { ActividadService } from '../common/servicios/actividad.service';
import { HttpClient } from '@angular/common/http';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { RolService } from '../common/servicios/rol.service';
import { SociedadService } from '../common/servicios/sociedad.service';
import { RegionService } from '../common/servicios/region.service';
import { Convenio, ConvenioFilter } from '../common/model/convenio';
import { ConvenioService } from '../common/servicios/convenio.service';

@Component({
    providers: [CorporativoService, AgenteService],
    templateUrl: 'empresacorp.template.html'
})

export class EmpresaCorpComponent implements OnInit {

    // variable para mostras seccion portal contratante por el momento false hasta fase 2
    visiblePortalContratante: boolean;
    visibleBotonSubCobertura: boolean;
    subSucursaArray: SubSucursal[];
    subSucursalEXE: SubSucursal;
    subSucursalDEN: SubSucursal;
    subSucursalONC: SubSucursal;
    subSucursalTRA: SubSucursal;

    // array de sucursales muchos
    subSucursalEXEArray: SubSucursal[];
    subSucursalDENArray: SubSucursal[];
    subSucursalONCArray: SubSucursal[];
    subSucursalTRAArray: SubSucursal[];


    seleccionExe: number;
    seleccionDEN: number;
    seleccionONC: number;
    seleccionTRA: number;
    // variable global para habilitar o desabilitar bones de edicion y guardado al trabajar con listas
    estaEnEdicion: boolean;
    // variable para envio de mails
    notificar: boolean;

    // Variable para saber si se muestra el formulario o el editor
    showEditor: boolean;
    // Variable para saber si se trata de un nuevo registro
    esNuevo: boolean;
    // para tomar los valores de los filtros
    filter: CorporativoFilter;
    // listado de objetos consultado
    empresasList: EmpresaCoorporativo[];
    // variable para almacenar la empresa seleccionada
    empresa: EmpresaCoorporativo;
    // estructura para actualizacion
    errors: Array<string> = [];
    corporativo: CorporativoEntity; // objeto que tiene la estructura de completa de la empresa, roles , usuarios, sucursales

    // temporal para verificar actualizacion
    coporativoTemporal: CorporativoEntity;

    agentes: Agente[]; // combo
    regiones: Region[]; // combo
    grupos: Grupo[]; // combo
    usuari: Usuario;
    users: Usuario[];
    actividades: Actividad[]; // combo
    formaPago: Sociedad[]; // comobo
    sociedades: Sociedad[]; // combo
    contrato: ContratoEntityList[];
    ciudades: Catalogo[]; // combo
    traslateCiudades: TraslateCiudades[];
    traslCiudades: TraslateCiudades;
    sectoresCompletos: Catalogo[]; // combo
    sectoresFiltrados: Catalogo[];

    empresaDireccion: EmpresaDireccion; // objeto direccion de la empresa
    sucursalNombre: SucursalNombre;
    sucursalesNombre: SucursalNombre[];
    // creo un objeto temporal que me servira para cargar las listas atadas
    sucursalesConfiguradas: Sucursal[];
    sucursalesEXE: Sucursal[];
    sucursalesDEN: Sucursal[];
    sucursalesONC: Sucursal[];
    sucursalesTRA: Sucursal[];
    ExeSeccionVisible: boolean;
    DenSeccionVisible: boolean;
    OncSeccionVisible: boolean;
    TraSeccionVisible: boolean;

    Conta = 2000;
    values = ' caracteres restantes';
    Mensaje = this.Conta + this.values;
    MensajeVision = this.Conta + this.values;
    unidades: Unidad[];
    sucursalessalud: Sociedad[];
    // para cargar el tipo de documento
    tiposDocumento: String[];
    // para tomar fechas se filtraran solo los dias
    /** parametros para la toma de datos especificos de actualizacion **/
    fechaInicioSursalEdit: Date;
    fechaFinSursalEdit: Date;
    regionEdit: string;
    ejecutivoResponsableEdit: string;
    fechaBloqueoEdit: Date;
    garantiaEdit: boolean;
    odasEdit: number;
    tipoTarjetaEdit: string;
    fechatemporal: Date;
    /** fin parametros **/
    /** Variables temporales **/
    direccionTemporal: string;
    ExisteError: boolean;
    mensajeError: String;
    // variables utlizadas para validar campos formulario
    cedularRepresentante: boolean;
    filtroPrestador: string;
    popupTitle: string = "Listado";
    agenteTemporal: Agente[];
    actCedula: boolean;
    actRepresentate: boolean;
    existeErroresValidacion: boolean;
    mensajeErroresValidacion: string;
    BusquedaTemporal: string;
    /**fin**/
    notificacionCobranzas: number;
    notificacionPrefactura: number;
    tipoDocumentoRepresentate: String;
    tipoDocumentoUsuario: String;
    selectedFile: File = null;
    roles: Rol[];
    filterContrato: ContratoEntityFilter;
    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };
    // elementos de alidacion de insercion y actualizacion
    usuarioValido: boolean;
    modalShow = false;
    // Constructor, se ejecuta al inicializar el proceso, inicializa las variables
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private constantService: ConstantService,
        private corporativoService: CorporativoService, public transaccionService: TransaccionService, private regionService: RegionService,
        private grupoService: GrupoService, private rolService: RolService, private agenteService: AgenteService,
        private actividadService: ActividadService, private sociedadService: SociedadService,
        private catalogoService: CatalogoService, private fileService: CorporativoService,
        private http: HttpClient) {
        this.showEditor = false;
        this.esNuevo = false;
        this.filter = new CorporativoFilter(); // inicializacion para los filtros
        this.empresasList = [];
        // para proceso de creacion
        this.corporativo = new CorporativoEntity();
        this.coporativoTemporal = new CorporativoEntity();
        this.corporativo.Empresa = new EmpresaCoorporativo();
        this.corporativo.Sucursal = new Sucursal();
        this.corporativo.Sucursales = [];
        this.sucursalNombre = new SucursalNombre();
        this.filterContrato = new ContratoEntityFilter();
        this.usuari = new Usuario();
        this.usuari.rol = new Rol;
        this.corporativo.Empresa.PorcentajeComisionBroker = 5;
        this.empresaDireccion = new EmpresaDireccion();
        this.sectoresCompletos = [];
        this.sectoresFiltrados = [];
        this.regiones = [];
        this.users = [];
        this.grupos = [];
        this.sucursalesNombre = [];
        this.formaPago = [];
        // validacion de usuario
        this.usuarioValido = false;
        this.tiposDocumento = [];
        this.tipoDocumentoRepresentate = 'CÉDULA';
        this.tipoDocumentoUsuario = 'CÉDULA';
        this.notificacionCobranzas = 0;
        this.notificacionPrefactura = 0;
        /** para parametros de actualizacion**/
        this.fechaInicioSursalEdit = new Date();
        this.fechaFinSursalEdit = new Date();
        this.traslateCiudades = [];
        this.ExisteError = false;
        this.actCedula = true;
        this.actRepresentate = true;
        this.tipoTarjetaEdit = 'BLANCA';
        this.BusquedaTemporal = '';
        this.existeErroresValidacion = false;
        // hasta segunda fase
        this.visiblePortalContratante = true;
        this.sucursalesConfiguradas = [];
        this.sucursalesEXE = [];
        this.sucursalesDEN = [];
        this.sucursalesONC = [];
        this.sucursalesTRA = [];
        this.ExeSeccionVisible = false;
        this.DenSeccionVisible = false;
        this.OncSeccionVisible = false;
        this.TraSeccionVisible = false;
        this.subSucursaArray = [];
        this.visibleBotonSubCobertura = false
        this.estaEnEdicion = false;
        this.notificar = true;
    }

    // Corre cuando Angular está cargado y todos los componentes descargados
    // sirve para inizializar los datos
    ngOnInit(): void {
        // No muestro nada en pantalla inicialmente, hasta que ponga un criterio de búsqueda
        // Si deseo cargar de entrada, llamo a buscar simplemente
        this.consultar();
        this.loadRegiones();
        this.loadAgentes();
        this.consultarRoles();
        this.loadGrupos();
        this.loadActividades();
        //this.loadFormaPago();
        this.consultarSociedad();
        this.consultarUnidades();
        this.consultarSucursales();
        this.consultarCiudades();
        this.consultarSectores();
        // cargar tipoDocumento;
        this.tiposDocumento = ['CÉDULA', 'PASAPORTE'];
    }

    // Método que indica si se activa el botón buscar, cuando se quiere poner una validación para poder buscar y no traiga toda la base
    puedeBuscar(): boolean {
        let numeroLLeno = true;
        if (this.filter.Numero === undefined) {
            numeroLLeno = false;
        }
        if (this.filter.Numero === 0) {
            numeroLLeno = false;
        }
        let razonLLeno = true;
        if (this.filter.RazonSocial === undefined) {
            razonLLeno = false;
        }
        if (this.filter.RazonSocial === '') {
            razonLLeno = false;
        }
        let rucLLeno = true;
        if (this.filter.Ruc === undefined) {
            rucLLeno = false;
        }
        if (this.filter.Ruc === '') {
            rucLLeno = false;
        }
        if (numeroLLeno || rucLLeno || razonLLeno) {
            return true;
        } else {
            return false;
        }
    }

    // metodo para realizar la busqueda de todo
    loadData(corporativo: EmpresaCoorporativo[]): void {
        this.empresasList = corporativo;
    }
    consultar(): void {
        this.existeErroresValidacion = false;
        this.mensajeErroresValidacion = '';
        this.corporativoService.resetDefaultPaginationConstanst();
        this.buscar();

    }
    buscar(): void {
        this.corporativoService.getByFiltersPaginated(this.filter)
            .subscribe(corporativo => {
                this.loadData(corporativo);
                if (corporativo != undefined && corporativo.length > 0) {
                    var inipos = jQuery("#ResultadoBusquedaCorporativo").position().top;
                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                }
            },
                error => this.authService.showErrorPopup(error));
    }
    // metodo para buscar cada vez que se cambien de pestaña
    pageChanged(): void {
        this.buscar();
    }
    // Mètodo que trae todos los registros que tiene esta tabla (solamente para transacciones de pocos registros)
    traerTodos(): void {
        this.consultar();
    }
    // Método que limpia los campos de búsqueda
    limpiarBusqueda(): void {
        this.corporativoService.resetDefaultPaginationConstanst();
        this.filter = new CorporativoFilter();
        this.empresasList = [];
    }

    // Método que abre el formulario de edición, para crear un nuevo registro
    nuevo(): void {
        // marca como nuevo
        this.esNuevo = true;
        // Abre el panel de edición
        this.showEditor = true;
        this.limpiarReiniciarControles();
    }

    // Método invocado para abrir la edición, invocado desde los items de la lista
    abrirEdicion(empresa: number): void {
        // Abre el panel de edición
        this.existeErroresValidacion = false;
        this.mensajeErroresValidacion = '';
        this.showEditor = true;
        this.esNuevo = false;
        //this.corporativo = this.coporativoTemporal
        // real
        this.corporativoService.ObtenerEmpresaSucursales(empresa)
            .subscribe(result => {
                console.log(result);
                //  //console.log(actividades)
                this.corporativo = result;
                // verificamos si la estructura es la correcta
                this.verificarEstructuraCompleta();
                this.cargarDatosActualizacion();

            },
                error => this.authService.showErrorPopup(error));

    }
    /** Metodos de carga de combos de formulario **/
    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                // //console.log(regiones)
                this.regiones = regiones;
            },
                error => this.authService.showErrorPopup(error));
    }
    loadAgentes(): void {
        this.agenteService.getAgentes("AS")
            .subscribe(agentes => {
                //console.log(agentes)
                this.agentes = agentes;
                this.agenteTemporal = this.agentes;
            },
                error => this.authService.showErrorPopup(error));
    }
    consultarRoles(): void {
        this.corporativoService.getRoles().subscribe(
            result => {
                this.roles = result;
                ////console.log(result);
            },
            error => console.log(error)
        );
    }
    loadGrupos(): void {
        this.grupoService.GetGrupos()
            .subscribe(grupos => {
                //    console.log(grupos)
                this.grupos = grupos;
            },
                error => this.authService.showErrorPopup(error));
    }
    loadActividades(): void {
        this.corporativoService.getCatalogoGen("TIPACTIV")
            .subscribe(actividades => {
                this.actividades = actividades;
                //console.log(actividades)
            },
                error => this.authService.showErrorPopup(error));
    }
    /*loadFormaPago(): void {
        this.corporativoService.getCatalogoGen("FORPAGO")
            .subscribe(pago => {
                    //  console.log(pago)
                    this.formaPago = pago;
                },
                error => this.authService.showErrorPopup(error));
    }*/
    onChangeCiudad(codCiudad: number): void {
        //this.corporativo.Empresa.Zona = undefined;
        if (codCiudad != undefined && codCiudad != 0 && this.sectoresCompletos != undefined) {
            var ciudad = this.ciudades.find(c => c.CodigoProgress == codCiudad.toLocaleString());
            if (ciudad != undefined) {
                this.sectoresFiltrados = this.sectoresCompletos.filter(s => s.CodigoProgress == ciudad.Codigo);
            }
        }
        else
            this.sectoresFiltrados = [];
    }
    onChangeFechaCobreanza(): void {
        this.corporativo.Empresa.NotificacionCopago = this.notificacionCobranzas;
        this.corporativo.Empresa.DigitadorCreacion
    }
    onChangeFechaAnual(): void {
        var nuevoAnio = '' + (this.corporativo.Sucursal.FechaInicio.getFullYear() + 1) + '-' + (this.corporativo.Sucursal.FechaInicio.getUTCMonth() + 1) + '-' + this.corporativo.Sucursal.FechaInicio.getUTCDate();
        this.corporativo.Sucursal.FechaFin = new Date(nuevoAnio);
    }
    onChangeFechaActualizacionAnual() {
        var nuevoAnio = '' + (this.fechaInicioSursalEdit.getFullYear() + 1) + '-' + (this.fechaInicioSursalEdit.getUTCMonth() + 1) + '-' + this.fechaInicioSursalEdit.getUTCDate();
        this.fechaFinSursalEdit = new Date(nuevoAnio);
    }
    onChangeFechaprefactura(): void {
        this.corporativo.Empresa.NotificacionPrefactura = this.notificacionPrefactura;
    }
    consultarSociedad(): void {
        this.corporativoService.getCatalogoGen('TIPSOCIE').subscribe(
            result => {
                this.sociedades = result;
                // console.log(result);
            },
            error => console.log(error)
        );
    }
    consultarUnidades(): void {
        this.corporativoService.getUnidadesResponsables().subscribe(
            result => {
                this.unidades = result;
                //console.log(result);
            },
            error => console.log(error)
        );
    }

    consultarSucursales(): void {
        this.corporativoService.getSucursales().subscribe(
            result => {
                this.sucursalessalud = result;
                //console.log(result);
            },
            error => console.log(error)
        );
    }
    consultarCiudades(): void {
        if (this.traslateCiudades === undefined || this.traslateCiudades.length === 0) {
            this.catalogoService.getCiudadesForOdas().subscribe(
                result => {
                    for (let ciudadBuscada of result) {
                        this.traslCiudades = new TraslateCiudades();
                        this.traslCiudades.Name = ciudadBuscada.Valor;
                        this.traslCiudades.Id = Number(ciudadBuscada.CodigoProgress);
                        this.traslateCiudades.push(this.traslCiudades);
                    }
                    this.ciudades = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }
    consultarSectores(): void {
        if (this.sectoresCompletos === undefined || this.sectoresCompletos.length === 0) {
            this.catalogoService.getSectoresForOdas().subscribe(
                result => {
                    this.sectoresCompletos = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }
    /** Procesos con Listas Usuarios y Sucursales **/
    // verificacion de la cedula
    onKeyUsuario(event: any) { // without type info
        const x = jQuery("#CedulaUsuario").val().length;
        if (x > 10)
            this.tipoDocumentoUsuario = 'RUC';
        else
            this.tipoDocumentoUsuario = 'CÉDULA';
        if (x >= 10) {
            this.filtrarUsuario();
        }
    }
    onKeyRepresentante(event: any) { // without type info
        const x = jQuery("#CedulaRepresentante").val().length;
        if (x > 10)
            this.tipoDocumentoRepresentate = 'RUC';
        else
            this.tipoDocumentoRepresentate = 'CÉDULA';
        if (x >= 10)
            this.filtrarRepresentante();
    }
    // Se verifica si el usuario existe, si es asi se cargan los datos del mismo ya en el formulario
    filtrarUsuario(): void {
        this.corporativoService.ObtenerPersonaPorNumeroIdentificacion(this.usuari.Cedula)
            .subscribe(PersonaEntity => {
                let x: PersonaEntity = PersonaEntity;
                if (x !== undefined && x.Primer_Nombre !== undefined) {
                    if(x.Primer_Nombre === null) x.Primer_Nombre ='';
                    if(x.Segundo_Nombre === null) x.Segundo_Nombre ='';
                    if(x.Primer_Apellido === null) x.Primer_Apellido ='';
                    if(x.Segundo_Apellido === null) x.Segundo_Apellido ='';
                    this.usuari.NombreApellido = x.Primer_Nombre + ' ' + x.Segundo_Nombre + ' ' + x.Primer_Apellido + ' ' + x.Segundo_Apellido;
                    this.usuari.Email = x.Email_Personal;
                    this.usuari.NombreUsuario = x.Identificacion;
                    this.usuari.Contrasena = x.Identificacion;
                    this.usuari.Telefono = x.Telefono_Domicilio;
                } else {
                    this.usuari.NombreApellido = '';
                    this.usuari.Email = '';
                    this.usuari.NombreUsuario = '';
                    this.usuari.Contrasena = '';
                    this.usuari.Telefono = '';
                }
            },
                error => this.authService.showErrorPopup(error));


    }
    // Se verifica si el usuario existe, si es asi se cargan los datos del mismo ya en el formulario
    filtrarRepresentante(): void {
        const filterTrans = new ContratoEntityFilter();
        // filterTrans.NumeroCedula = this.corporativo.Empresa.CedulaRepresentante;
        this.corporativoService.ObtenerPersonaPorNumeroIdentificacion(this.corporativo.Empresa.CedulaRepresentante)
            .subscribe(PersonaEntity => {
                let x: PersonaEntity = PersonaEntity;
                if (x !== undefined && x.Primer_Nombre !== undefined) {
                    if(x.Primer_Nombre === null) x.Primer_Nombre ='';
                    if(x.Segundo_Nombre === null) x.Segundo_Nombre ='';
                    if(x.Primer_Apellido === null) x.Primer_Apellido ='';
                    if(x.Segundo_Apellido === null) x.Segundo_Apellido ='';
                    this.corporativo.Empresa.NombresRepresentante = x.Primer_Nombre + ' ' + x.Segundo_Nombre;
                    this.corporativo.Empresa.ApellidosRepresentante = x.Primer_Apellido + ' ' + x.Segundo_Apellido;
                    this.corporativo.Empresa.RepresentanteMail = x.Email_Personal;
                    this.corporativo.Empresa.RepresentanteTelefono = x.Telefono_Domicilio;
                    this.corporativo.Empresa.RepresentanteCelular = x.Telefono_Trabajo;
                } else {
                    this.corporativo.Empresa.NombresRepresentante = '';
                    this.corporativo.Empresa.ApellidosRepresentante = '';
                    this.corporativo.Empresa.RepresentanteMail = '';
                    this.corporativo.Empresa.RepresentanteTelefono = '';
                    this.corporativo.Empresa.RepresentanteCelular = '';
                }
            },
                error => this.authService.showErrorPopup(error));
    }
    //verificar ingreso de usuario
    // verificamos que los campos esten llenos para permitir agregar al usuario
    validarUsuario(): boolean {
        //console.log(this.usuari);
        if (this.usuari.Cedula === undefined) {
            return false;
        }
        if (this.usuari.Cedula === '') {
            return false;
        }
        if (this.usuari.NombreApellido === undefined) {
            return false;
        }
        if (this.usuari.NombreApellido === '') {
            return false;
        }
        if (this.usuari.Email === undefined) {
            return false;
        }
        if (this.usuari.Email === '') {
            return false;
        }
        if (this.usuari.Telefono === undefined) {
            return false;
        }
        if (this.usuari.Telefono === '') {
            return false;
        }
        if (this.usuari.TelefonoFijo === undefined) {
            return false;
        }
        if (this.usuari.TelefonoFijo === '') {
            return false;
        }
        if (this.usuari.Extension === undefined) {
            return false;
        }
        if (this.usuari.Extension === '') {
            return false;
        }
        if (this.usuari.rol.Id === undefined) {
            return false;
        }
        if (this.usuari.rol.Id === 0) {
            return false;
        }
        return true;
    }
    // verificacion de los campos sucursal
    validarSucursal(): boolean {
        if (this.sucursalNombre.nivel === undefined || this.sucursalNombre.nivel === '') {
            return false;
        }
        if (this.sucursalNombre.max === undefined || this.sucursalNombre.max === '') {
            return false;
        }
        if (this.sucursalNombre.descripcion === undefined || this.sucursalNombre.descripcion === '') {
            return false;
        }
        if (this.sucursalNombre.alias === undefined || this.sucursalNombre.alias === '') {
            return false;
        }
        if (this.sucursalNombre.producto === undefined || this.sucursalNombre.producto === '') {
            return false;
        }
        if (this.sucursalNombre.coberturas === undefined || this.sucursalNombre.coberturas === '') {
            return false;
        }

        if (!this.esNuevo) {
            if (this.fechaInicioSursalEdit === undefined || this.fechaInicioSursalEdit === null) {
                return false;
            }
            if (this.fechaFinSursalEdit === undefined || this.fechaFinSursalEdit === null) {
                return false;
            }
        }
        return true;
    }
    // Cambiar direccion
    changeDireccion() {
        let dir = "";
        if (this.empresaDireccion.calle1 != "undefined") {
            if (dir != "undefined") {
                dir = dir + this.empresaDireccion.calle1;
            } else {
                dir = this.empresaDireccion.calle1;
            }
        }
        if (this.empresaDireccion.calle2 != "undefined") {
            if (dir != "undefined") {
                dir = dir + " " + this.empresaDireccion.calle2;
            } else {
                dir = this.empresaDireccion.calle2;
            }
        }
        if (this.empresaDireccion.referencia != "undefined") {
            if (dir != "undefined") {
                dir = dir + " " + this.empresaDireccion.referencia;
            } else {
                dir = this.empresaDireccion.referencia;
            }
        }
        this.corporativo.Empresa.Calle = dir;
    }
    // insertamos el usuario a la lista de usuarios
    InsertarUsuarioTabla() {
        this.estaEnEdicion = false;
        //console.log(this.usuari);
        this.roles.forEach(element => {
            // console.log(element);
            if (this.usuari.rol.Id == element.Id) {
                this.usuari.rol.Nombre = element.Nombre;
            }
        });
        this.users.push(this.usuari);
        this.corporativo.Usuarios = this.users;
        // Reiniciamos para que cada vez que se agregue se ingrese un nuevo objeto
        this.usuari = new Usuario();
        this.usuari.rol = new Rol;
    }
    // editar usuario de tabla
    updateUsuario(usuario: Usuario): void {
        this.estaEnEdicion = true;
        this.actCedula = false;
        this.actRepresentate = false;
        this.usuari = usuario;
        if (this.usuari.rol === null || this.usuari.rol === undefined) {
            this.usuari.rol = new Rol();
            this.usuari.Id = 0;
        }
        this.tipoDocumentoUsuario = 'CÉDULA';
        this.users = this.users.filter(obj => obj !== usuario);
        this.corporativo.Usuarios = this.users;
    }
    // eliminar usuario tabla
    deleteUsuario(usuario: Usuario): void {
        this.users = this.users.filter(obj => obj !== usuario);
        this.corporativo.Usuarios = this.users;
    }
    // notificar usuario tabla
    mailUsuario(usuario: Usuario): void {
        // enviar el mail de notificacion
        let corporativoUsuario = new CorporativoEntity();
        corporativoUsuario.Usuarios = [];
        corporativoUsuario.Usuarios.push(usuario);
        this.corporativoService.notificarUsuariosCorporativos(corporativoUsuario).subscribe(
            result => {
                console.log(result);
                // entonces tomo nuevamente el objeto que recibo de vuelto y lo cargo para edicion
                if (result === null || result === undefined || result === false) {
                    this.authService.showErrorPopup("Tuvimos un problema al notificar al correo electrónico. Error:" + result + ", por favor recargue la página e intentelo de nuevo.");
                } else {
                    this.authService.showSuccessPopup("Se notificó al correo electrónico del usuario seleccionado");
                }
            },
            error => {
                console.log(error);
                this.authService.showErrorPopup("No fue posible enviar el correo electrónico al usuario, por favor intentelo más tarde.");
            }
        );
    }
    NotificarTodosUsuarios():void{
        // enviar el mail de notificacion
        let corporativoUsuario = new CorporativoEntity();
        corporativoUsuario.Usuarios = [];
        corporativoUsuario.Usuarios = this.corporativo.Usuarios;
        this.corporativoService.notificarUsuariosCorporativos(corporativoUsuario).subscribe(
            result => {
                console.log(result);
                // entonces tomo nuevamente el objeto que recibo de vuelto y lo cargo para edicion
                if (result === null || result === undefined || result === false) {
                    this.authService.showErrorPopup("Tuvimos un problema al notificar al correo electrónico. Error:" + result + ", por favor recargue la página e intentelo de nuevo.");
                } else {
                    this.authService.showSuccessPopup("Se notificó al correo electrónico del usuario seleccionado");
                }
            },
            error => {
                console.log(error);
                this.authService.showErrorPopup("No fue posible enviar el correo electrónico al usuario, por favor intentelo más tarde.");
            }
        );
    }
    // Insertar los planes
    InsertarSucursalTabla() {
        this.estaEnEdicion = false;
        //creamos el objeto sucursal que se agregara al objeto general de envio
        let suc = new Sucursal();
        suc = this.sucursalNombre.sucursal;
        if (suc === undefined)
            suc = new Sucursal();
        this.sucursalNombre.descripcion = this.sucursalNombre.descripcion.toUpperCase();
        suc.Nombre = this.sucursalNombre.descripcion.toUpperCase() + " MAX:" + this.sucursalNombre.max + " Nivel:" + this.sucursalNombre.nivel;
        this.sucursalNombre.alias = this.sucursalNombre.alias.toUpperCase();
        suc.Alias = this.sucursalNombre.alias.toUpperCase();//alias
        suc.CodigoProducto = this.sucursalNombre.producto;
        suc.TipoCobertura = this.sucursalNombre.coberturas;
        suc.EsOpcional = false;//this.sucursalNombre.esOpcional;
        suc.FechaFin = this.fechaFinSursalEdit;
        suc.FechaInicio = this.fechaInicioSursalEdit;
        suc.FechaBloqueo = this.fechaBloqueoEdit;
        if (this.esNuevo)
            suc.TipoTarjeta = 'AZUL';
        else { //al no ser nuevos ya deben venir desde bd
            if (this.sucursalNombre.subSucursal !== undefined && this.sucursalNombre.producto === 'COR')
                suc.Configuracion = this.sucursalNombre.subSucursal;
            else
                suc.Configuracion = null;
            suc.TipoTarjeta = this.tipoTarjetaEdit;
            suc.NumeroOdas = this.odasEdit;
            suc.PresentaGarantia = this.garantiaEdit;
        }
        //agregamos el objetosucursal al temporal para mostrar en pantalla
        this.sucursalNombre.sucursal = suc;
        this.sucursalesNombre.push(this.sucursalNombre);
        //Reinicio los Comtroles
        this.corporativo.Sucursales.push(suc);
        this.sucursalNombre = new SucursalNombre();
        this.fechaFinSursalEdit = new Date();
        this.fechaInicioSursalEdit = new Date();
        this.regionEdit = null;
        this.ejecutivoResponsableEdit = null;
        this.fechaBloqueoEdit = new Date();
        this.garantiaEdit = false;
        this.odasEdit = null;
        this.tipoTarjetaEdit = null;
        this.visibleBotonSubCobertura = false;
    }
    // editar sucursalTabla
    updateSucursalTabla(sucursalNombre: SucursalNombre) {
        this.estaEnEdicion = true;
        this.modalShow = true;
        this.sucursalNombre = sucursalNombre;
        if (this.sucursalNombre.sucursal !== undefined) {
            if (sucursalNombre.sucursal.FechaInicio !== undefined)
                this.fechaInicioSursalEdit = new Date(sucursalNombre.sucursal.FechaInicio);
            if (sucursalNombre.sucursal.FechaInicio !== undefined)
                this.fechaFinSursalEdit = new Date(sucursalNombre.sucursal.FechaFin);
            if (sucursalNombre.sucursal.FechaBloqueo !== undefined)
                this.fechaBloqueoEdit = sucursalNombre.sucursal.FechaBloqueo;
            if (sucursalNombre.sucursal.PresentaGarantia != undefined)
                this.garantiaEdit = sucursalNombre.sucursal.PresentaGarantia;
            if (sucursalNombre.sucursal.NumeroOdas !== undefined)
                this.odasEdit = sucursalNombre.sucursal.NumeroOdas;
            if (sucursalNombre.sucursal.TipoTarjeta !== undefined)
                this.tipoTarjetaEdit = sucursalNombre.sucursal.TipoTarjeta;
            if (sucursalNombre.producto !== undefined)
                this.sucursalNombre.producto = sucursalNombre.producto;
        }
        //this.sucursalesNombre = this.sucursalesNombre.filter(obj => obj !== sucursalNombre);
        this.deleteSucursalTabla(sucursalNombre);
        //activo desactivo boton de subcoberturas dependiendo si es cobertura COR
        if (!this.esNuevo) {
            if (sucursalNombre.sucursal.CodigoProducto === 'COR') {
                this.visibleBotonSubCobertura = true;
                //cargo
            }
            else {
                this.visibleBotonSubCobertura = false;
            }
        }
    }
    // eleminar sucursal tabla
    deleteSucursalTabla(sucursal: SucursalNombre) {
        this.sucursalesNombre = this.sucursalesNombre.filter(obj => obj !== sucursal);//quito de pantalla
        this.corporativo.Sucursales = this.corporativo.Sucursales.filter(obj => obj !== sucursal.sucursal);//quito de objeto general
    }
    /** VERIFICACION Y PROCESO DE GUARDADO **/
    verificarDatosGuardado(): string {
        let MensajeError = '';
        if (this.corporativo.Empresa.Ruc === '' || this.corporativo.Empresa.Ruc === undefined) {
            MensajeError += ' El campo Ruc de la sección Datos Generales Smartplan No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.RazonSocial === '' || this.corporativo.Empresa.RazonSocial === undefined) {
            MensajeError += ' El campo Razón Social de la sección Datos Generales Smartplan No puede estar vacío.-';
        }
        //if (this.corporativo.Empresa. === 0 || this.corporativo.Empresa. === undefined) {
        //    MensajeError += ' El campo Grupo de la sección Datos Generales Corporativo No puede estar vacío.-';
        //}
        if (this.corporativo.Sucursal.Region === '' || this.corporativo.Sucursal.Region === undefined) {
            MensajeError += 'El campo Región de la sección Datos Generales Smartplan No puede estar vacío.-';
        }
        if (this.esNuevo) {
            if (this.corporativo.Sucursal.FechaInicio === null || this.corporativo.Sucursal.FechaInicio === undefined) {
                MensajeError += 'El campo Fecha Desde de la sección Datos Generales Smartplan No puede estar vacío.-';
            }
            if (this.corporativo.Sucursal.FechaFin === null || this.corporativo.Sucursal.FechaFin === undefined) {
                MensajeError += 'El campo Fecha Fin de la sección Datos Generales Smartplan No puede estar vacío.-';
            }
        }
        if (this.corporativo.Empresa.TipoSociedad === '' || this.corporativo.Empresa.TipoSociedad === undefined) {
            MensajeError += 'El campo TipoSociedad de la sección Datos Generales Smartplan No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.CodigoActividad === 0 || this.corporativo.Empresa.CodigoActividad === undefined) {
            MensajeError += 'El campo Actividad de la sección Datos Generales Smartplan No puede estar vacío.-';
        }
        if (this.corporativo.Sucursal.UnidadResponsable === '' || this.corporativo.Sucursal.UnidadResponsable === undefined) {
            MensajeError += 'El campo Ejecutivo Responsable de la sección Datos Generales Smartplan No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.CedulaRepresentante === '' || this.corporativo.Empresa.CedulaRepresentante === undefined) {
            MensajeError += 'El campo Cédula/Pasaporte de la sección Representante Legal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.NombresRepresentante === '' || this.corporativo.Empresa.NombresRepresentante === undefined) {
            MensajeError += 'El campo Nombre de la sección Representante Legal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.ApellidosRepresentante === '' || this.corporativo.Empresa.ApellidosRepresentante === undefined) {
            MensajeError += 'El campo Apellidos de la sección Representante Legal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.RepresentanteTelefono === '' || this.corporativo.Empresa.RepresentanteTelefono === undefined) {
            MensajeError += 'El campo Teléfono de la sección Representante Legal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.RepresentanteMail === '' || this.corporativo.Empresa.RepresentanteMail === undefined) {
            MensajeError += 'El campo Email de la sección Representante Legal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.CargoRepresentante === '' || this.corporativo.Empresa.CargoRepresentante === undefined) {
            MensajeError += 'El campo Cargo de la sección Representante Legal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.RepresentanteCelular === '' || this.corporativo.Empresa.RepresentanteCelular === undefined) {
            MensajeError += 'El campo Celular de la sección Representante Legal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.CodigoCiudad === 0 || this.corporativo.Empresa.CodigoCiudad === undefined) {
            MensajeError += 'El campo Ciudad de la sección Datos de Contacto No puede estar vacío.-';
        }

        if (this.corporativo.Empresa.Barrio === '' || this.corporativo.Empresa.Barrio === undefined) {
            MensajeError += 'El campo Barrio de la sección Datos de Contacto No puede estar vacío.-';
        }
        if (this.esNuevo) {
            if (this.empresaDireccion.calle1 === '' || this.empresaDireccion.calle1 === undefined) {
                MensajeError += 'El campo Dirección de la sección Datos de Contacto No puede estar vacío.-';
            }
            if (this.empresaDireccion.calle2 === '' || this.empresaDireccion.calle2 === undefined) {
                MensajeError += 'El campo Calle Secundaria de la sección Datos de Contacto No puede estar vacío.-';
            }
            if (this.empresaDireccion.referencia === '' || this.empresaDireccion.referencia === undefined) {
                MensajeError += 'El campo Referencia de la sección Datos de Contacto No puede estar vacío.-';
            }
        } else {
            if (this.direccionTemporal === '' || this.direccionTemporal === undefined) {
                MensajeError += 'El campo Dirección de la sección Datos de Contacto No puede estar vacío.-';
            }
        }
        if (this.corporativo.Empresa.Telefono === '' || this.corporativo.Empresa.Telefono === undefined) {
            MensajeError += 'El campo Teléfono de la sección Datos de Contacto No puede estar vacío.-';
        }
        if (this.corporativo.Usuarios === undefined || this.corporativo.Usuarios === null || this.corporativo.Usuarios.length === 0) {
            MensajeError += 'La empresa debe contar al menos con un Usuario Agregarlo en la sección Usuarios.-';
        }
        if (this.filtroPrestador === '' || this.filtroPrestador === undefined) {
            // si es directo no necesita los datos del broker
        } else {
            if (this.corporativo.Empresa.PorcentajeComisionBroker === undefined || this.corporativo.Empresa.PorcentajeComisionBroker === null) {
                MensajeError += 'El campo Comisión de la sección Datos Broker No puede estar vacío.-';
            }
            if (this.corporativo.Empresa.BrokerContacto === '' || this.corporativo.Empresa.BrokerContacto === undefined) {
                MensajeError += 'El campo Contacto de la sección Datos Broker No puede estar vacío.-';
            }
            if (this.corporativo.Empresa.BrokerTelefono === '' || this.corporativo.Empresa.BrokerTelefono === undefined) {
                MensajeError += 'El campo Teléfono de la sección Datos Broker No puede estar vacío.-';
            }
            if (this.corporativo.Empresa.EmailBroker === '' || this.corporativo.Empresa.EmailBroker === undefined) {
                MensajeError += 'El campo Correo broker de la sección Datos Pago Inteligente No puede estar vacío.-';
            }
            if (this.corporativo.Sucursal.EmailBrokerDocumentosElectronicos === '' || this.corporativo.Sucursal.EmailBrokerDocumentosElectronicos === undefined) {
                MensajeError += 'El campo Correo Documento a Broker de la sección Datos Facturación y Pago No puede estar vacío.-';
            }
        }
        if (this.corporativo.Sucursal.PeriodoPago === 0 || this.corporativo.Sucursal.PeriodoPago === undefined) {
            MensajeError += 'El campo Periodo de Facturación de la sección Datos Facturación y Pago No puede estar vacío.-';
        }
        if (this.corporativo.Sucursal.FormaPago === 0 || this.corporativo.Sucursal.FormaPago === undefined) {
            MensajeError += 'El campo Forma de Pago de la sección Datos Facturación y Pago No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.EmailRRHH === '' || this.corporativo.Empresa.EmailRRHH === undefined) {
            MensajeError += 'El campo Correo Empresa de la sección Datos Pago Inteligente No puede estar vacío.-';
        }
        if (this.corporativo.Sucursal.ContactoDocumentosElectronicos === '' || this.corporativo.Sucursal.ContactoDocumentosElectronicos === undefined) {
            MensajeError += 'El campo Correo de Contacto de la sección Datos Facturación y Pago No puede estar vacío.-';
        }
        if (this.corporativo.Sucursal.EmailContactoDocumentosElectronicos === '' || this.corporativo.Sucursal.EmailContactoDocumentosElectronicos === undefined) {
            MensajeError += 'El campo Correo Envio de Documento de la sección Datos Facturación y Pago No puede estar vacío.-';
        }
        if (this.corporativo.Sucursal.EmailSucursalDocumentosElectronicos === '' || this.corporativo.Sucursal.EmailSucursalDocumentosElectronicos === undefined) {
            MensajeError += 'El campo Correo Envío de Documentos de la sección Datos Facturación y Pago No puede estar vacío.-';
        }

        // hasta fase dos seccion portal contratante
        if (this.notificacionCobranzas <= 0 || !this.notificacionCobranzas) {
            MensajeError += 'El campo Notificación Cobranza de la sección Configuración del Portal No puede estar vacío.-';
        }
        if (this.notificacionPrefactura <= 0 || !this.notificacionPrefactura) {
            MensajeError += 'El campo Notificación Prefactura de la sección Configuración del Portal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.PeriodoPago <= 0 || !this.corporativo.Empresa.PeriodoPago) {
            MensajeError += 'El campo Periodo de Pago Días para Facturación de la sección Configuración del Portal No puede estar vacío.-';
        }
        if (this.corporativo.Empresa.PeriodoCopago <= 0 || !this.corporativo.Empresa.PeriodoCopago) {
            MensajeError += 'El campo Periodo de Copago Días de la sección Configuración del Portal No puede estar vacío.-';
        }
        /* if (this.corporativo.Empresa.ProvisionalCobertura === '' || this.corporativo.Empresa.ProvisionalCobertura === undefined) {
             MensajeError += 'El campo Cobertura Provisional Copago Consulta de la sección Cobertura Provisional No puede estar vacío.-';
         }
         if (this.corporativo.Empresa.ProvisionalCopago === '' || this.corporativo.Empresa.ProvisionalCopago === undefined) {
             MensajeError += 'El campo Cobertura Provisional Copago Porcentaje de la sección Cobertura Provisional No puede estar vacío.-';
         }*/
        if (this.corporativo.Sucursales === undefined || this.corporativo.Sucursales === null || this.corporativo.Sucursales.length === 0) {
            MensajeError += 'La empresa debe tener al menos un Plan, por favor agreguelo en la sección Planes.-';
        }
        return MensajeError;
    }
    // guardar todo el objecto
    guardar(): void {
        this.coporativoTemporal = this.corporativo;
        this.corporativo.Empresa.NotificacionPrefactura = this.notificacionPrefactura;
        this.corporativo.Empresa.NotificacionCopago = this.notificacionCobranzas;
        this.corporativo.Empresa.DigitadorCreacion = this.authService.nombreUsuario;
        // verificamos
        let textoVerificacion = this.verificarDatosGuardado();
        if (textoVerificacion.length === 0) {
            this.existeErroresValidacion = false;
            this.mensajeErroresValidacion = '';
            this.corporativoService.crearCorporativo(this.corporativo).subscribe(
                result => {
                    console.log(result);
                    // entonces tomo nuevamente el objeto que recibo de vuelto y lo cargo para edicion
                    if (result === null || result === undefined || result.length === 0) {
                        this.authService.showErrorPopup("Tuvimos un problema al guardar. Error:" + result + ", por favor recargue la página e intentelo de nuevo.");
                    } else {
                        this.showEditor = true;
                        this.esNuevo = false;
                        this.corporativo = result;// tomo el objeto de vuelta
                        // para administracion de coberturas
                        this.sucursalesConfiguradas = this.corporativo.Sucursales;
                        //console.log(result);
                        this.authService.showSuccessPopup("Se creo correctamente el smartplan.");
                        this.cargarDatosActualizacion();
                        // entonces tomo nuevamente el objeto que recibo de vuelto y lo cargo para edicion
                        //this.router.navigate(['/corporativo']);
                    }
                },
                error => {
                    console.log(error);
                    this.showEditor = true;
                    this.esNuevo = true;
                    this.authService.showErrorPopup("Hubo un problema de comunicación con el servidor: por favor intentelo de nuevo.");
                }
            );
        } else {
            this.existeErroresValidacion = true;
            this.mensajeErroresValidacion = textoVerificacion;
        }
    }
    // guardar todo el objecto
    actualizar(): void {
        this.coporativoTemporal = this.corporativo;
        this.corporativo.Empresa.Calle = this.direccionTemporal;//para actualizar la direcciones
        this.corporativo.Empresa.NotificacionPrefactura = this.notificacionPrefactura;
        this.corporativo.Empresa.NotificacionCopago = this.notificacionCobranzas;
        this.corporativo.Empresa.DigitadorModificacion = this.authService.nombreUsuario;
        let textoVerificacion = this.verificarDatosGuardado();
        if (textoVerificacion.length === 0) {
            this.existeErroresValidacion = false;
            this.mensajeErroresValidacion = '';
            this.corporativoService.actualizarCorporativo(this.corporativo).subscribe(
                result => {
                    if (result === null || result === undefined || result.length === 0) {
                        this.authService.showErrorPopup("Tuvimos un problema al Actualizar. Error:" + result + ", por favor recargue la página e intentelo de nuevo.");
                    } else {
                        //console.log(result);
                        this.corporativo = result;// tomo el objeto de vuelta
                        this.authService.showSuccessPopup("Se actualizo correctamente el smartplan.");
                        this.cargarDatosActualizacion();
                        //this.router.navigate(['/corporativo']);
                    }
                },
                error => {
                    console.log(error);
                    this.authService.showErrorPopup("Hubo un problema de comunicación con el servidor: por favor intentelo de nuevo.");
                }
            );
        } else {
            this.existeErroresValidacion = true;
            this.mensajeErroresValidacion = textoVerificacion;
        }
    }
    // metodo para volver a la grilla
    volver(): void {
        this.limpiarReiniciarControles();
        this.showEditor = false;
        this.esNuevo = true;
    }
    // Método que limpia las variables del formulario y regresar a la búsqueda, llamado desde el botón o para limpiar la pantalla de edición
    cancelar(): void {
        this.showEditor = false;
        this.esNuevo = true;
        this.limpiarReiniciarControles();
        this.consultar();
    }
    // metodo para cargar los datos de actualizacion en el formulario
    cargarDatosActualizacion(): void {
        //datos de actualizacion
        this.estaEnEdicion = false;
        // activacion, desactivacion de controles y botones
        this.notificacionCobranzas = this.corporativo.Empresa.NotificacionCopago;
        this.notificacionPrefactura = this.corporativo.Empresa.NotificacionPrefactura;
        //console.log(this.corporativo);
        this.onChangeCiudad(this.corporativo.Empresa.CodigoCiudad);
        this.corporativo.Empresa.Zona = this.corporativo.Empresa.Zona;
        this.users = []; //limpio la tabla de usuarios
        this.users = this.corporativo.Usuarios;
        this.sucursalesNombre = []; //limpio la lista
        this.direccionTemporal = this.corporativo.Empresa.Calle;
        // cargamos la region y el ejecutivo
        this.cargaAgenteUpdate();
        this.sucursalesConfiguradas = this.corporativo.Sucursales;
        for (let suc of this.corporativo.Sucursales) {
            this.sucursalNombre = new SucursalNombre();
            let separacionMax = suc.Nombre.split(' MAX:');
            let separacionNivel = separacionMax[1].split(' NIVEL:');
            this.sucursalNombre.descripcion = separacionMax[0];
            this.sucursalNombre.max = separacionNivel[0];
            this.sucursalNombre.nivel = separacionNivel[1];
            this.sucursalNombre.producto = suc.CodigoProducto;
            this.sucursalNombre.alias = suc.Alias; //alias
            this.sucursalNombre.sucursal = suc;
            this.sucursalNombre.coberturas = suc.TipoCobertura;
            this.sucursalNombre.esOpcional = false;//suc.EsOpcional;
            if (suc.Configuracion != undefined && this.sucursalNombre.producto === 'COR') // cargo la subSucursal si existe
                this.sucursalNombre.subSucursal = suc.Configuracion;
            this.sucursalesNombre.push(this.sucursalNombre);
            this.sucursalNombre = new SucursalNombre();
        }
        if (this.corporativo.Empresa.CedulaRepresentante.length > 10)
            this.tipoDocumentoRepresentate = 'RUC';
        else
            this.tipoDocumentoRepresentate = 'CÉDULA';
        //Notificaciones de emails de usuarios
        if(this.corporativo.Empresa.EmpresaLogo == "True")
            this.notificar = false;
    }
    // verificar nivel
    verificarNivel() {
        if (Number(this.sucursalNombre.nivel) < 3 || Number(this.sucursalNombre.nivel) > 10) {
            alert('El nivel no puede ser menor a 3 ni mayor a 10');
            this.sucursalNombre.nivel = '3';
        }
    }
    verificarOdas() {
        if (Number(this.odasEdit) < 0 || Number(this.odasEdit) > 9999) {
            alert('El número de Odas debe estar comprendido entre 0 a 9999');
            this.odasEdit = 0;
        }
    }

    verificarCobertura() {
        if (Number(this.corporativo.Empresa.ProvisionalCopago) > 100) {
            alert('El porcentaje de cobertura no puede mayor a 100%');
            this.corporativo.Empresa.ProvisionalCopago = '0';
        }
    }
    listarConveniosPrestador() {
        this.popupTitle = 'Listado de Brokers';
    }
    seleccionarConvenio(agente: Agente): void {
        this.filtroPrestador = agente.Nombre;
        this.corporativo.Empresa.CodigoAgenteVenta = agente.Codigo;
        //verifico cul es el nombre del broker para saber si es directo o no
        // si no lo es aplico 5%, si es directo aplico 0%
        let indexDirecto = agente.Nombre.indexOf("DIRECTO");
        debugger;
        if (indexDirecto === -1) {
            this.corporativo.Empresa.PorcentajeComisionBroker = 5;
        } else {
            if (indexDirecto === 0)
                this.corporativo.Empresa.PorcentajeComisionBroker = 0;
            else
                this.corporativo.Empresa.PorcentajeComisionBroker = 5;
        }

        jQuery("#prestadorViewModal").modal("hide");
    }
    filtrarConvenios(searchValue: string) {
        if (this.BusquedaTemporal.length > 0) {
            if (searchValue.length < this.BusquedaTemporal.length) {
                this.agenteTemporal = this.agentes;
            }
        }
        this.BusquedaTemporal = searchValue;
        if (this.agenteTemporal != undefined && this.agenteTemporal.length > 0) {
            var a = this.agenteTemporal.filter(item => item.Nombre.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.agenteTemporal = a;
        }
        if (searchValue.length === 0) {
            this.agenteTemporal = this.agentes;
        }
    }
    //carga agente en Actualizacion
    cargaAgenteUpdate() {
        this.agenteTemporal = this.agentes;
        var a = this.agenteTemporal.filter(item => item.Codigo.toString() === this.corporativo.Empresa.CodigoAgenteVenta.toString());
        if (a.length != 0) {
            this.filtroPrestador = a[0].Nombre;
        }
    }
    //verificamos si es cedula o pasaporte
    verificarPasaporte(vef: number): boolean {
        if (this.tipoDocumentoUsuario === 'CÉDULA') {
            this.actCedula = true;
        }
        if (this.tipoDocumentoUsuario === 'PASAPORTE') {
            this.actCedula = false;
        }
        return false;
    }
    verificarRepresentante(vef: number): boolean {
        if (this.tipoDocumentoRepresentate === 'CÉDULA') {
            this.actRepresentate = true;
        }
        if (this.tipoDocumentoRepresentate === 'PASAPORTE') {
            this.actRepresentate = false;
        }
        return false;
    }
    limpiarReiniciarControles() {
        this.filter = new CorporativoFilter(); // inicializacion para los filtros
        // para proceso de creacion
        this.corporativo = new CorporativoEntity();
        this.coporativoTemporal = new CorporativoEntity();
        this.corporativo.Empresa = new EmpresaCoorporativo();
        this.corporativo.Sucursal = new Sucursal();
        this.corporativo.Sucursales = [];
        this.sucursalNombre = new SucursalNombre();
        this.filterContrato = new ContratoEntityFilter();
        this.usuari = new Usuario();
        this.usuari.rol = new Rol;
        this.corporativo.Empresa.PorcentajeComisionBroker = 5;
        this.empresaDireccion = new EmpresaDireccion();
        this.users = [];
        this.sucursalesNombre = [];
        // validacion de usuario
        this.usuarioValido = false;
        this.tipoDocumentoRepresentate = 'CÉDULA';
        this.tipoDocumentoUsuario = 'CÉDULA';
        this.notificacionCobranzas = 0;
        this.notificacionPrefactura = 0;
        /** para parametros de actualizacion**/
        this.fechaInicioSursalEdit = new Date();
        this.fechaFinSursalEdit = new Date();
        this.ExisteError = false;
        this.actCedula = true;
        this.actRepresentate = true;
        this.tipoTarjetaEdit = 'BLANCA';
        this.BusquedaTemporal = '';
        this.existeErroresValidacion = false;
        this.filtroPrestador = '';
        this.direccionTemporal = '';
        this.notificacionPrefactura = 0;
        this.notificacionCobranzas = 0;
    }
    verificarEstructuraCompleta() {

        //si sucursal no tiene subsucursales


        if (this.corporativo === null || this.corporativo === undefined) {
            this.corporativo = new CorporativoEntity();
        }
        if (this.corporativo.Empresa === null || this.corporativo.Empresa === undefined) {
            this.corporativo.Empresa = new EmpresaCoorporativo();
        }
        if (this.corporativo.Usuarios === null || this.corporativo.Usuarios === undefined || this.corporativo.Usuarios.length === 0) {
            let listUsuarios = new Array<Usuario>();
            this.corporativo.Usuarios = listUsuarios;
        }
        if (this.corporativo.Sucursal === null || this.corporativo.Sucursal === undefined) {
            this.corporativo.Sucursal = new Sucursal();
            this.corporativo.Sucursal.Region = 'SIERRA';
        } else {
            if (this.corporativo.Sucursal.Region === null || this.corporativo.Sucursal.Region === undefined || this.corporativo.Sucursal.Region === '') {
                this.corporativo.Sucursal.Region = 'SIERRA';
            }
        }
        if (this.corporativo.Sucursales === null || this.corporativo.Sucursales === undefined || this.corporativo.Sucursales.length === 0) {
            let listSucursales = new Array<Sucursal>();
            this.corporativo.Sucursales = listSucursales;
        }
    }
    cargarCoberturasAdm() {
        // filtro las coberturas COR DENT EXE ONC
        var suc;
        let tieneEXE: boolean = false;
        let tieneDEN: boolean = false;
        let tieneONC: boolean = false;
        let tieneTRA: boolean = false;
        let idEXE: number[] = new Array();
        let idDEN: number[] = new Array();
        let idONC: number[] = new Array();
        let idTRA: number[] = new Array();
        let opcionalEXE: boolean[] = new Array();
        let opcionalDEN: boolean[] = new Array();
        let opcionalONC: boolean[] = new Array();
        let opcionalTRA: boolean[] = new Array();

        if (this.sucursalNombre.subSucursal != undefined) {
            suc = JSON.parse(this.sucursalNombre.subSucursal);
            if (suc.length > 0) {
                for (let s of suc) {
                    if (s.cobertura === "EXE") {
                        tieneEXE = true;
                        idEXE.push(s.id);
                        opcionalEXE.push(s.opcional);
                    }
                    if (s.cobertura === "DEN") {
                        tieneDEN = true;
                        idDEN.push(s.id);
                        opcionalDEN.push(s.opcional);
                    }
                    if (s.cobertura === "CPO") {
                        tieneONC = true;
                        idONC.push(s.id);
                        opcionalONC.push(s.opcional);
                    }
                    if (s.cobertura === "TRA") {
                        tieneTRA = true;
                        idTRA.push(s.id);
                        opcionalTRA.push(s.opcional);
                    }
                }
            }
        }

        //voy a buscar en en cada cobertura COR el archivo json si no lo tiene no se marca nada si lo tiene desencripto y cargo objecto
        this.sucursalesEXE = this.sucursalesConfiguradas.filter(obj => obj.CodigoProducto === 'EXE');
        if (this.sucursalesEXE.length > 0) {
            this.ExeSeccionVisible = true;
            //limpio los controles
            for (let suc of this.sucursalesEXE) {
                suc.EsHabilitado = !false;
                suc.EsObligatorio = false;
                suc.EsCheckeado = false;
            }
            if (tieneEXE) {
                for (let suc of this.sucursalesEXE) {
                    //recorremos los id exe y los buscamos contra los del contrato
                    let i = 0;
                    for (let idsucExe of idEXE) {
                        if (suc.Numero === idsucExe) {
                            suc.EsHabilitado = !true;
                            suc.EsObligatorio = !opcionalEXE[i];
                            suc.EsCheckeado = true;
                            this.seleccionExe = idsucExe;
                        }
                        i++;
                    }
                }
            } else {
                this.seleccionExe = 0;
            }
        }
        else
            this.ExeSeccionVisible = false;
        this.sucursalesDEN = this.sucursalesConfiguradas.filter(obj => obj.CodigoProducto === 'DEN');
        if (this.sucursalesDEN.length > 0) {
            this.DenSeccionVisible = true;
            //limpio los controles
            for (let suc of this.sucursalesDEN) {
                suc.EsHabilitado = !false;
                suc.EsObligatorio = false;
                suc.EsCheckeado = false;
            }
            if (tieneDEN) {
                for (let suc of this.sucursalesDEN) {
                    //recorremos los id exe y los buscamos contra los del contrato
                    let i = 0;
                    for (let idsucDen of idDEN) {
                        if (suc.Numero === idsucDen) {
                            suc.EsHabilitado = !true;
                            suc.EsObligatorio = !opcionalDEN[i];
                            suc.EsCheckeado = true;
                            this.seleccionDEN = idsucDen;
                        }
                        i++;
                    }
                }
            } else {
                this.seleccionDEN = 0;
            }
        }
        else
            this.DenSeccionVisible = false;
        this.sucursalesONC = this.sucursalesConfiguradas.filter(obj => obj.CodigoProducto === 'CPO');
        if (this.sucursalesONC.length > 0) {
            this.OncSeccionVisible = true;
            //limpio los controles
            for (let suc of this.sucursalesONC) {
                suc.EsHabilitado = !false;
                suc.EsObligatorio = false;
                suc.EsCheckeado = false;
            }
            if (tieneONC) {
                for (let suc of this.sucursalesONC) {
                    //recorremos los id exe y los buscamos contra los del contrato
                    let i = 0;
                    for (let idsucONC of idONC) {
                        if (suc.Numero === idsucONC) {
                            suc.EsHabilitado = !true;
                            suc.EsObligatorio = !opcionalONC[i];
                            suc.EsCheckeado = true;
                            this.seleccionONC = idsucONC;
                        }
                        i++;
                    }
                }
            } else {
                this.seleccionONC = 0;
            }
        }
        else
            this.OncSeccionVisible = false;


        this.sucursalesTRA = this.sucursalesConfiguradas.filter(obj => obj.CodigoProducto === 'TRA');
        if (this.sucursalesTRA.length > 0) {
            this.TraSeccionVisible = true;
            //limpio los controles
            for (let suc of this.sucursalesTRA) {
                suc.EsHabilitado = !false;
                suc.EsObligatorio = false;
                suc.EsCheckeado = false;
            }
            if (tieneTRA) {
                for (let suc of this.sucursalesTRA) {
                    //recorremos los id exe y los buscamos contra los del contrato
                    let i = 0;
                    for (let idsucTRA of idTRA) {
                        if (suc.Numero === idsucTRA) {
                            suc.EsHabilitado = !true;
                            suc.EsObligatorio = !opcionalTRA[i];
                            suc.EsCheckeado = true;
                            this.seleccionTRA = idsucTRA;
                        }
                        i++;
                    }
                }
            } else {
                this.seleccionTRA = 0;
            }
        }
        else
            this.TraSeccionVisible = false;
        //alert( ' EXE:' + this.sucursalesEXE.length + ' DEN:' + this.sucursalesDEN.length+' ONC: ' + this.sucursalesONC.length);
    }

    seleccionarEXETable(sucursalOp: Sucursal) {
        //verificao si esta check o no esta check
        if (sucursalOp.EsCheckeado) {
            //aumento al objeto
            sucursalOp.EsHabilitado = !true;
        } else {
            //quito del objeto
            sucursalOp.EsHabilitado = !false;
            sucursalOp.EsObligatorio = false;
        }
    }

    seleccionarDENTable(sucursalOp: Sucursal) {
        //verificao si esta check o no esta check
        if (sucursalOp.EsCheckeado) {
            //aumento al objeto
            sucursalOp.EsHabilitado = !true;
        } else {
            //quito del objeto
            sucursalOp.EsHabilitado = !false;
            sucursalOp.EsObligatorio = false;
        }

    }
    seleccionarONCTable(sucursalOp: Sucursal) {
        //verificao si esta check o no esta check
        if (sucursalOp.EsCheckeado) {
            //aumento al objeto
            sucursalOp.EsHabilitado = !true;
        } else {
            //quito del objeto
            sucursalOp.EsHabilitado = !false;
            sucursalOp.EsObligatorio = false;
        }
    }

    seleccionarTRATable(sucursalOp: Sucursal) {
        //verificao si esta check o no esta check
        if (sucursalOp.EsCheckeado) {
            //aumento al objeto
            sucursalOp.EsHabilitado = !true;
        } else {
            //quito del objeto
            sucursalOp.EsHabilitado = !false;
            sucursalOp.EsObligatorio = false;
        }
    }


    //almacenamiento de subCoberturas
    confirmarCoberturaLigada() {
        this.subSucursaArray = [];
        var conf = confirm('Desea guardar los cambios?');
        if (conf) {
            if (this.sucursalesEXE != undefined) {
                //alert('ConfirmacionEXE:  ' + this.subSucursalEXE.cobertura+' plan:'+this.subSucursalEXE.plan +' es Opcional: '+this.subSucursalEXE.opcional);
                //recorro el listado de listas EXE y las pongo en el array
                for (let su of this.sucursalesEXE) {
                    if (su.EsHabilitado != undefined && !su.EsHabilitado) {
                        this.subSucursalEXE = new SubSucursal();
                        this.subSucursalEXE.id = su.Numero;
                        this.subSucursalEXE.plan = su.TipoCobertura;
                        this.subSucursalEXE.cobertura = 'EXE';
                        this.subSucursalEXE.opcional = !su.EsObligatorio;
                        this.subSucursalEXE.alias = su.Alias;
                        this.subSucursaArray.push(this.subSucursalEXE);
                    }
                }
            }
            if (this.sucursalesDEN != undefined) {
                //alert('ConfirmacionEXE:  ' + this.subSucursalEXE.cobertura+' plan:'+this.subSucursalEXE.plan +' es Opcional: '+this.subSucursalEXE.opcional);
                //recorro el listado de listas EXE y las pongo en el array
                for (let su of this.sucursalesDEN) {
                    if (su.EsHabilitado != undefined && !su.EsHabilitado) {
                        this.subSucursalDEN = new SubSucursal();
                        this.subSucursalDEN.id = su.Numero;
                        this.subSucursalDEN.plan = su.TipoCobertura;
                        this.subSucursalDEN.cobertura = 'DEN';
                        this.subSucursalDEN.opcional = !su.EsObligatorio;
                        this.subSucursalDEN.alias = su.Alias;
                        this.subSucursaArray.push(this.subSucursalDEN);
                    }
                }
            }
            if (this.sucursalesONC != undefined) {
                //alert('ConfirmacionEXE:  ' + this.subSucursalEXE.cobertura+' plan:'+this.subSucursalEXE.plan +' es Opcional: '+this.subSucursalEXE.opcional);
                //recorro el listado de listas EXE y las pongo en el array
                for (let su of this.sucursalesONC) {
                    if (su.EsHabilitado != undefined && !su.EsHabilitado) {
                        this.subSucursalONC = new SubSucursal();
                        this.subSucursalONC.id = su.Numero;
                        this.subSucursalONC.plan = su.TipoCobertura;
                        this.subSucursalONC.cobertura = 'CPO';
                        this.subSucursalONC.opcional = !su.EsObligatorio;
                        this.subSucursalONC.alias = su.Alias;
                        this.subSucursaArray.push(this.subSucursalONC);
                    }
                }
            }
            if (this.sucursalesTRA != undefined) {
                //alert('ConfirmacionEXE:  ' + this.subSucursalEXE.cobertura+' plan:'+this.subSucursalEXE.plan +' es Opcional: '+this.subSucursalEXE.opcional);
                //recorro el listado de listas EXE y las pongo en el array
                for (let su of this.sucursalesTRA) {
                    if (su.EsHabilitado != undefined && !su.EsHabilitado) {
                        this.subSucursalTRA = new SubSucursal();
                        this.subSucursalTRA.id = su.Numero;
                        this.subSucursalTRA.plan = su.TipoCobertura;
                        this.subSucursalTRA.cobertura = 'TRA';
                        this.subSucursalTRA.opcional = !su.EsObligatorio;
                        this.subSucursalTRA.alias = su.Alias;
                        this.subSucursaArray.push(this.subSucursalTRA);
                    }
                }
            }
            //console.log(this.subSucursaArray);
            this.sucursalNombre.subSucursal = JSON.stringify(this.subSucursaArray);
            alert('Guardado Correctamente.');
            jQuery("#cargarCoberturasAdm").modal("hide");
        }
    }

    cerrarModal() {
        jQuery("#cargarCoberturasAdm").modal("hide");
    }
}

