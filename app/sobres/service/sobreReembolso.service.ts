import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { SobreEntity } from '../model/SobreEntity';
import { SobreFilter } from '../model/SobreFilter';


@Injectable()
export class SobreReembolsoService extends PaginationService {

    private sobreUrl = 'sobres';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.sobreUrl = constantService.API_ENDPOINT + this.sobreUrl;
    }

    actualizarSobre(sobreEntity: SobreEntity[]): Observable<any> {
        let body = JSON.stringify(sobreEntity);
        return this.authHttp.post(this.sobreUrl + "/ActualizarSobre", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ingresarSobre(sobreEntity: SobreEntity): Observable<any> {
        let body = JSON.stringify(sobreEntity);
        return this.authHttp.post(this.sobreUrl + "/IngresarSobre", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }


    getSobresByFiltersPaginated(filter: SobreFilter, registros: number): Observable<SobreEntity[]> {
        this.paginationConstants.pageSize = registros;
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.sobreUrl + "/BuscarSobre", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }


    asignarSobre(sobreEntity: SobreEntity[]): Observable<any> {
        let body = JSON.stringify(sobreEntity);
        return this.authHttp.post(this.sobreUrl + "/AsignarSobre", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    anularSobre(sobreEntity: SobreEntity[]): Observable<any> {
        let body = JSON.stringify(sobreEntity);
        return this.authHttp.post(this.sobreUrl + "/AnularSobre", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    guardarGestion(sobre: SobreEntity): Observable<any> {
        let body = JSON.stringify(sobre);
        return this.authHttp.post(this.sobreUrl + "/GuardarGestion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getSeguimientosSobresByNumeroSobrePaginated(numeroSobre: string): Observable<any>{ 
       
        return this.authHttp.getPaginated(this.sobreUrl + "/SeguimientosSobreByNumeroSobre/"+numeroSobre, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

}