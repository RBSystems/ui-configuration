import { Component, OnInit, Input } from '@angular/core';
import { Panel, UIConfig, Preset } from '../objects';
import { ApiService } from 'app/api.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  providers: [ApiService]
})
export class PanelComponent implements OnInit {
  @Input() panel: Panel;
  @Input() config: UIConfig;
  @Input() iconlist: string[];
  @Input() indyAudio: string[];
  preset: Preset;

  defaultMainIcon: string = "tv"
  curModalCaller: string;
  
  constructor(private api: ApiService) {
    this.preset = new Preset();
    this.preset.icon = this.defaultMainIcon;
   }

  ngOnInit() {
  }

  Toggle() {
    // Turn the panel button depending on its orientation, and reveal the other info.
    if(document.getElementById(this.panel.hostname).className == "panel-rightarrow") {
      document.getElementById(this.panel.hostname).className = "panel-downarrow";
      document.getElementById('panelinfo'+this.panel.hostname).className = "unhidden";
      if(this.config.panels.length <= 1) {
        document.getElementById('preset'+this.panel.hostname).className = "unhidden";
      }
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
      var m = <HTMLSelectElement>document.getElementById('mastername'+this.panel.hostname);
      var pre = m.options[m.selectedIndex];
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
        var m = <HTMLSelectElement>document.getElementById('mastername'+slave.hostname);
        var master = m.options[m.selectedIndex];

        var slaveButton = <HTMLInputElement>document.getElementById("slave1"+slave.hostname)

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
    var id = e.target.id;
    var box = <HTMLInputElement>document.getElementById(id);
    var dName = id.split(".")[2];
    this.config.presets.forEach(pre => {
      if(pre.name == this.panel.preset) {
        this.preset = pre;
      }
    });
    
    // Add to the list of displays that the preset controls
    if(id.includes("controls") && box.checked && !this.preset.displays.includes(dName)) {

      this.preset.displays.push(dName);
      var d: (string | null)[] = this.preset.displays;
      this.preset.displays = d.filter(this.notEmpty).sort(this.sortAlphaNum);

      this.preset.audioDevices.push(dName);
      var a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

      var audioBox = <HTMLInputElement>document.getElementById(this.panel.hostname+".audio."+dName);
      audioBox.checked = true;
    
    }
    // Remove from the list of displays that the preset controls
    else if(id.includes("controls") && !box.checked && this.preset.displays.includes(dName)) {
      
      delete this.preset.displays[this.preset.displays.indexOf(dName)];
      var d: (string | null)[] = this.preset.displays;
      this.preset.displays = d.filter(this.notEmpty).sort(this.sortAlphaNum);

      delete this.preset.audioDevices[this.preset.audioDevices.indexOf(dName)];
      var a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

      var audioBox = <HTMLInputElement>document.getElementById(this.panel.hostname+".audio."+dName);
      audioBox.checked = false;
    
    }
    // Add to the list of the displays that the preset can share to
    else if(id.includes("shares") && box.checked && !this.preset.shareableDisplays.includes(dName)) {
      
      this.preset.shareableDisplays.push(dName);
      var s: (string | null)[] = this.preset.shareableDisplays;
      this.preset.shareableDisplays = s.filter(this.notEmpty).sort(this.sortAlphaNum);
    
    }
    // Remove from the list of displays that the preset can share to
    else if(id.includes("shares") && !box.checked && this.preset.shareableDisplays.includes(dName)) {
      
      delete this.preset.shareableDisplays[this.preset.shareableDisplays.indexOf(dName)];
      var s: (string | null)[] = this.preset.shareableDisplays;
      this.preset.shareableDisplays = s.filter(this.notEmpty).sort(this.sortAlphaNum);
    
    }
    // Add to the list of audio devices for the preset
    else if(id.includes("audio") && box.checked && !this.preset.audioDevices.includes(dName)) {

      this.preset.audioDevices.push(dName);
      var a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Remove from the list of audio devices for the preset
    else if(id.includes("audio") && !box.checked && this.preset.audioDevices.includes(dName)) {

      delete this.preset.audioDevices[this.preset.audioDevices.indexOf(dName)];
      var a: (string | null)[] = this.preset.audioDevices;
      this.preset.audioDevices = a.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Add to the list of independent audio devices for the preset
    else if(id.includes("independent") && box.checked && !this.preset.independentAudios.includes(dName)) {

      this.preset.independentAudios.push(dName);
      var i: (string | null)[] = this.preset.independentAudios;
      this.preset.independentAudios = i.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Remove from the list of independent audio devices for the preset
    else if(id.includes("independent") && !box.checked && this.preset.independentAudios.includes(dName)) {

      delete this.preset.independentAudios[this.preset.independentAudios.indexOf(dName)];
      var i: (string | null)[] = this.preset.independentAudios;
      this.preset.independentAudios = i.filter(this.notEmpty).sort(this.sortAlphaNum);

    }
    // Add to the list of inputs for the preset
    else if(id.includes("input") && box.checked && !this.preset.inputs.includes(dName)) {

      this.preset.inputs.push(dName);
      var i: (string | null)[] = this.preset.inputs;
      this.preset.inputs = i.filter(this.notEmpty);

    }
    // Remove from the list of inputs for the preset
    else if(id.includes("input") && !box.checked && this.preset.inputs.includes(dName)) {

      delete this.preset.inputs[this.preset.inputs.indexOf(dName)];
      var i: (string | null)[] = this.preset.inputs;
      this.preset.inputs = i.filter(this.notEmpty);

    }
  }

  SetDefaultInput() {
    // Remove the selected device from the list of inputs and put it back at the top of the list.
    var dInputSelect = <HTMLSelectElement>document.getElementById("defaultInput"+this.panel.hostname);
    var defaultInput = dInputSelect.options[dInputSelect.selectedIndex];

    if(this.preset.inputs.includes(defaultInput.value)) {
      delete this.preset.inputs[this.preset.inputs.indexOf(defaultInput.value)];
      var i: (string | null)[] = this.preset.inputs;
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
    var reA: RegExp = /[^a-zA-Z]/g;
    var reN: RegExp = /[^0-9]/g;
    
    var aA = a.replace(reA, "");
    var bA = b.replace(reA, "");

    if(aA === bA) {
        var aN = parseInt(a.replace(reN, ""), 10);
        var bN = parseInt(b.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
  }

  Finish() {
    // Submit the new UIConfig file to the database.
    var location = this.config._id.split("-");
    var building = location[0];
    var room = location[1];
    this.api.updateUIConfig(building, room, this.config);
  }
}
