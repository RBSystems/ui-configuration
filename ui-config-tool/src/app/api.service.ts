import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import { UIConfig } from './objects';
import { ContentType } from '@angular/http/src/enums';

@Injectable()
export class ApiService {
  url: string = "http://10.5.34.100:9900";

  constructor(private http: Http) {}

  getDevicesInRoomByRole(building: string, room: string, role: string): Observable<string[]> {
    console.log("Trying " + building + " " + room + " " + role);
    return this.http.get(this.url+"/devices/" + building + "/" + room + "/" + role + "/").map(response => response.json());
  }

  getUIConfig(building: string, room: string): Observable<string> {
    return this.http.get(this.url+"/get/" + building + "/" + room).map(response => response.json());
  }

  addUIConfig(building: string, room: string, config: UIConfig): Observable<string> {
    return this.http.post(this.url+"/add/" + building + "/" + room, config).map(response => response.json());
  }

  updateUIConfig(building: string, room: string, config: UIConfig) {
    console.log(this.url+"Updating UI for "+building+"-"+room);
    
    var options = new RequestOptions({
      headers: new Headers({ 'Content-Type': 'application/json'})
    })
    
    this.http.put(this.url+"/update/" + building + "/" + room, config, options).subscribe();
  }

  getIcons(): Observable<string[]> {
    return this.http.get(this.url+"/icons").map(response => response.json());
  }

  getTemplate(id: string): Observable<UIConfig> {
    return this.http.get(this.url+"/template/" + id).map(response => response.json());
  }
}
