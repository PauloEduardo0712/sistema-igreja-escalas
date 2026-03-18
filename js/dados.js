/* =============================================
   DADOS.JS — Dados iniciais e estado global
   ============================================= */

const MINISTERIOS = [
  "Diáconos",
  "EBD",
  "Intercessão",
  "Recepção",
  "Louvor",
  "Mídia/Data Show",
  "Coordenação de Lanche"
];

const DIAS_SEMANA = [
  { key: "domingo-manha",  label: "Domingo Manhã"  },
  { key: "domingo-noite",  label: "Domingo Noite"  },
  { key: "segunda-noite",  label: "Segunda Noite"  },
  { key: "terca-noite",   label: "Terça Noite"    },
  { key: "quarta-noite",  label: "Quarta Noite"   },
  { key: "quinta-noite",  label: "Quinta Noite"   },
  { key: "sexta-noite",   label: "Sexta Noite"    },
  { key: "sabado-manha",  label: "Sábado Manhã"   },
  { key: "sabado-noite",  label: "Sábado Noite"   },
];

// Estado global da aplicação
let appState = {
  usuarioLogado: null,
  paginaAtual: "dashboard",

  voluntarios: [
    {
      id: 1, nome: "João Silva", usuario: "joao", senha: "1234",
      ministerio: "Diáconos",
      disponibilidade: ["domingo-manha", "domingo-noite", "quarta-noite"],
      indisponibilidade: ["sabado-noite"],
      obs: ""
    },
    {
      id: 2, nome: "Maria Santos", usuario: "maria", senha: "1234",
      ministerio: "EBD",
      disponibilidade: ["domingo-manha", "terca-noite"],
      indisponibilidade: ["sabado-manha"],
      obs: ""
    },
    {
      id: 3, nome: "Carlos Pereira", usuario: "carlos", senha: "1234",
      ministerio: "Intercessão",
      disponibilidade: ["domingo-noite", "quarta-noite", "sabado-noite"],
      indisponibilidade: [],
      obs: ""
    },
    {
      id: 4, nome: "Ana Lima", usuario: "ana", senha: "1234",
      ministerio: "Recepção",
      disponibilidade: ["domingo-manha", "sabado-manha"],
      indisponibilidade: ["terca-noite"],
      obs: ""
    },
    {
      id: 5, nome: "Pedro Costa", usuario: "pedro", senha: "1234",
      ministerio: "Louvor",
      disponibilidade: ["domingo-manha", "domingo-noite"],
      indisponibilidade: [],
      obs: ""
    },
  ],

  escalas: [
    {
      id: 1, tipo: "Diáconos", data: "2026-03-22", horario: "09:00",
      voluntarioId: 1, funcao: "Recepção", local: "Entrada principal",
      culto: "Culto Domingo Manhã", turma: "", professor: "", auxiliar: "",
      tema: "", lanche: "", focoPrayer: ""
    },
    {
      id: 2, tipo: "EBD", data: "2026-03-22", horario: "09:30",
      voluntarioId: 2, funcao: "Professora", local: "",
      culto: "", turma: "Adultos", professor: "Maria Santos",
      auxiliar: "Pedro Costa", tema: "A Graça de Deus",
      lanche: "Ana Lima", focoPrayer: ""
    },
    {
      id: 3, tipo: "Intercessão", data: "2026-03-25", horario: "19:00",
      voluntarioId: 3, funcao: "Intercessor", local: "Sala de Oração",
      culto: "", turma: "", professor: "", auxiliar: "", tema: "",
      lanche: "", focoPrayer: "Missões"
    },
    {
      id: 4, tipo: "Diáconos", data: "2026-03-29", horario: "19:00",
      voluntarioId: 4, funcao: "Suporte", local: "Salão Principal",
      culto: "Culto da Família", turma: "", professor: "", auxiliar: "",
      tema: "", lanche: "", focoPrayer: ""
    },
  ],

  nextVolId: 6,
  nextEscId: 5,
};
