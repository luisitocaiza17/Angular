import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { ResultadoGenerarArchivosBancos } from '../model/recaudo';


@Injectable()
export class BanksFileGeneration extends PaginationService {

    private fileGenerationUrl = 'GeneracionArchivosBancos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10); 
        this.fileGenerationUrl = constantService.API_ENDPOINT + this.fileGenerationUrl;        
    }

    GeneracionArchivosTodosLosBancos(): Observable<ResultadoGenerarArchivosBancos> {
        return this.authHttp.get(this.fileGenerationUrl + "/GeneracionArchivosTodosLosBancos", null, "SI")
                .map( (res) => this.extractRespGenerica(res) )
                .catch(this.authHttp.handleError);
    }

    GeneracionArchivosPagoDirectoYBansalud(): Observable<ResultadoGenerarArchivosBancos> {
        return this.authHttp.get(this.fileGenerationUrl + "/GenerarArchivosPagoDirectoYBansalud", null, "SI")
                .map( (res) => this.extractRespGenerica(res) )
                .catch(this.authHttp.handleError);
    }

    descgargarTxt(fileName: string): Observable<any>{
        fileName = fileName.replace('.txt', '');
        return this.authHttp.getGetFile(this.fileGenerationUrl + "/descargarTxt/" + fileName, null);
    }
}