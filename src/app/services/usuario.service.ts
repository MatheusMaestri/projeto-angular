import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5088/Usuario';

  constructor(private http: HttpClient) {}

  getUsuarioLogado(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${email}`);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  adicionarUsuario(usuario: Usuario): Observable<Usuario> { 
    return this.http.post<Usuario>(`${this.apiUrl}/registrar`, usuario); 
  }

  atualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${email}`);
  }  
}
