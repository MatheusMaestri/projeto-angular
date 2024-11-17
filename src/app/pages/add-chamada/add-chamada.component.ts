import { Component, EventEmitter, Output, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import 'bootstrap';

export interface Chamada {
  numero: number | null;
  descricao: string;
  id: number | null;
}

@Component({
  selector: 'app-add-chamada',
  templateUrl: './add-chamada.component.html',
  styleUrls: ['./add-chamada.component.css']
})
export class AddChamadaComponent implements AfterViewInit, OnChanges {
  @Input() chamada: Chamada = {
    numero: null,
    descricao: '',
    id: null
  };
  @Input() newVersion: { chamadas: Chamada[] } = { chamadas: [] };
  @Output() chamadaAdicionada = new EventEmitter<Chamada>();
  @Output() fecharModalEvent = new EventEmitter<void>();

  modalInstance: any;
  quillInstance: any;
  isSaving: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit(): void {}

  abrirModal(): void {
    const modalElement = document.getElementById('chamadaModal');
    if (modalElement) {
      this.modalInstance = new (window as any).bootstrap.Modal(modalElement);
      this.modalInstance.show();
  
      if (!this.quillInstance) {
        const quill = new (window as any).Quill('#editor-container', {
          theme: 'snow',
          placeholder: 'Descrição da Chamada',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['image']
            ]
          }
        });
        this.quillInstance = quill;
      }
  
      this.quillInstance.root.innerHTML = '';

      if (this.chamada.numero) {
        this.quillInstance.root.innerHTML = this.chamada.descricao || '';
      }
    }
  }

  fecharModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    if (this.chamada.numero && this.chamada.descricao.trim() !== '') {
      this.chamadaAdicionada.emit(this.chamada);
    }
    this.fecharModalEvent.emit();
  }

  getDescricaoChamada(): string {
    return this.quillInstance.root.innerHTML;
  }

  saveChamada(): void {
    this.chamada.descricao = this.getDescricaoChamada();
  
    if (this.chamada.numero && this.chamada.descricao.trim() !== '') {
      const chamadaExistente = this.newVersion.chamadas.find(
        (chamada) => chamada.numero === this.chamada.numero
      );
  
      if (chamadaExistente) {
        chamadaExistente.descricao = this.chamada.descricao;
        alert('Chamada atualizada com sucesso.');
      } else {
        this.chamadaAdicionada.emit(this.chamada);
      }
      
      this.fecharModal();
    } else {
      alert('Preencha todos os campos.');
    }
  }
  
}
