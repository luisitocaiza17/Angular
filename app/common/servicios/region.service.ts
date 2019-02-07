import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { Region } from '../model/region';


@Injectable()
export class RegionService {

    private regionUrl = 'region';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.regionUrl = constantService.API_ENDPOINT + this.regionUrl;
    }

    getAll(): Observable<Region[]> {
        return this.authHttp.get(this.regionUrl)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}