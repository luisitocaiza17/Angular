import { PaginationConstants } from './pagination';

export class PaginationServiceEmpresa {

    public paginationConstants: PaginationConstants;
    private paginationConstantsInit: PaginationConstants;

    constructor(pageNumber: number = 1, pageSize: number = 20) {
        this.paginationConstants = new PaginationConstants(0, pageNumber, pageSize, 0);
        this.paginationConstantsInit = new PaginationConstants(0, pageNumber, pageSize, 0);
    }
    
    private extractDataPaginatedEmpresas(res: any) {
        let body = res;
        if (body.total != undefined)
            this.paginationConstants.total = body.total;
        if (body.data != undefined) {
            this.paginationConstants.currentPageSize = body.data.length;
            return body.data;
        }
        return [];
    }

    protected extractDataEmpresa(res: any) {
        let body = res.json();
        console.log(body)
        return this.extractDataPaginatedEmpresas(body.Datos) || {};
    }

    public resetDefaultPaginationConstanst(): void {
        this.paginationConstants = Object.assign(new PaginationConstants(), this.paginationConstantsInit);
    }
}