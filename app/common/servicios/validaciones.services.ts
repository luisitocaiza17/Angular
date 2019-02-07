import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { ContratoKey } from '../model/contrato';

@Injectable()
export class ValidacionesService extends PaginationService {
	private validacionesUrl = 'validaciones';

	constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
		super(1, 5);
		this.validacionesUrl = constantService.API_ENDPOINT + this.validacionesUrl;
	}

	validarCedula(cedula: string): Observable<boolean>  {
		return this.authHttp.get(this.validacionesUrl + "/byCedula/" + cedula, null, "SI")
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