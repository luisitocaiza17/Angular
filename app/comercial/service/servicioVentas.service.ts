import { Injectable, Inject } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { DirectorVendedorFilter } from '../model/directorVendedorFilter';
import { DirectorVendedorEntity, InputCambioDirectores } from '../model/DirectorVendedorEntity';
import { FiltroAgenteVenta } from '../../comisiones/model/agenteVenta.model';


@Injectable()
export class ServicioVentasService extends PaginationService {

    private servicioVentasUrl = 'ServicioVentas';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.servicioVentasUrl = constantService.API_ENDPOINT + this.servicioVentasUrl;
    }

    Directores(filter: DirectorVendedorFilter, registroPagina): Observable<any> {
        this.paginationConstants.pageSize = registroPagina;
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.servicioVentasUrl + "/Directores", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    Vendedores(filter: DirectorVendedorFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.servicioVentasUrl + "/Vendedores", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    GruposVendedores(numeroPagina: number, registroPagina: number): Observable<any> {
        this.paginationConstants.pageNumber = numeroPagina;
        this.paginationConstants.pageSize = registroPagina;
        return this.authHttp.getPaginated(this.servicioVentasUrl + "/GruposVendedores", this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    TipoVendedor(numeroPagina: number, registroPagina: number): Observable<any> {
        this.paginationConstants.pageNumber = numeroPagina;
        this.paginationConstants.pageSize = registroPagina;
        return this.authHttp.getPaginated(this.servicioVentasUrl + "/TipoVendedor", this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    ActualizaVendedor(vendedor: DirectorVendedorEntity): Observable<Boolean> {
        let body = JSON.stringify(vendedor);
        return this.authHttp.post(this.servicioVentasUrl + "/ActualizaAgenteVendedor", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    CreaVendedor(vendedor: DirectorVendedorEntity): Observable<any> {
        let body = JSON.stringify(vendedor);
        return this.authHttp.post(this.servicioVentasUrl + "/CrearAgenteDirector", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GetAgentesVentaByFiltersPaginated(filter: FiltroAgenteVenta, pageSize): Observable<any> {
        this.paginationConstants.pageSize = pageSize;
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.servicioVentasUrl + "/GetAgentesVentaByFiltersPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    CrearAgenteVenta(agenteVenta: DirectorVendedorEntity): Observable<any> {
        let body = JSON.stringify(agenteVenta);
        return this.authHttp.post(this.servicioVentasUrl + "/CrearAgenteVenta", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ReingresarAgenteVenta(agenteVenta: DirectorVendedorEntity): Observable<boolean> {
        let body = JSON.stringify(agenteVenta);
        return this.authHttp.post(this.servicioVentasUrl + "/ReingresarAgenteVenta", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    verificarSiSalaTieneDirector(codigoSala: number, codigoDelDirector: number = 0): Observable<DirectorVendedorEntity> {
        return this.authHttp.get(this.servicioVentasUrl + "/VerificarSiSalaTieneDirector/"+ codigoSala + "/" + codigoDelDirector,  null, "SI")
          .map((res) => this.extractRespGenerica(res))
          .catch(this.authHttp.handleError);
      }

    ReasignarAgenteVenta(directorVendedor:DirectorVendedorEntity): Observable<boolean> {
        let body = JSON.stringify(directorVendedor);
        return this.authHttp.post(this.servicioVentasUrl + "/reingresarDirector", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    CrearNuevoDirectorEnSalaConDirectorAsignado(directores: InputCambioDirectores ): Observable<string> {
        let body = JSON.stringify(directores);
        return this.authHttp.post(this.servicioVentasUrl + "/CrearNuevoDirectorEnSalaConDirectorAsignado", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ReingresarDirectorSiSalaEstaOcupada(directores: InputCambioDirectores ): Observable<string> {
        let body = JSON.stringify(directores);
        return this.authHttp.post(this.servicioVentasUrl + "/ReingresarDirectorSiSalaEstaOcupada", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    directorExistenteEnSalaConDirectorAsignado(directores: InputCambioDirectores ): Observable<string> {
        let body = JSON.stringify(directores);
        return this.authHttp.post(this.servicioVentasUrl + "/DirectorExistenteEnSalaConDirectorAsignado", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

}