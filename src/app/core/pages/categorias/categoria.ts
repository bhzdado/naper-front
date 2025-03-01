export interface Categoria {
    id?: string;
    nome: string;
    parent?: number;
    quantidade_questoes?: number
}

export interface Subcategoria {
    id?: string;
    nome: string;
    categoria_id?: string;
}

