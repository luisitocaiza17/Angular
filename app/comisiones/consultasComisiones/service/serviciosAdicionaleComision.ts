import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { PaginationService } from '../../../utils/pagination.service';
import { ServicioAdicionalComisionEntity } from '../model/consultasComisiones.model';
import { Observable } from 'rxjs';
import { ComisionNovedadGenerico } from '../model/comisionNovedadGenerico';

@Injectable()
export class ServicioAdicionalComisionService extends PaginationService {

	private serviceUrl = 'servicioAdicionalComision';

	constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
		super(1,10);
		this.serviceUrl = this.constantService.API_ENDPOINT + this.serviceUrl;
	}

	GetServiciosAdicionalesByFilterspaginated(pageSize: number, servicioAdicional: ServicioAdicionalComisionEntity): Observable<ServicioAdicionalComisionEntity[]> {
		this.paginationConstants.pageSize = pageSize;
		let body = JSON.stringify(servicioAdicional);
		return this.authHttp.postPaginated(this.serviceUrl + "/GetServiciosAdicionalesByFilterspaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
			.map((res) => this.extractRespuestaGenericaDataPaginated(res))
			.catch(this.authHttp.handleError);
	}

	GetServicioAdicionalNovedad(servicioAdicional: ComisionNovedadGenerico): Observable<ComisionNovedadGenerico> {
        let body = JSON.stringify(servicioAdicional);
        return this.authHttp.post(this.serviceUrl + "/serviciosAdicionalesNovedades", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
	}
	
	CrearServicioAdicionalComisionNovedad(comision: ComisionNovedadGenerico): Observable<boolean> {
        let body = JSON.stringify(comision);
        return this.authHttp.post(this.serviceUrl, body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
	}
	
	ActualizarServicioAdicionalComisionNovedad(comision: ComisionNovedadGenerico): Observable<boolean> {
        let body = JSON.stringify(comision);
        return this.authHttp.post(this.serviceUrl + "/actualizacion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}