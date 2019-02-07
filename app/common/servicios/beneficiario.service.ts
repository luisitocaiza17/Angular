import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { BeneficiarioKey, CambioTitularFilter, BeneficiarioList, BeneficiarioPrecios } from '../model/beneficiario';
import { ResumenBeneficiario } from '../model/beneficiario';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { DatosMaternidad } from '../model/transacciones';
import { OdaResumen } from '../model/reclamo';
import { ContratoKey } from '../model/contrato';
import { PersonaEntity } from '../model/persona';


@Injectable()
export class BeneficiarioService extends PaginationService {

    private beneficiarioUrl = 'beneficiarios';

    public beneficiarios = new BehaviorSubject<BeneficiarioList[]>([]);
    currentBeneficiarios = this.beneficiarios.asObservable();

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.beneficiarioUrl = constantService.API_ENDPOINT + this.beneficiarioUrl;
    }

    getBeneficiarioListByContrato(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.postPaginated(this.beneficiarioUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private extractObjectData(res: Response) {
        let body = res.json();
        return body;
    }

    getOneBeneficiarioByKey(beneficiarioKey: BeneficiarioKey) {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getOneByKey", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getResumenBeneficiario(beneficiarioKey: BeneficiarioKey): Observable<ResumenBeneficiario> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getResumen", body)
            .map(this.extractObjectData)
            .catch(this.authHttp.handleError);
    }

    getValorOdas(beneficiarioKey: BeneficiarioKey): Observable<OdaResumen> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getValorOdas", body)
            .map(this.extractObjectData)
            .catch(this.authHttp.handleError);
    }

    getBeneficiarioAutorizacion(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getBeneficiarioAutorizacion", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getBeneficiarioOda(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getBeneficiarioOda", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getBeneficiarios(beneficiarioKey): Observable<any[]> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getBeneficiarios", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getBeneficiariosForPrecios(beneficiarioKey): Observable<any[]> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getBeneficiariosForPrecios", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    cambiarBeneficiarioTitular(cambioTitularFilter: CambioTitularFilter): Observable<any> {
        let body = JSON.stringify(cambioTitularFilter);
        return this.authHttp.post(this.beneficiarioUrl + "/cambiarBeneficiarioTitular", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getListaReingresoBeneficiario(beneficiarioList: BeneficiarioList): Observable<any> {
        let body = JSON.stringify(beneficiarioList);
        return this.authHttp.post(this.beneficiarioUrl + "/getListaReingreso", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getUltimoReingresoBeneficiario(beneficiarioList: BeneficiarioList): Observable<any> {
        let body = JSON.stringify(beneficiarioList);
        return this.authHttp.post(this.beneficiarioUrl + "/getUltimoReingreso", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    actualizaPrecioAnteriorNuevo(beneficiarioPrecios: BeneficiarioPrecios): Observable<any> {
        let body = JSON.stringify(beneficiarioPrecios);
        return this.authHttp.post(this.beneficiarioUrl + "/actualizaPrecioAnteriorNuevo", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getBeneficiariosMaternidad(beneficiarioKey: BeneficiarioKey): Observable<any[]> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.beneficiarioUrl + "/getBeneficiariosMaternidad", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    create(datosMaternidad: DatosMaternidad): Observable<any> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.postGetFile(this.beneficiarioUrl, body, null, "SI").catch(this.authHttp.handleError);;
    }

    excluir(datosMaternidad: DatosMaternidad): Observable<any> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.postGetFile(this.beneficiarioUrl + "/exclusiones", body, null, "SI");
    }

    reactivar(datosMaternidad: DatosMaternidad): Observable<any> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.postGetFile(this.beneficiarioUrl + "/reactivaciones", body, null, "SI");
    }

    setBeneficiarios(beneficiarios: BeneficiarioList[]) {
        this.beneficiarios.next(beneficiarios);
    }

    excluirBeneficiarioTitular(datosMaternidad: DatosMaternidad[]): Observable<any> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.postGetFile(this.beneficiarioUrl + "/exclusionTitular", body, null, "SI");
    }

    excluirBeneficiarioTitularSinBeneficios(datosMaternidad: DatosMaternidad): Observable<any> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.postGetFile(this.beneficiarioUrl + "/exclusionTitularSinBeneficios", body, null, "SI");
    }

    actualizarRelacionBeneficiario(datosMaternidad: DatosMaternidad): Observable<any> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.postGetFile(this.beneficiarioUrl + "/actualizaRelacionBeneficiario", body, null, "SI");
    }

    getBeneficiarioSinBeneficios(beneficiario: BeneficiarioList): Observable<boolean> {
        let body = JSON.stringify(beneficiario);
        return this.authHttp.post(this.beneficiarioUrl + "/getBeneficiarioSinBeneficios", body, null, "SI")
            .map((res) => this.extractResp(res))
            .catch(this.authHttp.handleError);
    }

    reactivarTitularSinBeneficios(datosMaternidad: DatosMaternidad): Observable<any> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.postGetFile(this.beneficiarioUrl + "/reactivaTitularSinBeneficio", body, null, "SI");
    }

    actualizarBeneficiario(datosMaternidad: DatosMaternidad[]): Observable<boolean> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.post(this.beneficiarioUrl + "/actualizaBeneficiarios", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getBeneficiario(beneficiario: BeneficiarioList): Observable<any> {
        let body = JSON.stringify(beneficiario);
        return this.authHttp.post(this.beneficiarioUrl + "/getBeneficiario", body, null, "SI")
            .map((res) => this.extractResp(res))
            .catch(this.authHttp.handleError);
    }

    getDatosBeneficiarioTitular(contratokey: ContratoKey): Observable<PersonaEntity> {
        let body = JSON.stringify(contratokey);
        return this.authHttp.post(this.beneficiarioUrl + "/datosBeneficiarioTitular", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
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