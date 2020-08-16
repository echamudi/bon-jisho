import { NgModule } from '@angular/core';

import { AppRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BasicSearchComponent } from './components/basic-search/basic-search.component';
import { EntryDetailsComponent } from './components/entry-details/entry-details.component';

import { ElectronService } from './services/electron.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BonJishoService } from './services/bon-jisho.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    SidebarComponent,
    AdvancedSearchComponent,
    ToolbarComponent,
    BasicSearchComponent,
    EntryDetailsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    TooltipModule
  ],
  providers: [
    ElectronService,
    BonJishoService
  ],
  // bootstrap: [MainComponent]
})
export class MainModule { }
