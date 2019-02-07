
import { Injectable, Inject } from '@angular/core';

import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/cath';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';



export class LogoServise {
    Uploader: any;
  _errorHandler(arg0: any): any {
  }
  constructor(private _http: Http, LogoService) {

  }
  public uploadImagine() {
    const _url = '/src/app/logo';
    return this._http.post(_url, FormData)
    .catch(this._errorHandler);
  }
  private _errinHandler(error: Response) {
  console.error('Error Occured + error');
  return Observable.throw(error ||  'Some error on sever Occured')
  }
  public genFilelist() {
    const _url = '/src/app/logo';
    return this._http.get(_url)
    .catch(this._errorHandler);
  }
}
