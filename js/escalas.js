/* =============================================
   ESCALAS.JS — CRUD de Escalas
   ============================================= */

function renderEscalas(filtroMin = "", filtroData = "", filtroBusca = "") {
  let lista = appState.escalas.slice().sort((a,b) => a.data.localeCompare(b.data));
  if (filtroMin)   lista = lista.filter(e => e.tipo === filtroMin);
  if (filtroData)  lista = lista.filter(e => e.data === filtroData);
  if (filtroBusca) {
    const q = filtroBusca.toLowerCase();
    lista = lista.filter(e => {
      const vol = appState.voluntarios.find(v => v.id === e.voluntarioId);
      return (vol && vol.nome.toLowerCase().includes(q)) || e.tipo.toLowerCase().includes(q);
    });
  }

  return `
    <div class="page-title">📅 Escalas</div>
    <div class="page-subtitle">Gerencie as escalas ministeriais</div>
    <div class="filter-bar">
      <select id="fMin" onchange="filtrarEscalas(this.value, document.getElementById('fData').value, document.getElementById('fBusca').value)" style="min-width:170px;">
        <option value="">Todos os ministérios</option>
        ${MINISTERIOS.map(m=>`<option ${m===filtroMin?"selected":""}>${m}</option>`).join("")}
      </select>
      <input id="fData" type="date" value="${filtroData}" onchange="filtrarEscalas(document.getElementById('fMin').value, this.value, document.getElementById('fBusca').value)">
      <input id="fBusca" type="text" placeholder="🔍 Buscar voluntário..." value="${filtroBusca}" oninput="filtrarEscalas(document.getElementById('fMin').value, document.getElementById('fData').value, this.value)" style="flex:1;min-width:180px;">
      <button class="btn btn-chama" onclick="abrirModalNovaEscala()">+ Nova Escala</button>
    </div>
    <div class="section-card">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Data</th><th>Horário</th><th>Ministério</th><th>Voluntário</th><th>Função</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${lista.map(e => {
              const conflito = verificarConflito(e);
              return `<tr>
                <td>${formatarData(e.data)}</td>
                <td>${e.horario}</td>
                <td><span class="escala-tipo-badge">${e.tipo}</span></td>
                <td>${nomeVoluntario(e.voluntarioId)}</td>
                <td>${e.funcao||e.professor||e.intercessor||"–"}</td>
                <td>${conflito.ok
                  ? '<span class="badge badge-green">✅ OK</span>'
                  : `<span class="badge badge-red" title="${conflito.msg}">⚠️ Conflito</span>`}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="abrirModalEditarEscala(${e.id})">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmarExcluirEscala(${e.id})">🗑️</button>
                </td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

function filtrarEscalas(m, d, b) {
  document.getElementById("mainContent").innerHTML = renderEscalas(m, d, b);
}

function abrirModalNovaEscala() {
  abrirModal(`
    <div class="modal-title">➕ Nova Escala</div>
    <div class="form-grid">
      <div class="form-group"><label>Ministério *</label>
        <select id="eTipo" onchange="atualizarCamposEscala()">${MINISTERIOS.map(m=>`<option>${m}</option>`).join("")}</select>
      </div>
      <div class="form-group"><label>Data *</label><input id="eData" type="date" onchange="verificarDisponibilidadeNoForm()"></div>
      <div class="form-group"><label>Horário *</label><input id="eHorario" type="time" value="09:00" onchange="verificarDisponibilidadeNoForm()"></div>
      <div class="form-group"><label>Voluntário *</label>
        <select id="eVoluntario" onchange="verificarDisponibilidadeNoForm()">
          ${appState.voluntarios.map(v=>`<option value="${v.id}">${v.nome} — ${v.ministerio}</option>`).join("")}
        </select>
      </div>
    </div>
    <div id="alertaDisponibilidade" style="margin-top:10px;"></div>
    <div id="camposExtra" style="margin-top:12px;"></div>
    <div class="form-actions">
      <button class="btn btn-chama" onclick="salvarNovaEscala()">💾 Salvar Escala</button>
      <button class="btn btn-ghost" onclick="fecharModalDireto()">Cancelar</button>
    </div>`);
  atualizarCamposEscala();
}

function atualizarCamposEscala() {
  const tipo = document.getElementById("eTipo")?.value;
  let campos = "";
  if (tipo === "Diáconos") {
    campos = `<div class="form-grid">
      <div class="form-group"><label>Culto/Evento</label><input id="eCulto" placeholder="Ex: Culto Domingo Manhã"></div>
      <div class="form-group"><label>Local</label><input id="eLocal" placeholder="Ex: Entrada principal"></div>
      <div class="form-group"><label>Função</label><input id="eFuncao" placeholder="Ex: Recepção"></div>
    </div>`;
  } else if (tipo === "EBD") {
    campos = `<div class="form-grid">
      <div class="form-group"><label>Turma</label><input id="eTurma" placeholder="Ex: Adultos"></div>
      <div class="form-group"><label>Professor</label><input id="eProfessor" placeholder="Nome"></div>
      <div class="form-group"><label>Auxiliar</label><input id="eAuxiliar" placeholder="Nome"></div>
      <div class="form-group"><label>Tema</label><input id="eTema" placeholder="Tema da aula"></div>
      <div class="form-group"><label>Resp. Lanche</label><input id="eLanche" placeholder="Nome"></div>
    </div>`;
  } else if (tipo === "Intercessão") {
    campos = `<div class="form-grid">
      <div class="form-group"><label>Local</label><input id="eLocal" placeholder="Ex: Sala de Oração"></div>
      <div class="form-group"><label>Foco da Oração</label><input id="eFoco" placeholder="Ex: Missões"></div>
      <div class="form-group"><label>Função</label><input id="eFuncao" value="Intercessor"></div>
    </div>`;
  } else {
    campos = `<div class="form-grid">
      <div class="form-group"><label>Função</label><input id="eFuncao" placeholder="Função do voluntário"></div>
      <div class="form-group"><label>Local</label><input id="eLocal" placeholder="Local de atuação"></div>
    </div>`;
  }
  const el = document.getElementById("camposExtra");
  if (el) el.innerHTML = campos;
}

function salvarNovaEscala() {
  const tipo         = document.getElementById("eTipo").value;
  const data         = document.getElementById("eData").value;
  const horario      = document.getElementById("eHorario").value;
  const voluntarioId = parseInt(document.getElementById("eVoluntario").value);
  const erro = validarCamposObrigatorios({ "Data": data, "Horário": horario });
  if (erro) { toast(erro, "danger"); return; }

  const novaEscala = {
    id: appState.nextEscId++, tipo, data, horario, voluntarioId,
    funcao:     document.getElementById("eFuncao")?.value    || "",
    local:      document.getElementById("eLocal")?.value     || "",
    culto:      document.getElementById("eCulto")?.value     || "",
    turma:      document.getElementById("eTurma")?.value     || "",
    professor:  document.getElementById("eProfessor")?.value || "",
    auxiliar:   document.getElementById("eAuxiliar")?.value  || "",
    tema:       document.getElementById("eTema")?.value      || "",
    lanche:     document.getElementById("eLanche")?.value    || "",
    focoPrayer: document.getElementById("eFoco")?.value      || "",
  };

  appState.escalas.push(novaEscala);
  fecharModalDireto();
  toast("Escala cadastrada com sucesso!", "success");
  irPara("escalas");
}

function abrirModalEditarEscala(id) {
  const e = appState.escalas.find(x => x.id === id);
  if (!e) return;
  abrirModal(`
    <div class="modal-title">✏️ Editar Escala</div>
    <div class="form-grid">
      <div class="form-group"><label>Ministério</label>
        <select id="eTipo">${MINISTERIOS.map(m=>`<option ${m===e.tipo?"selected":""}>${m}</option>`).join("")}</select>
      </div>
      <div class="form-group"><label>Data</label><input id="eData" type="date" value="${e.data}"></div>
      <div class="form-group"><label>Horário</label><input id="eHorario" type="time" value="${e.horario}"></div>
      <div class="form-group"><label>Voluntário</label>
        <select id="eVoluntario">${appState.voluntarios.map(v=>`<option value="${v.id}" ${v.id===e.voluntarioId?"selected":""}>${v.nome}</option>`).join("")}</select>
      </div>
      <div class="form-group"><label>Função</label><input id="eFuncao" value="${e.funcao||""}"></div>
      <div class="form-group"><label>Local</label><input id="eLocal" value="${e.local||""}"></div>
      <div class="form-group"><label>Culto/Evento</label><input id="eCulto" value="${e.culto||""}"></div>
      <div class="form-group"><label>Turma (EBD)</label><input id="eTurma" value="${e.turma||""}"></div>
      <div class="form-group"><label>Tema</label><input id="eTema" value="${e.tema||""}"></div>
      <div class="form-group"><label>Foco da Oração</label><input id="eFoco" value="${e.focoPrayer||""}"></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-chama" onclick="salvarEdicaoEscala(${id})">💾 Salvar</button>
      <button class="btn btn-ghost" onclick="fecharModalDireto()">Cancelar</button>
    </div>`);
}

function salvarEdicaoEscala(id) {
  const e = appState.escalas.find(x => x.id === id);
  e.tipo         = document.getElementById("eTipo").value;
  e.data         = document.getElementById("eData").value;
  e.horario      = document.getElementById("eHorario").value;
  e.voluntarioId = parseInt(document.getElementById("eVoluntario").value);
  e.funcao       = document.getElementById("eFuncao").value;
  e.local        = document.getElementById("eLocal").value;
  e.culto        = document.getElementById("eCulto").value;
  e.turma        = document.getElementById("eTurma").value;
  e.tema         = document.getElementById("eTema").value;
  e.focoPrayer   = document.getElementById("eFoco").value;
  fecharModalDireto();
  toast("Escala atualizada!", "success");
  irPara("escalas");
}

function confirmarExcluirEscala(id) {
  abrirModal(`
    <div class="modal-title">🗑️ Confirmar Exclusão</div>
    <div class="alert alert-warning">⚠️ Tem certeza que deseja excluir esta escala?</div>
    <div class="form-actions">
      <button class="btn btn-danger" onclick="excluirEscala(${id})">Sim, excluir</button>
      <button class="btn btn-ghost" onclick="fecharModalDireto()">Cancelar</button>
    </div>`);
}

function excluirEscala(id) {
  appState.escalas = appState.escalas.filter(e => e.id !== id);
  fecharModalDireto();
  toast("Escala excluída.", "success");
  irPara("escalas");
}

/* ---------- CONFLITOS ---------- */

function renderConflitos() {
  const conflitos = detectarTodosConflitos();
  return `
    <div class="page-title">⚠️ Conflitos</div>
    <div class="page-subtitle">Análise automática de conflitos nas escalas</div>
    ${conflitos.length === 0
      ? `<div class="alert alert-success">✅ Nenhum conflito encontrado! Todas as escalas estão em ordem.</div>`
      : conflitos.map(({ escala: e, conflito: c }) => `
          <div class="conflict-card">
            <div class="conflict-card-header">
              <span class="conflict-card-title">⚠️ Conflito — ${e.tipo}</span>
              <span class="badge badge-red">${formatarData(e.data)}</span>
            </div>
            <div class="alert alert-danger" style="margin-bottom:12px;">${c.msg}</div>
            <div class="conflict-meta">
              <span>📅 Data: <strong>${formatarData(e.data)}</strong></span>
              <span>⏰ Horário: <strong>${e.horario}</strong></span>
              <span>👤 Voluntário: <strong>${nomeVoluntario(e.voluntarioId)}</strong></span>
              <span>⛪ Ministério: <strong>${e.tipo}</strong></span>
            </div>
            <div class="form-actions" style="margin-top:0;border-top:none;padding-top:0;">
              <button class="btn btn-chama btn-sm" onclick="abrirModalEditarEscala(${e.id})">✏️ Editar</button>
              <button class="btn btn-danger btn-sm" onclick="confirmarExcluirEscala(${e.id})">🗑️ Remover</button>
            </div>
          </div>`).join("")}`;
}
