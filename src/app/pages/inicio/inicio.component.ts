import { Component, OnInit } from '@angular/core';
import { SistemaService } from '../../services/sistema.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  sistemas = [
    { nome: 'Gestor Matriz', versaoAtual: 'Carregando...', proximaVersao: 'Carregando...', chamadasResolvidas: 0 },
    { nome: 'SH Online', versaoAtual: 'Carregando...', proximaVersao: 'Carregando...', chamadasResolvidas: 0 },
    { nome: 'App de Vendas', versaoAtual: 'Carregando...', proximaVersao: 'Carregando...', chamadasResolvidas: 0 },
  ];

  loading: boolean = true;

  constructor(private sistemaService: SistemaService) {}

  ngOnInit(): void {
    this.fetchVersoes();
  }

  fetchVersoes(): void {
    this.loading = true;
    this.sistemaService.buscarVersoes().subscribe(
      (data) => {
        this.sistemas.forEach((sistema) => {
          const sistemaData = data.filter((item) => item.Sistema === sistema.nome);

          sistemaData.forEach((item) => {
            if (item.Ativo) {
              sistema.versaoAtual = item.Versao;
              sistema.chamadasResolvidas = item.Chamadas.length;
            } else {
              sistema.proximaVersao = item.Versao;
            }
          });
        });

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Erro ao buscar as versões:', error);
      }
    );
  }
}
