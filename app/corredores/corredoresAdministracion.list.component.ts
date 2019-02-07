import { Component, OnInit, ElementRef, ChangeDetectorRef, Output, Input, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { ConstantService } from '../utils/constant.service';
import { saveAs } from 'file-saver/FileSaver';
import {pcUsuarioRol} from '../common/model/pcUsuarioRol';
import {pcRol} from '../common/model/pcRol';
import {Usuario} from '../common/model/usuario';
import {Rol} from '../common/model/rol';
import {PersonaEntity} from '../common/model/corporativo';
import {CorporativoService} from '../common/servicios/corporativo.service';
import {AgenteService} from '../common/servicios/agente.service';
import {CorredoresAgenteVentaServices} from '../common/servicios/corredoresAgenteVenta.services';
import {AgenteVenta} from '../common/model/agenteVenta';
import {AgenteVentaCorredoresEntity} from '../common/model/agenteVentaCorredoresEntity';
import {CorredoresGrupoAgenteVentaServices} from '../common/servicios/corredoresGrupoAgentes.services';



@Component({
    providers: [CorporativoService , AgenteService, CorredoresAgenteVentaServices, CorredoresGrupoAgenteVentaServices  ],
    templateUrl: 'corredoresAdministracion.list.template.html'
})

export class CorredoresAdministracionListComponent implements OnInit {

    //variables de visualizacion
    showEditor=false;
    esNuevo=false;
    estaEnEdicion=false;
    //variables  globales
    corredoresList:AgenteVenta[];
    corredor:AgenteVentaCorredoresEntity;
    filtro:any;
    mensajeError: string;
    ExisteError:boolean;
    //variables de combos
    tipoContribuyenteList:any[];
    tipoContribuyente:any;
    estadoList:any[];
    estado:any;
    regionList:any[];
    grupoList:any[];
    region:any;
    tiposDocumento: string[];
    tipoDocumentoUsuario: string;
    actCedula:boolean;
    sucursalesList:any[];
    //objectos de procesos
    usuario:pcUsuarioRol;
    rol:pcRol;
    roles:pcRol[];
    rolId:number;
    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };
    // Constructor, se ejecuta al inicializar el proceso, inicializa las variables
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
                private authService: AuthService, private constantService: ConstantService, private corporativoService: CorporativoService,
                private agenteService: AgenteService, private corredoresAgenteServices: CorredoresAgenteVentaServices,
                public grupoService: CorredoresGrupoAgenteVentaServices) {

        this.corredoresList = new Array<AgenteVenta>();
        //lleno el objeto inicial
        this.corredor = new AgenteVentaCorredoresEntity();
        //definimos el fitro
        this.filtro = new Object();
        //inicializacion de valores
        this.tipoDocumentoUsuario = 'CÉDULA';
        this.tiposDocumento = [];
        this.usuario= new  pcUsuarioRol();
        this.usuario.rol = [];
        this.actCedula=true;
        this.roles =[];
        this.estaEnEdicion=false;
    }

    // sirve para inizializar los datos
    ngOnInit(): void {
        //combo de tipoContribuyente
        this.cargarTipoContribuyente();
        this.cargarEstados();
        this.cargarRegion();
        this.cargarGrupo();
        this.cargarTipoDocumento();
        this.cargarRoles();
        this.cargarSucursalesVenta();
    }
    //funciones de activacion, desactivacion y controles
    cargarTipoContribuyente() {
        this.tipoContribuyenteList = new Array<any>();
        this.tipoContribuyente = new Object();
        this.tipoContribuyente.id = 1;
        this.tipoContribuyente.nombre = 'Persona natural';
        this.tipoContribuyenteList.push(this.tipoContribuyente);
        this.tipoContribuyente = new Object();
        this.tipoContribuyente.id = 2;
        this.tipoContribuyente.nombre = 'Jurídica';
        this.tipoContribuyenteList.push(this.tipoContribuyente);
    }
    cargarEstados() {
        this.estadoList = new Array<any>();
        this.estado = new Object();
        this.estado.id = 1;
        this.estado.nombre = 'Activo';
        this.estadoList.push(this.estado);
        this.estado = new Object();
        this.estado.id = 2;
        this.estado.nombre = 'Anulado';
        this.estadoList.push(this.estado);
    }
    cargarRegion() {
        this.regionList = new Array<any>();
        this.region = new Object();
        this.region.id = 'Sierra';
        this.region.nombre = 'Sierra';
        this.regionList.push(this.region);
        this.region = new Object();
        this.region.id = 'Costa';
        this.region.nombre = 'Costa';
        this.regionList.push(this.region);
        this.region = new Object();
        this.region.id = 'Austro';
        this.region.nombre = 'Austro';
        this.regionList.push(this.region);
    }
    cargarGrupo() {
        this.grupoList = new Array<any>();
        this.grupoService.GrupoAgentesTraerTodos()
            .subscribe(result => {
                    this.grupoList = result;
                },
                error => this.authService.showErrorPopup(error));
    }
    cargarTipoDocumento() {
        this.tiposDocumento = ['CÉDULA', 'PASAPORTE'];
    }
    cargarRoles(){
        this.roles=[];
        var rolOpcion:pcRol= new pcRol();
        rolOpcion.Id=1;
        rolOpcion.Nombre='Administrador Broker';
        this.roles.push(rolOpcion);
        rolOpcion= new pcRol();
        rolOpcion.Id=3;
        rolOpcion.Nombre='Gestor';
        this.roles.push(rolOpcion);
        rolOpcion = new pcRol();
        rolOpcion.Id = 4;
        rolOpcion.Nombre = 'Administrador Grupo';
        this.roles.push(rolOpcion);
    }
    cargarSucursalesVenta(){
        this.corredoresAgenteServices.CorredoresObtenerCatalogoSucursales()
            .subscribe(Sucursal => {
                    this.sucursalesList=Sucursal;
                },
                error => this.authService.showErrorPopup(error));
    }
    onKeyUsuario(event: any) { // without type info
        const x = jQuery("#CedulaUsuario").val().length;
        if(x > 10 ) {
            this.usuario.TipoDocumento = 'RUC';
        }
        else {
            this.usuario.TipoDocumento = 'CÉDULA';
        }

        if (x >= 10) {
            this.filtrarUsuario();
        }
    }
    filtrarUsuario(): void {
        this.corporativoService.ObtenerPersonaPorNumeroIdentificacion(this.usuario.Cedula)
            .subscribe(PersonaEntity => {
                    let x: PersonaEntity = PersonaEntity;
                    if (x !== undefined && x.Primer_Nombre !== undefined) {
                        this.usuario.NombreApellido = x.Primer_Nombre + ' ' + x.Segundo_Nombre + ' '+ x.Primer_Apellido + ' ' + x.Segundo_Apellido;
                        this.usuario.Email = x.Email_Personal;
                        this.usuario.NombreUsuario = x.Identificacion;
                        this.usuario.Contrasena =  x.Identificacion;
                        this.usuario.Telefono = x.Telefono_Domicilio;
                        var fechaNacimientoZonaH=new Date(x.Fecha_Nacimiento);
                        this.usuario.fechaNacimiento=new Date(fechaNacimientoZonaH.getFullYear(),(fechaNacimientoZonaH.getMonth()),(fechaNacimientoZonaH.getDate()+1));
                    }else{
                        this.usuario.NombreApellido = '';
                        this.usuario.Email = '';
                        this.usuario.NombreUsuario = '';
                        this.usuario.Contrasena =  '';
                        this.usuario.Telefono = '';
                        this.usuario.fechaNacimiento = new Date();
                    }
                },
                error => this.authService.showErrorPopup(error));
    }
    verificarPasaporte ( vef: number):boolean {
        if(this.usuario.TipoDocumento === 'CÉDULA') {
            this.actCedula = true;
        }
        if(this.usuario.TipoDocumento ==='PASAPORTE') {
            this.actCedula = false;
        }
        return false;
    }
    validarUsuario(): boolean {
        if (this.usuario.TipoDocumento === undefined) {
            return false;
        }
        if (this.usuario.TipoDocumento === '') {
            return false;
        }
        if (this.usuario.Cedula === undefined) {
            return false;
        }
        if (this.usuario.Cedula === '') {
            return false;
        }
        if (this.usuario.NombreApellido === undefined) {
            return false;
        }
        if (this.usuario.NombreApellido === '') {
            return false;
        }
        if (this.usuario.Email === undefined) {
            return false;
        }
        if (this.usuario.Email === '') {
            return false;
        }
        if (this.usuario.Telefono === undefined) {
            return false;
        }
        if (this.usuario.Telefono === '') {
            return false;
        }
        if (this.usuario.TelefonoFijo === undefined) {
            return false;
        }
        if (this.usuario.TelefonoFijo === '') {
            return false;
        }
        if (this.rolId === undefined || this.rolId === 0 ) {
            return false;
        }
        return true;
    }
    //FUNCIONES DE COMPORTAMIENTO
    traerFiltros(){
        if(this.filtro.nombre === undefined &&this.filtro.ruc===undefined && this.filtro.codigo===undefined)
            return alert('Debe ingresar al menos un filtro para realizar la busqueda especifica');
        if(this.filtro.nombre != undefined && this.filtro.nombre!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaPorNombre(this.filtro.nombre) .subscribe(result => {
                    this.corredoresList = result;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
        if(this.filtro.codigo != undefined && this.filtro.codigo!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaPorCodigoCorredor(Number(this.filtro.codigo)) .subscribe(result => {
                    this.corredoresList = result;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
        if(this.filtro.ruc != undefined && this.filtro.ruc!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaPorRucCorredor(this.filtro.ruc) .subscribe(result => {
                    this.corredoresList = result;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }


    }
    abrirEdicion(corredor:AgenteVenta){
        this.showEditor=true;
        //ahora consulto los datos especificos del corredor
        this.corredoresAgenteServices.CorredoresObtenerAgentesVentaCorredorPorCodigo(corredor.Codigo) .subscribe(result => {
                //primero verificamos que los componentes basicos vengan sin undefined
                if(result == undefined || result == null) {
                    this.authService.showErrorPopup("Hubo un problema de comunicación con el servidor: por favor intentelo de nuevo.");
                }else{
                    //transformamos fechas
                    if(result.FechaIngreso!=null)
                        result.FechaIngreso = new Date(result.FechaIngreso);
                    if(result.FechaSalida !=null)
                        result.FechaSalida = new Date(result.FechaSalida);
                    this.corredor = result;
                    if(this.corredor.Usuarios==undefined || this.corredor.Usuarios==null)
                        this.corredor.Usuarios=[];
                    this.corredor.DigitadorCreacion= this.authService.nombreCompleto;
                }

            },
            error => this.authService.showErrorPopup(error));

    }
    InsertarUsuarioTabla() {

       //tomamos el rol
       var rol:pcRol[]=this.roles.filter(x=> x.Id==this.rolId);
       if(rol==undefined || rol == null) {//validacion de seguridad
            alert('Debe seleccionar un Perfil de Usuario');
            return false;
       }else{
           this.usuario.rol=rol;
       }
       if(this.usuario.fechaNacimiento==undefined || this.usuario.fechaNacimiento == null){
           alert('El usuario debe tener fecha de nacimiento.');
           return false;
       }
        if(this.usuario.Email==undefined || this.usuario.Email == null || this.usuario.Email.trim()==''){
            alert('El usuario debe tener un E-mail.');
            return false;
        }
        if(this.usuario.Cedula==undefined || this.usuario.Cedula == null || this.usuario.Cedula.trim()==''){
            alert('El usuario debe tener una cédula o pasaporte.');
            return false;
        }
        if(this.usuario.Telefono==undefined || this.usuario.Telefono == null || this.usuario.Telefono.trim()==''){
            alert('El usuario debe tener un número de telefono celular.');
            return false;
        }

       this.corredor.Usuarios.push(this.usuario);
       //limpiamos
       this.usuario= new pcUsuarioRol();
       this.usuario.rol=[];
       this.usuario.fechaNacimiento = new Date();
       this.rolId = undefined;
        this.estaEnEdicion=false;
    }
    updateUsuario(usuario:pcUsuarioRol){
        this.estaEnEdicion=true;
        this.usuario=usuario;
        if(usuario.TipoDocumento==='CÉDULA')
            this.actCedula = true;
        if(usuario.fechaNacimiento != undefined && usuario.fechaNacimiento!=null)
            this.usuario.fechaNacimiento=new Date(usuario.fechaNacimiento);
        this.rolId=usuario.rol[0].Id;
        this.corredor.Usuarios = this.corredor.Usuarios.filter(obj => obj !== usuario);
    }
    eliminarUsuario(usuario:pcUsuarioRol){
        this.corredor.Usuarios = this.corredor.Usuarios.filter(obj => obj !== usuario);
    }
    nuevo(): void {
        // marca como nuevo
        this.esNuevo = true;
        // Abre el panel de edición
        this.showEditor = true;
        //limpiamos controles de usuario
        this.corredor = new AgenteVentaCorredoresEntity();
        this.corredor.TipoContribuyente=1;
        this.corredor.CodigoEstadoAgente=1;
        this.corredor.Region="Sierra";
        this.corredor.CodigoSucursal=1;
        this.corredor.Usuarios=[]
        this.usuario= new pcUsuarioRol();
        this.usuario.rol=[];
        this.corredor.DigitadorCreacion= this.authService.nombreCompleto;
    }
    cancelar():void{
        this.esNuevo = false;
        this.showEditor = false;
        this.corredor = new AgenteVentaCorredoresEntity();
        this.corredor.Usuarios=[]
        this.usuario= new pcUsuarioRol();
        this.usuario.rol=[];
        this.usuario.fechaNacimiento = new Date();
    }

    fileEvent($event) {
        const fileSelected: File = $event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(fileSelected);
        reader.onload = ((item: any) => {
            return (e: Event) => {
                // use "e" or "file"
                item.contratoAgenciamiento = reader.result.split(',')[1];
            }
        })(this.corredor);
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    }

    download() {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/octect-stream;charset=utf-8;base64,' + encodeURIComponent(this.corredor.contratoAgenciamiento));
        element.setAttribute('download', 'Archivo.pdf');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    verificarDatosGuardado(): string {
        this.mensajeError = '';
        if (this.corredor.TipoContribuyente === undefined || this.corredor.TipoContribuyente === 0|| this.corredor.TipoContribuyente === null) {
            this.mensajeError += ' El tipo de contribuyente de la sección Datos Corredor No puede estar vacío.-';
        }
        if (this.corredor.RucBroker=== undefined || this.corredor.RucBroker === '') {
            this.mensajeError += ' El Ruc del Broker de la sección Datos Corredor No puede estar vacío.-';
        }
        if (this.corredor.RazonSocialBroker === undefined || this.corredor.RazonSocialBroker === '') {
            this.mensajeError += ' La reazón social de Broker de la sección Datos Corredor No puede estar vacío.-';
        }
        if (this.corredor.representante_legal === undefined || this.corredor.representante_legal === '') {
            this.mensajeError += ' El representante legar del Broker de la sección Datos Corredor No puede estar vacío.-';
        }
        if (this.corredor.Nombre === undefined || this.corredor.Nombre === '') {
            this.mensajeError += ' El nombre comercial del Broker de la sección Datos Corredor No puede estar vacío.-';
        }
        if (this.corredor.CodigoEstadoAgente === undefined || this.corredor.CodigoEstadoAgente === 0) {
            this.mensajeError += ' El estado del Borker de la sección Datos Corredor No puede estar vacío.-';
        }
        if (this.corredor.FechaIngreso === undefined || this.corredor.FechaIngreso === null){
            this.mensajeError += ' La Fecha fecha de Ingreso de la sección Datos Corredor No puede estar vacío.-';
        }
        if (this.corredor.Region === undefined || this.corredor.Region === '') {
            this.mensajeError += ' La Región del Broker de la sección Datos Corredor No puede estar vacío.-';
        }
        if(this.corredor.CodigoEstadoAgente==2) {
            if (this.corredor.FechaSalida === undefined || this.corredor.FechaSalida === null) {
                this.mensajeError += ' La Fecha de salida del Broker de la sección Datos Corredor No puede estar vacío.-';
            }
        }
        if (this.corredor.CodigoSucursal === undefined || this.corredor.CodigoSucursal === 0) {
            this.mensajeError += ' La sucursal de la sección Datos Corredor No puede estar vacío.-';
        }
        //Seccion de cantacto Corredor
        if(this.corredor.EmailRenovacion==''){
            this.mensajeError += ' El correo de renovación del Broker de la sección Contacto Corredor No puede estar vacío.-';
        }

        if(this.corredor.contacto_nombre==''){
            this.mensajeError += ' El nombre de contacto del Broker de la sección Contacto Corredor No puede estar vacío.-';
        }
        //seccion Usuario
        if(this.corredor.Usuarios.length==0){
            this.mensajeError += ' El broker debe tener al menos un usuario.-';
        }
        if(this.mensajeError.length>0){
            this.ExisteError=true;
        }else{
            this.ExisteError=false;
        }
        return this.mensajeError;
    }
    guardarCorredor(){
        debugger;
        //primero hacemos la validacoón de los campos del corredor
        let textoVerificacion = this.verificarDatosGuardado();
        if (textoVerificacion.length === 0 ) {
            if(this.corredor.Codigo!=0){
                if(this.corredor.CodigoEstadoAgente == 2){
                    this.corredor.DigitadorAnulacion=this.authService.nombreCompleto;
                    this.corredor.DigitadorModificacion=this.authService.nombreCompleto;
                    this.corredor.FechaAnulacion=this.corredor.FechaSalida;
                }else{
                    this.corredor.DigitadorModificacion=this.authService.nombreCompleto;
                }
            }


            this.corredoresAgenteServices.CorredoresAgentesVentaCrearActualizar(this.corredor) .subscribe(result => {
                    // primero verificamos que los componentes basicos vengan sin undefined
                    if(result === undefined || result == null) {
                        this.authService.showErrorPopup("Hubo un problema de comunicación con el servidor: por favor intentelo de nuevo.");
                    }else{
                        console.log(result);
                        if (result === undefined || result == null)
                            this.authService.showErrorPopup("Tuvimos un Problema.");
                        else{
                            this.corredor=result;
                            if(this.corredor.Mensaje =='') {
                                this.esNuevo = false;
                                if(this.corredor.FechaIngreso!=null)
                                    this.corredor.FechaIngreso = new Date(this.corredor.FechaIngreso);
                                if(this.corredor.FechaSalida !=null)
                                    this.corredor.FechaSalida = new Date(this.corredor.FechaSalida);

                                this.authService.showSuccessPopup("Proceso Correcto!!");
                            }
                            else
                                this.authService.showErrorPopup("Tuvimos un Problema: "+this.corredor.Mensaje);
                        }

                    }
                },
                error => this.authService.showErrorPopup(error));

        }else{
            alert('El broker no paso la validación de la información ingresada, corrijalo e intentelo de nuevo.');
            return;
        }
    }
}
