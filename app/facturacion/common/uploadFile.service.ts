import { Injectable, Inject } from "@angular/core";
import { Http, Response } from "@angular/http";
import { ConstantService } from "../../utils/constant.service";
import { Observable } from "rxjs/Observable";

import { PaginationService } from '../../utils/pagination.service';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { RespuestaCargaArchivoCobros } from "../../common/model/facturacion";
import { HttpHeaders, HttpClient } from "@angular/common/http";


@Injectable()
export class UploadFileService extends PaginationService {

  private uploadUrl = 'recepcionArchivos';

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

  cargarArchivoPichincha(fileToUpload: File, nombreArchivoSalida: string, lugarPago: string): Observable<RespuestaCargaArchivoCobros> {
    let formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(this.uploadUrl + "/cargarArchivosPichincha?nombreArchivoSalida=" + nombreArchivoSalida + "&lugarPago=" + lugarPago, formData)
      .map( res => this.extractRespGenerica(res) )
      .catch(this.authHttp.handleError);
  }

  descargarCsvRespuestaCargaArchivoCobros(fileName: string): Observable<any>{
    return this.authHttp.postGetFile(this.uploadUrl + "/descargarCsvRespuestaCargaArchivoCobros?fileName=" + fileName, null, null, "SI");
  }

  /*postFile(fileToUpload: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    let body = JSON.stringify(formData);
    return this.authHttp.post(this.uploadUrl + "/ingresarRespuesta", body, null, "SI")
      .map((res) => this.extractRespGenerica(res))
      .catch(this.authHttp.handleError);
  }*/

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}