import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private baseUrl = 'http://localhost:8081/photo';

  constructor(private http: HttpClient, private cookieService: CookieService) {

   }

  uploadPhoto(file: File, nome: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('nome', nome);

    const accessToken = this.cookieService.get('accessToken'); 

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    headers.append('Content-Type', 'image/jpeg');

    return this.http.post('http://localhost:8081/photo/upload', formData, { headers });
  }

  downloadPhoto(nome: string, username: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('username', username);

    return this.http.post('http://localhost:8081/photo/download', formData, { responseType: 'blob'});
  }

  getImageUrlObservable(nomeStanza: string, gestore: string): Observable<string> {
    return this.downloadPhoto(nomeStanza, gestore).pipe(
      map((blob: Blob) => URL.createObjectURL(blob))
    );
  }
}