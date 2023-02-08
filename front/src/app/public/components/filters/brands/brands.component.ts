import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Brand } from 'src/app/models/brand';
import { Model } from 'src/app/models/model';

@Component({
  selector: 'app-filter-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
})
export class FilterBrandComponent {
  @Input() brands: Brand[] | undefined;
  @Input() brandsFilter: any;

  filterModels(brand: Brand): Model[] | undefined {
    return brand.models?.filter((model) => model.vehicles?.length);
  }
}
