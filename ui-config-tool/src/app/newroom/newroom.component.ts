import { Component, OnInit } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Space, ControlProcessor, Panel } from 'app/objects';
import { ApiService } from 'app/api.service';
import { ControlProcessorComponent } from 'app/controlprocessor/controlprocessor.component';

@Component({
  selector: 'app-newroom',
  templateUrl: './newroom.component.html',
  styleUrls: ['./newroom.component.css'],
  providers: [ApiService],
})
export class NewRoomComponent implements OnInit {
  space: Space;
  panelAddresses: string[] = [];
  CPList: Panel[] = [];
  TPData: any;

  constructor(private api: ApiService) {
    this.space = new Space;
  }

  ngOnInit(): void {

  }

  GetTouchPanels() {
    this.panelAddresses = [];
    this.CPList = [];
    return this.api.GetDevicesInRoomByRole(this.space.building, this.space.room, "ControlProcessor")
        .subscribe(val =>{
          this.panelAddresses = val;
          console.log(this.panelAddresses);
          for(var i = 0; i < this.panelAddresses.length; i++) {
            this.CPList[i] = new Panel();
            this.CPList[i].hostname = this.panelAddresses[i];
          }
        });
  }
}
