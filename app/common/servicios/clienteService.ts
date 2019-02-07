import { PaginationService } from "../../utils/pagination.service";
import { ConstantService } from "../../utils/constant.service";
import { AppAuthHttp } from "../../seguridad/appAuthHttp";
import { ClienteFilter, ClienteEntity, ClientePassword } from "../model/cliente";
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
@Injectable()
export class ClienteService extends PaginationService{
    private listaClientesUrl='portalClientes';
    constructor (private authHttp: AppAuthHttp,private constantService: ConstantService){
        super(1,10);
        this.listaClientesUrl=constantService.API_ENDPOINT+this.listaClientesUrl;
    }

   
    getByFilter(registros:number,filter:ClienteFilter):Observable<ClienteEntity[]>{
        this.paginationConstants.pageSize = registros;
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.listaClientesUrl + "/PortalClientesConsultar", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
        .map((res) => this.extractRespuestaGenericaDataPaginated(res))
        .catch(this.authHttp.handleError);
    }

    updateCliente(cliente: ClienteEntity): Observable<boolean> {
        let body = JSON.stringify(cliente);
        return this.authHttp.post(this.listaClientesUrl + "/ActualizarDatosCliente", body,null,"SI")
            .map( (res) => this.extractRespuestaGenericaData(res))
            .catch(this.authHttp.handleError);
    }

    generatemd5Password(password: string): Observable<any> {
        let body = JSON.stringify(password);
        return this.authHttp.get(this.listaClientesUrl + "/GetPasswordMD5/" + password, null, "SI")
        .map((res) => this.extractData(res))
        .catch(this.authHttp.handleError);
    }

    savenewPassword(clientePassword:ClientePassword): Observable<any> {
        let body = JSON.stringify(clientePassword);
        return this.authHttp.get(this.listaClientesUrl + "/GuardarNuevoPassword/"+clientePassword.DocumentoIdentificacion+"/" + clientePassword.PasswordMD5, null, "SI")
        .map((res) => this.extractData(res))
        .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}