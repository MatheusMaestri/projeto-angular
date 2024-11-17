import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAdmin = false;
  isMobile = false;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    const usuarioEmail = localStorage.getItem('usuarioEmail');
    if (usuarioEmail) {
      this.usuarioService.getUsuarioLogado(usuarioEmail).subscribe(
        (usuario: Usuario) => {
          this.isAdmin = usuario.IsAdmin;
        },
        (error) => {
          console.error('Erro ao carregar dados do usuário logado:', error);
        }
      );
    } else {
      console.log('Usuário não está logado');
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('usuarioId');
  }
}
