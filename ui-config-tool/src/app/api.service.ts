import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import { UIConfig, Room } from './objects';
import { ContentType } from '@angular/http/src/enums';

@Injectable()
export class ApiService {
  url: string = "http://10.5.34.100:9900";
  room: Room = new Room();
  options: RequestOptions;
  headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    // this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Credentials', 'true');

    this.options = new RequestOptions({headers : this.headers});
  }

  getDevicesInRoomByRole(building: string, room: string, role: string): Observable<string[]> {
    console.log("Trying " + building + "-" + room + " " + role);
    return this.http.get(this.url+"/devices/" + building + "/" + room + "/" + role + "/", this.options).map(response => response.json());
  }

  getUIConfig(building: string, room: string): Observable<any> {
    return this.http.get(this.url+"/get/" + building + "/" + room, this.options).map(response => response.json());
  }

  addUIConfig(building: string, room: string, config: UIConfig): Observable<string> {
    return this.http.post(this.url+"/add/" + building + "/" + room, config, this.options).map(response => response.json());
  }

  updateUIConfig(building: string, room: string, config: UIConfig): Observable<string> {
    console.log(this.url+" Updating UI for "+building+"-"+room);
    return this.http.put(this.url+"/update/" + building + "/" + room, config, this.options).map(response => response.json());
  }

  getIcons(): Observable<string[]> {
    return this.http.get(this.url+"/icons", this.options).map(response => response.json());
  }

  getTemplate(id: string): Observable<UIConfig> {
    return this.http.get(this.url+"/template/" + id, this.options).map(response => response.json());
  }
}
