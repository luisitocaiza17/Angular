import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Prestador, PrestadorFilter } from '../model/prestador';
import { Agenda, AgendaFilter } from '../model/agenda';
import { EspecialidadVeris, EspecialidadVerisFilter } from '../model/especialidadVeris';
import { Cita, CitaFilter } from '../model/cita';
import { UsuarioVeris, UsuarioVerisFilter } from '../model/usuarioVeris';
import { PacienteVeris, PacienteVerisFilter } from '../model/pacienteVeris';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';


@Injectable()
export class PrestadorService extends PaginationService {

    private prestadorUrl = 'prestador';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.prestadorUrl = constantService.API_ENDPOINT + this.prestadorUrl;

    }

    getByFilters(filter: PrestadorFilter): Observable<Prestador[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/getByFilter", body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getAgenda(filter: AgendaFilter): Observable<Agenda[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/getAgenda", body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getEspecialidad(filter: EspecialidadVerisFilter): Observable<EspecialidadVeris> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/getEspecialidad", body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    setCita(filter: CitaFilter): Observable<Cita> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/setCita", body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getUsuario(filter: UsuarioVerisFilter): Observable<UsuarioVeris> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/getUsuario", body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    setPaciente(filter: PacienteVerisFilter): Observable<PacienteVeris> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/setPaciente", body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    prestador(codigoPrestador: string): Observable<any> {
        return this.authHttp.get(this.prestadorUrl + "/Prestadores/" + codigoPrestador, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    getPrestadorCiRuc(codigoPrestador: string): Observable<any> {
        return this.authHttp.get(this.prestadorUrl + "/buscaPrestadorCiRuc/" + codigoPrestador, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
    

}