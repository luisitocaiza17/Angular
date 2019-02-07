import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { PlanFilter, Plan } from '../model/plan';
import { CoberturaPlan } from '../model/coberturaPlan';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from "../../utils/pagination.service";
import { Beneficio } from '../../listaCorporativo/model/Beneficio';

@Injectable()
export class CoberturaPlanService extends PaginationService {

    private coberturaPlanUrl = 'coberturaPlan';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.coberturaPlanUrl = constantService.API_ENDPOINT + this.coberturaPlanUrl;
    }

    getCoberturasByPlanFilter(filter: PlanFilter): Observable<CoberturaPlan[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.coberturaPlanUrl + "/getByPlanFilter", body)
            .map((res) => this.extractDataPageResult(res))
            .catch(this.authHttp.handleError);
    }

    getCoberturasByPlanPersonaFilter(filter: PlanFilter): Observable<CoberturaPlan[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.coberturaPlanUrl + "/getByPlanPersonaFilter", body)
            .map((res) => this.extractDataPageResult(res))
            .catch(this.authHttp.handleError);
    }
    //Coberturas
    //Lista de Coberturas
    getCoberturasPlan(codigoProducto: string, codigoPlan: string, versionPlan: number): Observable<CoberturaPlan[]> {
        
        return this.authHttp.get(this.coberturaPlanUrl + "/getPlanCobertura/" + codigoProducto + "/" + codigoPlan + "/" + versionPlan, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
            
            
    }

    getCatalogoCobertura(nombreCatalogo: string): Observable<CoberturaPlan[]> {
        return this.authHttp.get(this.coberturaPlanUrl + "/getListaCobertura/" + nombreCatalogo, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    insertarCobertura(cobertura: CoberturaPlan): Observable<any> {
        let body = JSON.stringify(cobertura);
        return this.authHttp.post(this.coberturaPlanUrl + "/insertarCobertura", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    actualizarCobertura(cobertura: CoberturaPlan): Observable<any> {
        let body = JSON.stringify(cobertura);
        return this.authHttp.post(this.coberturaPlanUrl + "/actualizarCobertura", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getListaPlanesCor(cobertura: CoberturaPlan): Observable<Plan[]> {
        let body = JSON.stringify(cobertura);
        return this.authHttp.post(this.coberturaPlanUrl + "/listaPlanesCor", body, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }
    getListaBeneficios(cobertura: CoberturaPlan): Observable<Plan[]> {
        let body = JSON.stringify(cobertura);
        return this.authHttp.post(this.coberturaPlanUrl + "/listaBeneficios", body, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }

    getBeneficios(cobertura: CoberturaPlan, registros: number): Observable<Beneficio[]> {
        this.paginationConstants.pageSize = registros;
        let body = JSON.stringify(cobertura);
        return this.authHttp.postPaginated(this.coberturaPlanUrl + "/Beneficios", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    private extractDataPageResult(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private extractData(res: Response) {     
        let body = res.json();
        return body.Datos || [];
    }

}