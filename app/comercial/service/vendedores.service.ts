import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { VendedorFilter } from '../model/vendedorFilter';
import { DirectorVendedorEntity } from '../model/DirectorVendedorEntity';

@Injectable()
export class VendedoresService extends PaginationService {

    private vendedoresUrl = 'vendedores';


    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.vendedoresUrl = constantService.API_ENDPOINT + this.vendedoresUrl;
    }

    getByFiltersVendedoresPaginated(registros: number, filter: VendedorFilter): Observable<any> {
        this.paginationConstants.pageSize = registros;
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.vendedoresUrl + "/filterForVendedores", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getAllVendedores(): Observable<any> {
        return this.authHttp.get(this.vendedoresUrl+"/getVendedoresReasignacionCartera", null,"SI")
            .map((res)=>this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
    
    getAgenteContacto(agenteContacto:DirectorVendedorEntity): Observable<any> {
        let body = JSON.stringify(agenteContacto);
        return this.authHttp.post(this.vendedoresUrl+"/getAgenteContacto", body, null,"SI")
            .map((res)=>this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}