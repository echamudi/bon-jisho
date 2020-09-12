import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'join'})
export class JoinPipe implements PipeTransform {
  transform(strings: string[], seperator?: string): string {
    return strings.join(seperator ?? ', ');
  }
}
