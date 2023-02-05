import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
})
export class CarListComponent {
  public fakeCars: Number[] = [];

  @Input() expandGrid: boolean | undefined;

  ngOnInit() {
    for (let i = 0; i < 6; i++) {
      this.fakeCars.push(i);
    }
  }
}
