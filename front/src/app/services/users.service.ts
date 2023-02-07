import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiService {
  private url = `${this.base_url}/users`;

  getUsers(
    search: string = '',
    limit: number = 10,
    skip: number = 0
  ): Observable<{ result: User[]; total: number }> {
    return this.httpClient.get<{ result: User[]; total: number }>(this.url, {
      params: {
        limit,
        skip,
        search,
      },
    });
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(
      this.url,
      JSON.stringify(user),
      this.httpOptions
    );
  }

  updateUser(id: number, user: User): Observable<void> {
    return this.httpClient.put<void>(
      `${this.url}/${id}`,
      JSON.stringify(user),
      this.httpOptions
    );
  }

  checkPassword(id: number, user: User): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${this.url}/${id}/check-password`,
      JSON.stringify(user),
      this.httpOptions
    );
  }

  changePassword(id: number, body: { newPassword: string }): Observable<void> {
    return this.httpClient.patch<void>(
      `${this.url}/${id}/change-password`,
      JSON.stringify(body),
      this.httpOptions
    );
  }

  removeUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`, this.httpOptions);
  }
}

export enum UserErrorMessages {
  REPEATED_EMAIL = 'user already exists with this email',
}
