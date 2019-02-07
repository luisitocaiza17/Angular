import { Injectable } from '@angular/core';
import { Semaforo } from '../model/semaforo';
import { Observable } from 'rxjs/Rx';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { PaginationService } from '../../../utils/pagination.service';
import { ConstantService } from '../../../utils/constant.service';
@Injectable()
export class SemaforoService extends PaginationService {

    private semaforoUrl = 'semaforo';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.semaforoUrl = constantService.API_ENDPOINT + this.semaforoUrl;
    }

    actualizarSemaforo(listaSemaforo: Semaforo[]): Observable<any> {
        let body = JSON.stringify(listaSemaforo);
        return this.authHttp.post(this.semaforoUrl + "/actualizarSemaforo", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getTipoSemaforos(): Observable<string[]> {
        return this.authHttp.get(this.semaforoUrl + "/tipoSemaforos",null, "SI")
            .map((res)=> this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getSemaforosByTipo(tipoSemaforo:number):Observable<Semaforo[]>{
        return this.authHttp.get(this.semaforoUrl+"/semaforos/"+tipoSemaforo, null, "SI")
        .map((res)=> this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }

}
