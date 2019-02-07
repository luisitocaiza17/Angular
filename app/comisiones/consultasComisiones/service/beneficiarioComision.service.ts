import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { Observable } from 'rxjs/Rx';
import { FiltroBeneficiarioComisionEntity, BeneficiarioComisionEntity } from '../model/consultasComisiones.model';
import { ComisionNovedadGenerico } from '../model/comisionNovedadGenerico';

@Injectable()
export class BeneficiarioComisionService extends PaginationService {

    private beneficiarioUrl = 'beneficiarioComision';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10);
        this.beneficiarioUrl = this.constantService.API_ENDPOINT + this.beneficiarioUrl;
    }

    GetBeneficiariosComisionByFiltersPaginated(pageSize: number, filter: FiltroBeneficiarioComisionEntity): Observable<BeneficiarioComisionEntity[]> {
        this.paginationConstants.pageSize = pageSize;
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.beneficiarioUrl + "/GetBeneficiariosComisionByFiltersPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    GetBeneficiarioNovedad(beneficiario: ComisionNovedadGenerico): Observable<ComisionNovedadGenerico> {
        let body = JSON.stringify(beneficiario);
        return this.authHttp.post(this.beneficiarioUrl + "/beneficiariosNovedades", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    CrearBeneficiarioComisionNovedad(comision: ComisionNovedadGenerico): Observable<boolean> {
        let body = JSON.stringify(comision);
        return this.authHttp.post(this.beneficiarioUrl, body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ActualizarBeneficiarioComisionNovedad(comision: ComisionNovedadGenerico): Observable<boolean> {
        let body = JSON.stringify(comision);
        return this.authHttp.post(this.beneficiarioUrl + "/actualizacion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

}
