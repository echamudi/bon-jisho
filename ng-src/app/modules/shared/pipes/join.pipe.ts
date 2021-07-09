import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'join'})
export class JoinPipe implements PipeTransform {
  transform(strings: string[] | undefined | null , seperator?: string): string {
    if (strings === undefined) return '';
    if (strings === null) return '';
    return strings.join(seperator ?? ', ');
  }
}
