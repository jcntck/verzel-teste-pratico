import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AdminAlertComponent {
  @Input() adminAlertOptions!: AdminAlertOptions;
  @Output() closeAlertEvent = new EventEmitter<boolean>();

  public showAlert: boolean = true;

  closeAlert() {
    this.showAlert = false;
    window.setTimeout(() => this.closeAlertEvent.emit(false), 125);
  }
}

export enum AlertTypes {
  SUCCESS,
  ERROR,
}

export interface AdminAlertOptions {
  type: AlertTypes;
  message: string;
}
