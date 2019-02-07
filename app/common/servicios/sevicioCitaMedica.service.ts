import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';
import { PaginationService } from '../../utils/pagination.service';

import { CitaMedicaEntity, CitaMedicaFilter, SolicitarCitaDestacadoKey, SolicitudDestacadoFilter, ValidarPacienteKey, RegistarPacienteKey, AgendarCitaKey, ConsultarCitaFilter } from '../model/cita';
import { PrestadorFilter, MedicosFilter, } from '../model/prestador';


@Injectable()
export class ServicioCitaMedicaService extends PaginationService {

    private citaMedicaUrl = '/citaMedica';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.citaMedicaUrl = constantService.API_ENDPOINT + this.citaMedicaUrl;
    }

    obtenerCiudades(): Observable<any> {
        return this.authHttp.get(this.citaMedicaUrl + "/ObtenerCiudades", null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    consultarMedicosPorEspecialidadFecha(filter: CitaMedicaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.citaMedicaUrl + "/ConsultarMedicosPorEspecialidadFecha", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    consultarCitasDisponiblesPorMedicoFecha(filter: CitaMedicaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.citaMedicaUrl + "/ConsultarCitasDisponiblesPorMedicoFecha", body, null, "SI")
            .map((res) => this.extractRespuestaGenericaData(res))
            .catch(this.authHttp.handleError);
    }

    solicitarCitaMedicoDestacado(key: SolicitarCitaDestacadoKey): Observable<any> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.citaMedicaUrl + "/SolicitarCitaMedicoDestacado", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerSolicitudesCitaMedicoDestacado(filter: SolicitudDestacadoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.citaMedicaUrl + "/ObtenerSolicitudesCitaMedicoDestacado", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    actualizarEstadoSolicitudCitaMedicoDestacado(filter: SolicitudDestacadoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.citaMedicaUrl + "/ActualizarEstadoSolicitudCitaMedicoDestacado", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    agendarCitaMedica(agendarKey: AgendarCitaKey): Observable<any> {
        let body = JSON.stringify(agendarKey);
        return this.authHttp.post(this.citaMedicaUrl + "/AgendarCitaMedica", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerCitaMedicas(filter: ConsultarCitaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.citaMedicaUrl + "/ObtenerCitaMedicas", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    cancelarCitaMedica(filter: CitaMedicaEntity): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.citaMedicaUrl + "/CancelarCitaMedica", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    //PACIENTE

    validarPaciente(key: ValidarPacienteKey): Observable<any> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.citaMedicaUrl + "/ValidarPaciente", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    registrarPaciente(key: RegistarPacienteKey): Observable<any> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.citaMedicaUrl + "/RegistrarPaciente", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    actualizarPaciente(key: RegistarPacienteKey): Observable<any> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.citaMedicaUrl + "/ActualizarPaciente", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    //PRESTADORES
    medicos(filter: MedicosFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.citaMedicaUrl + "/Medicos", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    //CENTROS MEDICOS
    centroMedico(): Observable<any> {
        return this.authHttp.get(this.citaMedicaUrl + "/CentroMedico", null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    //ESPECIALIDADES
    obtenerEspecialidades(): Observable<any> {
        return this.authHttp.get(this.citaMedicaUrl + "/ObtenerEspecialidades", null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

}
