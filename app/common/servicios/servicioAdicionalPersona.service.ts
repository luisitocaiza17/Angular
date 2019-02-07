import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ServicioAdicionalPersona, ServiciosContratoEntity, DatosServicioEntity, FilterSevicio, ServiciosEntity, PrecioServicioEntity } from '../model/servicioAdicionalPersona';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { ContratoKey } from '../model/contrato';

import { DatosModificaBeneficiarios,DatosCreaServicioBeneficiario,DatosMaternidad } from '../model/transacciones';


@Injectable()
export class ServicioAdicionalPersonaService extends PaginationService {

    private servicioAdicionalUrl = 'serviciosAdicionales';
    private transaccionUrl = 'transaccion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.servicioAdicionalUrl = constantService.API_ENDPOINT + this.servicioAdicionalUrl;
        this.transaccionUrl = constantService.API_ENDPOINT + this.transaccionUrl;
    }

    getServicios(): Observable<ServiciosEntity[]> {
        return this.authHttp.get(this.servicioAdicionalUrl + "/servicios", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getServicioAdicionalListByContratoKey(contratoKey): Observable<ServicioAdicionalPersona[]> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.postPaginated(this.servicioAdicionalUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getServiciosAdicionalesBeneficiario(contratoKey: ContratoKey): Observable<ServiciosContratoEntity[]> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.servicioAdicionalUrl + '/byBeneficiario', body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    anularServicioAdicionalBeneficiario(contratoKey: ContratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.postGetFile(this.servicioAdicionalUrl + '/exclusiones', body, null, "SI");
    }

    getDetalleServicio(codigoServicio: number, tipoProducto: string, edad: number): Observable<PrecioServicioEntity> {
        return this.authHttp.get(this.servicioAdicionalUrl + "/getDetalleServicio/" + codigoServicio + "/" + tipoProducto + "/" + edad, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    PrecioServicio(filter: FilterSevicio): Observable<DatosServicioEntity> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/getPrecioServicio2", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    reactivarServicioBeneficiario(contratoKey: ContratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.postGetFile(this.servicioAdicionalUrl + '/reactivaciones', body, null, "SI");
    }

    crearServicioAdicionalBeneficiario(datos: DatosCreaServicioBeneficiario): Observable<any> {
        let body = JSON.stringify(datos);
        return this.authHttp.postGetFile(this.servicioAdicionalUrl + "/crearServicioBeneficiario", body, null, "SI");
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}