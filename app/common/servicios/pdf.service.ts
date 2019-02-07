import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ReciboCobranzaPdfIndividual } from '../model/cobranza';
import { ConstantService } from '../../utils/constant.service';
import { ContratoKey } from '../model/contrato';


@Injectable()
export class PdfService {

    private pdfUrl = 'pdf';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.pdfUrl = constantService.API_ENDPOINT + this.pdfUrl;
    }

    GenerarPdfReciboCobranzaIndividual(recibo: ReciboCobranzaPdfIndividual): any {
        var body = JSON.stringify(recibo);
        return this.authHttp.postGetFile(this.pdfUrl + "/pdfReciboCobranzaIndividual", body, null, "SI");
    }

    GenerarPdfCartaAnulacion(_contratoKey: ContratoKey): any {
        var body = JSON.stringify(_contratoKey);
        return this.authHttp.postGetFile(this.pdfUrl + "/pdfCrearCartaAnulacion", body, null, "SI");
    }

}