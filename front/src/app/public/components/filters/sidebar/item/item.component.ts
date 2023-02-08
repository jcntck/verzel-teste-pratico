import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Brand } from 'src/app/models/brand';

@Component({
  selector: 'app-filter-sidebar-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class FilterSidebarItemComponent {
  public hiddenAccordion: boolean = true;
  @Input() name: string | undefined;
  @Input() brands: Brand[] | undefined;
  @Input() brandsFilter: any;

  toggleAccordion() {
    this.hiddenAccordion = !this.hiddenAccordion;
  }
}
