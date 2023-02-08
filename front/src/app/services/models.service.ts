import { Injectable } from '@angular/core';
import { Model } from '../models/model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ModelsService extends ApiService {
  private url = `${this.base_url}/models`;

  getModels(): Observable<Model[]> {
    return this.httpClient.get<Model[]>(`${this.url}/all`);
  }

  createModel(model: { name: string; brandId: number }): Observable<Model> {
    return this.httpClient.post<Model>(
      this.url,
      JSON.stringify(model),
      this.httpOptions
    );
  }

  updateModel(
    id: number,
    model: { name: string; brandId: number }
  ): Observable<void> {
    return this.httpClient.put<void>(
      `${this.url}/${id}`,
      JSON.stringify(model),
      this.httpOptions
    );
  }

  removeModel(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`, this.httpOptions);
  }
}

export enum BrandErrorMessages {
  REPEATED_NAME = 'model already exists with this name',
}
