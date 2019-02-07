import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { PaginationService } from '../../../utils/pagination.service';
import { ConstantService } from '../../../utils/constant.service';
import { Premio } from '../model/premio';
import { PaginationConstants } from '../../../utils/pagination';

@Injectable()
export class PremioService extends PaginationService {

    private premioUrl = 'premio';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.premioUrl = constantService.API_ENDPOINT + this.premioUrl;
    }

    createPremio(premio:Premio): Observable<any> {
        let body = JSON.stringify(premio);
        return this.authHttp.post(this.premioUrl + "/insertPremio", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getAllPremio(): Observable<Premio[]> {
        return this.authHttp.getPaginated(this.premioUrl + "/getAllPremio",this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
        .map((res) => this.extractRespuestaGenericaDataPaginated(res))
        .catch(this.authHttp.handleError);
    }
  
    updatePremio(premio:Premio): Observable<any> {
        let body = JSON.stringify(premio);
        return this.authHttp.post(this.premioUrl + "/updatePremio", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

  

}
