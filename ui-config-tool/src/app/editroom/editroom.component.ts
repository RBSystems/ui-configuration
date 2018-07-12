import { Component, OnInit, ViewChild } from '@angular/core';

import { UIConfig, Room } from 'app/objects';
import { ApiService } from 'app/api.service';
import { PanelComponent } from 'app/panel/panel.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-editroom',
  templateUrl: './editroom.component.html',
  styleUrls: ['./editroom.component.css'],
})
export class EditRoomComponent {
  @ViewChild(PanelComponent)
  panel: PanelComponent;
  panelNames: string[] = [];
  config: UIConfig = new UIConfig();
  iconlist: string[];
  inputs: string[];
  displays: string[];
  audios: string[];
  show: boolean;
  

  constructor(protected api: ApiService, private router: Router) {
    this.GetIconList();
    this.show = false;
    if(this.api.room.Building != null && this.api.room.Room != null) {
      this.GetRoomDevices();
    }
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
  }

  GetTouchPanels() {
    this.panelNames = [];
    this.api.getDevicesInRoomByRole(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase(), "ControlProcessor")
      .subscribe(val =>{
        this.panelNames = val;
        for(var i = 0; i < this.panelNames.length; i++) {
          this.panelNames[i] = this.api.room.Building.toUpperCase() + "-" + this.api.room.Room.toUpperCase() + "-" + this.panelNames[i];
        }
      });
  }

  GetInputDevices() {
    this.inputs = [];
    this.api.getDevicesInRoomByRole(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase(), "AudioIn")
        .subscribe(val =>{
          val.forEach(i => {
            this.inputs.push(i)
          });
        });
    
    this.api.getDevicesInRoomByRole(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase(), "VideoIn")
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
    this.api.getDevicesInRoomByRole(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase(), "VideoOut")
        .subscribe(val =>{
          val.forEach(i => {
            this.displays.push(i)
          });
        });
  }

  GetAudioDevices() {
    this.audios = [];
    this.api.getDevicesInRoomByRole(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase(), "Microphone")
        .subscribe(val =>{
          val.forEach(i => {
            this.audios.push(i)
          });
        });
  }

  GetIconList() {
    this.iconlist = [];
    this.api.getIcons().subscribe(val => {
      this.iconlist = val;
    });
  }

  getUIConfig() {
    this.config = {};
    this.api.getUIConfig(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase())
        .subscribe(val =>{
          this.config = <UIConfig>val;
          console.log(this.config);
          this.show = true;
        },
        error => {
          console.log("hello")
          this.router.navigateByUrl('newroom');
        });
  }
}
