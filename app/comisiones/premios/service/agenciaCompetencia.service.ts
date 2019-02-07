import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { PaginationService } from '../../../utils/pagination.service';
import { ConstantService } from '../../../utils/constant.service';
import { Premio } from '../model/premio';
import { PaginationConstants } from '../../../utils/pagination';

@Injectable()
export class AgenciaCompetenciaService extends PaginationService {

    private agenciaCompetenciaUrl = 'agenciaCompetencia';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.agenciaCompetenciaUrl = constantService.API_ENDPOINT + this.agenciaCompetenciaUrl;
    }

    getAgenciasCompetencia(idpremio:number): Observable<any> {
        return this.authHttp.get(this.agenciaCompetenciaUrl+"/getAgenciasCompetencia/"+idpremio, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}
