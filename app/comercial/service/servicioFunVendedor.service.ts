import { Injectable, Inject } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { FunFilter } from '../model/funFilter';
import { FunEntity } from '../model/funEntity';
import { SerieFunEntity } from '../model/serieFunEntity';
import { CreateFunKey } from '../model/createFunKey';
import { SerieFunFilter } from '../model/serieFunFilter';

@Injectable()
export class ServicioFunVendedorService extends PaginationService {

    private servicioFunVendedorUrl = 'ServicioFunVendedor';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 15);
        this.servicioFunVendedorUrl = constantService.API_ENDPOINT + this.servicioFunVendedorUrl;
    }

    Fun(funFilter: FunFilter): Observable<any> {
        let body = JSON.stringify(funFilter);
        return this.authHttp.postPaginated(this.servicioFunVendedorUrl + "/Fun", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    ActualizarFun(listaFunes: FunEntity[]): Observable<any> {
        let body = JSON.stringify(listaFunes);
        return this.authHttp.post(this.servicioFunVendedorUrl + "/ActualizarFun", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtieneNumeroFun(): Observable<any> {
        return this.authHttp.get(this.servicioFunVendedorUrl + "/ObtieneNumeroFun", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    procesoCrearFun(fun: CreateFunKey): Observable<any> {
        let body = JSON.stringify(fun);
        return this.authHttp.post(this.servicioFunVendedorUrl + "/ProcesoCrearFun", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerDisponibilidadFun(funDesde: number, funHasta: number): Observable<any> {
        return this.authHttp.getPaginated(this.servicioFunVendedorUrl + "/ObtenerDisponibilidadFun/" + funDesde + "/" + funHasta, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    crearSerieFun(serie: SerieFunEntity): Observable<any> {
        let body = JSON.stringify(serie);
        return this.authHttp.post(this.servicioFunVendedorUrl + "/CrearSerieFun", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerFunesCreadosEnProceso(serie: SerieFunFilter): Observable<any> {
        let body = JSON.stringify(serie);
        return this.authHttp.postPaginated(this.servicioFunVendedorUrl + "/ObtenerFunesCreadosEnProceso", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    obtenerFunSerie(numeroSerie: number): Observable<any> {
        return this.authHttp.getPaginated(this.servicioFunVendedorUrl + "/obtenerFunSerie/" + numeroSerie, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }


    actualizaSerieFun(serie: SerieFunEntity): Observable<any> {
        let body = JSON.stringify(serie);
        return this.authHttp.post(this.servicioFunVendedorUrl + "/ActualizaSerieFun", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    procesoAnularSerie(serie: SerieFunEntity): Observable<any> {
        let body = JSON.stringify(serie);
        return this.authHttp.post(this.servicioFunVendedorUrl + "/ProcesoAnularSerie", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }


}