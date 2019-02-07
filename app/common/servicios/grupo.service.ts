import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';
import {Grupo, GrupoSearch} from '../model/grupo';

import { ConstantService } from '../../utils/constant.service';


@Injectable()
export class GrupoService {

    private grupoUrl = 'grupo';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.grupoUrl = constantService.API_ENDPOINT + this.grupoUrl;
    }


    GetGrupos(): Observable<Grupo[]> {
        return this.authHttp.get(this.grupoUrl + '/ObtenerGrupos')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }
    CreateGrupo(grupo: Grupo): Observable<any> {
        const body = JSON.stringify(grupo);
        return this.authHttp.post(this.grupoUrl + '/CrearGrupo', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GetGruposCorp(parametros: GrupoSearch): Observable<Grupo[]> {
        return this.authHttp.post(this.grupoUrl + '/GetGruposCorp', JSON.stringify(parametros))
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    UpdateGrupo(item: Grupo): Observable<any> {
        const body = JSON.stringify(item);
        return this.authHttp.post(this.grupoUrl + '/UpdateGrupo', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    DeleteGrupo(item: Grupo): Observable<any> {
        const body = JSON.stringify(item);
        return this.authHttp.post(this.grupoUrl + '/DeleteGrupo', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }


    private extractData(res: Response) {
        console.log(res);
        let body = res.json();
        console.log(body);
        return body.Datos || [];
    }
}
