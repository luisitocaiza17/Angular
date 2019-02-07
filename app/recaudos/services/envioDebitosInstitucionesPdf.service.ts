import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { RemesaEntity } from '../../common/model/remesa';
import { InputForEnvioDebitosInstituciones } from '../model/recaudo';
import { BancoEntity } from '../../common/model/genericos';
import { DetalleRemesa } from '../../common/model/detalleRemesa';


@Injectable()
export class EnvioDebitosInstitucionesPdfService extends PaginationService {

    private serviceUrl = 'EnvioDebitosInstitucionesPdf';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10); 
        this.serviceUrl = constantService.API_ENDPOINT + this.serviceUrl;        
    }

    descargarPdfSoporteBancoDeRemesa(Input: InputForEnvioDebitosInstituciones): Observable<any> {
        let body = JSON.stringify(Input);
        return this.authHttp.postGetFile(this.serviceUrl + "/descargarPdfSoporteBancoDeRemesa", body, null, "SI");
    }

    descargarPdfSoporteUsuarioDeRemesa(Input: InputForEnvioDebitosInstituciones): Observable<any> {
        let body = JSON.stringify(Input);
        return this.authHttp.postGetFile(this.serviceUrl + "/descargarPdfSoporteUsuarioDeRemesa", body, null, "SI");
    }

    descargarPdfSoporteBancoNacionalPorCuenta(Input: InputForEnvioDebitosInstituciones): Observable<any> {
        let body = JSON.stringify(Input);
        return this.authHttp.postGetFile(this.serviceUrl + "/DescargarPdfSoporteBancoNacionalPorCuenta", body, null, "SI");
    }

    descargarPdfSoporteUsuarioNacionalPorCuenta(Input: InputForEnvioDebitosInstituciones): Observable<any> {
        let body = JSON.stringify(Input);
        return this.authHttp.postGetFile(this.serviceUrl + "/DescargarPdfSoporteUsuarioNacionalPorCuenta", body, null, "SI");
    }

    descargarPdfSoporteBancoNacionalPorCuota(Input: InputForEnvioDebitosInstituciones): Observable<any> {
        let body = JSON.stringify(Input);
        return this.authHttp.postGetFile(this.serviceUrl + "/DescargarPdfSoporteBancoNacionalPorCuota", body, null, "SI");
    }

    descargarPdfSoporteUsuarioNacionalPorCuota(Input: InputForEnvioDebitosInstituciones): Observable<any> {
        let body = JSON.stringify(Input);
        return this.authHttp.postGetFile(this.serviceUrl + "/DescargarPdfSoporteUsuarioNacionalPorCuota", body, null, "SI");
    }

}