import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { Diagnostico, DiagnosticoFilter } from '../model/diagnostico';
import { Catalogo } from '../model/catalogo';
import { ExclusionEntityList } from '../model/exclusion';
import { DatosTransaccion } from '../model/transacciones';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class DiagnosticoService extends PaginationService {

    private diagnosticoUrl = 'diagnostico';
    private transaccionesUrl = 'transaccion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.diagnosticoUrl = constantService.API_ENDPOINT + this.diagnosticoUrl;
        this.transaccionesUrl = constantService.API_ENDPOINT + this.transaccionesUrl;
    }

    getAllByIniciales(iniciales: string): Observable<Diagnostico[]> {
        return this.authHttp.get(this.diagnosticoUrl + "/getAllByIniciales/" + iniciales)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getByFilterPaginated(filter: DiagnosticoFilter, pageNumber: number, pageSize: number): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.diagnosticoUrl + "/getByFilterPaginated", body, pageNumber, pageSize)
            .catch(this.authHttp.handleError);
    }

    getenfermedades(): Observable<Catalogo[]> {
        return this.authHttp.get(this.diagnosticoUrl + "/getenfermedades/")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    insertPreexistencia(preexistencia: ExclusionEntityList): Observable<DatosTransaccion> {
        let body = JSON.stringify(preexistencia);
        return this.authHttp.post(this.transaccionesUrl + "/insertPreexistencia", body, null, "SI")
            .map(this.extractRespGenerica)
            .catch(this.authHttp.handleError);
    }

    insertCoberturaEspecialDiagnostico(preexistencia: ExclusionEntityList): Observable<DatosTransaccion> {
        let body = JSON.stringify(preexistencia);
        return this.authHttp.post(this.transaccionesUrl + "/insertCoberturaEspecialDiagnostico", body, null, "SI")
            .map(this.extractRespGenerica)
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