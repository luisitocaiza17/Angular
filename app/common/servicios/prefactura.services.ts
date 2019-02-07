import {PaginationService} from '../../utils/pagination.service';
import {Injectable} from '@angular/core';
import {ConstantService} from '../../utils/constant.service';
import {Http, Response} from '@angular/http';
import {AppAuthHttp} from '../../seguridad/appAuthHttp';
import {Observable} from 'rxjs/Rx';
import {CORP_PreFactura} from '../model/corpprefacturadetalle';
import {CorporativoEntity} from '../model/corporativo';

@Injectable()
export class PrefacturaService extends PaginationService {
    private prefacturaUrl = 'prefactura';
    private servicesUrl = 'CatalogoAplicacion';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService, private http: Http) {
        super(1, 5);
        this.prefacturaUrl = constantService.API_ENDPOINT + this.prefacturaUrl;
        this.servicesUrl = constantService.SERVICES_ENDPOINT + constantService.API_ENDPOINT + this.servicesUrl;
    }
    // traer registros por filtros
    getPrefacturas(id: number, ruc: string, fechaRegistro: string): Observable<any[]> {
        return this.authHttp.get(this.prefacturaUrl + '/ObtenerPreFacturasPorFiltro/' + id + '/' + ruc + '/' + fechaRegistro)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    // Envio de listado de empresas confirmadas
    GrabarPreFacturacionAprobacion(empresas: CORP_PreFactura[]): Observable<any> {
        let body = JSON.stringify(empresas);
        return this.authHttp.post(this.prefacturaUrl + '/GrabarPreFacturacionAprobacion', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        // console.log(body);
        return body.Datos || [];
    }

    private extractBody(res: Response) {
        const body = res.json();
        // console.log(body);
        return body || [];
    }
}
