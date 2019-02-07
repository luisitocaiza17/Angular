import {Injectable, Inject} from '@angular/core';
import {AppAuthHttp} from '../../seguridad/appAuthHttp';
import {Observable} from 'rxjs/Rx';
import {ConstantService} from '../../utils/constant.service';
import {PaginationService} from '../../utils/pagination.service';
import {Proveedor} from '../../serviciosAdicionales/models/Bases';
import {Criterio, Poliza, Servicio, Catalogo} from '../../serviciosAdicionales/models/Polizas';

@Injectable()
export class ServiciosAdicionalesAdminService extends PaginationService {

    private readonly catalogosURL: string = '/servadic/catalogo/getCatalogoPorCodigo/CRITERIO';
    private readonly proveedorURL: string = '/servadic/proveedor';
    private readonly serviciosURL: string = '/servadic/servicio/getServicios';
    private readonly polizasURL: string = '/servadic/poliza';
    private readonly criteriosURL: string = '/servadic/criterio';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.catalogosURL = constantService.API_ENDPOINT + this.catalogosURL;
        this.proveedorURL = constantService.API_ENDPOINT + this.proveedorURL;
        this.serviciosURL = constantService.API_ENDPOINT + this.serviciosURL;
        this.polizasURL = constantService.API_ENDPOINT + this.polizasURL;
        this.criteriosURL = constantService.API_ENDPOINT + this.criteriosURL;
    }

    obtenerCatalogo(): Observable<Catalogo> {
        return this.authHttp
            .get(this.catalogosURL, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerProveedores(): Observable<Proveedor[]> {
        return this.authHttp
            .get(this.proveedorURL.concat('/getProveedores'), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerServicios(): Observable<Servicio[]> {
        return this.authHttp
            .get(this.serviciosURL, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerPoliza(id: number): Observable<Poliza> {
        return this.authHttp
            .get(this.polizasURL.concat('/getPolizasPorId/').concat(id.toString()), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerPolizaPorProveedor(id: number): Observable<Poliza[]> {
        return this.authHttp
            .get(this.polizasURL.concat('/getPolizasPorProveedorId/').concat(id.toString()), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerCriterios(id: number): Observable<Criterio[]> {
        return this.authHttp
            .get(this.criteriosURL.concat('/getCriteriosPorPolizaId/').concat(id.toString()), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    guardarProveedor(proveedor: Proveedor): Observable<Proveedor> {
        return this.authHttp
            .post(this.proveedorURL.concat('/saveProveedor'), JSON.stringify(proveedor), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    guardarPoliza(poliza: Poliza): Observable<Poliza> {
        return this.authHttp
            .post(this.polizasURL.concat('/savePoliza'), JSON.stringify(poliza), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    guardarCriterio(criterio: Criterio): Observable<Criterio> {
        return this.authHttp
            .post(this.criteriosURL.concat('/saveCriterio'), JSON.stringify(criterio), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}
