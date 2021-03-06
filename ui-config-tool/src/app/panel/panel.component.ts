import { Component, OnInit, Input } from '@angular/core';
import { Panel, UIConfig, Preset, Room } from '../objects';
import { ApiService } from 'app/api.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  @Input() panel: Panel;
  @Input() config: UIConfig;
  @Input() iconlist: string[];
  @Input() indyAudio: string[];
  preset: Preset = new Preset();

  defaultMainIcon: string = "tv"
  curModalCaller: string;
  message: string;
  
  constructor(private api: ApiService) {
    
   }

  ngOnInit() {
  }

  ngOnChanges() {
    
  }

  Toggle() {
    // Turn the panel button depending on its orientation, and reveal the other info.
    if(document.getElementById(this.panel.hostname).className == "panel-rightarrow") {
      document.getElementById(this.panel.hostname).className = "panel-downarrow";
      document.getElementById('panelinfo'+this.panel.hostname).className = "unhidden";
      if(this.config.panels.length <= 1) {
        document.getElementById('preset'+this.panel.hostname).className = "unhidden";
      }
      this.UpdatePageUI();
    }
    else if(document.getElementById(this.panel.hostname).className == "panel-downarrow") {
      document.getElementById(this.panel.hostname).className = "panel-rightarrow";
      document.getElementById('panelinfo'+this.panel.hostname).className = "hidden";
    }
  }

  SlaveStatus() {
    // Assign presets and show hidden info.
    if((<HTMLInputElement>document.getElementById("slave1"+this.panel.hostname)).checked) {
      document.getElementById('master'+this.panel.hostname).className = "unhidden";
      document.getElementById('preset'+this.panel.hostname).className = "hidden";
      let m = <HTMLSelectElement>document.getElementById('mastername'+this.panel.hostname);
      let pre = m.options[m.selectedIndex];
      this.config.panels.forEach(pan => {
        if(pan.hostname == pre.value) {
          this.panel.uipath = pan.uipath
          this.panel.preset = pan.preset
          this.panel.features = pan.features
        }
      });
    }
    else {
      document.getElementById('master'+this.panel.hostname).className = "hidden";
      document.getElementById('preset'+this.panel.hostname).className = "unhidden";
    }
  }

  Sharing() {
    // Add or remove the Sharing feature.
    if((<HTMLInputElement>document.getElementById("share1"+this.panel.hostname)).checked) {
      this.panel.features[0] = "share";
    }
    else {
      delete this.panel.features[0];
    }
  }

  SwitchUIPath() {
    // Make changes that are necessary for switching UI paths.
    if(this.panel.features.includes("share") && this.panel.uipath != "/blueberry") {
      delete this.panel.features[0];
    }
  }

  LoadPreset() {
    // Load a preset already in the list of presets.
    this.config.presets.forEach(p => {
      if(p.name == this.panel.preset) {
        this.preset = p;
        return;
      }
    });

    // Add the current preset to the list.
    if(this.preset.name == null) {
      this.preset.name = this.panel.preset;
      this.config.presets.push(this.preset);

      this.config.panels.forEach(slave => {
        let m = <HTMLSelectElement>document.getElementById('mastername'+slave.hostname);
        let master = m.options[m.selectedIndex];

        let slaveButton = <HTMLInputElement>document.getElementById("slave1"+slave.hostname)

        if(this.panel.hostname == master.value && slaveButton.checked) {
          slave.uipath = this.panel.uipath
          slave.preset = this.panel.preset
          slave.features = this.panel.features
        }
      });
    }
  }
  
  IconShow(e) {
    // When the user clicks the button, open the modal
    document.getElementById('myModal'+this.panel.hostname).style.display = "block";
    this.curModalCaller = e.target.id;
  }

  closeX() {
    // When the user clicks on <span> (x), close the modal
    document.getElementById('myModal'+this.panel.hostname).style.display = "none";
  }

  closeAny(event) {
    // When the user clicks anywhere outside of the modal, close it
    if (event.target != document.getElementById('myModal'+this.panel.hostname)) {
        document.getElementById('myModal'+this.panel.hostname).style.display = "none";
    }
  }

  errorX() {
    // When the user clicks on <span> (x), close the modal
    document.getElementById("messageModal").style.display = "none";
  }

  errorCloseAny(event) {
    // When the user clicks anywhere outside of the modal, close it
    if (event.target != document.getElementById("messageModal")) {
        document.getElementById("messageModal").style.display = "none";
    }
  }

  ShowMessage(m: string) {
    // When the user clicks the button, open the modal
    this.message = m;
    document.getElementById("messageModal").style.display = "block";
  }

  changeIcon(newIcon: string) {
    // Change the Preset icon
    if(this.curModalCaller.includes("preset")) {
      this.config.presets.forEach(p => {
        if(p.name == this.panel.preset) {
          p.icon = newIcon;
        }
      });
    }
    // Change the Output icon
    else if(this.curModalCaller.includes("display")) {
      this.config.outputConfiguration.forEach(out => {
        if(out.name == this.curModalCaller.split(".")[1]) {
          out.icon = newIcon;
        }
      });
    }
    // Change the Input icon
    else if(this.curModalCaller.includes("input")) {
      this.config.inputConfiguration.forEach(input => {
        if(input.name == this.curModalCaller.split(".")[1]) {
          input.icon = newIcon;
        }
      })
    }
    // Close the modal
    document.getElementById('myModal'+this.panel.hostname).style.display = "none";
    document.getElementById(this.curModalCaller).innerHTML = newIcon;
  }

  UpdateDeviceLists(e) {
    // Update the device lists upon checking a box.
    let id = e.target.id;
    let box = <HTMLInputElement>document.getElementById(id);
    let dName = id.split(".")[2];
    this.config.presets.forEach(pre => {
      if(pre.name == this.panel.preset) {
        this.preset = pre;
      }
    });
    
    // Add to the list of displays that the preset controls
    if(id.includes("controls") && box.checked && !this.preset.displays.includes(dName)) {

      this.preset.displays.push(dName);
      let d: (string | null)[] = this.preset.displays;
      this.preset.displays = d.filter(this.notEmpty).sort(this.sortAlphaNum);

      this.preset.audioDevices.push(dName);
      let a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

      let audioBox = <HTMLInputElement>document.getElementById(this.panel.hostname+".audio."+dName);
      audioBox.checked = true;
    
    }
    // Remove from the list of displays that the preset controls
    else if(id.includes("controls") && !box.checked && this.preset.displays.includes(dName)) {
      
      delete this.preset.displays[this.preset.displays.indexOf(dName)];
      let d: (string | null)[] = this.preset.displays;
      this.preset.displays = d.filter(this.notEmpty).sort(this.sortAlphaNum);

      delete this.preset.audioDevices[this.preset.audioDevices.indexOf(dName)];
      let a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

      let audioBox = <HTMLInputElement>document.getElementById(this.panel.hostname+".audio."+dName);
      audioBox.checked = false;
    
    }
    // Add to the list of the displays that the preset can share to
    else if(id.includes("shares") && box.checked && !this.preset.shareableDisplays.includes(dName)) {
      
      this.preset.shareableDisplays.push(dName);
      let s: (string | null)[] = this.preset.shareableDisplays;
      this.preset.shareableDisplays = s.filter(this.notEmpty).sort(this.sortAlphaNum);
    
    }
    // Remove from the list of displays that the preset can share to
    else if(id.includes("shares") && !box.checked && this.preset.shareableDisplays.includes(dName)) {
      
      delete this.preset.shareableDisplays[this.preset.shareableDisplays.indexOf(dName)];
      let s: (string | null)[] = this.preset.shareableDisplays;
      this.preset.shareableDisplays = s.filter(this.notEmpty).sort(this.sortAlphaNum);
    
    }
    // Add to the list of audio devices for the preset
    else if(id.includes("audio") && box.checked && !this.preset.audioDevices.includes(dName)) {

      this.preset.audioDevices.push(dName);
      let a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Remove from the list of audio devices for the preset
    else if(id.includes("audio") && !box.checked && this.preset.audioDevices.includes(dName)) {

      delete this.preset.audioDevices[this.preset.audioDevices.indexOf(dName)];
      let a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Add to the list of independent audio devices for the preset
    else if(id.includes("independent") && box.checked && !this.preset.independentAudioDevices.includes(dName)) {

      this.preset.independentAudioDevices.push(dName);
      let i: (string | null)[] = this.preset.independentAudioDevices;
      this.preset.independentAudioDevices = i.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Remove from the list of independent audio devices for the preset
    else if(id.includes("independent") && !box.checked && this.preset.independentAudioDevices.includes(dName)) {

      delete this.preset.independentAudioDevices[this.preset.independentAudioDevices.indexOf(dName)];
      let i: (string | null)[] = this.preset.independentAudioDevices;
      this.preset.independentAudioDevices = i.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Add to the list of inputs for the preset
    else if(id.includes("input") && box.checked && !this.preset.inputs.includes(dName)) {

      this.preset.inputs.push(dName);
      let i: (string | null)[] = this.preset.inputs;
      this.preset.inputs = i.filter(this.notEmpty);

    }
    // Remove from the list of inputs for the preset
    else if(id.includes("input") && !box.checked && this.preset.inputs.includes(dName)) {

      delete this.preset.inputs[this.preset.inputs.indexOf(dName)];
      let i: (string | null)[] = this.preset.inputs;
      this.preset.inputs = i.filter(this.notEmpty);

    }
  }

  SetDefaultInput() {
    // Remove the selected device from the list of inputs and put it back at the top of the list.
    let dInputSelect = <HTMLSelectElement>document.getElementById("defaultInput"+this.panel.hostname);
    let defaultInput = dInputSelect.options[dInputSelect.selectedIndex];

    if(this.preset.inputs.includes(defaultInput.value)) {
      delete this.preset.inputs[this.preset.inputs.indexOf(defaultInput.value)];
      let i: (string | null)[] = this.preset.inputs;
      this.preset.inputs = i.filter(this.notEmpty);
    }

    this.preset.inputs.unshift(defaultInput.value);
  }


  notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    // Remove all empty and null values from the array.
    return value !== null && value !== undefined;
  }

  sortAlphaNum(a,b) {
    // Sort the array first alphabetically and then numerically.
    let reA: RegExp = /[^a-zA-Z]/g;
    let reN: RegExp = /[^0-9]/g;
    
    let aA = a.replace(reA, "");
    let bA = b.replace(reA, "");

    if(aA === bA) {
        let aN = parseInt(a.replace(reN, ""), 10);
        let bN = parseInt(b.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
  }

  FinishNew() {
    console.log("New don't work")
    // this.api.addUIConfig(this.api.room.Building, this.api.room.Room, this.config).subscribe(
    //   success => {
    //     this.ShowMessage("Successfully added new config file!");
    //   },
    //   error => {
    //     this.ShowMessage("You cannot add a new config file for this room, there is already one in the database.");
    //   });
  }

  FinishEdit() {
    console.log("Edit don't work neither")
    // this.api.updateUIConfig(this.api.room.Building, this.api.room.Room, this.config).subscribe(
    //   success => {
    //     this.ShowMessage("Successfully updated the config file!")
    //   },
    //   error => {
    //     this.ShowMessage(error);
    //   });
  }

  UpdatePageUI() {
    this.config.presets.forEach(pre => {
      if(this.panel.preset == pre.name) {
        this.preset = pre;

        if(this.preset.icon ==  null || this.preset.icon.length < 1) {
          this.preset.icon = this.defaultMainIcon;
        }

        // Check/uncheck slave buttons
        this.config.panels.some(pan => {
          if(this.panel.hostname == pan.hostname) {
            if((<HTMLInputElement>document.getElementById("slave2"+this.panel.hostname)) != null) {
              (<HTMLInputElement>document.getElementById("slave2"+this.panel.hostname)).checked = true;
              this.SlaveStatus();
            }
            return this.panel.hostname === pan.hostname;
          }
          else if(this.panel.preset == pan.preset) {
            if((<HTMLInputElement>document.getElementById("slave1"+this.panel.hostname)) != null) {
              (<HTMLInputElement>document.getElementById("slave1"+this.panel.hostname)).checked = true;
              let m = <HTMLSelectElement>document.getElementById('mastername'+this.panel.hostname);
              m.value = pan.hostname;
              this.SlaveStatus();
            }
            return this.panel.preset === pan.preset;
          }
        });
        

        // Check/uncheck display buttons
        if(this.preset.displays != null && this.preset.displays.length > 0) {
          this.preset.displays.forEach(d => {
            let id: string;
            if(this.panel.uipath == '/blueberry') {
              id = this.panel.hostname+".controls."+d;
            }
            else if(this.panel.uipath == '/cherry') {
              id = this.panel.hostname+".cherrycontrols."+d;
            }
  
            if((<HTMLInputElement>document.getElementById(id)) != null) {
              (<HTMLInputElement>document.getElementById(id)).checked = true;
            }
          });
        }
        
        // Check/uncheck sharing option and displays
        if(this.panel.features != null && this.panel.features.includes("share")) {
          if((<HTMLInputElement>document.getElementById("share1"+this.panel.hostname)) != null) {
            (<HTMLInputElement>document.getElementById("share1"+this.panel.hostname)).checked = true;

            this.preset.shareableDisplays.forEach(share => {
              let id = this.panel.hostname+".shares."+share;
  
              if((<HTMLInputElement>document.getElementById(id)) != null) {
                (<HTMLInputElement>document.getElementById(id)).checked = true;
              }
            });
          }
        }

        // Check/uncheck audio devices
        if(this.preset.audioDevices != null && this.preset.audioDevices.length > 0) {
          this.preset.audioDevices.forEach(audio => {
            let id = this.panel.hostname+".audio."+audio;
  
            if((<HTMLInputElement>document.getElementById(id)) != null) {
              (<HTMLInputElement>document.getElementById(id)).checked = true;
            }
          });
        }
        
        // Check/uncheck independent audio devices
        if(this.preset.independentAudioDevices != null && this.preset.independentAudioDevices.length > 0) {
          this.preset.independentAudioDevices.forEach(ia => {
            let id = this.panel.hostname+".independent."+ia;
  
            if((<HTMLInputElement>document.getElementById(id)) != null) {
              (<HTMLInputElement>document.getElementById(id)).checked = true;
            }
          });
        }
        
        // Check/uncheck input devices
        if(this.preset.inputs != null && this.preset.inputs.length > 0) {
          this.preset.inputs.forEach(input => {
            let id = this.panel.hostname+".input."+input;
  
            if((<HTMLInputElement>document.getElementById(id)) != null) {
              (<HTMLInputElement>document.getElementById(id)).checked = true;
            }
          });
        }
      }
    });
  }
}
