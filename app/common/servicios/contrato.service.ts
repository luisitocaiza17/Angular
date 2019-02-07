import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { ContratoEntityFilter, ContratoKey, Contrato, DatosTitular, ClaveContratoEntity } from '../model/contrato';
import { TransaccionKey } from '../model/transacciones';
import { MovimientoWithNombreTransaccion } from '../model/movimiento';
import { AgenteVentaReasignacionCartera } from '../../common/model/agenteVentaReasignacionCartera';

@Injectable()
export class ContratoService extends PaginationService {

    private contratoUrl = 'contratos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.contratoUrl = constantService.API_ENDPOINT + this.contratoUrl;
    }

    getByFiltersPaginated(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.contratoUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getOneByKey(filter: ContratoKey): Observable<Contrato> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.contratoUrl + "/getOneByKey", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getResumenContrato(contratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.contratoUrl + "/getResumenContrato", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getContratoKey(filter: TransaccionKey): Observable<ContratoKey> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.contratoUrl + "/getContratoKey", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getDatosTitular(filter: TransaccionKey): Observable<DatosTitular> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.contratoUrl + "/datosTitular", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    descargarReporteSaldosFavor(filter: TransaccionKey): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.contratoUrl + "/ReporteSaldoAFavor", body, null, "SI");
    }


    getListaContratosPaginated(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.contratoUrl + "/getListaContratos", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getUltimoMovimientoByClaveContratoAndEstados(claveContrato: ClaveContratoEntity, codigosTransaccion: number[]): Observable<MovimientoWithNombreTransaccion> {
        let body = JSON.stringify(claveContrato);
        var cods = '?';

        for (let i = 0; i < codigosTransaccion.length; i++) {
            if (i < codigosTransaccion.length - 1)
                cods += 'codigos=' + codigosTransaccion[i] + '&';
            else
                cods += 'codigos=' + codigosTransaccion[i];
        }

        return this.authHttp.post(this.contratoUrl + "/ObtenerUltimoMovimientoByClaveContratoAndEstados" + cods, body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    updateContrato(reasignacionCartera: AgenteVentaReasignacionCartera): Observable<boolean> {
        let body = JSON.stringify(reasignacionCartera);
        return this.authHttp.post(this.contratoUrl + "/actualizarContratoReasignacionCartera", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getByFiltersSobrePaginated(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.contratoUrl + "/filterForSobres", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}