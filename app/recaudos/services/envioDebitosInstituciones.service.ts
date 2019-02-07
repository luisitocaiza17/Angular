import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { RemesaEntity } from '../../common/model/remesa';
import { InputForEnvioDebitosInstituciones } from '../model/recaudo';
import { BancoEntity } from '../../common/model/genericos';
import { DetalleRemesa } from '../../common/model/detalleRemesa';


@Injectable()
export class EnvioDebitosInstitucionesService extends PaginationService {

    private fileGenerationUrl = 'EnvioDebitosInstituciones';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10); 
        this.fileGenerationUrl = constantService.API_ENDPOINT + this.fileGenerationUrl;        
    }

    GetLastRemesaFromEachRegionByCodigoBanco(codigoBanco: number): Observable<RemesaEntity[]> {
        return this.authHttp.get(this.fileGenerationUrl + "/GetLastRemesaFromEachRegionByCodigoBanco/" + codigoBanco, null, "SI")
                .map( (res) => this.extractRespGenerica(res) )
                .catch(this.authHttp.handleError);
    }

    GetDetallesRemesa(numeroRemesa: number): Observable<DetalleRemesa[]>{ 
        return this.authHttp.get(this.fileGenerationUrl + "/GetDetallesOfARemesa/" + numeroRemesa, null, "SI")
        .map( (res) => this.extractRespGenerica(res) )
        .catch(this.authHttp.handleError);
    }

    GetBancosUsados(): Observable<BancoEntity[]> {
        return this.authHttp.getPaginated(this.fileGenerationUrl + "/GetBancosUsados", this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    GetTotalBanco(codigoBanco: number): Observable<number> {
        return this.authHttp.get(this.fileGenerationUrl + "/GetTotalBanco/" + codigoBanco, null, "SI")
                .map( (res) => this.extractRespGenerica(res) )
                .catch(this.authHttp.handleError);
    }
}