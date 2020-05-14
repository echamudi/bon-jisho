import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './views/home/home.component';
import { SidebarComponent } from './blocks/sidebar/sidebar.component';
import { AdvancedSearchComponent } from './views/advanced-search/advanced-search.component';
import { ToolbarComponent } from './blocks/toolbar/toolbar.component';
import { BasicSearchComponent } from './views/basic-search/basic-search.component';
import { EntryDetailsComponent } from './blocks/entry-details/entry-details.component';

import { ElectronService } from './services/electron.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    AdvancedSearchComponent,
    ToolbarComponent,
    BasicSearchComponent,
    EntryDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    ElectronService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
