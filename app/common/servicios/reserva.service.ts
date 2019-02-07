import { ConstantService } from '../../utils/constant.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaginationService } from '../../utils/pagination.service';
import { ReservaFilter, PorcentajesEntity } from '../model/reserva';
import { CronTabEntity } from '../../facturacion/model/cronTabEntity';

@Injectable()
export class ReservasService extends PaginationService {
	private reservasUrl = 'reservas';

	constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
		super(1, 5);
		this.reservasUrl = constantService.API_ENDPOINT + this.reservasUrl;
    }
    generarProcesoManual
    GenerarManual(filter: ReservaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reservasUrl + "/generarProcesoManual", body,null,"SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GenerarIndividual(filter: ReservaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reservasUrl + "/generarIndividuales", body,null,"SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    UpdatePorcentajes(porcentajeReservas: PorcentajesEntity[]): Observable<any> {
        let body = JSON.stringify(porcentajeReservas);
        return this.authHttp.post(this.reservasUrl + "/UpdatePorsentajesReservas", body,null,"SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
    
    
    GenerarSimulacion(filter: ReservaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reservasUrl + "/generarSimulacion", body,null,"SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GetReservas(): Observable<any> {
        return this.authHttp.get(this.reservasUrl + "/ObtenerReservas", null,"SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GetPorcentajesReservas(): Observable<any> {
        return this.authHttp.get(this.reservasUrl + "/ObtenerPorcentajesReservas", null,"SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
    



}