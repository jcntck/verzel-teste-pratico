import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Model } from 'src/app/models/model';

@Component({
  selector: 'app-filter-brands-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class FilterBrandItemComponent {
  @Input() id: number | undefined;
  @Input() name: string | undefined;
  @Input() src: string | undefined;
  @Input() models: Model[] | undefined;
  @Input() brandsFilter: any;
  // @Output() filterByModelEvent = new EventEmitter<number>();

  public hiddenModels: boolean = true;

  toggleModels() {
    if (this.hiddenModels) {
      this.brandsFilter.push(this.id);
    } else {
      this.brandsFilter = this.brandsFilter.filter(
        (brandId: number) => brandId != this.id
      );
    }
    this.hiddenModels = !this.hiddenModels;
  }

  filterByModel(modelId: number) {
    // this.filterByModelEvent.emit(modelId);
  }
}
