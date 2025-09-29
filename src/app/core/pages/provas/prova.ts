import { Categoria } from "../categorias/categoria";

export interface Prova {
    id?: number;
    titulo: string;
    tipo_prova: any;
    ativo: number;
    total_questoes: number;
    categorias: any;
    quantidade_questoes: any;
}
