import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { Observable } from 'rxjs/Rx';
import { FiltroMovimientoComisionEntity, MovimientoComisionEntity, MovimientoYBeneficiarioComision } from '../model/consultasComisiones.model';

@Injectable()
export class MovimientoComisionService extends PaginationService {

    private serviceUrl = 'movimientoComision';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10);
        this.serviceUrl = this.constantService.API_ENDPOINT + this.serviceUrl;
    }

    GetMovimientosComisionByFiltersPaginated(filter: FiltroMovimientoComisionEntity): Observable<MovimientoComisionEntity[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.serviceUrl + "/GetMovimientosComisionByFiltersPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    crearMovimientoComisionManual(movimientoYBeneficiario: MovimientoYBeneficiarioComision): Observable<boolean> {
        let body = JSON.stringify(movimientoYBeneficiario);
        return this.authHttp.post(this.serviceUrl + "/crearMovimientoComisionManual", body, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }

    eliminarMovimientoComisionManual(movimiento: MovimientoComisionEntity): Observable<boolean> {
        let body = JSON.stringify(movimiento);
        return this.authHttp.post(this.serviceUrl + "/eliminarMovimientoComisionManual", body, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }

}
