import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { HomeComponent } from './components/home/home.component';
// import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
// import { BasicSearchComponent } from './components/basic-search/basic-search.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent
    // children: [
    //   { path: '', component: HomeComponent},
    //   { path: 'basic-search', component: BasicSearchComponent },
    //   { path: 'advanced-search', component: AdvancedSearchComponent },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
