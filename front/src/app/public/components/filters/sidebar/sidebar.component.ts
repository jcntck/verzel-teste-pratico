import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Brand } from 'src/app/models/brand';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class FilterSidebarComponent {
  @Input() brands: Brand[] | undefined;
  @Input() brandsFilter: any;
}
