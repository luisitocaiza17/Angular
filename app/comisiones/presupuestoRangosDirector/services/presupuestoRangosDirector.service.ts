import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { PaginationService } from '../../../utils/pagination.service';
import { Observable } from 'rxjs/Rx';
import { PresupuestoRangosDirectorFilter, PresupuestoRangosDirectorEntity } from '../model/presupuestoRangosDirector.model';

@Injectable()
export class PresupuestoRangosDirectorService extends PaginationService {

  
  private presupuestoUrl = 'presupuestoRangosDirector';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1,10);
    this.presupuestoUrl = constantService.API_ENDPOINT + this.presupuestoUrl;
  }   

  consultarPresupuestos(filter: PresupuestoRangosDirectorFilter): Observable<PresupuestoRangosDirectorEntity[]> {
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.presupuestoUrl + "/consultarPresupuestoRangosDirector", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);
  }

  actualizarPresupuestoRangosDirector(presupuesto: PresupuestoRangosDirectorEntity): Observable<any> {
    let body = JSON.stringify(presupuesto);
    return this.authHttp.post(this.presupuestoUrl + "/actualizarPresupuestoRangosDirector", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  crearPresupuestoRangosDirector(presupuesto: PresupuestoRangosDirectorEntity): Observable<any> {
    let body = JSON.stringify(presupuesto);
    return this.authHttp.post(this.presupuestoUrl + "/crearPresupuestoRangosDirector", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }
}
