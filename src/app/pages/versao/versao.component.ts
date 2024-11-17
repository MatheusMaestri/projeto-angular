import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


export interface VersaoElement {
  id: number;
  versao: string;
  descricao: string;
  chamadasResolvidas: number;
}

export interface NewVersion {
  versao: string;
  ativo: boolean;
  sistema: string;
  descricoes: string;
  chamadas: Chamada[];
}

export interface Chamada {
  numero: number;
  descricao: string;
}

@Component({
  selector: 'app-versao',
  templateUrl: './versao.component.html',
  styleUrls: ['./versao.component.css']
})
export class VersaoComponent implements AfterViewInit {
  displayedColumns: string[] = ['versao', 'descricao', 'chamadasResolvidas', 'actions'];

  dataSourceGM = new MatTableDataSource<VersaoElement>([]);
  dataSourceSH = new MatTableDataSource<VersaoElement>([]);
  dataSourceAP = new MatTableDataSource<VersaoElement>([]);

  selectedVersion: any = null;
  selectedChamada: any = null; 
  quillViewerInstance: any;
  modalInstance: any;
  isEditing: boolean = false;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginatorGM!: MatPaginator;
  @ViewChild('paginatorSH') paginatorSH!: MatPaginator;
  @ViewChild('paginatorAP') paginatorAP!: MatPaginator;

  newVersion: NewVersion = {
    versao: '',
    ativo: true,
    sistema: '',
    descricoes: '',
    chamadas: []
  };

  element: any;
  versao: any;

  constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService) {}

  ngAfterViewInit() {
    this.dataSourceGM.paginator = this.paginatorGM;
    this.dataSourceSH.paginator = this.paginatorSH;
    this.dataSourceAP.paginator = this.paginatorAP;

    this.fetchVersoes();
    this.checkAdminStatus();

    this.quillViewerInstance = new (window as any).Quill('#descricaoChamada', {
      theme: 'snow',
      readOnly: true,
      modules: { toolbar: false }
    });
  }

  checkAdminStatus(): void {
    const usuarioEmail = localStorage.getItem('usuarioEmail');
    if (usuarioEmail) {
      this.usuarioService.getUsuarioLogado(usuarioEmail).subscribe(
        (usuario) => {
          this.isAdmin = usuario.IsAdmin;
        },
        (error) => {
          console.error('Erro ao verificar o status do administrador:', error);
        }
      );
    }
  }

  fetchVersoes(): void {
    this.http.get<any[]>('http://localhost:5088/Documentacao')
      .pipe(
        map(data => data.map(item => ({
          id: item.Id,
          versao: item.Versao,
          descricao: item.Descricoes,
          chamadasResolvidas: item.Chamadas.length,
          sistema: item.Sistema,
          chamadas: item.Chamadas
        })))
      )
      .subscribe((data: any[]) => {
        const reversedData = data.reverse();
        this.dataSourceGM.data = reversedData.filter(item => item.sistema === 'Gestor Matriz');
        this.dataSourceSH.data = reversedData.filter(item => item.sistema === 'SH Online');
        this.dataSourceAP.data = reversedData.filter(item => item.sistema === 'App de Vendas');
      });
  }

  verDescricaoChamada(chamada: any): void {
    this.selectedChamada = chamada;
    if (this.quillViewerInstance) {
      this.quillViewerInstance.root.innerHTML = chamada.Descricao || 'Selecione uma chamada.';
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.selectedChamada = null;
      this.quillViewerInstance.root.innerHTML = 'Selecione uma chamada.';
    }
  }

  verVersao(element: any): void {
    this.selectedVersion = element;
    this.selectedChamada = null;
    const modalElement = document.getElementById('myModal');
    this.modalInstance = new (window as any).bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  editar(element: any): void {
    if (this.selectedVersion === element && this.isEditing) {
      this.isEditing = false;
    } else {
      this.selectedVersion = element;
      this.isEditing = true;
    }
  }

  editarVersao(element: VersaoElement): void {
    console.log('Editar versão ID:', element.id);
  
    this.selectedVersion = { ...element };
  
    this.router.navigate(['/add-versao', element.id], { state: { version: element } });
  }

  excluir(element: any): void {
    this.http.delete(`http://localhost:5088/Documentacao/${element.sistema}/${element.versao}`).subscribe(
      response => {
        const index = this.dataSourceGM.data.indexOf(element);
        if (index >= 0) {
          this.dataSourceGM.data.splice(index, 1);
          this.dataSourceGM._updateChangeSubscription();
        }
        alert('Versão excluída com sucesso!');
      },
      error => {
        console.error('Erro ao excluir a versão:', error);
        alert('Erro ao excluir a versão.');
      }
    );
  }
}

