import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { CatalogoEstados } from '../../../common/model/catalogoEstados';
import { Observable } from 'rxjs/Rx';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { SubtipoFilter } from '../model/subtipoFilter';
import { Subtipo, SubtipoSoloEntity } from '../model/subtipo';
import { ObservacionSubtipo } from '../model/ObservacionSubtipo';
import { HistorialSubtipo } from '../model/HistorialSubtipo';


@Injectable()
export class SubtipoService extends PaginationService {

  private subtipoUrl = 'subtipo';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1,10);
    this.subtipoUrl = constantService.API_ENDPOINT + this.subtipoUrl;
  }


  insertarSubtipo(subtipo: Subtipo): Observable<any> {
    let body = JSON.stringify(subtipo);
    return this.authHttp.post(this.subtipoUrl + "/insertSubtipo", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarNombres(idTipo:number): Observable<string[]> {
    return this.authHttp.get(this.subtipoUrl + "/consultarNombres/"+idTipo, null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }

  consultarUltimaObservacion(idSubtipo: number): Observable<ObservacionSubtipo> {

    return this.authHttp.get(this.subtipoUrl + "/consultarUltimaObservacion/" + idSubtipo, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);

  }


  agregarObservacion(observacion: ObservacionSubtipo): Observable<any> {
    let body = JSON.stringify(observacion);
    return this.authHttp.post(this.subtipoUrl + "/insertObservacion", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


  consultarSubtipo(filter: SubtipoFilter): Observable<Subtipo[]> {
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.subtipoUrl + "/consultarSubtipo", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);

  }

  consultarHistorial(idSubtipo: number): Observable<HistorialSubtipo> {
    if (idSubtipo != undefined) {
      return this.authHttp.get(this.subtipoUrl + "/historialSubtipo/" + idSubtipo, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }
  }

  getAllSubtipos(): Observable<Subtipo[]> {
    return this.authHttp.get(this.subtipoUrl + "/getAllSubtipos", null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


  getSubtipoByTipos(idtipo: number): Observable<Subtipo[]> {
    return this.authHttp.get(this.subtipoUrl + "/getSubtipoByTipo/" + idtipo, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  getSubtipoByFilters(filter: SubtipoFilter): Observable<SubtipoSoloEntity> {
    let body = JSON.stringify(filter);
    return this.authHttp.post(this.subtipoUrl + "/GetSubtipoByFilters", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  getSubtipoById(idsubtipo: number): Observable<Subtipo[]> {
    return this.authHttp.get(this.subtipoUrl + "/getSubtipoById/" + idsubtipo, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


}
