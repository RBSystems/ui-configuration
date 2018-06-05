import { Component, OnInit, Inject } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Room, Panel } from 'app/objects';
import { ApiService } from 'app/api.service';
import { PanelComponent } from 'app/panel/panel.component';

@Component({
  selector: 'app-newroom',
  templateUrl: './newroom.component.html',
  styleUrls: ['./newroom.component.css'],
  providers: [ApiService],
})
export class NewRoomComponent implements OnInit {
  room: Room = new Room();
  panelAddresses: string[] = [];
  CPList: Panel[] = [];

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {

  }

  GetTouchPanels() {
    this.panelAddresses = [];
    this.CPList = [];
    return this.api.GetDevicesInRoomByRole(this.room.Building, this.room.Room, "ControlProcessor")
        .subscribe(val =>{
          this.panelAddresses = val;
          console.log(this.panelAddresses);
          for(var i = 0; i < this.panelAddresses.length; i++) {
            this.CPList[i] = new Panel();
            this.CPList[i].Hostname = this.panelAddresses[i];
          }
        });
  }
}
