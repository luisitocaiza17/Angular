import { Injectable, Inject } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { ComercialMotivosFilter } from '../model/comercialMotivosFilter';

@Injectable()
export class CatalogoComercialService extends PaginationService {

    private catalogoComecialUrl = 'catalogoComercial';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.catalogoComecialUrl = constantService.API_ENDPOINT + this.catalogoComecialUrl;
    }

    
    obtenerDirectores(): Observable<any[]> {
        return this.authHttp.get(this.catalogoComecialUrl + "/ObtenerDirectores", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    MotivoEstadoFun(filter: ComercialMotivosFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.catalogoComecialUrl + "/MotivoEstadoFun", body, 1, 1000, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    VendedorSucursal(numeroPagina: number, registroPagina: number): Observable<any> {
        this.paginationConstants.pageNumber = numeroPagina;
        this.paginationConstants.pageSize = registroPagina;
        return this.authHttp.getPaginated(this.catalogoComecialUrl + "/VendedorSucursal", this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    } 
}