import {Injectable, Inject} from '@angular/core';
import {AppAuthHttp} from '../../seguridad/appAuthHttp';
import {Observable} from 'rxjs/Rx';
import {ConstantService} from '../../utils/constant.service';
import {PaginationService} from '../../utils/pagination.service';
import {Proveedor, Estado, Base} from '../../serviciosAdicionales/models/Bases';
import {Resumen, Movimiento, Gap} from '../../serviciosAdicionales/models/Detalles';
import {Response} from '@angular/http';

@Injectable()
export class ServiciosAdicionalesBasesService extends PaginationService {

    private readonly proveedorURL: string = '/servadic/proveedor/getProveedores';
    private readonly estadosURL: string = '/servadic/catalogo/getCatalogoPorCodigo/ESTADOS';
    private readonly configuracionURL: string = '/servadic/configuracion/getConfiguracionesPorCodigoAgrupacion/INICIAL';
    protected readonly resumenesURL: string = '/servadic/resumen';
    private readonly movimientosURL: string = '/servadic/movimiento';
    private readonly gapURL: string = '/servadic/gap';
    private readonly erroresURL: string = '/servadic/error';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.proveedorURL = constantService.API_ENDPOINT + this.proveedorURL;
        this.configuracionURL = constantService.API_ENDPOINT + this.configuracionURL;
        this.estadosURL = constantService.API_ENDPOINT + this.estadosURL;
        this.resumenesURL = constantService.API_ENDPOINT + this.resumenesURL;
        this.movimientosURL = constantService.API_ENDPOINT + this.movimientosURL;
        this.gapURL = constantService.API_ENDPOINT + this.gapURL;
        this.erroresURL = constantService.API_ENDPOINT + this.erroresURL;
    }

    obtenerProveedores(): Observable<Proveedor[]> {
        return this.authHttp
            .get(this.proveedorURL, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerConfiguracion(): Observable<any[]> {
        return this.authHttp
            .get(this.configuracionURL, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerEstados(): Observable<Estado[]> {
        return this.authHttp
            .get(this.estadosURL, null, 'SI')
            .map(res => {
                const catalogo = this.extractRespGenerica(res);
                return catalogo.Item || [];
            })
            .catch(this.authHttp.handleError);
    }

    obtenerResumenes(proveedor: number, mes: number, anio: number, estado: string): Observable<any[]> {
        const url = this.resumenesURL + '/getResumenPorProveedorId/' + proveedor + '/Mes/' + mes + '/Anio/' + anio
            + ((estado === undefined || estado === null) ? '' : ('/Estado/' + estado));
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerResumenMovimientos(base: number): Observable<Resumen> {
        const url = this.movimientosURL.concat('/getResumen/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerInclusionesMovimientos(base: number): Observable<Movimiento[]> {
        const url = this.movimientosURL.concat('/getInclusiones/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerExclusionesMovimientos(base: number): Observable<Movimiento[]> {
        const url = this.movimientosURL.concat('/getExclusiones/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerCambiosCoberturaMovimientos(base: number): Observable<Movimiento[]> {
        const url = this.movimientosURL.concat('/getCambiosCoberturas/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerResumenGap(base: number): Observable<Resumen> {
        const url = this.gapURL.concat('/getResumen/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerAltasGap(base: number): Observable<Gap[]> {
        const url = this.gapURL.concat('/getAltas/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerBajasGap(base: number): Observable<Gap[]> {
        const url = this.gapURL.concat('/getBajas/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerCambiosTarifaGap(base: number): Observable<Gap[]> {
        const url = this.gapURL.concat('/getCambioTarifa/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerResumenErrores(base: number): Observable<Resumen> {
        const url = this.erroresURL.concat('/getResumen/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerMovimientosErrores(base: number): Observable<Movimiento[]> {
        const url = this.erroresURL.concat('/getMovimientos/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerGapsErrores(base: number): Observable<Gap[]> {
        const url = this.erroresURL.concat('/getGap/').concat(base.toString());
        return this.authHttp
            .get(url, null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    liberarBase(data: any): Observable<Base> {
        return this.authHttp
            .post(this.resumenesURL.concat('/Liberar'), JSON.stringify(data), null, 'SI')
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    descargarExcelBase(id: number): Observable<Response> {
        return this.authHttp
            .getGetFile(this.resumenesURL.concat('/ReporResumen/').concat(id.toString()));
    }

}
