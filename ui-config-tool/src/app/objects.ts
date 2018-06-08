import { Component } from '@angular/core';

export class UIConfig   {
	_id?: 				  string
	_rev?:            string            
	Api?:                 string[] = [];     
	Panels?:              Panel[] = [];    
	Presets?:             Preset[] = [];
	InputConfiguration?:  IOConfiguration[] = [];
	OutputConfiguration?: IOConfiguration[] = [];
	AudioConfiguration?:  AudioConfiguration[] = [];
}

export class Preset   {
	Name?:                    string  
	Icon?:                    string  
	Displays?:                string[] = [];
	ShareableDisplays?:       string[] = [];
	AudioDevices?:            string[] = [];
	Inputs?:                  string[] = [];
	IndependentAudioDevices?: string[] = [];
}

export class Panel   {
	Hostname?: string   
	UIPath?:   string   
	Preset?:   string   
	Features?: string[] = [];
}

export class AudioConfiguration   {
	Display?:      string   
	AudioDevices?: string[] = [];
	RoomWide?:     boolean     
}

export class IOConfiguration   {
	Name?: string 
	Icon?: string 
}

export class Room {
	ID?:            string
	Building?: 		string
	Room?: 			string
	Template?:		string
}
