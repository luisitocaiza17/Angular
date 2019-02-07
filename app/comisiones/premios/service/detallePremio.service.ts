import { Injectable } from "@angular/core";
import { PaginationService } from '../../../utils/pagination.service';
import { AppAuthHttp } from "../../../seguridad/appAuthHttp";
import { ConstantService } from "../../../utils/constant.service";
import { Observable } from 'rxjs/Rx';
import { DetallePremio } from "../model/DetallePremio";
@Injectable()
export class DetallePremioService extends PaginationService {

    private detallePremioUrl = 'detallePremio';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.detallePremioUrl = constantService.API_ENDPOINT + this.detallePremioUrl;
    }

    createDetallePremio(detallePremio:DetallePremio): Observable<any> {
        let body = JSON.stringify(detallePremio);
        return this.authHttp.post(this.detallePremioUrl + "/createDetallePremio", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getDetallePremioByPremio(idPremio:Number):Observable<DetallePremio[]>{
        return this.authHttp.getPaginated(this.detallePremioUrl + "/getDetallePremioByPremio/"+idPremio, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
          .map((res) => this.extractRespuestaGenericaDataPaginated(res))
          .catch(this.authHttp.handleError);
    }

    updateDetallePremio(detallPremio:DetallePremio): Observable<any> {
        let body = JSON.stringify(detallPremio);
        return this.authHttp.post(this.detallePremioUrl + "/updateDetallePremio", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}
