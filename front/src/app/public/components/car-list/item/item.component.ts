import { Component, Input } from '@angular/core';
import { Formatter } from 'src/app/helpers/Formatter.helper';
import { Vehicle } from 'src/app/models/vehicle';

@Component({
  selector: 'app-car-list-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class CarListItemComponent {
  @Input() vehicle!: Vehicle;

  toCurrency(value: number): string {
    return Formatter.toCurrency(value);
  }
}
