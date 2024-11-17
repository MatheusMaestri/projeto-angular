import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
      },
      (error) => {
        console.error('Erro ao listar usuários:', error);
        this.snackBar.open('Erro ao listar usuários.', 'Fechar', { duration: 3000 });
      }
    );
  }

  adicionarUsuario(usuario: Usuario): void {
    this.usuarioService.adicionarUsuario(usuario).subscribe(
      (response) => {
        this.snackBar.open('Usuário registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.listarUsuarios();
      },
      (error) => {
        console.error('Erro ao registrar usuário:', error);
        this.snackBar.open('Erro ao registrar usuário.', 'Fechar', { duration: 3000 });
      }
    );
  }

  removerUsuario(id: number): void {
    this.usuarioService.excluirUsuario(id).subscribe(
      () => {
        this.snackBar.open('Usuário removido com sucesso!', 'Fechar', { duration: 3000 });
        this.listarUsuarios();
      },
      (error) => {
        console.error('Erro ao remover usuário:', error);
        this.snackBar.open('Erro ao remover usuário.', 'Fechar', { duration: 3000 });
      }
    );
  }
}
