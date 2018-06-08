import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import { UIConfig } from './objects';

@Injectable()
export class ApiService {
  private url = 'http://localhost:9900';

  constructor(private http: Http) { }

  getDevicesInRoomByRole(building: string, room: string, role: string): Observable<string[]> {
    console.log("Trying " + building + " " + room + " " + role);
    return this.http.get(this.url + "/devices/" + building + "/" + room + "/" + role + "/").map(response => response.json());
  }

  getUIConfig(building: string, room: string): Observable<string> {
    return this.http.get(this.url + "/get/" + building + "/" + room).map(response => response.json());
  }

  addUIConfig(building: string, room: string): Observable<string> {
    return this.http.get(this.url + "/add/" + building + "/" + room).map(response => response.json());
  }

  updateUIConfig(building: string, room: string): Observable<string> {
    return this.http.get(this.url + "/update/" + building + "/" + room).map(response => response.json());
  }

  getIcons(): Observable<string[]> {
    return this.http.get(this.url + "/icons").map(response => response.json());
  }

  getTemplate(id: string): Observable<UIConfig> {
    console.log(id)
    return this.http.get(this.url + "/template/" + id).map(response => response.json());
  }
}
