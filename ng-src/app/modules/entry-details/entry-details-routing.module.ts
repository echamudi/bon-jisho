import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryDetailsComponent } from './entry-details.component';

const routes: Routes = [
  {
    path: 'jmdict', component: EntryDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryDetailsRoutingModule { }
