import {Injectable} from '@angular/core';
import {ConstantService} from '../../utils/constant.service';
import {AppAuthHttp} from '../../seguridad/appAuthHttp';
import {CORP_TerminosCondiciones} from '../model/terminoscondiciones';
import {Observable} from 'rxjs/Rx';
import {AgenteVenta} from '../model/agenteVenta';
import {Response} from '@angular/http';
import {
    AgenteReport, AgenteReportResult,
    AgenteVentaCambioFilter,
    AgenteVentaCorredoresEntity,
    ContratoEntityFilterBroker,
    ContratoEntityListBroker,
    EmpresaList
} from '../model/agenteVentaCorredoresEntity';

@Injectable()
export class CorredoresAgenteVentaServices{
    private grupoUrl = 'CorredoresAgenteVenta';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.grupoUrl = constantService.API_ENDPOINT + this.grupoUrl;
    }

    CorredoresObtenerAgentesVentaPorNombre(nombreAgenteVenta: string): Observable<AgenteVenta[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerAgentesVentaPorNombre?nombreAgenteVenta=' + nombreAgenteVenta)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresObtenerAgentesVentaPorCodigoCorredor(codigo: number): Observable<AgenteVenta[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerAgentesVentaPorCodigoCorredor?codigo=' + codigo)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresObtenerAgentesVentaPorRucCorredor(ruc: string): Observable<AgenteVenta[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerAgentesVentaPorRucCorredor?ruc=' + ruc)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresObtenerAgentesVentaVendedorPorNombre(nombreAgenteVenta: string): Observable<AgenteVenta[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerAgentesVentaVendedorPorNombre?nombreAgenteVenta=' + nombreAgenteVenta)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresObtenerAgentesVentaVendedorPorCodigoCorredor(codigo: number): Observable<AgenteVenta[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerAgentesVentaVendedorPorCodigoCorredor?codigo=' + codigo)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresObtenerAgentesVentaVendedorPorRucCorredor(ruc: string): Observable<AgenteVenta[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerAgentesVentaVendedorPorRucCorredor?ruc=' + ruc)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresObtenerAgentesVentaCorredorPorCodigo(codigo: number): Observable<AgenteVentaCorredoresEntity> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerAgentesVentaCorredorPorCodigo?codigo=' + codigo)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresObtenerCatalogoSucursales():Observable<any> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresObtenerCatalogoSucursales')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    CorredoresAgentesVentaCrearActualizar(agenteVente: AgenteVentaCorredoresEntity): Observable<AgenteVentaCorredoresEntity> {
        const body = JSON.stringify(agenteVente);
        return this.authHttp.post(this.grupoUrl + '/CorredoresAgentesVentaCrearActualizar', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    ConsultarContratosPorFiltro(agenteVente: ContratoEntityFilterBroker): Observable<ContratoEntityListBroker[]> {
        const body = JSON.stringify(agenteVente);
        return this.authHttp.post(this.grupoUrl + '/ConsultarContratosPorFiltro', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    CorredoresAgentesVentaReasignacionLista(agenteVente: AgenteVentaCambioFilter): Observable<boolean> {
        const body = JSON.stringify(agenteVente);
        return this.authHttp.post(this.grupoUrl + '/CorredoresAgentesVentaReasignacionLista', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    CorredoresAgentesVentaReasignacionContratos(agenteVente: AgenteVentaCambioFilter): Observable<boolean> {
        const body = JSON.stringify(agenteVente);
        return this.authHttp.post(this.grupoUrl + '/CorredoresAgentesVentaReasignacionContratos', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    ConsultarContratosListPorAgente(agenteVente: ContratoEntityFilterBroker): Observable<EmpresaList[]> {
        const body = JSON.stringify(agenteVente);
        return this.authHttp.post(this.grupoUrl + '/ConsultarContratosListPorAgente', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    CorredoresAgentesVentaReporte(agenteVente: AgenteReport): Observable<AgenteReportResult[]> {
        const body = JSON.stringify(agenteVente);
        return this.authHttp.post(this.grupoUrl + '/CorredoresAgentesVentaReporte', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        console.log(res);
        let body = res.json();
        console.log(body);
        return body.Datos || [];
    }
}