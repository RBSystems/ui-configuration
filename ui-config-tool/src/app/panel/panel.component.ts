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
  preset: Preset = new Preset();

  defaultMainIcon: string = "tv"
  curModalCaller: string;
  
  constructor(private api: ApiService) {
    this.preset.Icon = this.defaultMainIcon;
   }

  ngOnInit() {
  }

  Toggle() {
    if(document.getElementById(this.panel.Hostname).className == "panel-rightarrow") {
      document.getElementById(this.panel.Hostname).className = "panel-downarrow";
      document.getElementById('panelinfo'+this.panel.Hostname).className = "unhidden";
      if(this.config.Panels.length <= 1) {
        document.getElementById('preset'+this.panel.Hostname).className = "unhidden";
      }
    }
    else if(document.getElementById(this.panel.Hostname).className == "panel-downarrow") {
      document.getElementById(this.panel.Hostname).className = "panel-rightarrow";
      document.getElementById('panelinfo'+this.panel.Hostname).className = "hidden";
    }
  }

  SlaveStatus() {
    if((<HTMLInputElement>document.getElementById("slave1"+this.panel.Hostname)).checked) {
      document.getElementById('master'+this.panel.Hostname).className = "unhidden";
      document.getElementById('preset'+this.panel.Hostname).className = "hidden";
      var m = <HTMLSelectElement>document.getElementById('mastername'+this.panel.Hostname);
      var pre = m.options[m.selectedIndex];
      this.config.Panels.forEach(pan => {
        if(pan.Hostname == pre.value) {
          this.panel.UIPath = pan.UIPath
          this.panel.Preset = pan.Preset
          this.panel.Features = pan.Features
        }
      });
    }
    else {
      document.getElementById('master'+this.panel.Hostname).className = "hidden";
      document.getElementById('preset'+this.panel.Hostname).className = "unhidden";
    }
  }

  Sharing() {
    if((<HTMLInputElement>document.getElementById("share1"+this.panel.Hostname)).checked) {
      this.panel.Features[0] = "share";
      console.log(this.config)
    }
    else {
      delete this.panel.Features[0];
      console.log(this.config)
    }

    if(this.panel.Features.includes("share") && this.panel.UIPath != "/blueberry") {
      delete this.panel.Features[0];
    }
  }

  LoadPreset() {
    this.config.Presets.forEach(p => {
      if(p.Name == this.panel.Preset) {
        this.preset = p;
        console.log(this.config);
        return;
      }
    });

    if(this.preset.Name == null) {
      this.preset.Name = this.panel.Preset;
      this.config.Presets.push(this.preset);

      this.config.Panels.forEach(slave => {
        var m = <HTMLSelectElement>document.getElementById('mastername'+slave.Hostname);
        var master = m.options[m.selectedIndex];

        var slaveButton = <HTMLInputElement>document.getElementById("slave1"+slave.Hostname)

        if(this.panel.Hostname == master.value && slaveButton.checked) {
          slave.UIPath = this.panel.UIPath
          slave.Preset = this.panel.Preset
          slave.Features = this.panel.Features
        }
      });
      console.log(this.config);
    }
  }

  

  // When the user clicks the button, open the modal
  IconShow(e) {
      document.getElementById('myModal'+this.panel.Hostname).style.display = "block";
      console.log(e.target.id);
      this.curModalCaller = e.target.id;
  }

  // When the user clicks on <span> (x), close the modal
  closeX() {
      document.getElementById('myModal'+this.panel.Hostname).style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  closeAny(event) {
      if (event.target == document.getElementById('myModal'+this.panel.Hostname)) {
          document.getElementById('myModal'+this.panel.Hostname).style.display = "none";
      }
  }

  changeIcon(newIcon: string) {
    if(this.curModalCaller.includes("preset")) {
      this.config.Presets.forEach(p => {
        if(p.Name == this.panel.Preset) {
          p.Icon = newIcon;
        }
      });
    }
    else if(this.curModalCaller.includes("display")) {
      this.config.OutputConfiguration.forEach(out => {
        if(out.Name == this.curModalCaller.split(".")[1]) {
          out.Icon = newIcon;
        }
      });
    }
    document.getElementById('myModal'+this.panel.Hostname).style.display = "none";
    document.getElementById(this.curModalCaller).innerHTML = newIcon;
  }

  UpdateDisplays(e) {
    var id = e.target.id;
    var box = <HTMLInputElement>document.getElementById(id);
    var dName = id.split(".")[2];
    this.config.Presets.forEach(pre => {
      if(pre.Name == this.panel.Preset) {
        this.preset = pre;
      }
    });
    

    if(id.includes("controls") && box.checked && !this.preset.Displays.includes(dName)) {
      this.preset.Displays.push(dName);
    }
    else if(id.includes("controls") && !box.checked && this.preset.Displays.includes(dName)) {
      delete this.preset.Displays[this.preset.Displays.indexOf(dName)];
    }
    else if(id.includes("shares") && box.checked && !this.preset.ShareableDisplays.includes(dName)) {
      this.preset.ShareableDisplays.push(dName);
    }
    else if(id.includes("shares") && !box.checked && this.preset.ShareableDisplays.includes(dName)) {
      delete this.preset.ShareableDisplays[this.preset.ShareableDisplays.indexOf(dName)];
    }

    var d: (string | null)[] = this.preset.Displays;
    var s: (string | null)[] = this.preset.ShareableDisplays;

    this.preset.Displays = d.filter(this.notEmpty).sort(this.sortAlphaNum);
    this.preset.ShareableDisplays = s.filter(this.notEmpty).sort(this.sortAlphaNum);

    console.log(this.config);
  }

  notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  sortAlphaNum(a,b) {
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
}
