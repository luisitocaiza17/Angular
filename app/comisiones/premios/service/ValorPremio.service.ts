import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { PaginationService } from '../../../utils/pagination.service';
import { ConstantService } from '../../../utils/constant.service';
import { PaginationConstants } from '../../../utils/pagination';
import { ValorPremio } from '../model/ValorPremio';

@Injectable()
export class ValorPremioService extends PaginationService {

    private valorPremioUrl = 'valorPremio';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.valorPremioUrl = constantService.API_ENDPOINT + this.valorPremioUrl;
    }

    createValorPremio(valorPremio:ValorPremio): Observable<boolean> {
        let body = JSON.stringify(valorPremio);
        return this.authHttp.post(this.valorPremioUrl + "/insertValorPremio", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getAllValorPremio(idDetallePremio:number): Observable<ValorPremio[]> {
        return this.authHttp.getPaginated(this.valorPremioUrl + "/getAllValorPremio/"+idDetallePremio,this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
        .map((res) => this.extractRespuestaGenericaDataPaginated(res))
        .catch(this.authHttp.handleError);
    }
  
    deleteValorPremio(valorPremio:ValorPremio): Observable<any> {
        let body = JSON.stringify(valorPremio);
        return this.authHttp.post(this.valorPremioUrl + "/deleteValorPremio", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    validarValorPremio(valorPremio:ValorPremio): Observable<boolean> {
        let body = JSON.stringify(valorPremio);
        return this.authHttp.post(this.valorPremioUrl + "/validarValorPremio", body, null, "SI")
            .map((res) => this.extractRespBooleana(res))
            .catch(this.authHttp.handleError);
    }
  

}
