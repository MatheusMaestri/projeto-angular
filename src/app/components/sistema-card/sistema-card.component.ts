import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sistema-card',
  templateUrl: './sistema-card.component.html',
  styleUrls: ['./sistema-card.component.css']
})
export class SistemaCardComponent {
  @Input() sistemaNome: string = '';
  @Input() versaoAtual: string = 'Carregando...';
  @Input() proximaVersao: string = 'Carregando...';
  @Input() chamadasResolvidas: number = 0;
}