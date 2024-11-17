import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AddChamadaComponent } from '../add-chamada/add-chamada.component';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Chamada {
  numero: number | null;
  descricao: string;
  id: number | null;
}

export interface NewVersion {
  versao: string;
  ativo: boolean;
  sistema: string;
  descricoes: string;
  chamadas: Chamada[];
}

@Component({
  selector: 'app-add-nova-versao',
  templateUrl: './add-nova-versao.component.html',
  styleUrls: ['./add-nova-versao.component.css']
})
export class AddNovaVersaoComponent implements OnInit, AfterViewInit {

  @ViewChild(AddChamadaComponent) chamadaComponent!: AddChamadaComponent;

  chamada: Chamada = {
    numero: 0, 
    descricao: '',
    id: null
  };

  newVersion: NewVersion = {
    versao: '',
    ativo: true,
    sistema: '',
    descricoes: '',
    chamadas: []
  };

  selectedChamada: Chamada | null = null;
  modalAberto: boolean = false;
  versionId: number | null = null;
  isLoading = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.versionId = +params['id'];
      if (this.versionId) {
        this.getVersionById(this.versionId);
      }
    });
  }

  ngAfterViewInit() {}

  getVersionById(id: number): void {
    this.http.get(`http://localhost:5088/Documentacao/${id}`).subscribe(
      (data: any) => {
        this.newVersion = {
          versao: data.Versao,
          ativo: data.Ativo,
          sistema: data.Sistema,
          descricoes: data.Descricoes.join('\n'),
          chamadas: data.Chamadas.map((chamada: any) => ({
            id: chamada.Id,
            numero: chamada.Numero,
            descricao: chamada.Descricao
          }))
        };
      },
      error => {
        console.error('Erro ao carregar versão:', error);
        alert('Erro ao carregar versão.');
      }
    );
  }

  openAddChamadaModal(): void {
    this.chamadaComponent.newVersion = this.newVersion;
    this.chamadaComponent.chamada = this.selectedChamada || { numero: null, descricao: '', id: null };
    this.chamadaComponent.abrirModal();
  }

  adicionarChamada(chamada: Chamada): void {
    const chamadaExistente = this.newVersion.chamadas.some(
      (chamadaExistente) => chamadaExistente.numero === chamada.numero
    );
  
    if (!chamadaExistente) {
      this.newVersion.chamadas.push(chamada);
    } else {
      console.log('Já existe uma chamada com este número.');
    }
  }

  onSubmit(): void {
    this.isLoading = true;

    const payload = {
      Versao: this.newVersion.versao,
      Descricoes: this.newVersion.descricoes.split('\n'),
      Ativo: this.newVersion.ativo,
      Chamadas: this.newVersion.chamadas.map(chamada => ({
        Id: chamada.id || 0,
        Numero: chamada.numero,
        Descricao: chamada.descricao
      })),
      Sistema: this.newVersion.sistema
    };

    console.log("Payload enviado:", JSON.stringify(payload, null, 2));

    this.http.get(`http://localhost:5088/Documentacao/${this.newVersion.sistema}/${this.newVersion.versao}`)
      .subscribe(
        (response: any) => {
          console.log('Resposta completa do GET:', response);

          if (response && response.Versao) {
            console.log('Executando PUT para atualizar a versão.');
            this.http.put(`http://localhost:5088/Documentacao/${response.Versao}`, payload)
              .subscribe(
                response => {
                  console.log('Resposta do servidor (PUT):', response);
                  this.snackBar.open('Versão atualizada com sucesso!', 'Fechar', { duration: 4000 });
                  this.router.navigate(['/versao']);
                  this.isLoading = false;
                },
                error => {
                  console.error('Erro ao atualizar versão:', error);
                  this.snackBar.open('Erro ao atualizar versão.', 'Fechar', { duration: 4000 });
                  this.isLoading = false;
                }
              );
          } else {
            console.log('Resposta do GET não contém a propriedade "Versao".');
            this.isLoading = false;
          }
        },
        error => {
          console.error('Erro ao verificar existência da versão:', error);
          if (error.status === 404) {
            console.log('Versão não encontrada. Executando POST para adicionar nova versão.');
            this.http.post('http://localhost:5088/Documentacao', payload)
              .subscribe(
                response => {
                  console.log('Resposta do servidor (POST):', response);
                  this.snackBar.open('Versão adicionada com sucesso!', 'Fechar', { duration: 4000 });
                  this.router.navigate(['/versao']);
                  this.isLoading = false;
                },
                error => {
                  console.error('Erro ao adicionar versão (detalhes do erro):', error.error);
                  this.snackBar.open('Erro ao adicionar versão. Verifique os dados e tente novamente.', 'Fechar', { duration: 4000 });
                  this.isLoading = false;
                }
              );
          } else {
            this.snackBar.open('Erro ao verificar existência da versão.', 'Fechar', { duration: 4000 });
            this.isLoading = false;
          }
        }
      );
  }
  

  openChamadaOptions(chamada: Chamada): void {
    this.selectedChamada = chamada;
    const modalElement = document.getElementById('chamadaOptionsModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  removeChamada(chamada: Chamada): void {
    this.newVersion.chamadas = this.newVersion.chamadas.filter(c => c.numero !== chamada.numero);
    this.selectedChamada = null;
  }
  

  goBack(): void {
    this.router.navigate(['/versao']);
  }
}
