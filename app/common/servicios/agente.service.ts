import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ContratoKey, ContratoEntityFilter } from '../../common/model/contrato';

import { ConstantService } from '../../utils/constant.service';
import { EmpresaCoorporativo , CorporativoFilter, CorporativoList} from '../model/corporativo';
import { Agente } from '../model/agente';
import { Sucursal, SucursalNombre } from '../model/sucursal';
import { Rol } from '../model/rol';
import { Unidad } from '../model/unidad';
import { Sociedad } from '../model/sociedad';
import { Usuario } from '../model/usuario';
import { PaginationService } from '../../utils/pagination.service';
import { catalogoRouting } from '../../catalogo/catalogo.routing';
import { Catalogo } from '../model/catalogo';


@Injectable()
export class AgenteService extends PaginationService {

    private agenteUrl = 'agenteventa';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.agenteUrl = constantService.API_ENDPOINT + this.agenteUrl;

}
    // getByFiltersPaginated(filter: CorporativoFilter): Observable<Corporativo[]> {
    //     let body = JSON.stringify(filter);
    //     return this.authHttp.postPaginated(this.corporativoUrl + "/getCorporativo",
    //             body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
    //         .map((res) => this.extractDataPaginatedEmpresas(res))
    //         .catch(this.authHttp.handleError);
    // }


    // getUsuarioByCedula(filter: ContratoEntityFilter): Observable<any> {
    //     let body = JSON.stringify(filter);
    //     return this.authHttp.postPaginated(this.contratoUrl + "/filterForTransacciones", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
    //         .map((res) => this.extractDataPaginated(res))
    //         .catch(this.authHttp.handleError);
    // }
    // crearCorporativo(corporativo: Corporativo): Observable<any> {
    //     let body = JSON.stringify(corporativo);
    //     return this.authHttp.post(this.corporativoUrl + "/CrearCorporativoSucursalesUsuarios", body)
    //         .map(this.extractData)
    //         .catch(this.authHttp.handleError);
    // }

    // eliminarCorporativo(corporativo: Corporativo): Observable<any> {
    //     let body = JSON.stringify(corporativo);
    //     return this.authHttp.post(this.corporativoUrl + "/eliminarCorporativo", body)
    //         .map(this.extractData)
    //         .catch(this.authHttp.handleError);
    // }

    // getCorporativo(): Observable<Corporativo[]> {
    //     return this.authHttp.get(this.corporativoUrl + "/getCorporativo")
    //         .map((res) => this.extractData(res))
    //         .catch(this.authHttp.handleError);
    // }

    // getRoles(): Observable<Rol[]> {
    //     return this.authHttp.get(this.corporativoUrl + "/ObtenerRoles")
    //         .map((res) => this.extractData(res))
    //         .catch(this.authHttp.handleError);
    // }

    // getUnidadesResponsables(): Observable<Unidad[]> {
    //     return this.authHttp.get(this.corporativoUrl + "/ObtenerUnidadesResponsables")
    //         .map((res) => this.extractData(res))
    //         .catch(this.authHttp.handleError);
    // }

    getAgentes(nombre:string): Observable<Agente[]> {
        return this.authHttp.get(this.agenteUrl + "/ObtenerAgentes/" + nombre )
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    // getCorporativoByEmpresaNumero(Numero: number): Observable<Corporativo[]> {
    //     return this.authHttp.get(this.corporativoUrl + "/getCorporativoByEmpresaNumero/" + Numero)
    //         .map(this.extractData)
    //         .catch(this.authHttp.handleError);
    // }

    // getCorporativoByRazonSocial(RazonSocial: number): Observable<Corporativo[]> {
    //     return this.authHttp.get(this.corporativoUrl + "/getCorporativoByRazonSocial/" + RazonSocial)
    //         .map(this.extractData)
    //         .catch(this.authHttp.handleError);
    // }

    // getCorporativoByRucEmpresa(Ruc: number): Observable<Corporativo[]> {
    //     return this.authHttp.get(this.corporativoUrl + "/getCorporativoByRucEmpresa/" + Ruc)
    //         .map(this.extractData)
    //         .catch(this.authHttp.handleError);
    // }

    // getSucursalByCorporativo(Sucursal: Sucursal): Observable<Corporativo[]> {
    //     return this.authHttp.get(this.corporativoUrl + "/getSucursalByCorporativo/"+ Sucursal)
    //     .map(this.extractData)
    //     .catch(this.authHttp.handleError);
    // }

    // // Corporativo Datos Corporativos
    // actualizarDatosCorporativos(filter: CorporativoFilter): Observable<boolean> {
    //     let body = JSON.stringify(filter);
    //     return this.authHttp.post(this.corporativoUrl + "/ModificarCorporativo", body)
    //         .map(res => res.json())
    //         .catch(this.authHttp.handleError);
    // }

    // // Corporativo Representante Legal
    // actualizarRepresentanteLegal(filter: CorporativoFilter): Observable<boolean> {
    //     let body = JSON.stringify(filter);
    //     return this.authHttp.post(this.corporativoUrl + "/ModificarCorporativo", body)
    //         .map(res => res.json())
    //         .catch(this.authHttp.handleError);
    // }

    // // Corporativo Datos Broker
    // actualizarDatosBroker(filter: CorporativoFilter): Observable<boolean> {
    //     let body = JSON.stringify(filter);
    //     return this.authHttp.post(this.corporativoUrl + "/ModificarCorporativo", body)
    //         .map(res => res.json())
    //         .catch(this.authHttp.handleError);
    // }

    protected extractDataPaginatedEmpresas(res: any) {

        let body = res.json();
        body = body.Datos;
        if (body.total != undefined)
            this.paginationConstants.total = body.total;
        if (body.data != undefined) {
            this.paginationConstants.currentPageSize = body.data.length;
            return body.data || [];
        }
        return [];
    }
    private extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body.Datos || [];
    }
}
