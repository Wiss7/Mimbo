import { Pipe, PipeTransform } from '@angular/core';
import { Case } from './case.model';

@Pipe({
  name: 'casesFilter',
  pure: false,
})
export class CasesFilterPipe implements PipeTransform {
  transform(items: Case[], filter: Object): any {
    if (filter == 'All') {
      return items;
    }
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter((item) => item.isClosed == filter);
  }
}
