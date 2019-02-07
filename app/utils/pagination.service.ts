import { PaginationConstants } from './pagination';
import { Observable } from 'rxjs/Rx';
import { tokenNotExpired, JwtHelper, AuthHttp, AuthHttpError } from 'angular2-jwt';

export class PaginationService {

    public paginationConstants: PaginationConstants;
    private paginationConstantsInit: PaginationConstants;

    constructor(pageNumber: number = 1, pageSize: number = 20) {
        this.paginationConstants = new PaginationConstants(0, pageNumber, pageSize, 0);
        this.paginationConstantsInit = new PaginationConstants(0, pageNumber, pageSize, 0);
    }

    protected extractDataPaginated(res: any) {
        let body = res.json();
        //console.log(body);
        if (body.total == undefined && body.Datos != undefined) {
            body = body.Datos;
            if (body.total != undefined)
                this.paginationConstants.total = body.total;
            if (body.data != undefined) {
                this.paginationConstants.currentPageSize = body.data.length;
                // console.log("--"+body.data);
                return body.data || [];
            }
        } else {

            if (body.total != undefined)
                this.paginationConstants.total = body.total;
            if (body.data != undefined) {
                this.paginationConstants.currentPageSize = body.data.length;
                // console.log("++"+body.data);
                return body.data || [];

            }
        }
        return [];
    }

    protected extractRespuestaGenericaDataPaginated(res: any) {
        let body = res.json();

        if (body.Estado == "Error") {
            throw new Error(body.Mensajes[0]);
        }
        else {

            body = body.Datos;
            //console.log(body);
            if (body.TotalRegistros == undefined && body.Datos != undefined) {
                body = body.Datos;
                if (body.TotalRegistros != undefined)
                    this.paginationConstants.total = body.TotalRegistros;
                if (body.Entidades != undefined) {
                    this.paginationConstants.currentPageSize = body.Entidades.length;
                    //console.log("--"+body.Entidades);
                    return body.Entidades || [];
                }
            } else {

                if (body.TotalRegistros != undefined)
                    this.paginationConstants.total = body.TotalRegistros;
                if (body.Entidades != undefined) {
                    this.paginationConstants.currentPageSize = body.Entidades.length;
                    return body.Entidades || [];
                }
            }
        }
    }


    protected extractRespuestaGenericaData(res: any) {
        let body = res.json();

        if (body.Estado == "Error") {
            throw new Error(body.Mensajes[0]);
        }
        body = body.Datos;
        if (body.Entidades != undefined) {
            return body.Entidades || [];
        }

        return [];
    }

    protected extractRespGenerica(res: any) {
        let body = res.json();
        if (body.Estado == "Error") {
            throw new Error(body.Mensajes[0]);
        }
        return body.Datos || {};
    }

    public resetDefaultPaginationConstanst(): void {
        this.paginationConstants = Object.assign(new PaginationConstants(), this.paginationConstantsInit);
    }

    public extractRespBooleana(res: any) {
        let body = res.json();
        console.log('>>>>>>>>', body);
        if (body.Estado == "Error") {
            throw new Error(body.Mensajes[0]);
        }
        return body.Datos;
    }
}