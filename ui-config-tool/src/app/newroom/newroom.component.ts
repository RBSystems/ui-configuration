import { Component, OnInit, Inject, Output, ViewChild, EventEmitter } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';


import { Room, Panel, UIConfig, IOConfiguration } from 'app/objects';
import { PanelComponent } from 'app/panel/panel.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newroom',
  templateUrl: './newroom.component.html',
  styleUrls: ['./newroom.component.css'],
})
export class NewRoomComponent implements OnInit {
  @ViewChild(PanelComponent)
  panel: PanelComponent;
  panelNames: string[] = [];
  config: UIConfig = new UIConfig();
  iconlist: string[];
  inputs: string[];
  displays: string[];
  audios: string[];
  showPanels: boolean;
  

  constructor(protected api: ApiService, private router: Router) {
    this.GetIconList();
    this.showPanels = false;
    if(this.api.room.Building != null && this.api.room.Room != null) {
      this.GetRoomDevices();
    }
  }

  ngOnInit(): void {

  }

  GetRoomDevices() {
    delete this.config;
    this.getUIConfig();
    // Now we get our lists of devices from the database.
    this.GetTouchPanels();
    this.GetInputDevices();
    this.GetOutputDevices();
    this.GetAudioDevices();
  }

  GetTouchPanels() {
    this.panelNames = [];
    this.api.getDevicesInRoomByRole(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase(), "ControlProcessor")
        .subscribe(val =>{
          this.panelNames = val;
          for(let i = 0; i < this.panelNames.length; i++) {
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

  GetTemplate() {
    this.showPanels = false;
    this.config = new UIConfig();
    
    if(this.api.room.Template == "Custom") {
      this.FillUIConfig();
    }
    else {
      this.api.getTemplate(this.api.room.Template).subscribe(val => {
        this.config = <UIConfig>val;
        setTimeout(() => this.FillUIConfig(), 0);
      })
    }
  }

  getUIConfig() {
    this.config = {};
    this.api.getUIConfig(this.api.room.Building.toUpperCase(), this.api.room.Room.toUpperCase())
        .subscribe(val =>{
          console.log("hello")
          this.router.navigateByUrl('editroom');
        });
  }

  FillUIConfig() {
    // Add the default information to the new UIConfig object.
    if(!this.config.api.includes("localhost")) {
      this.config.api.push("localhost");
    }
    
    this.config._id = this.api.room.Building + "-" + this.api.room.Room;

    // Add the Panels without overwriting template information.
    for(let i = 0; i < this.panelNames.length; i++) {
      if(this.api.room.Template != "Custom" && i < this.config.panels.length) {
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

    console.log("made it to the end")
    // Allow the panel list to be shown.
    this.showPanels = true;
  }
}
