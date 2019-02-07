import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ls, LsRes, Delete, DeleteRes } from '../model/informacionRetencion';
import { Observable } from 'rxjs';
import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class InformacionRetencionService {
    api: String

    constructor(private http: HttpClient, constantService: ConstantService) {
        this.api = constantService.API_ENDPOINT;
    }

    lista(ls: Ls): Observable<LsRes> {
        const url = this.api + "retencionClientes/incrementoContratos";
        const req = JSON.stringify(ls);
        return this
            .http
            .post<LsRes>(url, req, this.opciones());
    }

    opciones() {
        return {
            headers: new HttpHeaders({
                "Authorization": `Bearer ${ localStorage.getItem('id_token') }`,
                "Content-Type": "application/json"
            })
        };
    }

    borrar(del: Delete): Observable<DeleteRes> {
        const url = this.api + "retencionClientes/incrementoContratos";
        const req = JSON.stringify(del);
        return this
            .http
            .post<DeleteRes>(url, req, this.opciones());
    }
}
