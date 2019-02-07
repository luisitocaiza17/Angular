// Fecha Creacion Servicio Corporativo 03/04/2018 - Pedro Benitez

import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ContratoKey, ContratoEntityFilter } from '../../common/model/contrato';

import { ConstantService } from '../../utils/constant.service';
import { EmpresaCoorporativo, CorporativoFilter, CorporativoList } from '../model/corporativo';
import { Sucursal, SucursalNombre, SucursalFilter } from '../model/sucursal';
import { Rol } from '../model/rol';
import { Usuario } from '../model/usuario';
import { PaginationService } from '../../utils/pagination.service';


@Injectable()
export class SucursalService extends PaginationService {

    private corporativoUrl = 'corporativo';
    private contratoUrl = 'contratos';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 3);
        this.corporativoUrl = constantService.API_ENDPOINT + this.corporativoUrl;

}

getByFiltersPaginatedSucursal(filter: CorporativoFilter): Observable<Sucursal[]> {
    let body = JSON.stringify(filter);

    return this.authHttp.postPaginated(this.corporativoUrl + "/getSucursalByCorporativo", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
        .map((res) => this.extractDataPaginatedEmpresas(res))
        .catch(this.authHttp.handleError);
}

 // Corporativo Datos Corporativos
 actualizarDatosSucursal(filter: SucursalFilter): Observable<boolean> {
    let body = JSON.stringify(filter);
    return this.authHttp.post(this.corporativoUrl + "/ModificarSucursal", body)
        .map(res => res.json())
        .catch(this.authHttp.handleError);
}

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


}
