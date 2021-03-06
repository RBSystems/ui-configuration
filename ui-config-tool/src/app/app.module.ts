import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NewRoomComponent } from './newroom/newroom.component';
import { EditRoomComponent } from './editroom/editroom.component';
import { PanelComponent } from './panel/panel.component';

import { AppComponent } from './app.component';
import { AppRouterModule } from './app-router.module';
import { ApiService } from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    NewRoomComponent,
    EditRoomComponent,
    PanelComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule,
    HttpModule,
    BrowserAnimationsModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
