import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { PaginationService } from '../../../utils/pagination.service';
import { Niveles } from '../model/Niveles';
import { Observable } from 'rxjs/Rx';
import { ObservacionNiveles } from '../model/ObservacionNiveles';
import { NivelesFilter } from '../model/nivelesFilter';
import { HistorialNiveles } from '../model/HistorialNiveles';
@Injectable()
export class NivelesService extends PaginationService {

  private nivelesUrl = 'niveles';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1,10);
    this.nivelesUrl = constantService.API_ENDPOINT + this.nivelesUrl;
  }


  insertarNiveles(niveles: Niveles): Observable<any> {
    let body = JSON.stringify(niveles);
    return this.authHttp.post(this.nivelesUrl + "/insertNiveles", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }



  
  agregarNiveles(observacion: ObservacionNiveles): Observable<any> {
    let body = JSON.stringify(observacion);
    return this.authHttp.post(this.nivelesUrl + "/insertNiveles", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


  consultarNiveles(filter: NivelesFilter): Observable<Niveles[]> {
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.nivelesUrl + "/consultarNiveles", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);

  }

  consultarNombres(): Observable<string[]> {
    return this.authHttp.get(this.nivelesUrl + "/consultarNombres",null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }


  consultarUltimaObservacion(idNiveles: number): Observable<ObservacionNiveles> {
    if(idNiveles!=undefined){
      return this.authHttp.get(this.nivelesUrl + "/consultarUltimaObservacion/" + idNiveles, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
    }
  }

  getAllNiveles(): Observable<Niveles[]> {
      return this.authHttp.get(this.nivelesUrl + "/getAllNiveles", null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarHistorial(idNiveles: number): Observable<HistorialNiveles> {
    if(idNiveles!=undefined){
      return this.authHttp.get(this.nivelesUrl + "/historialNiveles/" + idNiveles, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
    }
  }

  agregarObservacion(observacion: ObservacionNiveles): Observable<any> {
    let body = JSON.stringify(observacion);
    return this.authHttp.post(this.nivelesUrl + "/insertObservacion", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }


}
