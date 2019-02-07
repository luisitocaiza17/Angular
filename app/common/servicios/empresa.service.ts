import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ContratoKey } from '../../common/model/contrato';
import { PaginationService } from '../../utils/pagination.service';

import { ConstantService } from '../../utils/constant.service';
import { EmpresaCoorporativo } from '../model/corporativo';
import { Empresa, EmpresaFilter } from '../model/empresa';

@Injectable()
export class EmpresaService extends PaginationService {

    private empresaUrl = 'empresa';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.empresaUrl = constantService.API_ENDPOINT + this.empresaUrl;
    }

    getByRuc(ruc: string): Observable<any> {
        return this.authHttp.get(this.empresaUrl + "/" + ruc)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getActualizarEmpresa(empresaNumero: number, sucursalEmpresa: number, codigoContrato: number, contratoKey: ContratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.empresaUrl + "/getActualizarEmpresa/" + empresaNumero + "/" + sucursalEmpresa + "/" + codigoContrato, body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    buscarEmpresa(filter: EmpresaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.empresaUrl + "/buscarEmpresa", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    registarEmpresa(empresa: Empresa): Observable<any> {

        let body = JSON.stringify(empresa);
        return this.authHttp.post(this.empresaUrl + "/insertarEmpresa", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);

    }

    actualizaEmpresa(empresa: Empresa): Observable<any> {
        let body = JSON.stringify(empresa);
        return this.authHttp.post(this.empresaUrl + "/actualizarEmpresa", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}