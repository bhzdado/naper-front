import { Categoria } from "../categorias/categoria";

export interface Questao {
    id?: number;
    enunciado: string;
    categoria: Array<Categoria>,
    ativo: number;
    peso_padrao: number;
    alternativas: any;
    correta: number;
}
