import { Component, OnInit } from '@angular/core';

import { UIConfig, Space } from 'app/objects';
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
  space: Space = new Space();

  constructor(private api: ApiService) {

  }

  ngOnInit() {

  }

  getUIConfig() {
    this.config = {};
    return this.api.getUIConfig(this.space.building, this.space.room)
        .subscribe(val =>{
          this.config = <UIConfig>val;
          console.log(this.config);
        });
  }

}
