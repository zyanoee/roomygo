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

  uploadPhoto(file: File, nome: string, indirizzo: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('nome', nome);
    formData.append('indirizzo', indirizzo);

    const accessToken = this.cookieService.get('accessToken'); 

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    headers.append('Content-Type', 'image/jpeg');

    return this.http.post('http://localhost:8081/photo/upload', formData, { headers });
  }



  getImageUrlObservable(idstanza: number, gestore: string): Observable<string[]> {
    const formData = new FormData();
    formData.append('id', idstanza + '');
    formData.append('username', gestore);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<Map<string, string[]>>('http://localhost:8081/photo/download', formData, { headers }).pipe(
      map((data: any) => {
        if (data.message != undefined) {
          console.log(data.message);
          return data.message!;
        } else {
          return [];
        }
      })
    );
  }

  getImage(id: number, username: string, photoid: number): Observable<Blob | null> {
    const formData = new FormData();
    formData.append('id', id+"");
    formData.append('username', username);
    formData.append('photoid', photoid+"");
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');


    const url = `http://localhost:8081/photo/get`;
    return this.http.post(url, formData, { headers, responseType: 'blob' });
  }

  showImage(id: number, username: string, photoid: number): Observable<string> {
    return this.getImage(id, username, photoid).pipe(
      map((blob) => {if(blob!=null) {return URL.createObjectURL(blob)} else {return ""} })
    );
  }
  

  uploadPhotoPropic(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);

    const accessToken = this.cookieService.get('accessToken'); 

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    headers.append('Content-Type', 'image/jpeg');

    return this.http.post('http://localhost:8081/photo/uploadpropic', formData, { headers });
  }

  getImagePropic(username: string): Observable<Blob | null> {
    const formData = new FormData();
    formData.append('username', username);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const url = `http://localhost:8081/photo/getpropic`;
    return this.http.post(url, formData, { headers, responseType: 'blob' });
  }

  showImagePropic(username: string,): Observable<string> {
    return this.getImagePropic(username).pipe(
      map((blob) => {if(blob!=null) {return URL.createObjectURL(blob)} else {return ""} })
    );
  }
    
}