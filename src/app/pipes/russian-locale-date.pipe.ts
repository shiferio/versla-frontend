import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'russianLocaleDate'
})
export class RussianLocaleDatePipe implements PipeTransform {

  transform(value: string): string {
    let date = null;
    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

}
