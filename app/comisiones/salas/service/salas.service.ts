import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { Salas } from '../model/salas';
import { Observable } from 'rxjs/Rx';
import { PaginationService } from '../../../utils/pagination.service';
import { SalasFilter } from '../model/salasFilter';
import { CatalogoEstados } from '../../../common/model/catalogoEstados';
import { ObservacionSalas } from '../model/ObservacionSalas';
import { HistorialSala } from '../model/HistorialSala';
import { ResumenSalasFilter } from '../model/resumenSalasFilter';
import { ResumenSalas } from '../model/resumenSalas';
@Injectable()
export class SalasService extends PaginationService {

    private salasUrl = 'salas';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.salasUrl = constantService.API_ENDPOINT + this.salasUrl;
    }

    insertarSala(salas: Salas): Observable<any> {
        let body = JSON.stringify(salas);
        return this.authHttp.post(this.salasUrl + "/insertSalas", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    agregarObservacion(observacion: ObservacionSalas): Observable<any> {
        let body = JSON.stringify(observacion);
        return this.authHttp.post(this.salasUrl + "/insertObservacion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
    
    consultarSalas(filter: SalasFilter): Observable<Salas[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.salasUrl + "/consultarSalas", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    consultarResumenSalas(filter: ResumenSalasFilter): Observable<ResumenSalas[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.salasUrl + "/resumenSalas", body,  this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }
    
    consultarUltimaObservacion(idSala: number): Observable<ObservacionSalas> {
        return this.authHttp.get(this.salasUrl + "/consultarUltimaObservacion/" + idSala, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    consultarHistorial(idSala: number): Observable<HistorialSala> {
        return this.authHttp.get(this.salasUrl + "/historialSala/" + idSala, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getSalas(idSucursal): Observable<Salas[]> {
        return this.authHttp.get(this.salasUrl + "/getSala/"+idSucursal, null, "SI")
          .map((res) => this.extractRespGenerica(res))
          .catch(this.authHttp.handleError);
    }

    consultarSalaPorId(idSala: number): Observable<Salas> {
    return this.authHttp.get(this.salasUrl + "/"+idSala, null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
    }      

    consultarAllSalas(): Observable<Salas[]>{
        return this.authHttp.get(this.salasUrl + "/getAllSalas", null, "SI")
        .map((res) => this.extractRespGenerica(res))
        .catch(this.authHttp.handleError);
   }

}
