import { Component } from '@angular/core';

export class UIConfig   {
	_id?: 				  string
	_rev?:            string            
	api?:                 string[] = [];     
	panels?:              Panel[] = [];    
	presets?:             Preset[] = [];
	inputConfiguration?:  IOConfiguration[] = [];
	outputConfiguration?: IOConfiguration[] = [];
	audioConfiguration?:  AudioConfiguration[] = [];
}

export class Preset   {
	name?:                    string  
	icon?:                    string  
	displays?:                string[] = [];
	shareableDisplays?:       string[] = [];
	audioDevices?:            string[] = [];
	inputs?:                  string[] = [];
	independentAudioDevices?: string[] = [];
}

export class Panel   {
	hostname?: string   
	uipath?:   string   
	preset?:   string   
	features?: string[] = [];
}

export class AudioConfiguration   {
	display?:      string   
	audioDevices?: string[] = [];
	roomWide?:     boolean     
}

export class IOConfiguration   {
	name?: string 
	icon?: string 
}

export class Room {
	ID?:            string
	Building?: 		string
	Room?: 			string
	Template?:		string
}
