import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { PaginationService } from '../../../utils/pagination.service';
import { PrestadorFilter } from '../../../common/model/prestador';
import { Observable } from 'rxjs/Rx';
import { PresupuestoDirectorFilter } from '../model/presupuestoDirectorFilter';
import { PresupuestoDirector } from '../model/presupuestoDirector';
import { HistorialPresupuestoDirector } from '../model/HistorialPresupuestoDirector';

@Injectable()
export class PresupuestoDirectorService extends PaginationService {

  
  private presupuestoUrl = 'presupuestoDirector';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super();
    this.presupuestoUrl = constantService.API_ENDPOINT + this.presupuestoUrl;
  } 
  
  
  consultarPresupuesto(registros: number, filter: PresupuestoDirectorFilter): Observable<PresupuestoDirector[]> {
    this.paginationConstants.pageSize = registros;
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.presupuestoUrl + "/consultarPresupuestoDirector", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);

  }

  
  insertarPresupuesto(presupuesto: PresupuestoDirector): Observable<any> {
    let body = JSON.stringify(presupuesto);
    return this.authHttp.post(this.presupuestoUrl + "/insertPresupuestoDirector", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarNombres(idSala:number): Observable<string[]> {
    return this.authHttp.get(this.presupuestoUrl + "/consultarNombres/"+idSala+"/", null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }

  
  actualizarPresupuesto(presupuesto: PresupuestoDirector): Observable<any> {
    let body = JSON.stringify(presupuesto);
    return this.authHttp.post(this.presupuestoUrl + "/actualizarPresupuesto", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarHistorial(CodigoPresupuestoVendedor:number):Observable<HistorialPresupuestoDirector[]>{
    return this.authHttp.get(this.presupuestoUrl + "/obtenerHistorial/"+CodigoPresupuestoVendedor+"/", null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }
}
