import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './public/pages/app.component';
import { NavbarComponent } from './public/shared/navbar/navbar.component';
import { SearchbarComponent } from './public/components/searchbar/searchbar.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, SearchbarComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
