import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UsuarioService {

    private usuarioUrl = 'usuario';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.usuarioUrl = constantService.API_ENDPOINT + this.usuarioUrl;
    }

    getAll(): Observable<string[]> {
        return this.authHttp.get(this.usuarioUrl)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}