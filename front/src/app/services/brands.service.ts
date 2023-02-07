import { Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandsService extends ApiService {
  private url = `${this.base_url}/brands`;

  getBrands(): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(`${this.url}/all`);
  }

  createBrand(brand: { name: string; iconPath: string }): Observable<Brand> {
    return this.httpClient.post<Brand>(
      this.url,
      JSON.stringify(brand),
      this.httpOptions
    );
  }

  updateBrand(id: number, brand: Brand): Observable<void> {
    return this.httpClient.put<void>(
      `${this.url}/${id}`,
      JSON.stringify(brand),
      this.httpOptions
    );
  }

  removeBrand(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`, this.httpOptions);
  }
}

export enum BrandErrorMessages {
  REPEATED_NAME = 'brand already exists with this name',
}
