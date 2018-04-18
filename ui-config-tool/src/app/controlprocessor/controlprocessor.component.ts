import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ControlProcessor, Template, UIConfig, Panel } from 'app/objects';
import { TemplateComponent } from 'app/template/template.component';

@Component({
  selector: 'control-processor',
  templateUrl: './controlprocessor.component.html',
  styleUrls: ['./controlprocessor.component.css']
})
export class ControlProcessorComponent implements OnInit {
  @Input() cp: Panel;
  @Input() CPList: Panel[];
  @Input() config: UIConfig;
  showTemp: boolean = false;
  TC: TemplateComponent;

  constructor() {

  }

  ngOnInit() {

  }

  Toggle() {
    if(document.getElementById(this.cp.hostname).className == "cp-rightarrow") {
      document.getElementById(this.cp.hostname).className = "cp-downarrow";
      document.getElementById('cpinfo'+this.cp.hostname).className = "unhidden";
    }
    else if(document.getElementById(this.cp.hostname).className == "cp-downarrow") {
      document.getElementById(this.cp.hostname).className = "cp-rightarrow";
      document.getElementById('cpinfo'+this.cp.hostname).className = "hidden";
    }
  }

  ToggleTemplate() {
    if(document.getElementById('t'+this.cp.hostname).classList.contains("hidden")) {
      document.getElementById('t'+this.cp.hostname).className = "unhidden";
    }
    else if(document.getElementById('t'+this.cp.hostname).classList.contains("unhidden")) {
      document.getElementById('t'+this.cp.hostname).className = "hidden";
    }
  }

  SlaveStatus() {
    if((<HTMLInputElement>document.getElementById("slave1"+this.cp.hostname)).checked) {
      document.getElementById('master'+this.cp.hostname).className = "unhidden";
      document.getElementById('preset'+this.cp.hostname).className = "hidden";
    }
    else {
      document.getElementById('master'+this.cp.hostname).className = "hidden";
      document.getElementById('preset'+this.cp.hostname).className = "unhidden";
    }
  }

  ngOnChanges() {
  }
}
