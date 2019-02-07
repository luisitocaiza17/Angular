import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { TipoFilter } from '../model/tipoFilter';
import { Tipo } from '../model/Tipo';
import { Observable } from 'rxjs/Rx';
import { ObservacionTipo } from '../model/ObservacionTipo';
import { CatalogoEstados } from '../../../common/model/catalogoEstados';
import { HistorialTipo } from '../model/HistorialTipo';


@Injectable()
export class TipoService extends PaginationService {

  private tipoUrl = 'tipo';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1,10);
    this.tipoUrl = constantService.API_ENDPOINT + this.tipoUrl;
  }


  consultarTipo(filter: TipoFilter): Observable<Tipo[]> {
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.tipoUrl + "/consultarTipo", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);
  }

  consultarNombres(idNivel:number): Observable<string[]> {
    return this.authHttp.get(this.tipoUrl + "/consultarNombres/"+ idNivel, null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }

  consultarUltimaObservacion(idTipo: number): Observable<ObservacionTipo> {

    return this.authHttp.get(this.tipoUrl + "/consultarUltimaObservacion/" + idTipo, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);

  }

  consultarHistorial(idTipo: number): Observable<HistorialTipo> {
    if (idTipo != undefined) {
      return this.authHttp.get(this.tipoUrl + "/historialTipo/" + idTipo, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }
  }

  agregarObservacion(observacion: ObservacionTipo): Observable<any> {
    let body = JSON.stringify(observacion);
    return this.authHttp.post(this.tipoUrl + "/insertObservacion", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  insertarTipo(tipo: Tipo): Observable<any> {
    let body = JSON.stringify(tipo);
    return this.authHttp.post(this.tipoUrl + "/insertTipo", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  getAllTipos(): Observable<Tipo[]> {
    return this.authHttp.get(this.tipoUrl + "/getAllTipos", null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarTiposPadre(): Observable<Tipo[]> {
    return this.authHttp.get(this.tipoUrl + "/getTiposPadre", null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarTiposHijos(nivelPadre: number): Observable<Tipo[]> {
    return this.authHttp.get(this.tipoUrl + "/getTiposHijos/"+ nivelPadre, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  getTodosTiposHijos(): Observable<Tipo[]> {
    return this.authHttp.get(this.tipoUrl + "/GetTodosTiposHijos", null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarTiposVendedor(): Observable<Tipo[]> {
    return this.authHttp.get(this.tipoUrl + "/getTipoVendedor/", null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }
}
