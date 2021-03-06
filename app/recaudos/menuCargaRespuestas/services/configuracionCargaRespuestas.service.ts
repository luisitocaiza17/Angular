import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../../utils/constant.service';
import { PaginationService } from '../../../utils/pagination.service';
import { ColumnaBdd, ConfiguracionCargaBancoEntity } from '../model/estadoCargaRespuestas.model';

@Injectable()
export class ConfiguracionCargaRespuestasService extends PaginationService {

    private serviceUrl = 'configuracionCargaRespuestas';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.serviceUrl = constantService.API_ENDPOINT + this.serviceUrl;
    }

    guardarConfiguracion(configuracion: ConfiguracionCargaBancoEntity): Observable<boolean[]> {
        let body = JSON.stringify(configuracion);
        return this.authHttp.post(this.serviceUrl + "/GuardarConfiguracion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getConfiguracion(codigoBanco: number): Observable<ConfiguracionCargaBancoEntity> {
        return this.authHttp.get(this.serviceUrl + "/GetConfiguracion/" + codigoBanco , null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
} 