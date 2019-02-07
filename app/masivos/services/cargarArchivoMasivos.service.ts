import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { MasivosEntity } from '../model/MasivosEntity';

@Injectable()
export class CargarArchivosMasivosService extends PaginationService {

    private masivosUrl = 'cargaArchivosMasivos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.masivosUrl = constantService.API_ENDPOINT + this.masivosUrl;
    }

    cargarArchivo(fileToUpload: File, masivos: MasivosEntity): Observable<any> {
        return this.authHttp.sendFile(this.masivosUrl + "/ValidarPrefactura/"+masivos.CodigoPrestador, fileToUpload)
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}
