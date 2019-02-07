
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FiltroReportes, Reporte } from '../model/reportes';
import { Observable } from 'rxjs';
import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class ReportesService {
    api: String

    constructor(private http: HttpClient, constantService: ConstantService) {
        this.api = constantService.API_ENDPOINT;
    }

    generarReporte(filtroReportes: FiltroReportes): Observable<Reporte[]> {
        const url = this.api + "retencionClientes/incrementoContratos";
        const req = JSON.stringify(filtroReportes);
        return this
            .http
            .post<Reporte[]>(url, req, this.opciones());
    }

    opciones() {
        return {
            headers: new HttpHeaders({
                "Authorization": `Bearer ${ localStorage.getItem('id_token') }`,
                "Content-Type": "application/json"
            })
        };
    }
}
