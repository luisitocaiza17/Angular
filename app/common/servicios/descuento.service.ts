import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { BeneficiarioList } from '../model/beneficiario';
import { ContratoKey } from '../model/contrato';
import { DatosContratoTransaccionBeneficiarioEntity } from '../model/transacciones';


@Injectable()
export class DescuentoService extends PaginationService {
    private descuentosUrl = 'descuentos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.descuentosUrl = constantService.API_ENDPOINT + this.descuentosUrl;
    }

    getDescuento(contratoKey: ContratoKey): Observable<number> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.descuentosUrl + "/getDescuento", body, null, "SI")
            .map((res) => this.extractResp(res))
            .catch(this.authHttp.handleError);
    }

    getDescuentoMaximoXBeneficiario(beneficiario: BeneficiarioList): Observable<number> {
        let body = JSON.stringify(beneficiario);
        return this.authHttp.post(this.descuentosUrl + "/getDesctMaxXBeneficiario", body, null, "SI")
            .map((res) => this.extractResp(res))
            .catch(this.authHttp.handleError);
    }

    getGastosAdministrativosBeneficiario(datoContrato: DatosContratoTransaccionBeneficiarioEntity): Observable<ContratoKey> {
        let body = JSON.stringify(datoContrato);
        return this.authHttp.post(this.descuentosUrl + "/getGastosAdministrativosBeneficiario", body, null, "SI")
            .map((res) => this.extractResp(res))
            .catch(this.authHttp.handleError);
    }

    sendNotificarTransaccionDescuento(datos: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(datos);
        return this.authHttp.post(this.descuentosUrl + "/notificarTransaccionDescuento", body, null, "SI")
            .map((res) => this.extractResp(res))
            .catch(this.authHttp.handleError);
    }

    private extractResp(res: any) {
        let body = res.json();
        if (body.Estado == "Error") {
            throw new Error(body.Mensajes[0]);
        }
        return body.Datos;
    }

}