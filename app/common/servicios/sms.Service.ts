import { PaginationService } from "../../utils/pagination.service";
import { Injectable, Inject } from '@angular/core';
import { AppAuthHttp } from "../../seguridad/appAuthHttp";
import { ConstantService } from "../../utils/constant.service";
import { Observable } from 'rxjs/Rx';
import { MensajeSMS } from "../model/mensajesms";
@Injectable()
export class ServicioSMS extends PaginationService {

    private contratoUrl = 'comunicaciones';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.contratoUrl = constantService.API_ENDPOINT + this.contratoUrl;
    }

    postSendSMS(mensaje: MensajeSMS): Observable<any> {
        let body = JSON.stringify(mensaje);
        return this.authHttp.post(this.contratoUrl + "/EnviarSMS",body,  null, "SI")
            .map(this.extractRespGenerica)
            .catch(this.authHttp.handleError);
    }
}