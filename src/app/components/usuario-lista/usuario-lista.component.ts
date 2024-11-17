import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent {
  @Input() usuarios: Usuario[] = [];
  @Output() removerUsuarioEvent = new EventEmitter<number>();

  removerUsuario(id: number): void {
    this.removerUsuarioEvent.emit(id);
  }
}
