import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class RelacionesService extends PaginationService {
	private relacionesUrl = 'relaciones';

	constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
		super(1, 5);
		this.relacionesUrl = constantService.API_ENDPOINT + this.relacionesUrl;
	}

	getRelaciones(): Observable<any[]>  {
		return this.authHttp.get(this.relacionesUrl, null, "SI")
			.map((res) => this.extractRespGenerica(res))
			.catch(this.authHttp.handleError);
	}
}