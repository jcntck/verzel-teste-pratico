import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// Admin
import { AdminAlertComponent } from './admin/components/alert/alert.component';
import { AlertDirective } from './admin/components/alert/alert.directive';
import { AdminFormComponent } from './admin/components/form/form.component';
import { AdminPaginationComponent } from './admin/components/pagination/pagination.component';
import { AdminLoginComponent } from './admin/pages/login/login.component';
import { AdminUsersComponent } from './admin/pages/users/users.component';
import { AdminVehiclesComponent } from './admin/pages/vehicles/vehicles.component';
import { AdminHeaderComponent } from './admin/shared/header/header.component';
import { AdminSidebarComponent } from './admin/shared/sidebar/sidebar.component';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';

// Public
import { BreadcrumbsComponent } from './public/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsItemComponent } from './public/components/breadcrumbs/item/item.component';
import { CarListComponent } from './public/components/car-list/car-list.component';
import { CarListItemComponent } from './public/components/car-list/item/item.component';
import { FilterOptionsComponent } from './public/components/filter-options/filter-options.component';
import { FilterBrandComponent } from './public/components/filters/brands/brands.component';
import { FilterBrandItemComponent } from './public/components/filters/brands/item/item.component';
import { FilterSidebarItemComponent } from './public/components/filters/sidebar/item/item.component';
import { FilterSidebarComponent } from './public/components/filters/sidebar/sidebar.component';
import { PaginationComponent } from './public/components/pagination/pagination.component';
import { SearchbarComponent } from './public/components/searchbar/searchbar.component';
import { HomeComponent } from './public/pages/home.component';
import { FooterComponent } from './public/shared/footer/footer.component';
import { NavbarComponent } from './public/shared/navbar/navbar.component';

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
    BreadcrumbsComponent,
    BreadcrumbsItemComponent,
    CarListComponent,
    CarListItemComponent,
    FilterOptionsComponent,
    PaginationComponent,
    FooterComponent,
    AdminUsersComponent,
    AdminFormComponent,
    AdminAlertComponent,
    AlertDirective,
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminVehiclesComponent,
    AdminPaginationComponent,
    AdminLoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
