import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showError: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData = this.loginForm.value;
      this.loginService.login(loginData).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.mensagem) {
            localStorage.setItem('usuarioEmail', loginData.email);
            this.snackBar.open('Bem Vindo(a)!', 'Fechar', {
              duration: 4000,
              panelClass: 'custom-success-snackbar'
            });
            this.router.navigate(['../inicio']);
          } else {
            this.snackBar.open('Erro ao fazer login', 'Fechar', {
              duration: 4000,
              panelClass: 'custom-error-snackbar'
            });
          }
        },
        (error) => {
          console.error('Erro ao fazer login:', error);
          this.isLoading = false;
          this.snackBar.open('Erro ao fazer login', 'Fechar', {
            duration: 4000,
            panelClass: 'custom-error-snackbar'
          });
        }
      );
    } else {
      this.snackBar.open('Erro ao fazer login', 'Fechar', {
        duration: 4000,
        panelClass: 'custom-error-snackbar'
      });
    }
  }
}
