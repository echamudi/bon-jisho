import { NgModule } from '@angular/core';

import { AppRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InspectTextComponent } from './components/inspect-text/inspect-text.component';
import { SearchComponent } from './components/search/search.component';
import { EntryDetailsComponent } from './components/entry-details/entry-details.component';

import { ElectronService } from './services/electron.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    SidebarComponent,
    InspectTextComponent,
    SearchComponent,
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
    // MainService
  ],
  // bootstrap: [MainComponent]
})
export class MainModule { }
