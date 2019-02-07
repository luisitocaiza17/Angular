import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ListaCorporativoEntity, ListaCorporativoFilter, InsertarPlanKey} from '../model/listaCorporativo';
import { ListaPlanesCorporativoEntity, UltimoPlanCorporativoFilter, ListaPlanesKey} from '../model/listaPlanesCorporativo';
import { PaginationService } from '../../utils/pagination.service';
import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class ListaCorporativoService extends PaginationService{

    private listaCorporativoUrl = 'ListaCorporativo';

    constructor(private authHttp: AppAuthHttp,private constantService: ConstantService){
        super(1, 10);        
        this.listaCorporativoUrl = constantService.API_ENDPOINT + this.listaCorporativoUrl;
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


    createPlan(planCorporativo: ListaPlanesCorporativoEntity): Observable<any> {
        let body = JSON.stringify(planCorporativo);
        return this.authHttp.post(this.listaCorporativoUrl + "/insertPlan", body,null,"SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getByUltimoPlan(filter: UltimoPlanCorporativoFilter): Observable<ListaPlanesCorporativoEntity> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.listaCorporativoUrl + "/obtenerUltimoPlan", body,  null, "SI")
            .map( (res) => this.extractRespGenerica(res) )
            .catch(this.authHttp.handleError);
    }

    updatePlan(planCorporativo: ListaPlanesKey): Observable<string> {
        let body = JSON.stringify(planCorporativo);
        return this.authHttp.post(this.listaCorporativoUrl + "/updatePlan", body,null,"SI")
            .map( (res) => this.extractRespuestaGenericaData(res))
            .catch(this.authHttp.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}