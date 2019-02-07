import { Injectable } from "@angular/core";
import { AppAuthHttp } from "../../../seguridad/appAuthHttp";
import { ConstantService } from "../../../utils/constant.service";
import { Observable } from "rxjs";
import { PaginationService } from "../../../utils/pagination.service";
import { IndicadoresVendedor } from "../model/indicadoresVendedor";

@Injectable()
export class IndicadoresService extends PaginationService {
	private indicadoresUrl = 'indicadoresVendedor';
	
	constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
		super(1,10);
    this.indicadoresUrl = constantService.API_ENDPOINT + this.indicadoresUrl;
	}
	
	GetIndicadoresVendedor(codigoAgente: number, anio: number, mes: number): Observable<IndicadoresVendedor> {
		return this.authHttp.get(this.indicadoresUrl + "/getIndicadoresVendedor/" + codigoAgente + "/" + anio + "/" + mes, null, "SI")
			.map((res) => this.extractRespGenerica(res))
			.catch(this.authHttp.handleError);
	}
	
}