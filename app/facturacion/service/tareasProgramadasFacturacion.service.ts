import { Injectable, } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { EmitirNotaEntity } from '../../common/model/pago';
import { CronTabEntity } from '../model/cronTabEntity';


@Injectable()
export class TareasProgramadasFacturacionService extends PaginationService {

    private programadas = 'tareasProgramadasFacturacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.programadas = constantService.API_ENDPOINT + this.programadas;
    }

    emitirNotasCreditoPCA(cronTabEntity: CronTabEntity): Observable<any> {
        let body = JSON.stringify(cronTabEntity);
        return this.authHttp.post(this.programadas + "/EmitirNotasCreditoMasivasPca/", body, null, "SI")
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    emitirNotasCreditoLote(cronTabEntity: CronTabEntity): Observable<any> {
        let body = JSON.stringify(cronTabEntity);
        return this.authHttp.post(this.programadas + "/EmitirNotasCreditoLoteProgramadas/", body, null, "SI")
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

}