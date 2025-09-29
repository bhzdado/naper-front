import { FormGroup } from "@angular/forms";
import { Prova } from "./prova";
import { Aluno, Turma } from "../turmas/turma";

export interface ProvaLiberada {
    id?: number, 
    descricao: string,
    expiracao?: any,
    data_prova?: Prova|any,
    turmas?: Turma|any,
    alunos?: Aluno|any,
    valor?: number,
    tempo_execucao?: string,
    range?: any,
    tempo_ate_expiracao_formatado?: any
}
