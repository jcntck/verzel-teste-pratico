import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleDTO } from '../dtos/vehicle.dto';
import { Vehicle } from '../models/vehicle';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService extends ApiService {
  private url = `${this.base_url}/vehicles`;

  getVehicles(
    search: string = '',
    limit: number = 10,
    skip: number = 0,
    sort: string = '',
    order: string = ''
  ): Observable<{ result: Vehicle[]; total: number }> {
    return this.httpClient.get<{ result: Vehicle[]; total: number }>(this.url, {
      params: {
        limit,
        skip,
        search,
        sort,
        order,
      },
    });
  }

  createVehicle(vehicle: VehicleDTO): Observable<Vehicle> {
    return this.httpClient.post<Vehicle>(
      this.url,
      JSON.stringify(vehicle),
      this.httpOptions
    );
  }

  updateVehicle(id: number, vehicle: VehicleDTO): Observable<void> {
    return this.httpClient.put<void>(
      `${this.url}/${id}`,
      JSON.stringify(vehicle),
      this.httpOptions
    );
  }

  removeVehicle(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`, this.httpOptions);
  }
}
