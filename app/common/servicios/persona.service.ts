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
import { FilterPersona, PersonaEntity } from '../model/persona';


@Injectable()
export class PersonaService extends PaginationService {

    private personaUrl = 'persona';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.personaUrl = constantService.API_ENDPOINT + this.personaUrl;

    }


    buscarPersona(filterPersona: FilterPersona): Observable<any> {
        let body = JSON.stringify(filterPersona);
        return this.authHttp.post(this.personaUrl + "/buscarPersona", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    registarPersona(persona: PersonaEntity): Observable<any> {

        let body = JSON.stringify(persona);
        return this.authHttp.post(this.personaUrl + "/insertarPersona", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);

    }

    actualizaPersona(persona: PersonaEntity): Observable<any> {

        let body = JSON.stringify(persona);
        return this.authHttp.post(this.personaUrl + "/actualizarPersona", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);

    }



    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }


}