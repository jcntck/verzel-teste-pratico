import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  public baseApiUrl = 'https://upload.uploadcare.com/base/';
  public token = 'e4ad0fb1fc3e64a0bf5e';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('UPLOADCARE_PUB_KEY', this.token);

    return this.http.post(this.baseApiUrl, formData);
  }
}
