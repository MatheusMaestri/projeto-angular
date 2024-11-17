import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
  }

  carregarUsuario(): void {
    const userEmail = localStorage.getItem('usuarioEmail');
    if (userEmail) {
      this.usuarioService.getUserByEmail(userEmail).subscribe(
        (usuario: Usuario) => {
          if (usuario) {
            this.usuario = usuario;
          }
        },
        (error) => {
          console.error('Erro ao carregar dados do usuário:', error);
          this.snackBar.open('Erro ao carregar dados do usuário.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    }
  }  

  atualizarPerfil(updatedData: any): void {
    if (this.usuario) {
      const usuarioAtualizado: Partial<Usuario> = { ...this.usuario, ...updatedData };
      this.usuarioService.atualizarUsuario(this.usuario.Id, usuarioAtualizado).subscribe(
        (response) => {
          console.log('Usuário atualizado com sucesso:', response);
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Erro ao atualizar usuário:', error);
          this.snackBar.open('Erro ao atualizar o perfil.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    }
  }
}
