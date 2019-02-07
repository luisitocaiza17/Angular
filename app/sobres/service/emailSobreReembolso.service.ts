import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { EmailSobreFilter } from '../model/EmailSobreFilter';

@Injectable()
export class EmailSobreReembolsoService extends PaginationService {

    private emailSobreUrl = 'emailSobres';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.emailSobreUrl = constantService.API_ENDPOINT + this.emailSobreUrl;
    }

    enviarEmail(filter: EmailSobreFilter): any {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.emailSobreUrl + "/EnviarEmail", body, null, "SI")
            .map(this.extractRespGenerica)
            .catch(this.authHttp.handleError);
    }
}