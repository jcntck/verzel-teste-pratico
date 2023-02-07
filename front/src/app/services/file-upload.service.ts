import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  public baseApiUrl = environment.UPLOADCARE_URL;
  public token = environment.UPLOADCARE_PUB_KEY;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('UPLOADCARE_PUB_KEY', this.token);

    return this.http.post(this.baseApiUrl, formData);
  }
}
