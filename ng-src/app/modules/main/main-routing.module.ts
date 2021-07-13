import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { HomeComponent } from './components/home/home.component';
// import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
// import { BasicSearchComponent } from './components/basic-search/basic-search.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'home', component: MainComponent},
      { path: 'search', component: MainComponent },
      { path: 'inspect-text', component: MainComponent },
      { path: 'vocabulary-lists', component: MainComponent },
      { path: 'kanji-lists', component: MainComponent },
      { path: 'about', component: MainComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
