import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ContratoKey } from '../model/contrato';

import { Plan, PlanFilter, PlanContrato, AprobacionPlanFilter, AprobacionPlanEntity, PlanCambioEntity } from '../model/plan';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { FilterEmisionTarjetas, DatosMaternidad } from '../model/transacciones';
import { BeneficiarioKey } from '../model/beneficiario';

@Injectable()
export class PlanService extends PaginationService {

    private planUrl = 'planes';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.planUrl = constantService.API_ENDPOINT + this.planUrl;
    }

    getByFiltersPaginated(filter: PlanFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.planUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getByFiltersForAutorizacion(codContrato: number, codProducto: string): Observable<Plan[]> {
        return this.authHttp.get(this.planUrl + "/getByFiltersForAutorizacion/" + codContrato + "/" + codProducto)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getActualByFiltersForAutorizacion(codContrato: number, codProducto: string, codPlan: string): Observable<Plan> {
        return this.authHttp.get(this.planUrl + "/getActualByFiltersForAutorizacion/" + codContrato + "/" + codProducto + "/" + codPlan)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getPlanAnteriorContrato(codContrato: number, codPlan: string): Observable<Plan> {
        return this.authHttp.get(this.planUrl + "/getPlanAnteriorContrato/" + codContrato + "/" + codPlan)
            .map((res) => res.json())
            .catch(this.authHttp.handleError);
    }

    validarNuevoPlan(planContrato: PlanContrato) {

        let body = JSON.stringify(planContrato);
        return this.authHttp.post(this.planUrl + "/validarNuevoPlan", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    verificarPermisoCambioPlan(filter: AprobacionPlanFilter): Observable<AprobacionPlanEntity> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.planUrl + "/verificarPermisoCambioPlan", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getListaPlanesCP(producto: string, contratoNumero: number, region: string, proceso: string): Observable<PlanCambioEntity[]> {
        return this.authHttp.get(this.planUrl + "/getListaPlanesCP/" + producto + "/" + contratoNumero + "/" + region + "/" + proceso, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getPrecioBasePlan(contratoKey: ContratoKey): Observable<number> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.planUrl + "/getPrecioBasePlan", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getDetalleMontoFactura(filter: FilterEmisionTarjetas) {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.planUrl + "/getPrecioTotalFactura", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getDetalleFacturaAnterior(contratoKey: BeneficiarioKey) {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.planUrl + "/getPrecioTotalFacturaAnterior", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getPrecioPlanONC(datosMaternidad: DatosMaternidad): Observable<number> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.post(this.planUrl + "/getPrecioPlanONC", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getPrecioPlanXPR(contrato: ContratoKey): Observable<number> {
        let body = JSON.stringify(contrato);
        return this.authHttp.post(this.planUrl + "/getPrecioPlanXPR", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private extractDataPageResult(res: Response) {
        let body = res.json();
        return body.data || {};
    }
}