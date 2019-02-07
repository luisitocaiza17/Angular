import { Injectable, Inject } from "@angular/core";
import { Http, Response } from "@angular/http";
import { ConstantService } from "../../utils/constant.service";
import { Observable } from "rxjs/Observable";

import { PaginationService } from '../../utils/pagination.service';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { RespuestaCargaArchivoCobros } from "../../common/model/facturacion";
import { HttpHeaders, HttpClient } from "@angular/common/http";


@Injectable()
export class UploadFileBancoService extends PaginationService {

  private uploadUrl = 'CargaRespuestas';

  constructor(private http: Http, private httClient: HttpClient, @Inject(ConstantService) constantService: ConstantService, private authHttp: AppAuthHttp) {
    super(1, 5);  
    this.uploadUrl = constantService.API_ENDPOINT +  this.uploadUrl;
      
  }

  /*constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
    super(1, 5);
    this.uploadUrl = constantService.API_ENDPOINT + this.uploadUrl;
  }*/

  postFile(fileToUpload: File, usr : string): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(this.uploadUrl + "/ingresarRespuesta/"+usr, formData)
      .map( res => this.extractRespGenerica(res) )
      .catch(this.authHttp.handleError);
  }

  cargarRespuestasBanco(fileToUpload: File, nombreArchivoSalida: string, lugarPago: string, codigoBanco: number): Observable<RespuestaCargaArchivoCobros> {
    let formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(this.uploadUrl + "/CargarRespuestasBanco?nombreArchivoSalida=" + nombreArchivoSalida + "&lugarPago=" + lugarPago + "&codigoBanco=" + codigoBanco, formData)
      .map( res => this.extractRespGenerica(res) )
      .catch(this.authHttp.handleError);
  }

  descargarCsvRespuestaCargaArchivoCobros(fileName: string): Observable<any>{
    return this.authHttp.postGetFile(this.uploadUrl + "/descargarCsvRespuestaCargaArchivoCobros?fileName=" + fileName, null, null, "SI");
  }

}