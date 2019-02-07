import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { Canales } from '../model/canales';
import { Observable } from 'rxjs/Rx';
import { ObservacionCanales } from '../model/observacionCanales';
import { CanalesFilter } from '../model/canalesFilter';
import { HistorialCanales } from '../model/historialCanales';


@Injectable()
export class CanalesService extends PaginationService {

  private canalesUrl = 'canales';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1,10);
    this.canalesUrl = constantService.API_ENDPOINT + this.canalesUrl;
  }


  insertarCanales(canales: Canales): Observable<any> {
    let body = JSON.stringify(canales);
    return this.authHttp.post(this.canalesUrl + "/insertCanales", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarNombres(): Observable<string[]> {
    return this.authHttp.get(this.canalesUrl + "/consultarNombres", null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }

  consultarUltimaObservacion(idCanales: number): Observable<ObservacionCanales> {

    return this.authHttp.get(this.canalesUrl + "/consultarUltimaObservacion/" + idCanales, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);

  }

  agregarObservacion(observacion: ObservacionCanales): Observable<any> {
    let body = JSON.stringify(observacion);
    return this.authHttp.post(this.canalesUrl + "/insertObservacion", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


  consultarCanales(filter: CanalesFilter): Observable<Canales[]> {
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.canalesUrl + "/consultarCanales", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);

  }


  consultarHistorial(idCanales: number): Observable<HistorialCanales> {
    if (idCanales != undefined) {
      return this.authHttp.get(this.canalesUrl + "/historialCanales/" + idCanales, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }
  }

  getAllSubCanales(): Observable<Canales[]> {
    return this.authHttp.get(this.canalesUrl + "/getAllCanales", null, "SI")
    .map((res) => this.extractRespGenerica(res))
    .catch(this.authHttp.handleError);
}

}
