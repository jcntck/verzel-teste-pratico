import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { Vehicle } from 'src/app/models/vehicle';
import { BrandsService } from 'src/app/services/brands.service';
import { VehiclesService } from 'src/app/services/vehicles.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public hiddenSidebar: boolean | undefined;

  public brands: Brand[] = [];
  public vehicles: Vehicle[] = [];

  public brandsFilter = [];
  public modelsFilter = [];

  public sortOptions = { sort: 'price', order: 'desc' };
  public search: string = '';
  public total: number | undefined;
  public currentPage: number | undefined;
  public totalPages: number | undefined;
  public limit: number = 10;
  public skip: number = 0;

  constructor(
    private vehiclesService: VehiclesService,
    private brandsService: BrandsService
  ) {}

  ngOnInit() {
    this.getVehicles(this.search, this.sortOptions);
  }

  setSidebarState(hiddenSidebar: boolean) {
    this.hiddenSidebar = hiddenSidebar;
  }

  searchData(search: string) {
    this.getVehicles(search, { sort: 'price', order: 'desc' });
    console.log(this.brandsFilter);
  }

  sortData(sortOptions: { sort: string; order: string }) {
    this.sortOptions = sortOptions;
    this.getVehicles(this.search, this.sortOptions);
  }

  updatePage(skip: number) {
    this.skip = skip;
    this.getVehicles(this.search, this.sortOptions);
  }

  getVehicles(search = '', sortOptions: { sort: string; order: string }) {
    this.vehiclesService
      .getVehicles(
        search,
        this.limit,
        this.skip,
        sortOptions.sort,
        sortOptions.order
      )
      .subscribe((response: { result: Vehicle[]; total: number }) => {
        this.vehicles = response.result;
        this.total = response.total;
        this.currentPage = this.skip / this.limit + 1;
        this.totalPages =
          response.total / this.limit < 1
            ? 1
            : Math.ceil(response.total / this.limit);

        this.getBrands();
      });
  }

  async getBrands() {
    const brands$ = this.brandsService.getBrandsWithVehicles().pipe();
    const brands = await firstValueFrom(brands$);
    this.brands = brands.filter(
      (brand) =>
        brand.models && brand.models.some((model) => model.vehicles?.length)
    );
  }
}
