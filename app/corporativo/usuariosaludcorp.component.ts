import {Component, OnInit, ElementRef, ChangeDetectorRef, Output, Input, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Rx';
import {correctHeight} from '../app.helpers';
import {AuthService} from '../seguridad/auth.service';
import {
    ObjUsuario, PersonaEntity, SEGPermiso, SEGPermisoUsuario, SEGUsuario, UsuarioEntity
} from '../common/model/corporativo';
import {HttpClient} from '@angular/common/http';
import {CorporativoService} from '../common/servicios/corporativo.service';
import {ConstantService} from '../utils/constant.service';
// import {factoryOrValue} from 'rxjs/operator/multicast';

@Component({
    providers: [CorporativoService],
    templateUrl: 'usuariosaludcorp.template.html'
})

export class UsuarioSaludCorpComponent implements OnInit {
    // Variable para saber si se muestra el formulario o el editor
    showEditor: boolean;
    // Variable para saber si se trata de un nuevo registro
    esNuevo: boolean;
    // Variable que almacena el item en edición
    item: SEGUsuario;
    // Variable que almacena la lista de items consultados
    list: SEGUsuario[];
    // Variable que almacena los datos del criterio de búsqueda
    filter: SEGUsuario;
    // Variable que almacena los datos del usuario del AD
    userAD: UsuarioEntity;

    // Variables de permisos
    permisosGlobal: SEGPermiso[];
    permisosAlmacenarGlobal: SEGPermisoUsuario[];

    // variable para envio de mails
    notificar: boolean;

    // para cargar el tipo de documento
    tiposDocumento: String[];
    tipoDocumentoUsuario: String;

    // elementos de insercion y actualizacion
    usuarioValido: boolean;
    actCedula: boolean;

    // variable global para habilitar o desabilitar bones de edicion y guardado al trabajar con listas
    estaEnEdicion: boolean;

    // Constructor, se ejecuta al inicializar el proceso, inicializa las variables
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
                private authService: AuthService, private constantService: ConstantService,
                private corporativoService: CorporativoService,
                private http: HttpClient) {
        this.showEditor = false;
        this.item = new SEGUsuario();
        this.list = [];
        this.filter = new SEGUsuario(); // inicializacion para los filtros
        this.esNuevo = false;

        // this.item.rol = new Rol;
        // this.item.rol.Id = 4; // 4: Rol de Usuarios Salud

        // validacion de usuario
        this.usuarioValido = false;
        this.tiposDocumento = [];
        this.tipoDocumentoUsuario = 'CÉDULA';

        /** para parametros de actualizacion**/
        this.actCedula = true;

        // hasta segunda fase
        this.estaEnEdicion = false;
        this.notificar = true;

        // Cargar el listado de permisos activos
        this.corporativoService.ObtenerPermisosActivos()
            .subscribe(result => {
                    console.log(result);
                    this.permisosGlobal = result;
                    // Acerar el listado de permisos
                    for (let per of this.permisosGlobal) {
                        per.Activo = false;
                    }
                },
                error => this.authService.showErrorPopup(error));
    }

    // Corre cuando Angular está cargado y todos los componentes descargados
    // sirve para inizializar los datos
    ngOnInit(): void {
        // No muestro nada en pantalla inicialmente, hasta que ponga un criterio de búsqueda
        // Si deseo cargar de entrada, llamo a buscar simplemente
        this.consultar();

        // cargar tipoDocumento;
        this.tiposDocumento = ['CÉDULA', 'PASAPORTE'];
    }

    // Método que indica si se activa el botón buscar, cuando se quiere poner una validación para poder buscar y no traiga toda la base
    puedeBuscar(): boolean {
        let cedulaLLena = true;
        if (this.filter.Cedula === undefined) {
            cedulaLLena = false;
        }
        if (this.filter.Cedula === '') {
            cedulaLLena = false;
        }
        let NombreLLeno = true;
        if (this.filter.NombreApellido === undefined) {
            NombreLLeno = false;
        }
        if (this.filter.NombreApellido === '') {
            NombreLLeno = false;
        }
        let NombreUsuarioLLeno = true;
        if (this.filter.NombreUsuario === undefined) {
            NombreUsuarioLLeno = false;
        }
        if (this.filter.NombreUsuario === '') {
            NombreUsuarioLLeno = false;
        }
        if (cedulaLLena || NombreLLeno || NombreUsuarioLLeno) {
            return true;
        } else {
            return false;
        }
    }

    // Método invocado para consultar la información del usuario desde el AD
    ObtenerUsuarioAD(): void {
        const nombre = jQuery('#NombreUsuarioAD').val();
        this.corporativoService.ObtenerDatosAD(nombre)
            .subscribe(result => {
                    // console.log(result);
                    this.userAD = result;

                    // Llenar los datos obtenidos desde el AD
                    if(result != null) {
                        this.item.Cedula = result.Identificacion;
                        this.item.NombreApellido = result.Nombres;
                        this.item.Email = result.Correo;
                        this.item.TelefonoFijo = result.Telefono;
                        this.item.Extension = result.Compannia;
                    }
                },
                error => this.authService.showErrorPopup(error));
    }

    consultar(): void {
        this.corporativoService.resetDefaultPaginationConstanst();
        this.buscar();
    }

    buscar(): void {
        this.corporativoService.ObtenerUsuariosPorFiltro(this.filter)
            .subscribe(result => {
                    this.list = result;
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
        this.filter = new SEGUsuario();
        this.list = [];
    }

    // Método que abre el formulario de edición, para crear un nuevo registro
    nuevo(): void {
        // marca como nuevo
        this.esNuevo = true;
        // Abre el panel de edición
        this.showEditor = true;

        // // Por si acaso inicializa nuevamente la variable de edición
        // this.item = new SEGUsuario();
        this.limpiarReiniciarControles();
    }

    // Método invocado para abrir la edición, invocado desde los items de la lista
    abrirEdicion(idUsuario: number): void {
        // Abre el panel de edición
        this.showEditor = true;
        this.esNuevo = false;

        // Acerar el listado de permisos
        for (let per of this.permisosGlobal) {
            per.Activo = false;
        }

        this.corporativoService.ObtenerUsuarioSalud(idUsuario)
            .subscribe(result => {
                    console.log(result);
                    //  //console.log(actividades)
                    this.item = result;
                    this.cargarDatosActualizacion();
                },
                error => this.authService.showErrorPopup(error));

        // Cargar el listado de permisos del usuario
        this.corporativoService.ObtenerPermisosUsuarioPorID(idUsuario)
            .subscribe(result => {
                    console.log(result);
                    this.permisosAlmacenarGlobal = result;
                    // Acerar el listado de permisos
                    for (let per of this.permisosGlobal) {
                        if (this.permisosAlmacenarGlobal.find(x => x.IDPermiso === per.IDPermiso)) {
                            per.Activo = true;
                        }
                    }
                },
                error => this.authService.showErrorPopup(error));
    }

    // consultarCiudades(): void {
    //     if (this.traslateCiudades === undefined || this.traslateCiudades.length === 0) {
    //         this.catalogoService.getCiudadesForOdas().subscribe(
    //             result => {
    //                 for (let ciudadBuscada of result) {
    //                     this.traslCiudades = new TraslateCiudades();
    //                     this.traslCiudades.Name = ciudadBuscada.Valor;
    //                     this.traslCiudades.Id = Number(ciudadBuscada.CodigoProgress);
    //                     this.traslateCiudades.push(this.traslCiudades);
    //                 }
    //                 this.ciudades = result;
    //             },
    //             error => this.authService.showErrorPopup(error));
    //     }
    // }

    /** Procesos con Listas Usuarios y Sucursales **/
    // verificacion de la cedula
    onKeyUsuario(event: any) { // without type info
        const x = jQuery('#CedulaUsuario').val().length;
        if (x > 10)
            this.tipoDocumentoUsuario = 'RUC';
        else
            this.tipoDocumentoUsuario = 'CÉDULA';
        // if (x >= 10) {
        //     this.filtrarUsuario();
    }

    // Método que valida si la información del formulario es completa para proceder a la grabación
    validarFormulario(): boolean {
        if (this.item.Cedula === undefined) {
            return false;
        }
        if (this.item.Cedula === '') {
            return false;
        }
        if (this.item.NombreApellido === undefined) {
            return false;
        }
        if (this.item.NombreApellido === '') {
            return false;
        }
        if (this.item.Email === undefined) {
            return false;
        }
        if (this.item.Email === '') {
            return false;
        }
        if (this.item.Telefono === undefined) {
            return false;
        }
        if (this.item.Telefono === '') {
            return false;
        }
        if (this.item.TelefonoFijo === undefined) {
            return false;
        }
        if (this.item.TelefonoFijo === '') {
            return false;
        }
        if (this.item.Extension === undefined) {
            return false;
        }
        if (this.item.Extension === '') {
            return false;
        }
        // if (this.item.rol.Id === undefined) {
        //     return false;
        // }
        // if (this.item.rol.Id === 0) {
        //     return false;
        // }
        return true;
    }

    // Método que graba la información del formulario, invocado desde el botón grabar
    guardar(): void {
        // Llenar el listado de permisos seleccionados
        for (let obj of this.permisosGlobal) {
            if ($('#' + obj.IDPermiso).prop('checked')) {
                obj.Activo = true;
            }
        }
        const record = new ObjUsuario();
        this.item.ADUsuario = true;
        this.item.NombreUsuario = this.userAD.NombreGrupo;

        record.usuario = this.item;
        record.lstPermisos = this.permisosGlobal;
        record.ModificadoPor = '';
        record.ModificadoPorID = 0;
        this.corporativoService.CrearUsuario(record).subscribe(
            result => {
                if (result.Estado === 'Error') {
                    if (result.Mensajes.length > 0) {
                        this.authService.showErrorPopup(result.Mensajes[0]);
                    } else {
                        this.authService.showErrorPopup('Ha ocurrido un problema en la grabación.');
                    }
                } else {
                    this.authService.showSuccessPopup('Grabación Exitosa.');
                }
                this.cancelar();
            },
            error => this.authService.showErrorPopup(error));
    }

    // guardar todo el objecto
    actualizar(): void {
        // Actualizar el listado de permisos seleccionados
        for (let obj of this.permisosGlobal) {
            if ($('#' + obj.IDPermiso).prop('checked')) {
                obj.Activo = true;
            }
            else obj.Activo = false;
        }

        const record = new ObjUsuario();
        record.usuario = this.item;
        record.lstPermisos = this.permisosGlobal;
        record.ModificadoPor = '';
        record.ModificadoPorID = 0;
        this.corporativoService.ActualizarUsuario(record).subscribe(
            result => {
                if (result > 0) {
                    this.authService.showSuccessPopup('Grabación Exitosa.');
                } else {
                    this.authService.showErrorPopup('Ha ocurrido un problema en la grabación.');
                }
                this.cancelar();
            },
            error => this.authService.showErrorPopup(error));
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
        // datos de actualizacion
        this.estaEnEdicion = false;

        if (this.item.Cedula.length > 10)
            this.tipoDocumentoUsuario = 'RUC';
        else this.tipoDocumentoUsuario = 'CÉDULA';
    }

    // verificamos si es cedula o pasaporte
    verificarPasaporte(vef: number): boolean {
        if (this.tipoDocumentoUsuario === 'CÉDULA') {
            this.actCedula = true;
        }
        if (this.tipoDocumentoUsuario === 'PASAPORTE') {
            this.actCedula = false;
        }
        return false;
    }

    limpiarReiniciarControles() {
        this.filter = new SEGUsuario(); // inicializacion para los filtros
        this.item = new SEGUsuario();

        // para proceso de creacion
        this.tipoDocumentoUsuario = 'CÉDULA';
        /** para parametros de actualizacion**/
        this.actCedula = true;

        // Acerar el listado de permisos
        for (let per of this.permisosGlobal) {
            per.Activo = false;
        }
    }
}

