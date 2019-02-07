import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { EmailSobreFilter } from '../model/EmailSobreFilter';

@Injectable()
export class PdfSobreReembolsoService extends PaginationService {

    private pdfSobreUrl = 'pdfSobres';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.pdfSobreUrl = constantService.API_ENDPOINT + this.pdfSobreUrl;
    }

    generarCartaDevolcionPdf(filter: EmailSobreFilter): any {
        var body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.pdfSobreUrl + "/GenerarCartaDevolucion/", body, null, "SI");
    }
}