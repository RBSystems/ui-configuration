import { Component, OnInit, Inject } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Room, Panel, UIConfig, IOConfiguration } from 'app/objects';
import { ApiService } from 'app/api.service';
import { PanelComponent } from 'app/panel/panel.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-newroom',
  templateUrl: './newroom.component.html',
  styleUrls: ['./newroom.component.css'],
  providers: [ApiService],
})
export class NewRoomComponent implements OnInit {
  room: Room = new Room();
  panelNames: string[] = [];
  config: UIConfig = new UIConfig();
  iconlist: string[];
  inputs: string[];
  displays: string[];
  audios: string[];

  constructor(private api: ApiService) {
    this.GetIconList();
    
  }

  ngOnInit(): void {

  }

  GetRoomDevices() {
    this.GetTouchPanels();
    this.GetInputDevices();
    this.GetOutputDevices();
    this.GetAudioDevices();

    console.log(this.inputs);
    console.log(this.displays);
    console.log(this.audios);
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

  FillUIConfig() {
    this.config.Api.push("localhost");
    this.config._id = this.room.Building + "-" + this.room.Room;

    this.panelNames.forEach(name => {
      var p = new Panel();
      p.Hostname = name;
      this.config.Panels.push(p);
    });

    this.inputs.forEach(input => {
      var io = new IOConfiguration();
      io.Name = input;
      
      if(input.includes("HDMI")) {
        io.Icon = "settings_input_hdmi";
      }
      else if(input.includes("VIA")) {
        io.Icon = "settings_input_antenna";
      }
      else if(input.includes("PC")) {
        io.Icon = "desktop_windows";
      }

      this.config.InputConfiguration.push(io);
    });

    this.displays.forEach(d => {
      var io = new IOConfiguration();
      io.Name = d;
      io.Icon = "tv";
      this.config.OutputConfiguration.push(io);
    });

    console.log(this.config);
  }
}
