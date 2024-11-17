import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface VersaoData {
  Sistema: string;
  Versao: string;
  Ativo: boolean;
  Chamadas: any[];
}

@Injectable({
  providedIn: 'root'
})
export class VersaoService {
  private apiUrl = 'http://localhost:5088/Documentacao';

  constructor(private http: HttpClient) {}

  fetchVersoes(): Observable<VersaoData[]> {
    return this.http.get<VersaoData[]>(this.apiUrl);
  }
}
