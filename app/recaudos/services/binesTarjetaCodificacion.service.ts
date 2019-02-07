import { Injectable, Inject } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class BinesTarjetaCodificacionService extends PaginationService {

    private binesTarjetaCodificacionUrl = 'binesTarjetaCodificacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5)
        this.binesTarjetaCodificacionUrl = constantService.API_ENDPOINT + this.binesTarjetaCodificacionUrl;
    }

    GetBines(): Observable<any[]> {
        return this.authHttp.get(this.binesTarjetaCodificacionUrl + "/ObtenerBines", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}