import { NgModule } from '@angular/core';

import { ElectronService } from './services/electron.service';
import { JoinPipe } from './pipes/join.pipe';
import { GetEntitiesPipe } from './pipes/get-entities.pipe';

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
  ],
})
export class SharedModule { }
