import {Injectable} from '@angular/core';
import {ConstantService} from '../../utils/constant.service';
import {AppAuthHttp} from '../../seguridad/appAuthHttp';
import {CORP_TerminosCondiciones} from '../model/terminoscondiciones';
import {Observable} from 'rxjs/Rx';
import {Response} from '@angular/http';
import {PC_GrupoAgentes} from '../model/PC_GrupoAgentes';


@Injectable()
export class CorredoresGrupoAgenteVentaServices{
    private grupoUrl = 'CorredoresGrupoAgentes';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.grupoUrl = constantService.API_ENDPOINT + this.grupoUrl;
    }

    GrupoAgentesTraerTodos(): Observable<PC_GrupoAgentes[]> {
        return this.authHttp.get(this.grupoUrl + '/GrupoAgentesTraerTodos')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }


    GrupoAgentesPorCodigo(codigo: number): Observable<PC_GrupoAgentes> {
        return this.authHttp.get(this.grupoUrl + '/GrupoAgentesPorCodigo?codigo=' + codigo.toString())
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    GrupoAgentesCrearActualizar(grupo: PC_GrupoAgentes): Observable<boolean> {
        const body = JSON.stringify(grupo);
        return this.authHttp.post(this.grupoUrl + '/GrupoAgentesCrearActualizar', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    GrupoAgentesEliminar(codigo: number): Observable<boolean> {
        return this.authHttp.get(this.grupoUrl + '/GrupoAgentesEliminar?codigo=' + codigo.toString())
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        console.log(res);
        let body = res.json();
        console.log(body);
        return body.Datos || [];
    }
}