import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { ModalComponent } from 'app/modal/modal.component';
import { Template, ControlProcessor } from 'app/objects';
import { ApiService } from 'app/api.service';

@Component({
  selector: 'ui-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  providers: [ApiService],
})
export class TemplateComponent implements OnInit {
  @Input() choice: string;
  @Input() cp: ControlProcessor;
  tInfo: Template;
  displayList: string[];
  displayAddresses: string[];
  defaultMainIcon: string = "tv"
  iconlist: string[] = [
    "tv",
    "videocam",
    "settings_input_antenna",
    "settings_input_hdmi",
    "airplay",
    "hd",
    "add_to_queue",
    "video_label",
    "wifi_tethering",
    "usb",
    "cast",
    "computer",
    "desktop_mac",
    "desktop_windows",
    "laptop_chromebook",
    "phone_android",
    "videogame_asset",
    "switch_video",
    "ondemand_video",
    "tap_and_play",
    "share"
  ];

  constructor(private api: ApiService) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.cp.configuration = new Template();
    this.cp.configuration.icon = this.defaultMainIcon;
    this.getRoomDisplays();
  }

  // When the user clicks the button, open the modal
  IconShow() {
      document.getElementById('myModal'+this.cp.hostname).style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  closeX() {
      document.getElementById('myModal'+this.cp.hostname).style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  closeAny(event) {
      if (event.target == document.getElementById('myModal'+this.cp.hostname)) {
          document.getElementById('myModal'+this.cp.hostname).style.display = "none";
      }
  }

  changeMainIcon(newIcon: string) {
    document.getElementById('myModal'+this.cp.hostname).style.display = "none";
    this.cp.configuration.icon = newIcon;
    document.getElementById('mainIcon'+this.cp.hostname).innerHTML = this.cp.configuration.icon;
  }

  getRoomDisplays() {
    this.displayList = [];
    this.displayAddresses = [];
    let spaceInfo = this.cp.hostname.split("-");
    return this.api.GetDevicesInRoomByRole(spaceInfo[0], spaceInfo[1], "VideoOut")
        .subscribe(val =>{
          this.displayAddresses = val;
          console.log(this.displayAddresses);
          for(var i = 0; i < this.displayAddresses.length; i++) {
            let displayName = this.displayAddresses[i].split("-");
            this.displayList[i] = displayName[2];
          }
          console.log(this.displayList);
        });
  }
}
