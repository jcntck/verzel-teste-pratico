import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './public/pages/app.component';
import { NavbarComponent } from './public/shared/navbar/navbar.component';
import { SearchbarComponent } from './public/components/searchbar/searchbar.component';
import { FilterSidebarComponent } from './public/components/filters/sidebar/sidebar.component';
import { FilterSidebarItemComponent } from './public/components/filters/sidebar/item/item.component';
import { FilterBrandComponent } from './public/components/filters/brands/brands.component';
import { FilterModelsComponent } from './public/components/filters/models/models.component';
import { FilterBrandItemComponent } from './public/components/filters/brands/item/item.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchbarComponent,
    FilterSidebarComponent,
    FilterSidebarItemComponent,
    FilterBrandComponent,
    FilterBrandItemComponent,
    FilterModelsComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
