import { Pipe, PipeTransform } from '@angular/core';
import { DictSourceT } from 'Types/bon-jisho';
import { getEntities } from 'Lib/entities';
import { c } from 'Lib/const';

@Pipe({name: 'getEntities'})
export class GetEntitiesPipe implements PipeTransform {
  transform(keys: string[], dict: DictSourceT): string[] {
    if (dict === 'jmnedict') {
      return getEntities(keys, c.JMNEDICT);
    } else {
      return getEntities(keys, c.JMDICT);
    }
  }
}
