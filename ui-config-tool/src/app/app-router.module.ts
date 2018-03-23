import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewRoomComponent } from './newroom/newroom.component';
import { EditRoomComponent } from './editroom/editroom.component';

const routes: Routes = [
  { path: '', redirectTo: '/newroom', pathMatch: 'full' },
  { path: 'newroom', component: NewRoomComponent },
  { path: 'editroom', component: EditRoomComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
