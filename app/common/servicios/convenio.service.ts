import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConvenioFilter, DetalleConvenioEntity } from '../model/convenio';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class ConvenioService extends PaginationService {

    private convenioUrl = 'convenio';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.convenioUrl = constantService.API_ENDPOINT + this.convenioUrl;
    }

    getByFilterPaginated(filter: ConvenioFilter, pageNumber: number, pageSize: number): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.convenioUrl + "/getByFilterPaginated", body, pageNumber, pageSize)
            .catch(this.authHttp.handleError);
    }

    getMedicosForAutorizacionByFilter(filter: ConvenioFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.convenioUrl + "/filterMedicosForAutorizacion", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }
    getClinicasForAutorizacionByFilter(filter: ConvenioFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.convenioUrl + "/filterHospitalesForNumero", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getHospitalesForAutorizacionByFilter(filter: ConvenioFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.convenioUrl + "/filterHospitalesForAutorizacion", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getMedicosByFiltersPaginated(filter: ConvenioFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.convenioUrl + "/filterMedicosForOdas", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getConvenioDetalle(numeroConvenio: number): Observable<any> {
        return this.authHttp.get(this.convenioUrl + "/convenioPorNumero/" + numeroConvenio, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    actualizarConvenio(convenio: DetalleConvenioEntity): Observable<any> {
        let body = JSON.stringify(convenio);
        return this.authHttp.post(this.convenioUrl + "/actualizaConvenio", body, null, "SI")
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    insertarConvenio(convenio: DetalleConvenioEntity): Observable<any> {
        let body = JSON.stringify(convenio);
        return this.authHttp.post(this.convenioUrl + "/insertarConvenio", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private extractRespuestaGenerica(res: Response) {
        let body = res.json();
        return body.Datos || {};
    }
}