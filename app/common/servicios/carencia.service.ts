import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Carencia, CarenciaFilter } from '../model/carencia';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class CarenciaService extends PaginationService {

    private planUrl = 'carencias';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.planUrl = constantService.API_ENDPOINT + this.planUrl;
    }

    getByFiltersPaginated(filter: CarenciaFilter): Observable<Carencia[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.planUrl + "/filter", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }
}