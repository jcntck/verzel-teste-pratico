import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class FilterSidebarItemComponent {
  public hiddenAccordion: boolean = true;
  @Input() name: string | undefined;

  toggleAccordion() {
    this.hiddenAccordion = !this.hiddenAccordion;
  }
}
