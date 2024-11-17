export interface Chamada {
    numero: number;
    descricao: string;
  }
  
  export interface NewVersion {
    versao: string;
    ativo: boolean;
    sistema: string;
    descricoes: string;
    chamadas: Chamada[];
  }