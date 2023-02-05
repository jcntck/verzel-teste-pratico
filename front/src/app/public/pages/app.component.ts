import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public hiddenSidebar: boolean | undefined;

  setSidebarState(hiddenSidebar: boolean) {
    this.hiddenSidebar = hiddenSidebar;
  }
}
