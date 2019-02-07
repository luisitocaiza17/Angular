import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { CreaPagoEntity } from '../model/creaPagoEntity';
import { CreaFormaPagoEntity } from '../model/creaFormaPagoEntity';


@Injectable()
export class ServicioPagoService extends PaginationService {

    private servicioPagoUrl = 'servicioPago';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.servicioPagoUrl = constantService.API_ENDPOINT + this.servicioPagoUrl;
    }

    obtenerPago(filter: CreaFormaPagoEntity, numeroPagina: number, registroPagina: number) {
        let body = JSON.stringify(filter);
        this.paginationConstants.pageNumber = numeroPagina;
        this.paginationConstants.pageSize = registroPagina;

        return this.authHttp.postPaginated(this.servicioPagoUrl + "/ObtenerPago", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    obtieneFunPagoPrimeraCuota(numeroFun: number) {
        return this.authHttp.get(this.servicioPagoUrl + "/ObtieneFunPagoPrimeraCuota/" + numeroFun, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
    
    obtieneSerieNumeroSerie(numeroSerie: number) {
        return this.authHttp.get(this.servicioPagoUrl + "/ObtieneSerieNumeroSerie/" + numeroSerie, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    crearPago(input: CreaPagoEntity){ 
        let body = JSON.stringify(input);
        return this.authHttp.post(this.servicioPagoUrl + "/CrearPago", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

}