import { Component, OnInit } from '@angular/core';

import { UIConfig, Room } from 'app/objects';
import { ApiService } from 'app/api.service';
import { ControlProcessorComponent } from 'app/controlprocessor/controlprocessor.component';


@Component({
  selector: 'app-editroom',
  templateUrl: './editroom.component.html',
  styleUrls: ['./editroom.component.css'],
  providers: [ApiService],
})
export class EditRoomComponent {
  config: UIConfig;
  configFile: string;
  room: Room = new Room();

  constructor(private api: ApiService) {

  }

  ngOnInit() {

  }

  getUIConfig() {
    this.config = {};
    return this.api.getUIConfig(this.room.Building, this.room.Room)
        .subscribe(val =>{
          this.config = <UIConfig>val;
          console.log(this.config);
        });
  }

}
