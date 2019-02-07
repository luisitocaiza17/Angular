import { Injectable, Inject } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { ConstantService } from "../../../utils/constant.service";
import { AppAuthHttp } from "../../../seguridad/appAuthHttp";
import { PaginationService } from "../../../utils/pagination.service";


@Injectable()
export class CargaArchivosMovimientosManualesService extends PaginationService {

  private serviceUrl = 'hangfireComisiones';

  constructor(private http: Http, private httClient: HttpClient, @Inject(ConstantService) constantService: ConstantService, private authHttp: AppAuthHttp) {
    super(1, 5);  
    this.serviceUrl = constantService.API_ENDPOINT +  this.serviceUrl;   
  }

  CargaLoteMovimientosManuales(fileToUpload: File, usuarioAutenticado: string): Observable<string> {
    let formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(this.serviceUrl + "/cargarLoteMovimientosManuales/" + usuarioAutenticado, formData)
      .map( res => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }
}