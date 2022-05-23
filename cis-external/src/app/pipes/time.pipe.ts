import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'hourpipe',
    pure: true
})
export class MinuteHourPipe implements PipeTransform {

    transform(value: number): any {
        if (value >= 0 && value / 60 < 1) {
            return value + ' Minutes';
          } else {
            return value / 60 + ' Hour';
        }
    }
}
