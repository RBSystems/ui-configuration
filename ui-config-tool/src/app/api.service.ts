import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  private url = 'http://localhost:9900';

  constructor(private http: Http) { }

  GetDevicesInRoomByRole(building: string, room: string, role: string): Observable<string[]> {
    console.log("Trying " + building + " " + room + " " + role);
    return this.http.get(this.url + "/devices/" + building + "/" + room + "/" + role + "/").map(response => response.json());
  }

  getUIConfig(building: string, room: string): Observable<string> {
    return this.http.get(this.url + "/get/" + building + "/" + room).map(response => response.json());
  }
}
