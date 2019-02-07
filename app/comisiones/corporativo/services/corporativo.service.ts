import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { ConstantService } from '../../../utils/constant.service';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ListaCorporativoFilter, ListaCorporativoEntity } from '../model/listaCorporativo';
import { Observable } from 'rxjs/Rx';
import { ListaPlanesCorporativoEntity } from '../model/listaPlanesCorporativo';
import { CorporativoReferidoEntity } from '../model/corporativoReferidoEntity';

@Injectable()
export class CorporativoService extends PaginationService {

  private listaCorporativoUrl = 'ListaCorporativo';
  private comisionesCorporativoUrl = 'corporativoComisiones';
  

  constructor(private authHttp: AppAuthHttp,private constantService: ConstantService){
      super(1, 10);        
      this.listaCorporativoUrl = constantService.API_ENDPOINT + this.listaCorporativoUrl;
      this.comisionesCorporativoUrl = constantService.API_ENDPOINT + this.comisionesCorporativoUrl;
      
  }

  actualizarContratos(filter: CorporativoReferidoEntity): Observable<boolean> {
    let body = JSON.stringify(filter);
    return this.authHttp.post(this.comisionesCorporativoUrl + "/actualizarCorporativo", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);

  }

  obtenerSucursalEmpresa(contrato:CorporativoReferidoEntity):Observable<CorporativoReferidoEntity>{
    let body = JSON.stringify(contrato);
    return this.authHttp.post(this.comisionesCorporativoUrl + "/obtenerSucursalEmpresa", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }

  getByFilters(registros: number, filter: ListaCorporativoFilter): Observable<ListaCorporativoEntity[]> {
      this.paginationConstants.pageSize = registros;
      let body = JSON.stringify(filter);
      return this.authHttp.postPaginated(this.listaCorporativoUrl + "/getListas", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
          .map((res) => this.extractRespuestaGenericaDataPaginated(res))
          .catch(this.authHttp.handleError);
  }

  getByPlanes(registros: number, filter: ListaCorporativoFilter): Observable<ListaPlanesCorporativoEntity[]> {
      this.paginationConstants.pageSize = registros;
      let body = JSON.stringify(filter);
      return this.authHttp.postPaginated(this.listaCorporativoUrl + "/getPlanes", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
          .map((res) => this.extractRespuestaGenericaDataPaginated(res))
          .catch(this.authHttp.handleError);
  }


  private extractData(res: Response) {
      let body = res.json();
      return body || {};
  }

}
