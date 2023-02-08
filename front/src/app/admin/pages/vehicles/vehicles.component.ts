import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vehicle } from 'src/app/models/vehicle';
import { BrandsService } from 'src/app/services/brands.service';

import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { VehicleDTO } from 'src/app/dtos/vehicle.dto';
import { Brand } from 'src/app/models/brand';
import { Model } from 'src/app/models/model';
import { ModelsService } from 'src/app/services/models.service';
import { VehiclesService } from 'src/app/services/vehicles.service';
import { AlertTypes } from '../../components/alert/alert.component';
import { DynamicAlertsComponent } from '../../components/alert/dynamicAlerts.component';
import { FormTypes } from '../../components/form/enums/form-types.enum';
import { AdminFormFields } from '../../components/form/interfaces/form.interface';
import { Formatter } from 'src/app/helpers/Formatter.helper';

@Component({
  selector: 'app-admin-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
})
export class AdminVehiclesComponent extends DynamicAlertsComponent {
  public vehicle = {} as Vehicle;

  public brands: Brand[] | undefined;
  public models: Model[] | undefined;
  public vehicles: Vehicle[] | undefined;

  public search: string = '';
  public total: number | undefined;
  public currentPage: number | undefined;
  public totalPages: number | undefined;
  public limit: number = 10;
  public skip: number = 0;

  public hiddenSidebar: boolean = false;
  public hiddenTable: boolean = false;

  public formTitle: string = 'Cadastro de veículos';
  public formType: FormTypes = FormTypes.CREATE;
  public hiddenForm: boolean = true;

  public formFields: AdminFormFields[] = [];

  constructor(
    private brandsService: BrandsService,
    private modelsService: ModelsService,
    private vehiclesService: VehiclesService
  ) {
    super();
  }

  ngOnInit() {
    this.getVehicles();
  }

  toggleSidebar(hiddenSidebar: boolean) {
    this.hiddenSidebar = hiddenSidebar;
  }

  hiddenVehicleForm() {
    this.hiddenForm = true;
    this.hiddenTable = false;
    this.vehicle = {} as Vehicle;
  }

  async openVehicleForm(vehicle?: Vehicle) {
    await this.getBrands();
    await this.getModels();

    if (vehicle) {
      this.formType = FormTypes.EDIT;
      this.formTitle = 'Editar veículo';
      this.vehicle = vehicle;
    } else {
      this.formTitle = 'Cadastro de veículos';
      this.formType = FormTypes.CREATE;
    }

    this.formFields = [
      {
        label: 'Icone da marca:',
        prefix: 'brand',
        name: 'iconPath',
        type: 'file',
        value: this.vehicle.model?.brand?.iconPath || '',
        required: false,
      },
      {
        label: 'Marca do veículo:',
        prefix: 'brand',
        name: 'name',
        required: true,
        type: 'select',
        id: this.vehicle.model?.brand?.id || null,
        value: this.vehicle.model?.brand?.name || '',
        placeholder: 'Digite o nome da marca do veículo ...',
        options: this.brands,
        filteredOptions: this.brands,
        hiddenOptions: true,
      },
      {
        label: 'Modelo do veículo:',
        prefix: 'model',
        name: 'name',
        required: true,
        type: 'select',
        id: this.vehicle.model?.id || null,
        value: this.vehicle.model?.name || '',
        placeholder: 'Digite o nome do modelo do veículo ...',
        options: this.models,
        filteredOptions: this.models,
        hiddenOptions: true,
        filterBy: 'brand',
      },
      {
        label: 'Nome do veículo:',
        prefix: 'vehicle',
        name: 'name',
        required: true,
        type: 'text',
        value: this.vehicle.name || '',
        placeholder: 'Digite o nome do veículo ...',
      },
      {
        label: 'Valor do veículo:',
        prefix: 'vehicle',
        name: 'price',
        required: true,
        type: 'number',
        value: this.vehicle.price || '',
        placeholder: 'Digite o valor do veículo ...',
      },
      {
        label: 'Foto do veículo:',
        prefix: 'vehicle',
        name: 'photoPath',
        required: true,
        type: 'file',
        value: this.vehicle.photoPath || '',
      },
    ];

    this.hiddenTable = true;
    this.hiddenForm = false;
  }

  onSearchVehicles(event: any) {
    this.search = event.target.value;
    this.skip = 0;
    this.getVehicles(this.search);
  }

  updatePage(skip: number) {
    this.skip = skip;
    this.getVehicles(this.search);
  }

  toCurrency(value: number) {
    return Formatter.toCurrency(value);
  }

  async createBrandIfNotExists(value: any) {
    if (!value['brand.id']) {
      const brand$ = this.brandsService
        .createBrand({
          name: value['brand.name'],
          iconPath: value['brand.iconPath'],
        })
        .pipe();
      return (await firstValueFrom(brand$)).id;
    } else {
      const brand$ = this.brandsService
        .updateBrand(Number(value['brand.id']), {
          name: value['brand.name'],
          iconPath: value['brand.iconPath'],
        })
        .pipe();
      await firstValueFrom(brand$);
    }
    return value['brand.id'];
  }

  async createModelIfNotExists(value: any) {
    if (!value['model.id']) {
      const model$ = this.modelsService
        .createModel({
          name: value['model.name'],
          brandId: Number(value['brand.id']),
        })
        .pipe();
      return (await firstValueFrom(model$)).id;
    }
    return value['model.id'];
  }

  async prepareData(value: any): Promise<VehicleDTO> {
    value['brand.id'] = await this.createBrandIfNotExists(value);
    value['model.id'] = await this.createModelIfNotExists(value);

    const vehicle: VehicleDTO = {
      name: value['vehicle.name'],
      price: Number(value['vehicle.price']),
      photoPath: value['vehicle.photoPath'] || null,
      modelId: Number(value['model.id']),
    };

    return vehicle;
  }

  async createVehicle(form: NgForm) {
    const { value } = form;
    const vehicle = await this.prepareData(value);

    this.vehiclesService.createVehicle(vehicle).subscribe({
      complete: () => {
        this.handleVehicleSuccess('Veículo criado com sucesso', form);
      },
      error: (httpErrorResponse: HttpErrorResponse) =>
        this.handleVehicleErrors(httpErrorResponse),
    });
  }

  async editVehicle(form: NgForm) {
    const { value } = form;

    const vehicle = await this.prepareData(value);

    this.vehiclesService.updateVehicle(this.vehicle.id, vehicle).subscribe({
      complete: () => {
        this.handleVehicleSuccess('Veículo atualizado com sucesso', form);
      },
      error: (httpErrorResponse: HttpErrorResponse) =>
        this.handleVehicleErrors(httpErrorResponse),
    });
  }

  removeVehicle(vehicle: Vehicle) {
    this.vehiclesService.removeVehicle(vehicle.id).subscribe({
      complete: () => {
        this.handleVehicleSuccess('Veículo removido com sucesso');
      },
      error: (httpErrorResponse: HttpErrorResponse) =>
        this.handleVehicleErrors(httpErrorResponse),
    });
  }

  submitForm(form: NgForm) {
    if (this.formType == FormTypes.EDIT) {
      this.editVehicle(form);
    } else {
      this.createVehicle(form);
    }
  }

  cleanForm(form: NgForm) {
    form.resetForm();
    this.hiddenVehicleForm();
  }

  handleVehicleSuccess(message: string, form?: NgForm) {
    this.createAlert(AlertTypes.SUCCESS, message);
    if (form) this.cleanForm(form);
    this.getVehicles();
  }

  handleVehicleErrors(httpErrorResponse: HttpErrorResponse) {
    const { error } = httpErrorResponse;
    if (error.status == 500) {
      this.createAlert(
        AlertTypes.ERROR,
        'Ocorreu um erro ao tentar executar esta ação, por favor contacte o suporte!'
      );
    }
  }

  async getBrands() {
    const brands$ = this.brandsService.getBrands().pipe();
    this.brands = await firstValueFrom(brands$);
  }

  async getModels() {
    const brands$ = this.modelsService.getModels().pipe();
    this.models = await firstValueFrom(brands$);
  }

  getVehicles(search = '') {
    this.vehiclesService
      .getVehicles(search, this.limit, this.skip)
      .subscribe((response: { result: Vehicle[]; total: number }) => {
        this.vehicles = response.result;
        this.total = response.total;
        this.currentPage = this.skip / this.limit + 1;
        this.totalPages =
          response.total / this.limit < 1
            ? 1
            : Math.ceil(response.total / this.limit);
      });
  }
}
