import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';
import { Caso, CasoFilter } from '../../common/model/gestionPasientes';

import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class GestionPasientesService {

    private url = '/casos';

    private user = 'rest';
    private password = '12345';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.url = constantService.API_ENDPOINT + this.url;
    }

    GetCasos(filter: CasoFilter): Observable<Caso[]> {
        filter.AutorizacionHeader = this.GetAuthBasic();
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.url + "/buscarCasos", body, null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    AsignarAutorizacionACaso(filter: CasoFilter): Observable<any> {        
        filter.AutorizacionHeader = this.GetAuthBasic();
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.url + "/asignarAutorizacionACaso", body, null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GuardaNuevoCaso(filter: CasoFilter): Observable<any> {        
        filter.AutorizacionHeader = this.GetAuthBasic();
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.url + "/guardaNuevoCaso", body, null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    AumentarCuota(filter: CasoFilter): Observable<any> {        
        filter.AutorizacionHeader = this.GetAuthBasic();
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.url + "/aumentarCuota", body, null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    ActualizaFecha(filter: CasoFilter): Observable<any> {        
        filter.AutorizacionHeader = this.GetAuthBasic();
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.url + "/actualizaFecha", body, null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private GetAuthBasic(): string{
        var aut = 'Basic ' + btoa(this.user + ':' + this.password);
        return aut;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}