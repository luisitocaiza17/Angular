
import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { ParametroDescuento, RespuestaParametroDescuento } from '../common/model/parametroDescuento';
import { Response } from '@angular/http';

@Injectable()
export class ParametroDescuentoService {
    api: String
    private parametroDescuentoUrl = 'parametroDescuento';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {

        this.parametroDescuentoUrl = constantService.API_ENDPOINT + this.parametroDescuentoUrl;
    }

    obtenerParametros(): Observable<any[]> {
        return this.authHttp.get(this.parametroDescuentoUrl + "/ObtenerParametroDescuento", null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    crearParametro(parametro: ParametroDescuento): Observable<RespuestaParametroDescuento> {
        let body = JSON.stringify(parametro);
        return this.authHttp.post(this.parametroDescuentoUrl + "/CrearParametroDescuento", body, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    deleteParametro(parametro: ParametroDescuento): Observable<RespuestaParametroDescuento> {
        let body = JSON.stringify(parametro);
        return this.authHttp.post(this.parametroDescuentoUrl + "/EliminarParametroDescuento", body, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    cargarArchivo(fileToUpload: File): Observable<any> {
        return this.authHttp.sendFile(this.parametroDescuentoUrl + "/CargaContratoDescuento/", fileToUpload)
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractRespuestaGenerica(res: Response) {
        let body = res.json();
        return body.Datos || {};
    }
}
