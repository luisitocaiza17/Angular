import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppAuthHttp } from "../../../../seguridad/appAuthHttp";
import { PaginationService } from "../../../../utils/pagination.service";
import { ConstantService } from "../../../../utils/constant.service";
import { BonoEntity } from "../../../model/bonos.model";

@Injectable()
export class BonosService extends PaginationService {
	private url = 'bonos';
	
	constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
		super(1,10);
        this.url = constantService.API_ENDPOINT + this.url;
	}
	
	GetBonosPaginated(filter: BonoEntity): Observable<BonoEntity[]> {
        let body = JSON.stringify(filter);
		return this.authHttp.postPaginated(this.url + "/GetBonosByFiltersPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
			.map((res) => this.extractRespuestaGenericaDataPaginated(res))
			.catch(this.authHttp.handleError);
	}

	InsertarBono(bonoNuevo: BonoEntity): Observable<string> {
        let body = JSON.stringify(bonoNuevo);
		return this.authHttp.post(this.url + "/insertarBono", body, null, "SI")
			.map((res) => this.extractRespGenerica(res))
			.catch(this.authHttp.handleError);
	}
	
	GetBonoCompletoById(idBono: number): Observable<BonoEntity> {
		return this.authHttp.get(this.url + "/GetBonoCompletoById/" + idBono, null, "SI")
			.map((res) => this.extractRespGenerica(res))
			.catch(this.authHttp.handleError);
	}

	Actualizar(bonoActualizar: BonoEntity): Observable<string> {
        let body = JSON.stringify(bonoActualizar);
		return this.authHttp.post(this.url + "/ActualizarBono", body, null, "SI")
			.map((res) => this.extractRespGenerica(res))
			.catch(this.authHttp.handleError);
	}
}