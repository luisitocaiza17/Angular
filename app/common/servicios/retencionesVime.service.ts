import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { RetencionKey, RespuestaParametroRetencion, DescuentosPendiente, GestionRetencionCliente } from '../model/retencion';

@Injectable()
export class RetencionesVime extends PaginationService {

    private urlRetenciones = 'retencionClientes';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.urlRetenciones = constantService.API_ENDPOINT + this.urlRetenciones;
    }

    tieneDescuento(retencionKey: RetencionKey): Observable<any> {
        let body = JSON.stringify(retencionKey);
        return this.authHttp.post(this.urlRetenciones + "/tieneDescuentoDisponible", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }


    getDescuentosPerdientesAprobacionTotal(usuario: string): Observable<number> {
        return this.authHttp.get(this.urlRetenciones + "/getDescuentosPerdientesAprobacionTotal/" + usuario)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    cancelarAprobacion(descuentoCliente: DescuentosPendiente): Observable<RespuestaParametroRetencion> {
        let body = JSON.stringify(descuentoCliente);
        return this.authHttp.post(this.urlRetenciones + "/descuento/cancelarDescuento", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    tieneDescuentoPendienteAprobacion(contrato: number, region: string, producto: string): Observable<number> {
        return this.authHttp.get(this.urlRetenciones + "/descuento/tieneDescuentoPendienteAprobacion/" + contrato + "/" + region + "/" + producto, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }


    AplicaAprobacion(gestion: GestionRetencionCliente): Observable<RespuestaParametroRetencion> {
        let body = JSON.stringify(gestion);
        return this.authHttp.post(this.urlRetenciones + "/aprobacion/crearAprobacion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getAprobacion(id: number): Observable<GestionRetencionCliente> {
        return this.authHttp.get(this.urlRetenciones + "/aprobacion/getAprobacion/" + id, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
}