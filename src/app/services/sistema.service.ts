import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SistemaData {
  Sistema: string;
  Versao: string;
  Ativo: boolean;
  Chamadas: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SistemaService {
  private apiUrl = 'http://localhost:5088/Documentacao';

  constructor(private http: HttpClient) {}

  buscarVersoes(): Observable<SistemaData[]> {
    return this.http.get<SistemaData[]>(this.apiUrl);
  }
}