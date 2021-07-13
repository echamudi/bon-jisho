import { NgModule } from '@angular/core';

import { AppRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InspectTextComponent } from './components/inspect-text/inspect-text.component';
import { SearchComponent } from './components/search/search.component';
import { AboutComponent } from './components/about/about.component';

import { CommonModule } from '@angular/common';
import { SharedModule } from 'App/modules/shared/shared.module';
import { EntryDetailsModule } from 'App/modules/entry-details/entry-details.module';
import { VocabularyListsComponent } from './components/vocabulary-lists/vocabulary-lists.component';
import { KanjiListsComponent } from './components/kanji-lists/kanji-lists.component';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    SidebarComponent,
    InspectTextComponent,
    SearchComponent,
    AboutComponent,
    VocabularyListsComponent,
    KanjiListsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    EntryDetailsModule
  ],
  providers: [
  ],
})
export class MainModule { }
