import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterdeleted',
})
export class FilterDeletedPipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items) {
      return items;
    }
    return items.filter((item) => item.isDeleted === 0);
  }
}
