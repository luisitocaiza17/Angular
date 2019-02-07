import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { PaginationService } from '../../../utils/pagination.service';
import { PrestadorFilter } from '../../../common/model/prestador';
import { PresupuestoVendedor } from '../model/presupuestoVendedor';
import { Observable } from 'rxjs/Rx';
import { PresupuestoVendedorFilter } from '../model/presupuestoVendedorFilter';
import { HistorialPresupuestoVendedor } from '../model/historialPresupuestoVendedor';

@Injectable()
export class PresupuestoVendedorService extends PaginationService {

  
  private presupuestoUrl = 'presupuestoVendedor';
  constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super();
    this.presupuestoUrl = constantService.API_ENDPOINT + this.presupuestoUrl;
  } 
  
  
  consultarPresupuesto(registros: number, filter: PresupuestoVendedorFilter): Observable<PresupuestoVendedor[]> {
    this.paginationConstants.pageSize = registros;
    let body = JSON.stringify(filter);
    return this.authHttp.postPaginated(this.presupuestoUrl + "/consultarPresupuestoVendedor", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
      .map((res) => this.extractRespuestaGenericaDataPaginated(res))
      .catch(this.authHttp.handleError);

  }

  
  insertarPresupuesto(presupuesto: PresupuestoVendedor): Observable<any> {
    let body = JSON.stringify(presupuesto);
    return this.authHttp.post(this.presupuestoUrl + "/insertPresupuestoVendedor", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarNombres(idRango:number): Observable<string[]> {
    return this.authHttp.get(this.presupuestoUrl + "/consultarNombres/"+idRango+"/", null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }

  
  actualizarPresupuesto(presupuesto: PresupuestoVendedor): Observable<any> {
    let body = JSON.stringify(presupuesto);
    return this.authHttp.post(this.presupuestoUrl + "/actualizarPresupuesto", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  consultarHistorial(CodigoPresupuestoVendedor:number):Observable<HistorialPresupuestoVendedor[]>{
    return this.authHttp.get(this.presupuestoUrl + "/obtenerHistorial/"+CodigoPresupuestoVendedor+"/", null, "SI")
      .map(this.extractRespGenerica)
      .catch(this.authHttp.handleError);
  }

}
