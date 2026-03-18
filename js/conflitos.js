/* =============================================
   CONFLITOS.JS — Lógica de detecção de conflitos
   ============================================= */

/**
 * Verifica conflitos de uma escala específica
 * Retorna { ok: bool, msg: string }
 */
function verificarConflito(escala) {
  const vol = appState.voluntarios.find(v => v.id === escala.voluntarioId);
  if (!vol) return { ok: true };

  const key = getDiaPeriodo(escala.data, escala.horario);

  // Conflito 1: voluntário marcou indisponibilidade neste dia/turno
  if ((vol.indisponibilidade || []).includes(key)) {
    const diaLabel = DIAS_SEMANA.find(d => d.key === key)?.label || key;
    return {
      ok: false,
      tipo: "indisponibilidade",
      msg: `${vol.nome} informou que não pode servir neste dia (${diaLabel}).`
    };
  }

  // Conflito 2: dupla escala no mesmo horário
  const dupla = appState.escalas.find(e =>
    e.id !== escala.id &&
    e.voluntarioId === escala.voluntarioId &&
    e.data === escala.data &&
    e.horario === escala.horario
  );
  if (dupla) {
    return {
      ok: false,
      tipo: "dupla-escala",
      msg: `${vol.nome} já está escalado às ${escala.horario} em "${dupla.tipo}" neste mesmo dia.`
    };
  }

  return { ok: true };
}

/**
 * Detecta todos os conflitos nas escalas cadastradas
 * Retorna array de { escala, conflito }
 */
function detectarTodosConflitos() {
  return appState.escalas
    .map(e => ({ escala: e, conflito: verificarConflito(e) }))
    .filter(item => !item.conflito.ok);
}

/**
 * Verifica disponibilidade ao selecionar voluntário no form de escala
 * Atualiza o div #alertaDisponibilidade
 */
function verificarDisponibilidadeNoForm() {
  const elData      = document.getElementById("eData");
  const elHorario   = document.getElementById("eHorario");
  const elVoluntario = document.getElementById("eVoluntario");
  const alertaDiv   = document.getElementById("alertaDisponibilidade");
  if (!elData || !elVoluntario || !alertaDiv || !elData.value) {
    if (alertaDiv) alertaDiv.innerHTML = "";
    return;
  }

  const volId = parseInt(elVoluntario.value);
  const vol   = appState.voluntarios.find(v => v.id === volId);
  if (!vol) return;

  const key    = getDiaPeriodo(elData.value, elHorario ? elHorario.value : "09:00");
  const indisp = (vol.indisponibilidade || []).includes(key);
  const jaEsc  = appState.escalas.find(e =>
    e.voluntarioId === volId &&
    e.data === elData.value &&
    e.horario === (elHorario ? elHorario.value : "")
  );

  let html = "";
  if (indisp) html += `<div class="alert alert-danger">🚫 ${vol.nome} informou que não pode servir neste dia/turno.</div>`;
  if (jaEsc)  html += `<div class="alert alert-warning">⚠️ ${vol.nome} já está escalado às ${elHorario.value} em "${jaEsc.tipo}" neste dia.</div>`;
  if (!indisp && !jaEsc && elData.value) html = `<div class="alert alert-success">✅ ${vol.nome} está disponível para este horário.</div>`;

  alertaDiv.innerHTML = html;
}
