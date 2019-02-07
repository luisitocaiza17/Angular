import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { Cobranza, CobranzaFilter, ReciboCobranzaPdfIndividual } from '../model/cobranza';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { CitaCliente, CitaClienteFilter } from '../model/cobranzas';
import { DetalleRemesa } from '../model/detalleRemesa';

@Injectable()
export class CobranzaService extends PaginationService {

    private cobranzaUrl = 'cobranza';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.cobranzaUrl = constantService.API_ENDPOINT + this.cobranzaUrl;
    }

    getByFiltersPaginated(filter: CobranzaFilter): Observable<Cobranza[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.cobranzaUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getOneByKey(key: CobranzaFilter): Observable<Cobranza> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.cobranzaUrl + "/getOneByKey", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    insertCitaCliente(citaCliente: CitaCliente): Observable<any> {
        let body = JSON.stringify(citaCliente);
        return this.authHttp.post(this.cobranzaUrl + "/insertCitaClientes", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getCitasClientesPaginated(filterCitas: CitaClienteFilter): Observable<any> {
        let body = JSON.stringify(filterCitas);
        return this.authHttp.postPaginated(this.cobranzaUrl + "/GetCitasClientesByFiltersPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    addObservacionYCumplida(citaCliente: CitaCliente): Observable<any> {
        let body = JSON.stringify(citaCliente);
        return this.authHttp.post(this.cobranzaUrl + "/AddObservacionCitaAndCumplida", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    addRutaToCitaCliente(citaCliente: CitaCliente): Observable<any> {
        let body = JSON.stringify(citaCliente);
        return this.authHttp.post(this.cobranzaUrl + "/AddRutaToCitaCliente", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ImprimirReciboCobranza(detalleRemesa: DetalleRemesa): Observable<any> {
        let body = JSON.stringify(detalleRemesa);
        return this.authHttp.post(this.cobranzaUrl + "/ImprimirReciboCobranza", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ModificarValorSiExisteDiferenciasEnDetalleRemesaVsCotizaciones(recibo: ReciboCobranzaPdfIndividual): Observable<any> {
        let body = JSON.stringify(recibo);
        return this.authHttp.post(this.cobranzaUrl + "/ModificarValorSiExisteDiferenciasEnDetalleRemesaVsCotizaciones", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}