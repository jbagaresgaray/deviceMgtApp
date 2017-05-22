import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


/*
  Generated class for the DeviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceProvider {

  public apiUrl = 'http://localhost:3000';
  // public apiUrl = 'http://54.206.38.223:5002';
  public apiVersion = '/sync/1.0/'

  constructor(public http: Http) { }

  private extractData(res: Response) {
    return res.json();
  }

  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

  validateDevice(data) {
    return this.http.post(this.apiUrl + this.apiVersion + 'devices/validate', data)
        .map((response) => response.json())
        .toPromise();
  }

  registerDevice(data){
    return this.http.post(this.apiUrl + this.apiVersion + 'devices', data)
        .map((response) => response.json())
        .toPromise();
  }

}
