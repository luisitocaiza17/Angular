// Fecha Creacion Servicio Corporativo 15/03/2018 - Pedro Benitez

import {Injectable, Inject} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {AppAuthHttp} from '../../seguridad/appAuthHttp';
import {Observable} from 'rxjs/Rx';
import {ContratoKey} from '../model/contrato';
import {ConstantService} from '../../utils/constant.service';
import {
    EmpresaCoorporativo, CorporativoFilter, CorporativoList, CorporativoEntity, PersonaEntity, SEGUsuario,
    ObjUsuario, UsuarioEntity, SEGPermiso, SEGPermisoUsuario
} from '../model/corporativo';
import {Sucursal, SucursalNombre} from '../model/sucursal';
import {Rol} from '../model/rol';
import {Unidad} from '../model/unidad';
import {Sociedad} from '../model/sociedad';
import {Usuario} from '../model/usuario';
import {PaginationService} from '../../utils/pagination.service';
import {catalogoRouting} from '../../catalogo/catalogo.routing';
import {Catalogo} from '../model/catalogo';
import {ContratoEntityFilter} from '../model/contrato';
import {observableToBeFn} from 'rxjs/testing/TestScheduler';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class CorporativoService extends PaginationService {
    // _baseURL = 'http://localhost:5150/SC/api/corporativo'

    private corporativoUrl = 'corporativo';
    // private usuarioUrl = 'usuario';
    private servicesUrl = 'CatalogoAplicacion';
    private contratoUrl = 'contratos';
    private registroCivilUrl = 'registrocivil'

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService, private http: Http) {
        super(1, 5);
        this.corporativoUrl = constantService.API_ENDPOINT + this.corporativoUrl;
        // this.usuarioUrl = constantService.API_ENDPOINT + this.usuarioUrl;
        this.servicesUrl = constantService.SERVICES_ENDPOINT + constantService.API_ENDPOINT + this.servicesUrl;
        this.registroCivilUrl = constantService.API_ENDPOINT + this.registroCivilUrl;
    }

// métodos nuevos
    // obtención del objeto completo del corporativo
    ObtenerEmpresaSucursales(numero: number): Observable<CorporativoEntity> {
        const body = JSON.stringify(numero);
        return this.authHttp.post(this.corporativoUrl + '/ObtenerEmp', body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    // obtención de datos de persona registro civil
    ObtenerPersonaPorNumeroIdentificacion(numero: string): Observable<PersonaEntity> {
        let body = JSON.stringify(numero);
        return this.authHttp.post(this.registroCivilUrl + '/ObtenerPersonaPorNumeroIdentificacion', body)
            .map((res) => this.extractBody(res))
            .catch(this.authHttp.handleError);
    }

    // Guardar corporativo
    crearCorporativo(corporativo: CorporativoEntity): Observable<any> {
        let body = JSON.stringify(corporativo);
        return this.authHttp.post(this.corporativoUrl + '/CrearCorporativoSucursalesUsuarios', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // actualizar corporativo
    actualizarCorporativo(corporativo: CorporativoEntity): Observable<any> {
        let body = JSON.stringify(corporativo);
        return this.authHttp.post(this.corporativoUrl + '/ActualizarCorporativoSucursalesUsuarios', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // obtención del listado de usuarios salud
    ObtenerUsuariosPorFiltro(filtro: SEGUsuario): Observable<SEGUsuario[]> {
        const body = JSON.stringify(filtro);
        return this.authHttp.post(this.corporativoUrl + '/ObtenerUsuariosPorFiltro', body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    // obtención de un usuario salud
    ObtenerUsuarioSalud(IDUsuario: number): Observable<SEGUsuario> {
        return this.authHttp.get(this.corporativoUrl + '/ObtenerUsuarioSalud/' + IDUsuario)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    // Grabar usuario salud
    CrearUsuario(nuevoUsuario: ObjUsuario): Observable<any> {
        let body = JSON.stringify(nuevoUsuario);
        return this.authHttp.post(this.corporativoUrl + '/CrearUsuarioSalud', body)
            .map(this.extractBody)
            .catch(this.authHttp.handleError);
    }

    // Actualizar usuario salud
    ActualizarUsuario(modUsuario: ObjUsuario): Observable<any> {
        let body = JSON.stringify(modUsuario);
        return this.authHttp.post(this.corporativoUrl + '/ActualizarUsuarioSalud', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // Obtención de datos desde el AD
    ObtenerDatosAD(NombreUsuario: string): Observable<UsuarioEntity> {
        return this.authHttp.get(this.corporativoUrl + '/ObtenerUsuarioADXNombre/' + NombreUsuario)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    // obtención de los permisos activos
    ObtenerPermisosActivos(): Observable<SEGPermiso[]> {
        return this.authHttp.get(this.corporativoUrl + '/ObtenerPermisosActivos')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    // obtención de los permisos de un usuario
    ObtenerPermisosUsuarioPorID(IDUsuario: number): Observable<SEGPermisoUsuario[]> {
        return this.authHttp.get(this.corporativoUrl + '/ObtenerPermisosUsuarioPorID/' + IDUsuario)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

// Metodos anteriores
    upload(files, parameters) {

        const headers = new Headers();
        const options = new RequestOptions({headers: headers});
        options.params = parameters;
        return this.http.post(this.corporativoUrl + '/UploadFile', files, options)
            .map(response => response.json())
            .catch(error => Observable.throw(error));
    }

    getByFiltersPaginated(filter: CorporativoFilter): Observable<EmpresaCoorporativo[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.corporativoUrl + '/getCorporativo',
            body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginatedEmpresas(res))
            .catch(this.authHttp.handleError);
    }


    getUsuarioByCedula(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.contratoUrl + '/filterForTransacciones', body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }


    eliminarCorporativo(corporativo: EmpresaCoorporativo): Observable<any> {
        let body = JSON.stringify(corporativo);
        return this.authHttp.post(this.corporativoUrl + '/eliminarCorporativo', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    EnviarImagen(Imagen: FormData): Observable<any> {
        let body = JSON.stringify(Imagen);
        return this.authHttp.post(this.corporativoUrl + '/RecibirImagen', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getCorporativo(): Observable<EmpresaCoorporativo[]> {
        return this.authHttp.get(this.corporativoUrl + '/getCorporativo')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getRoles(): Observable<Rol[]> {
        return this.authHttp.get(this.corporativoUrl + '/ObtenerRoles')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getUnidadesResponsables(): Observable<Unidad[]> {
        return this.authHttp.get(this.corporativoUrl + '/ObtenerUnidadesResponsables')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getSucursales(): Observable<Sociedad[]> {
        return this.authHttp.get(this.corporativoUrl + '/ObtenerSucursales')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getCatalogoGen(catal: string): Observable<Sociedad[]> {
        return this.authHttp.get(this.corporativoUrl + '/buscarCatalogo/' + catal)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getCorporativoByEmpresaNumero(Numero: number): Observable<EmpresaCoorporativo[]> {
        return this.authHttp.get(this.corporativoUrl + '/getCorporativoByEmpresaNumero/' + Numero)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getCorporativoByRazonSocial(RazonSocial: number): Observable<EmpresaCoorporativo[]> {
        return this.authHttp.get(this.corporativoUrl + '/getCorporativoByRazonSocial/' + RazonSocial)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getCorporativoByRucEmpresa(Ruc: number): Observable<EmpresaCoorporativo[]> {
        return this.authHttp.get(this.corporativoUrl + '/getCorporativoByRucEmpresa/' + Ruc)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getSucursalByCorporativo(Sucursal: Sucursal): Observable<EmpresaCoorporativo[]> {
        return this.authHttp.get(this.corporativoUrl + '/getSucursalByCorporativo/' + Sucursal)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // Corporativo Datos Corporativos
    actualizarDatosCorporativos(filter: CorporativoFilter): Observable<boolean> {
        const body = JSON.stringify(filter);
        return this.authHttp.post(this.corporativoUrl + '/ModificarCorporativo', body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    // Corporativo Representante Legal
    actualizarRepresentanteLegal(filter: CorporativoFilter): Observable<boolean> {
        const body = JSON.stringify(filter);
        return this.authHttp.post(this.corporativoUrl + '/ModificarCorporativo', body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    // Corporativo Datos Broker
    actualizarDatosBroker(filter: CorporativoFilter): Observable<boolean> {
        const body = JSON.stringify(filter);
        return this.authHttp.post(this.corporativoUrl + '/ModificarCorporativo', body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    // Corporativo Notificar Usuario
    notificarUsuariosCorporativos(corporativo: CorporativoEntity): Observable<boolean> {
        const body = JSON.stringify(corporativo);
        return this.authHttp.post(this.corporativoUrl + '/EnviarNotificacionUsuario', body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    protected extractDataPaginatedEmpresas(res: any) {

        let body = res.json();
        body = body.Datos;
        if (body.total !== undefined)
            this.paginationConstants.total = body.total;
        if (body.data !== undefined) {
            this.paginationConstants.currentPageSize = body.data.length;
            return body.data || [];
        }
        return [];
    }

    private extractData(res: Response) {
        const body = res.json();
        //console.log(body);
        //if (body.Estado === 'Error') {
        //    this.authHttp.showError(body.Mensajes);
        //}
        //else {
            return body.Datos || [];
        //}
    }

    private extractBody(res: Response) {
        const body = res.json();
        //console.log(body);
        return body || [];
    }
}

