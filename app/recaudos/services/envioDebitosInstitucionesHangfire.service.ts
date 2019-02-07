import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { RemesaEntity } from '../../common/model/remesa';
import { InputForEnvioDebitosInstituciones } from '../model/recaudo';
import { BancoEntity } from '../../common/model/genericos';
import { DetalleRemesa } from '../../common/model/detalleRemesa';


@Injectable()
export class EnvioDebitosInstitucionesHangfireService extends PaginationService {

    private fileGenerationUrl = 'EnvioDebitosInstitucionesHangfire';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10); 
        this.fileGenerationUrl = constantService.API_ENDPOINT + this.fileGenerationUrl;        
    }

    GenerarArchivosDebitosInstitucionPorRegion(input: InputForEnvioDebitosInstituciones): Observable<string>{ 
        let body = JSON.stringify(input);
        return this.authHttp.post(this.fileGenerationUrl + "/GenerarArchivosDebitosInstitucionPorRegion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GenerarArchivosDebitosInstitucionNacional(input: InputForEnvioDebitosInstituciones): Observable<string>{ 
        let body = JSON.stringify(input);
        return this.authHttp.post(this.fileGenerationUrl + "/GeneraArchivoDebitosNacional", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}