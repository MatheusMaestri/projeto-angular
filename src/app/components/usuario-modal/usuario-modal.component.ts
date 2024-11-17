import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-modal',
  templateUrl: './usuario-modal.component.html',
  styleUrls: ['./usuario-modal.component.css']
})
export class UsuarioModalComponent {
  usuarioForm!: FormGroup;
  @Output() adicionarUsuarioEvent = new EventEmitter<Usuario>();

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      senha: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isAdmin: [false]
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const novoUsuario: Usuario = this.usuarioForm.value;
      this.adicionarUsuarioEvent.emit(novoUsuario);
    }
  }
}
