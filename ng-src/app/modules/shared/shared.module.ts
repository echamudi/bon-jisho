import { NgModule } from '@angular/core';

import { ElectronService } from './services/electron.service';
import { JoinPipe } from './pipes/join.pipe';
import { GetEntitiesPipe } from './pipes/get-entities.pipe';
import { UnderscoreService } from './services/underscore.service';

@NgModule({
  declarations: [
    JoinPipe,
    GetEntitiesPipe,
  ],
  imports: [
  ],
  exports: [
    JoinPipe,
    GetEntitiesPipe,
  ],
  providers: [
    ElectronService,
    UnderscoreService,
  ],
})
export class SharedModule { }
