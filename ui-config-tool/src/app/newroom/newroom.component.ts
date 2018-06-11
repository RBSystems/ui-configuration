import { Component, OnInit, Inject, Output, ViewChild, EventEmitter } from '@angular/core';
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
  @ViewChild(PanelComponent)
  panel: PanelComponent;
  room: Room = new Room();
  panelNames: string[] = [];
  config: UIConfig = new UIConfig();
  iconlist: string[];
  inputs: string[];
  displays: string[];
  audios: string[];
  showPanels: boolean;
  

  constructor(private api: ApiService) {
    this.GetIconList();
    this.showPanels = false;
  }

  ngOnInit(): void {

  }

  GetRoomDevices() {
    delete this.config;
    // Now we get our lists of devices from the database.
    this.GetTouchPanels();
    this.GetInputDevices();
    this.GetOutputDevices();
    this.GetAudioDevices();
  }

  GetTouchPanels() {
    this.panelNames = [];
    this.api.getDevicesInRoomByRole(this.room.Building.toUpperCase(), this.room.Room.toUpperCase(), "ControlProcessor")
        .subscribe(val =>{
          this.panelNames = val;
          for(let i = 0; i < this.panelNames.length; i++) {
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
    this.api.getIcons().subscribe(val => {
      this.iconlist = val;
    });
  }

  GetTemplate() {
    this.showPanels = false;
    this.config = new UIConfig();
    
    if(this.room.Template == "Custom") {
      this.FillUIConfig();
    }
    else {
      this.api.getTemplate(this.room.Template).subscribe(val => {
        this.config = <UIConfig>val;
        setTimeout(() => this.FillUIConfig(), 0);
      })
    }
  }

  FillUIConfig() {
    // Add the default information to the new UIConfig object.
    if(!this.config.api.includes("localhost")) {
      this.config.api.push("localhost");
    }
    
    this.config._id = this.room.Building + "-" + this.room.Room;

    // Add the Panels without overwriting template information.
    for(let i = 0; i < this.panelNames.length; i++) {
      if(this.room.Template != "Custom" && i < this.config.panels.length) {
        this.config.panels[i].hostname = this.panelNames[i]
      }
      else {
          let p = new Panel();
          p.hostname = this.panelNames[i];
          p.preset = "";
          p.uipath = "";
          p.features = [];
          this.config.panels.push(p);
      }
    }

    // Add the Inputs without overwriting template information.
    this.inputs.forEach(input => {
      let io = new IOConfiguration();
      io.name = input;
      
      if(input.includes("HDMI")) {
        io.icon = "settings_input_hdmi";
      }
      else if(input.includes("VIA")) {
        io.icon = "settings_input_antenna";
      }
      else if(input.includes("PC")) {
        io.icon = "desktop_windows";
      }
      else {
        io.icon = "present_to_all";
      }

      this.config.inputConfiguration.push(io);
    });

    // Add the Outputs without overwriting template information.
    this.displays.forEach(d => {
      let io = new IOConfiguration();
      io.name = d;
      io.icon = "tv";
      this.config.outputConfiguration.push(io);
    });

    // Allow the panel list to be shown.
    this.showPanels = true;
  }

  Finish() {
    this.panel.Finish();
  }
}
