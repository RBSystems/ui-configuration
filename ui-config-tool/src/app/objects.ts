import { Component } from '@angular/core';

export class Space {
  building?: string;
  room?: string;
}

export class ControlProcessor {
  constructor(hostname: string, slave: boolean) {
    this.hostname = hostname;
    this.slave = slave;
  }
  hostname: string;
  slave: boolean;
  template: string;
  configuration?: Template;
  master?: string;
}

export class Template {
  name?: string;
  icon?: string;
  displays?: string[];
  audioDevices?: string[];
  inputs?: Input[];
  indAudio?: string[];
  features?: string[];
}

export class Input {
  name: string;
  icon: string;
}

export class UIConfig {
	api?: string[];
	panels?: Panel[];
	presets?: Preset[];
	inputConfiguration?: InputConfiguration[];
	audioConfiguration?: AudioConfiguration[];
}

export class Preset {
	name?: string;
	icon?: string;
	displays?: string[];
	shareableDisplays?: string[];
	audioDevices?: string[];
	inputs?: string[];
	independentAudioDevices?: string[];
}

export class Panel {
	hostname?: string;
	uipath?: string;
	preset?: string;
	features?: string[];
}

export class AudioConfiguration {
	display?: string;
	audioDevices?: string[];
	roomWide?: boolean;
}

export class InputConfiguration {
	name?: string;
	icon?: string;
}
