import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5088/Usuario/login';

  constructor(private http: HttpClient) { }

  login(loginData: { email: string; senha: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, loginData);
  }
}


