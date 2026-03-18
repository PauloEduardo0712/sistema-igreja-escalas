/* =============================================
   VALIDACOES.JS — Validação de campos
   ============================================= */

/**
 * Valida se campos obrigatórios estão preenchidos
 * @param {Object} campos - { nomeLabel: valorCampo }
 * @returns {string|null} mensagem de erro ou null se válido
 */
function validarCamposObrigatorios(campos) {
  for (const [label, valor] of Object.entries(campos)) {
    if (!valor || valor.toString().trim() === "") {
      return `O campo "${label}" é obrigatório.`;
    }
  }
  return null;
}

/**
 * Valida se o usuário já existe
 */
function usuarioJaExiste(usuario, excluirId = null) {
  return appState.voluntarios.some(v =>
    v.usuario === usuario && v.id !== excluirId
  );
}

/**
 * Valida formato de horário HH:MM
 */
function validarHorario(horario) {
  return /^\d{2}:\d{2}$/.test(horario);
}

/**
 * Valida se a data não é vazia
 */
function validarData(data) {
  return data && data.trim() !== "";
}
