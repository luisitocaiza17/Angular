import { ConstantService } from '../../utils/constant.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContratoEntityFilter, ContratoEntityList } from '../model/contrato';
import { Observable, BehaviorSubject } from 'rxjs';
import { Paginado, Maybe } from '../model/paginado';
import {
    Archivo,
    Beneficiario,
    Categoria,
    Descarga,
    Comentario,
    FiltroReportes,
    FiltroMFiles,
    OpcionesComentario,
    Reporte,
    Retencion,
    RetencionKey,
    ServiciosKey,
    Servicio,
    SetComentario,
    DescuentoCliente,
    ParametroRetencion,
    RespuestaParametroRetencion,
    DescuentosPendiente,
    ReporteRetencionFilter, 
    RetencionCambioPlanEntity, 
    GetRetencionKey
} from '../model/retencion';

import { ContratoKey} from '../model/contrato';
import { Catalogo } from '../model/catalogo';

@Injectable()
export class RetencionService {
    api: String

    public retenciones = new BehaviorSubject<Retencion>(new Retencion());
    currentRetencion = this.retenciones.asObservable();

    public informacionCambioPlan = new BehaviorSubject<RetencionCambioPlanEntity>(new RetencionCambioPlanEntity());
    infoRetencion = this.informacionCambioPlan.asObservable();
    
    public contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(new ContratoKey);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    //para retenciona-anular
    public _contratoK = new BehaviorSubject<ContratoKey>(new ContratoKey);
    currectContratoK: Observable<ContratoKey> = this._contratoK.asObservable();
    
    public beneficiariosContratoValores = new BehaviorSubject<Beneficiario[]>(new Array);
    currentBeneficiarios = this.beneficiariosContratoValores.asObservable();

    constructor(private http: HttpClient, constantService: ConstantService) {
        this.api = constantService.API_ENDPOINT;
    }

    filtrarContratos(filtro: ContratoEntityFilter, itemsPerPage: number, currentItem: number): Observable<Paginado<ContratoEntityList>> {
        const headers = new HttpHeaders({
            "Authorization": `Bearer ${localStorage.getItem('id_token')}`,
            "Content-Type": "application/json",
            "X-Page-Number": currentItem.toString(),
            "X-Page-Size": itemsPerPage.toString()
        });

        const url = this.api + "contratos/filter";
        const req = JSON.stringify(filtro);
        return this
            .http
            .post<Paginado<ContratoEntityList>>(url, req, { headers });
    }

    retencion(retencionKey: RetencionKey): Observable<Retencion> {
        const url = this.api + "retencionClientes/incrementoContratos";
        const req = JSON.stringify(retencionKey);
        return this
            .http
            .post<Retencion>(url, req, this.opciones());
    }


    descuentoRetencionCliente(retencionKey: RetencionKey): Observable<DescuentoCliente[]> {
        const url = this.api + "retencionClientes/descuentoRetencionCliente";
        const req = JSON.stringify(retencionKey);
        return this
            .http
            .post<DescuentoCliente[]>(url, req, this.opciones());
    }

    getdescuentoRetencionCliente(retencionKey: GetRetencionKey): Observable<DescuentoCliente[]> {
        const url = this.api + "retencionClientes/descuentoRetencionCliente";
        const req = JSON.stringify(retencionKey);
        return this
            .http
            .post<DescuentoCliente[]>(url, req, this.opciones());
    }


    opciones() {
        return {
            headers: new HttpHeaders({
                "Authorization": `Bearer ${localStorage.getItem('id_token')}`,
                "Content-Type": "application/json"
            })
        };
    }

    beneficiarios(retencionKey: RetencionKey): Observable<Beneficiario[]> {
        const url = this.api + "retencionClientes/incrementoBeneficiario";
        const req = JSON.stringify(retencionKey);
        return this
            .http
            .post<Beneficiario[]>(url, req, this.opciones());
    }

    servicios(serviciosKey: ServiciosKey): Observable<Servicio[]> {
        const url = this.api + "retencionClientes/incrementoServicios";
        const req = JSON.stringify(serviciosKey);
        return this
            .http
            .post<Servicio[]>(url, req, this.opciones());
    }

    obtenerOpciones(): Observable<OpcionesComentario> {
        const url = this.api + "comentarios/getAll";
        return this
            .http
            .get<OpcionesComentario>(url, this.opciones());
    }

    setComentario(sc: SetComentario): Observable<{ Estado: boolean, Mensaje: string }> {
        const url = this.api + "comentarios/setComentario";
        const body = JSON.stringify(sc);
        return this
            .http
            .post<{ Estado: boolean, Mensaje: string }>(url, sc, this.opciones());
    }

    getComentarioByIdCliente(retencionKey: RetencionKey): Observable<Comentario[]> {
        const url = this.api + "comentarios/getComentarioByIdCliente";
        const params = new HttpParams()
            .append('Region', retencionKey.Region)
            .append('CodigoProducto', retencionKey.CodigoProducto)
            .append('NumeroContrato', retencionKey.NumeroContrato.toString());

        return this
            .http
            .post<Comentario[]>(url, "", { ...this.opciones(), params });
    }

    generarReporte(filtroReportes: FiltroReportes): Observable<Reporte[]> {
        const url = this.api + "retencionClientes/reporteRetencionClientes";
        const req = JSON.stringify(filtroReportes);
        return this
            .http
            .post<Reporte[]>(url, req, this.opciones());
    }

    generarReporteExcel(filtroReportes: FiltroReportes): Observable<string> {
        const url = this.api + "reportes/reporteRetenciones";
        const req = JSON.stringify(filtroReportes);
        return this
            .http
            .post(url, req, { ...this.opciones(), responseType: 'blob' })
            .map(blob => window.URL.createObjectURL(blob));
    }

    descargarMFiles(filtroMFiles: FiltroMFiles): Observable<string> {
        const url = this.api + "retencionClientes/getDocumentosMFiles";
        const req = JSON.stringify(filtroMFiles);
        return this
            .http
            .post(url, req, { ...this.opciones(), responseType: 'blob' })
            .map(blob => window.URL.createObjectURL(blob));
    }

    obtenerCategorias(): Observable<Categoria[]> {
        const url = this.api + "retencionClientes/categoriasDocumentosPDF";
        return this
            .http
            .get<Categoria[]>(url, this.opciones());
    }

    obtenerOficinas(): Observable<Catalogo[]> {
        const url = this.api + "retencionClientes/getOficinas";
        return this
            .http
            .get<Catalogo[]>(url, this.opciones());
    }

    lista(idCategoria: number): Observable<Archivo[]> {
        const url = this.api + "retencionClientes/documentosPDFByIdCategoria";
        const req = JSON.stringify({ idCategoria });
        return this
            .http
            .post<Archivo[]>(url, req, this.opciones());
    }

    descargar(descarga: Descarga): Observable<string> {
        const url = this.api + "retencionClientes/descargarPDF";
        const req = JSON.stringify(descarga);
        return this
            .http
            .post(url, req, { ...this.opciones(), responseType: 'blob' })
            .map(blob => window.URL.createObjectURL(blob));
    }

    obtenerParametros(): Observable<ParametroRetencion[]> {
        const url = this.api + "retencionClientes/Parametros";
        return this
            .http
            .get<ParametroRetencion[]>(url, this.opciones());
    }
    obtenerParametroPorId(id: number): Observable<ParametroRetencion[]> {
        const url = this.api + "retencionClientes/Parametros/" + id;
        return this
            .http
            .get<ParametroRetencion[]>(url, this.opciones());
    }
    obtenerParametroPorNombre(rol: string): Observable<ParametroRetencion> {
        const url = this.api + "retencionClientes/Parametros/" + rol;
        return this
            .http
            .get<ParametroRetencion>(url, this.opciones());
    }
    crearParametro(parametro: ParametroRetencion): Observable<RespuestaParametroRetencion> {
        const url = this.api + "retencionClientes/Parametros";
        const req = JSON.stringify(parametro);
        return this
            .http
            .post<RespuestaParametroRetencion>(url, req, this.opciones());
    }
    modificarParametro(parametro: ParametroRetencion): Observable<RespuestaParametroRetencion> {
        const url = this.api + "retencionClientes/Parametros";
        const req = JSON.stringify(parametro);
        return this
            .http
            .put<RespuestaParametroRetencion>(url, req, this.opciones());
    }
    deleteParametro(id: number): Observable<RespuestaParametroRetencion> {
        const url = this.api + "retencionClientes/Parametros/" + id;
        return this
            .http
            .delete<RespuestaParametroRetencion>(url, this.opciones());
    }

    obtenerAplicacionDescuentoPendientes(filtro: FiltroReportes): Observable<DescuentoCliente[]> {
        const url = this.api + "retencionClientes/descuento/getDescuentosPerdientesAprobacion/";
        const req = JSON.stringify(filtro);
        return this
            .http
            .post<DescuentoCliente[]>(url, req, this.opciones());           
    }

    obtenerAplicacionDescuentoPendientesByKey(params: RetencionKey): Observable<DescuentosPendiente[]> {
        const url = this.api + "retencionClientes/descuento/getDescuentosPerdientesAprobacion/" + 
            params.Region + "/" + params.CodigoProducto + "/" + params.NumeroContrato + 
            "/" + params.IdDesc;
        return this
            .http
            .get<DescuentosPendiente[]>(url, this.opciones());
    }

    aplicarDescuento(descuentoCliente: DescuentosPendiente): Observable<RespuestaParametroRetencion> {
        const url = this.api + "retencionClientes/descuento/aplicarDescuento";
        const req = JSON.stringify(descuentoCliente);
        return this
            .http
            .post<RespuestaParametroRetencion>(url, req, this.opciones());
    }

    confirmarAplicarDescuento(filtros: RetencionKey): Observable<RespuestaParametroRetencion> {
        const url = this.api + "retencionClientes/descuento/confirmarAplicacionDescuento";
        const req = JSON.stringify(filtros);
        return this
            .http
            .post<RespuestaParametroRetencion>(url, req, this.opciones());
    }
    
    getUsuarioJefeRol(rolId: string): Observable<any> {
        const url = this.api + "retencionClientes/JefeInMediato/" + rolId;
        return this
            .http
            .get<any>(url, this.opciones());
    }

    setInformacionContacto(retencion: Retencion) {
        this.retenciones.next(retencion);
    }

    setInformacionCambioPlan(info: RetencionCambioPlanEntity) {
        this.informacionCambioPlan.next(info);
    }

    setInformacionContratoKey(contratoKey: ContratoKey) {
        this.contratoKey.next(contratoKey);
    }

    setBeneficiariosContratoValores(beneficiarios: Beneficiario[]) {
        this.beneficiariosContratoValores.next(beneficiarios);
    }

    setDataContratoKey(contratoKey: ContratoKey) {
        this._contratoK.next(contratoKey);
    }
    
}
