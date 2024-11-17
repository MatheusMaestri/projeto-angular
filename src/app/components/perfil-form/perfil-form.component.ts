import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css'],
})
export class PerfilFormComponent implements OnInit, OnChanges {
  @Input() usuario!: Usuario;
  @Output() atualizarPerfilEvent = new EventEmitter<any>();

  perfilForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.usuario) {
      this.initForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.usuario) {
      this.perfilForm = this.fb.group({
        nome: [this.usuario.Nome || '', Validators.required],
        email: [this.usuario.Email || '', [Validators.required, Validators.email]],
        senha: [''],
        isAdmin: [{ value: this.usuario.IsAdmin || false, disabled: true }],
      });
    }
  }

  onSubmit(): void {
    if (this.perfilForm.valid) {
      this.atualizarPerfilEvent.emit(this.perfilForm.value);
    }
  }
}
