import { Injectable } from "@angular/core";
import { AppAuthHttp } from "../../seguridad/appAuthHttp";
import { ConstantService } from "../../utils/constant.service";
import { Observable } from "rxjs";
import { PaginationService } from "../../utils/pagination.service";

@Injectable()
export class ContratoPCAService extends PaginationService {
	private contratoPCAUrl = 'tareasProgramadasPCA';
	
	constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
		super(1, 5);
		this.contratoPCAUrl = this.constantService.API_ENDPOINT + this.contratoPCAUrl;
	}

	cargarArchivo(fileUpload: File): Observable<any> {
		return this.authHttp.sendFile(this.contratoPCAUrl + "/uploads", fileUpload)
			.map((res) => this.extractRespGenerica(res))
			.catch(this.authHttp.handleError);
	}
}