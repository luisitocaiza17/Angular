import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { TransaccionKey } from '../model/transacciones';
import { DetallePagoEntity, DetallePagoFilter } from '../model/pago';


@Injectable()
export class PagoService extends PaginationService {

    private pagoUrl = 'pago';

    constructor(private http: Http, private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.pagoUrl = constantService.API_ENDPOINT + this.pagoUrl;
    }

    obtenerCabeceraPagoByContratoPaginated(filter: TransaccionKey): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.pagoUrl + "/obtenerCabeceraPagoByContratoPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    obtenerMotivosNotaCredito(): Observable<any> {
        return this.authHttp.get(this.pagoUrl + "/motivosNotaCredito", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerMotivosSalud(): Observable<any> {
        return this.authHttp.get(this.pagoUrl + "/motivosSalud", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
    obtenerMotivosSalud2(fileToUpload: File): Observable<any> {
        let formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        console.log("Hola : --->")
        console.log(fileToUpload);
        console.log(formData);
        return this.http.post(this.pagoUrl + "/ingresarRespuesta", formData)
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

}