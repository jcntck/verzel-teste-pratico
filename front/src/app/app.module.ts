import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AdminAlertComponent } from './admin/components/alert/alert.component';
import { AdminComponent } from './admin/pages/admin/admin.component';
import { AlertDirective } from './admin/components/alert/alert.directive';
import { AdminUsersComponent } from './admin/pages/users/users.component';
import { AppComponent } from './app.component';
import { BreadcrumbsComponent } from './public/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsItemComponent } from './public/components/breadcrumbs/item/item.component';
import { CarListComponent } from './public/components/car-list/car-list.component';
import { CarListItemComponent } from './public/components/car-list/item/item.component';
import { FilterOptionsComponent } from './public/components/filter-options/filter-options.component';
import { FilterBrandComponent } from './public/components/filters/brands/brands.component';
import { FilterBrandItemComponent } from './public/components/filters/brands/item/item.component';
import { FilterModelsComponent } from './public/components/filters/models/models.component';
import { FilterSidebarItemComponent } from './public/components/filters/sidebar/item/item.component';
import { FilterSidebarComponent } from './public/components/filters/sidebar/sidebar.component';
import { PaginationComponent } from './public/components/pagination/pagination.component';
import { SearchbarComponent } from './public/components/searchbar/searchbar.component';
import { HomeComponent } from './public/pages/home.component';
import { FooterComponent } from './public/shared/footer/footer.component';
import { NavbarComponent } from './public/shared/navbar/navbar.component';
import { AdminHeaderComponent } from './admin/shared/header/header.component';
import { AdminSidebarComponent } from './admin/shared/sidebar/sidebar.component';
import { AdminFormComponent } from './admin/components/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SearchbarComponent,
    FilterSidebarComponent,
    FilterSidebarItemComponent,
    FilterBrandComponent,
    FilterBrandItemComponent,
    FilterModelsComponent,
    BreadcrumbsComponent,
    BreadcrumbsItemComponent,
    CarListComponent,
    CarListItemComponent,
    FilterOptionsComponent,
    PaginationComponent,
    FooterComponent,
    AdminComponent,
    AdminUsersComponent,
    AdminFormComponent,
    AdminAlertComponent,
    AlertDirective,
    AdminHeaderComponent,
    AdminSidebarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'admin/usuarios', component: AdminUsersComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
