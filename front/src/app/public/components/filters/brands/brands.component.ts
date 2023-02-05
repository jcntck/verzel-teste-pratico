import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
})
export class FilterBrandComponent {
  public audiModels = [
    'A1',
    'A3',
    'A4',
    'A5',
    'A5',
    'A6',
    'Q3',
    'Q5',
    'Q7',
    'Rs Q3',
  ];

  public bmwModels = [
    '118i',
    '120i',
    '125i',
    '320i',
    '328i',
    '535i',
    '640i',
    'M 135i',
    'X1',
    'X2',
    'X3',
    'X4',
    'X5',
    'X6',
  ];
}
