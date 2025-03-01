
export interface Aluno {
    id?: string;
    nome: string;
}
export interface Turma {
    id?: string;
    nome: string;
    alunos: Aluno[];
}

