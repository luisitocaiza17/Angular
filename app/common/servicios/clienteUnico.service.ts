import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { PersonaUnicaEntity } from '../model/persona';

@Injectable()
export class ClienteUnicoService extends PaginationService {

    private clienteUnicoUrl = 'clienteUnico';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5)
        this.clienteUnicoUrl = constantService.API_ENDPOINT + this.clienteUnicoUrl;
    }

    updateClienteUnico(clienteUnico: PersonaUnicaEntity): Observable<boolean> {
        let body = JSON.stringify(clienteUnico);
        return this.authHttp.post(this.clienteUnicoUrl + "/updateClienteUnico", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    insertClienteUnico(clienteUnico: PersonaUnicaEntity): Observable<number> {
        let body = JSON.stringify(clienteUnico);
        return this.authHttp.post(this.clienteUnicoUrl + "/insertClienteUnico", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getClienteUnico(numeroPersona: number): Observable<PersonaUnicaEntity> {
        return this.authHttp.get(this.clienteUnicoUrl + "/getClienteUnico/" + numeroPersona)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    GetProvincias(): Observable<any[]> {
        return this.authHttp.get(this.clienteUnicoUrl + "/ObtenerProvincias", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}