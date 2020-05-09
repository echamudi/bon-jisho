import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'ng-src/app/views/home/home.component';
import { AdvancedSearchComponent } from 'ng-src/app/views/advanced-search/advanced-search.component';
import { BasicSearchComponent } from 'ng-src/app/views/basic-search/basic-search.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'basic-search', component: BasicSearchComponent},
  { path: 'advanced-search', component: AdvancedSearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
