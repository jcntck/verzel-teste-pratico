import { Type, ViewChild, Component } from '@angular/core';
import { AdminAlertComponent, AlertTypes } from './alert.component';
import { AlertDirective } from './alert.directive';

@Component({
  selector: 'alert',
  template: '',
})
export class DynamicAlertsComponent {
  @ViewChild(AlertDirective, { static: true })
  protected alertDirective!: AlertDirective;

  protected alert: { type: Type<AdminAlertComponent> } = {
    type: AdminAlertComponent,
  };

  createAlert(alertType: AlertTypes, message: string) {
    const viewContainerRef = this.alertDirective.viewContainerRef;
    const componentRef = viewContainerRef.createComponent<AdminAlertComponent>(
      this.alert.type
    );
    componentRef.instance.adminAlertOptions = { type: alertType, message };
    componentRef.instance.closeAlertEvent.subscribe(() =>
      componentRef.destroy()
    );
    window.setInterval(() => {
      componentRef.instance.closeAlert();
    }, 5000);
  }
}
