import { Component, Input } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
})
export class CarListComponent {
  public fakeCars: Number[] = [];

  @Input() expandGrid: boolean | undefined;
  @Input() vehicles: Vehicle[] = [];
}
