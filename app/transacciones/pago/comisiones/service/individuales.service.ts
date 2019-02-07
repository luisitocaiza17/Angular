import { Injectable } from '@angular/core';
import { PaginationService } from '../../../../utils/pagination.service';
import { AppAuthHttp } from '../../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../../utils/constant.service';
import { IndividualEntitiy } from '../individual/model/IndividualEntity';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class IndividualesService extends PaginationService {

  private individualesUrl = 'individuales';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1, 5);
    this.individualesUrl = constantService.API_ENDPOINT + this.individualesUrl;
  }

  actualizarIndividuales(individuales: IndividualEntitiy): Observable<any> {
    let body = JSON.stringify(individuales);
    return this.authHttp.post(this.individualesUrl + "/actualizarIndividual", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  obtenerIndividuales(individuales: IndividualEntitiy): Observable<IndividualEntitiy> {
    let body = JSON.stringify(individuales);
    return this.authHttp.post(this.individualesUrl + "/obtenerIndividuales", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

}
