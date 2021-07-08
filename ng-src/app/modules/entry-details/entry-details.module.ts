import { NgModule } from '@angular/core';

import { EntryDetailsComponent } from './entry-details.component';
import { CommonModule } from '@angular/common';
import { EntryDetailsRoutingModule } from './entry-details-routing.module';
import { SharedModule } from 'App/modules/shared/shared.module';
import { TooltipModule } from 'ng2-tooltip-directive';
import { RubyComponent } from './components/ruby/ruby.component';
import { KanjiTreeComponent } from './components/kanji-tree/kanji-tree.component';

@NgModule({
  declarations: [
    EntryDetailsComponent,
    RubyComponent,
    KanjiTreeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EntryDetailsRoutingModule,
    TooltipModule,
  ],
  exports: [
    EntryDetailsComponent
  ],
  providers: [],
})
export class EntryDetailsModule { }
