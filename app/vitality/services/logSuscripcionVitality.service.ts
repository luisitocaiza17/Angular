import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { LogSuscripcionVitalityEntity } from '../model/vitality.model';


@Injectable()
export class LogSuscripcionVitalityService extends PaginationService {

    private url = 'logSuscripcionVitality';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.url = constantService.API_ENDPOINT + this.url;
    }

    GetLogsSuscripcionesByFilters(filter: LogSuscripcionVitalityEntity): Observable<LogSuscripcionVitalityEntity[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.url + "/GetLogsSuscripcionesByFilters", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}