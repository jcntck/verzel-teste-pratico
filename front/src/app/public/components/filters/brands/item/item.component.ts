import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-brands-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class FilterBrandItemComponent {
  @Input() name: string | undefined;
  @Input() src: string | undefined;
  @Input() models: string[] | undefined;

  public hiddenModels: boolean = true;

  toggleModels() {
    this.hiddenModels = !this.hiddenModels;
  }
}
