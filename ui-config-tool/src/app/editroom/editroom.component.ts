import { Component, OnInit, ViewChild } from '@angular/core';

import { UIConfig, Room } from 'app/objects';
import { ApiService } from 'app/api.service';
import { PanelComponent } from 'app/panel/panel.component';


@Component({
  selector: 'app-editroom',
  templateUrl: './editroom.component.html',
  styleUrls: ['./editroom.component.css'],
  providers: [ApiService],
})
export class EditRoomComponent {
  @ViewChild(PanelComponent)
  panel: PanelComponent;
  room: Room = new Room();
  panelNames: string[] = [];
  config: UIConfig = new UIConfig();
  iconlist: string[];
  inputs: string[];
  displays: string[];
  audios: string[];
  show: boolean;
  

  constructor(private api: ApiService) {
    this.GetIconList();
    this.show = false;
    
  }

  ngOnInit(): void {

  }

  GetRoomDevices() {
    delete this.config;
    this.GetTouchPanels();
    this.GetInputDevices();
    this.GetOutputDevices();
    this.GetAudioDevices();

    console.log(this.inputs);
    console.log(this.displays);
    console.log(this.audios);

    this.getUIConfig();
    this.show = true;
  }

  GetTouchPanels() {
    this.panelNames = [];
    return this.api.getDevicesInRoomByRole(this.room.Building.toUpperCase(), this.room.Room.toUpperCase(), "ControlProcessor")
        .subscribe(val =>{
          this.panelNames = val;
          for(var i = 0; i < this.panelNames.length; i++) {
            this.panelNames[i] = this.room.Building.toUpperCase() + "-" + this.room.Room.toUpperCase() + "-" + this.panelNames[i];
          }
        });
  }

  GetInputDevices() {
    this.inputs = [];
    this.api.getDevicesInRoomByRole(this.room.Building.toUpperCase(), this.room.Room.toUpperCase(), "AudioIn")
        .subscribe(val =>{
          val.forEach(i => {
            this.inputs.push(i)
          });
        });
    
    this.api.getDevicesInRoomByRole(this.room.Building.toUpperCase(), this.room.Room.toUpperCase(), "VideoIn")
      .subscribe(val =>{
        val.forEach(i => {
          if(!this.inputs.includes(i)) {
            this.inputs.push(i)
          }
        });
      });
  }

  GetOutputDevices() {
    this.displays = [];
    this.api.getDevicesInRoomByRole(this.room.Building.toUpperCase(), this.room.Room.toUpperCase(), "VideoOut")
        .subscribe(val =>{
          val.forEach(i => {
            this.displays.push(i)
          });
        });
  }

  GetAudioDevices() {
    this.audios = [];
    this.api.getDevicesInRoomByRole(this.room.Building.toUpperCase(), this.room.Room.toUpperCase(), "Microphone")
        .subscribe(val =>{
          val.forEach(i => {
            this.audios.push(i)
          });
        });
  }

  GetIconList() {
    this.iconlist = [];
    return this.api.getIcons().subscribe(val => {
      this.iconlist = val;
    });
  }

  getUIConfig() {
    this.config = {};
    return this.api.getUIConfig(this.room.Building, this.room.Room)
        .subscribe(val =>{
          this.config = <UIConfig>val;
          console.log(this.config);
        });
  }

  Finish() {
    this.panel.Finish();
  }
}
