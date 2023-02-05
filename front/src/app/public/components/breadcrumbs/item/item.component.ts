import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class BreadcrumbsItemComponent {
  @Input() name: string | undefined;
}
