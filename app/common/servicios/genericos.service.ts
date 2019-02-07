import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { ContratoKey } from '../model/contrato';
import { SucursalDeRegion, OficinaerieFActuraEntity, BancoEntity, FilterBancos, FilterBancoTarjeta, FormatoFecha } from '../model/genericos';
import { ControlFacturaFilter } from '../model/controlFactura';

@Injectable()
export class GenericosService extends PaginationService {

    private genericosUrl = 'genericos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.genericosUrl = constantService.API_ENDPOINT + this.genericosUrl;
    }

    getSucursalPorRegion(contratoKey: ContratoKey): Observable<SucursalDeRegion[]> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.genericosUrl + "/getSucursalesPorRegion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getSucursalPorId(idSucursal: number): Observable<SucursalDeRegion> {
        return this.authHttp.get(this.genericosUrl + "/getSucursalPorId/" + idSucursal, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    OficinaSERIEFactura(wRegion: string, fProducto: number): Observable<OficinaerieFActuraEntity> {
        return this.authHttp.get(this.genericosUrl + "/OficinaSERIEFactura?wRegion=" + wRegion + "&fProducto=" + fProducto, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GetFirstControlFacturaByFilters(cfFilter: ControlFacturaFilter): Observable<any> {
        let body = JSON.stringify(cfFilter);
        return this.authHttp.post(this.genericosUrl + "/GetFirstControlFacturaByFilters", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GetCargarBancos(filter: FilterBancos): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.genericosUrl + "/CargarBancos", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GetCargarEspecialidadesPorTipo(tipoEspecialidad: boolean): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/cargarEspecialidadesPorTipo/" + tipoEspecialidad, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getMotivosAnulacion(): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/motivosAnulacion", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getEstados(): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/estadosContratosLista", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerActividades(): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/actividad", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    grupoArancel(): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/grupoArancel", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getAllBancosPaginated(): Observable<BancoEntity[]> {
        return this.authHttp.getPaginated(this.genericosUrl + "/GetAllBancosPaginated", this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    ObtenerUsuarioPorIdentificacion(cedula: string): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/ObtenerUsuarioPorIdentificacion/" + cedula, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ObtenerUsuariosGrupo(listaGrupo: string[]): Observable<any> {
        let body = JSON.stringify(listaGrupo);
        return this.authHttp.post(this.genericosUrl + "/ObtenerUsuariosGrupo", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    eliminarTareaProgramada(idTarea: string): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/EliminarTareaProgramada/" + idTarea, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getBancosEmisorTarjeta(): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/getCargarBancosEmisorTarjeta", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    cargarBancosUsados(): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/CargarBancosUsados", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    cargarProductosActivos(): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/CargarProductosActivos", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    cargarProductosNombre(codigoProducto: string): Observable<any> {
        return this.authHttp.get(this.genericosUrl + "/CargarProductoNombre/" + codigoProducto, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    GetFormatosFecha(): Observable<FormatoFecha[]> {
        return this.authHttp.get(this.genericosUrl + "/GetFormatosFecha", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

} 
