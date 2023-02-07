import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public hiddenSidebar: boolean | undefined;

  setSidebarState(hiddenSidebar: boolean) {
    this.hiddenSidebar = hiddenSidebar;
  }
}
