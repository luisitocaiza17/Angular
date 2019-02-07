import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';
import { UsuarioAdmin, RolAdmin, UsuarioRolAdmin, FuncionalidadAdmin, FuncionalidadRolAdmin, UsuarioByNombreRol } from '../../common/model/admin';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';


@Injectable()
export class AdministracionSistemaService extends PaginationService {

    private adminSistemaUrl = 'adminSistema';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService, private http: Http) {
        super(1, 5);
        this.adminSistemaUrl = constantService.API_ENDPOINT + this.adminSistemaUrl;
    }


    GetRolesByNombreUsuario(nomUsuario: string): Observable<any> {
        return this.authHttp.get(this.adminSistemaUrl + "/getRolesByNombreUsuario/" + nomUsuario)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GetUsuarioByNombreUsuario(nomUsuario: string): Observable<UsuarioAdmin> {
        return this.authHttp.get(this.adminSistemaUrl + "/getUsuarioByNombreUsuario/" + nomUsuario)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GetRoles(): Observable<RolAdmin[]> {
        return this.authHttp.get(this.adminSistemaUrl + "/getRoles")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GetRolesByIdUsuario(IdUsuario: number): Observable<RolAdmin[]> {
        return this.authHttp.get(this.adminSistemaUrl + "/getRolesByIdUsuario/" + IdUsuario)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    asignarRolAUsuario(usuRol: UsuarioRolAdmin): Observable<any> {
        let body = JSON.stringify(usuRol);
        return this.authHttp.post(this.adminSistemaUrl + "/asignarRolAUsuario", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    eliminarRolAUsuario(usuRol: UsuarioRolAdmin): Observable<any> {
        let body = JSON.stringify(usuRol);
        return this.authHttp.post(this.adminSistemaUrl + "/eliminarRolAUsuario", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    CreateRol(nomRol: string): Observable<any> {
        return this.authHttp.get(this.adminSistemaUrl + "/createRol/" + nomRol)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GetFuncionalidades(): Observable<FuncionalidadAdmin[]> {
        return this.authHttp.get(this.adminSistemaUrl + "/getFuncionalidades")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GetFuncionalidadesByIdRol(idRol: number): Observable<FuncionalidadAdmin[]> {
        return this.authHttp.get(this.adminSistemaUrl + "/getFuncionalidadesByIdRol/" + idRol)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    asignarFuncionalidadARol(funRol: FuncionalidadRolAdmin): Observable<any> {
        let body = JSON.stringify(funRol);
        return this.authHttp.post(this.adminSistemaUrl + "/asignarFuncionalidadARol", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    eliminarFuncionalidadARol(funRol: FuncionalidadRolAdmin): Observable<any> {
        let body = JSON.stringify(funRol);
        return this.authHttp.post(this.adminSistemaUrl + "/eliminarFuncionalidadARol", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GetUsuarioByNombreRol(nombreRol: string): Observable<any> {
        return this.authHttp.get(this.adminSistemaUrl + "/getUsuariosByNombreRol/" + nombreRol, null,"SI")
            .map(this.extractRespGenerica)
            .catch(this.authHttp.handleError);
    }

    GetIPClient(): Observable<any> {
        return this.http.get(this.adminSistemaUrl + "/getIPClient")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }




}