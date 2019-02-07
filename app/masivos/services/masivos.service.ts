import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { MasivosEntity } from '../model/MasivosEntity';

@Injectable()
export class MasivosService extends PaginationService {

    private masivosUrl = 'masivos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.masivosUrl = constantService.API_ENDPOINT + this.masivosUrl;
    }

    buscarGenerarMuestra(masivo: MasivosEntity): Observable<any> {
        let body = JSON.stringify(masivo);
        return this.authHttp.post(this.masivosUrl + "/BuscarMuestraCargaMigracion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}
