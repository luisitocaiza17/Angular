import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { Rangos } from '../model/Rangos';
import { Observable } from 'rxjs/Rx';
import { CatalogoEstados } from '../../../common/model/catalogoEstados';
import { ObservacionRangos } from '../model/ObservacionRangos';
import { RangosFilter } from '../model/RangosFilter';
import { HistorialRangos } from '../model/HistorialRangos';

@Injectable()
export class RangosService extends PaginationService {


  private rangosUrl = 'rangos';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1,10);
    this.rangosUrl = constantService.API_ENDPOINT + this.rangosUrl;
  }


  insertarRangos(rangos: Rangos): Observable<any> {
    let body = JSON.stringify(rangos);
    return this.authHttp.post(this.rangosUrl + "/insertRangos", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


  consultarNombres(idTipo:number, idSubtipo:number, idSucursal:number, idCanal): Observable<string[]> {
    return this.authHttp.get(this.rangosUrl + "/consultarNombres/"+idTipo+"/"+idSubtipo+"/"+idSucursal+"/"+idCanal+"/", null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }

  consultarUltimaObservacion(idRangos: number): Observable<ObservacionRangos> {

    return this.authHttp.get(this.rangosUrl + "/consultarUltimaObservacion/" + idRangos, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);

  }


  agregarObservacion(observacion: ObservacionRangos): Observable<any> {
    let body = JSON.stringify(observacion);
    return this.authHttp.post(this.rangosUrl + "/insertObservacion", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


  consultarRangos(filter: RangosFilter): Observable<Rangos[]> {
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.rangosUrl + "/consultarRangos", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);

  }

  consultarHistorial(idRangos: number): Observable<HistorialRangos> {
    if (idRangos != undefined) {
      return this.authHttp.get(this.rangosUrl + "/historialRangos/" + idRangos, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }
  }

  getRango(idsubtipo:number, idSucursal: number, idCanal: number): Observable<Rangos[]> {
    return this.authHttp.get(this.rangosUrl + "/buscarRango/"+idsubtipo+"/"+idSucursal+"/"+idCanal, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

}
