export interface ClienteRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
}

export interface ClienteResponse {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  CPF: string;
}
