import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ExclusionEntityList } from '../model/exclusion';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class ExclusionesService extends PaginationService {

    private exclusionesUrl = 'exclusiones';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.exclusionesUrl = constantService.API_ENDPOINT + this.exclusionesUrl;
    }

    getExclusionListByFilter(filter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.exclusionesUrl + "/allByfilter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }
}