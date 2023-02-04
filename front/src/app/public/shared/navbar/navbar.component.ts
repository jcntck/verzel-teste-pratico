import { Component, HostListener } from '@angular/core';

enum screenSizes {
  sm = 576,
  md = 768,
  lg = 992,
  xl = 1200,
  '2xl' = 1400,
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  public innerWidth: any;
  public hiddenMenu: boolean = true;
  public hiddenDropdown: boolean = true;

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= screenSizes.lg) this.hiddenMenu = true;
  }

  isMobileLogo(): boolean {
    return this.innerWidth <= screenSizes.lg;
  }

  toggleMenu() {
    this.hiddenMenu = !this.hiddenMenu;
  }

  toggleDropdown() {
    this.hiddenDropdown = !this.hiddenDropdown;
  }
}
