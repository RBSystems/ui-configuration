import { Component, OnInit, Input } from '@angular/core';
import { Panel } from '../objects';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  @Input() panel: Panel;
  constructor() { }

  ngOnInit() {
  }

  Toggle() {
    if(document.getElementById(this.panel.Hostname).className == "panel-rightarrow") {
      document.getElementById(this.panel.Hostname).className = "panel-downarrow";
      //document.getElementById('cpinfo'+this.panel.Hostname).className = "unhidden";
    }
    else if(document.getElementById(this.panel.Hostname).className == "panel-downarrow") {
      document.getElementById(this.panel.Hostname).className = "panel-rightarrow";
      //document.getElementById('cpinfo'+this.panel.Hostname).className = "hidden";
    }
  }
}
