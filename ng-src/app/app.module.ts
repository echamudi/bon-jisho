import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './views/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdvancedSearchComponent } from './views/advanced-search/advanced-search.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BasicSearchComponent } from './views/basic-search/basic-search.component';
import { EntryDetailsComponent } from './components/entry-details/entry-details.component';

import { ElectronService } from './services/electron.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BonJishoService } from './services/bon-jisho.service';

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
    FormsModule,
    TooltipModule
  ],
  providers: [
    ElectronService,
    BonJishoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
