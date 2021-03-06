import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AppConfig {

    private config: Object = null;

    constructor(private http: Http) {

    }

    public get(key: any) {
        return this.config[key];
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/config.json').
                map(res => res.json())                
                .catch((error: any):any => {
                console.log('Configuration file "config.json" could not be read');
                resolve(true);
                return Observable.throw(error.body || 'Server error');
            }).subscribe((envResponse) => {
                this.config = envResponse;
                let request:any = null;
                resolve(true);
            });

        });
    }
}