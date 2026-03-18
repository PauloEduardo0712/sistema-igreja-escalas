/* =============================================
   VOLUNTARIO.JS — Painel e Disponibilidade do Voluntário
   ============================================= */

/* ---------- DASHBOARD VOLUNTÁRIO ---------- */

function renderDashboardVoluntario() {
  const vol = appState.usuarioLogado;
  const minhasEscalas = appState.escalas.filter(e => e.voluntarioId === vol.id);
  const diasDisp  = (vol.disponibilidade||[]).map(d => DIAS_SEMANA.find(x=>x.key===d)?.label||d).join(", ")||"Nenhum informado";
  const diasIndisp = (vol.indisponibilidade||[]).map(d => DIAS_SEMANA.find(x=>x.key===d)?.label||d).join(", ")||"Nenhum informado";

  return `
    <div class="vol-profile-card">
      <div class="vol-avatar">${getIniciais(vol.nome)}</div>
      <div class="vol-info">
        <h2>Olá, ${vol.nome}! 🙏</h2>
        <p>Ministério: <strong>${vol.ministerio}</strong> &nbsp;|&nbsp; ${minhasEscalas.length} escala(s) cadastrada(s)</p>
      </div>
    </div>

    <div class="cards-grid">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-value">${minhasEscalas.length}</div>
        <div class="stat-label">Minhas Escalas</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-value">${(vol.disponibilidade||[]).length}</div>
        <div class="stat-label">Dias Disponíveis</div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <h3>📋 Minhas Próximas Escalas</h3>
        <button class="btn btn-primary btn-sm" onclick="irPara('minhas-escalas')">Ver todas</button>
      </div>
      <div class="section-body">
        ${minhasEscalas.length === 0
          ? `<div class="alert alert-info">ℹ️ Você ainda não possui escalas cadastradas.</div>`
          : `<div class="table-wrapper"><table>
              <thead><tr><th>Data</th><th>Horário</th><th>Ministério</th><th>Função</th></tr></thead>
              <tbody>
                ${minhasEscalas.slice().sort((a,b)=>a.data.localeCompare(b.data)).map(e => `
                  <tr>
                    <td>${formatarData(e.data)}</td>
                    <td>${e.horario}</td>
                    <td><span class="escala-tipo-badge">${e.tipo}</span></td>
                    <td>${e.funcao||e.professor||"–"}</td>
                  </tr>`).join("")}
              </tbody>
            </table></div>`}
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <h3>🗓️ Minha Disponibilidade</h3>
        <button class="btn btn-chama btn-sm" onclick="irPara('disponibilidade')">Editar</button>
      </div>
      <div class="section-body">
        <p style="font-size:13px;margin-bottom:8px;"><span class="badge badge-green">✅ Disponível:</span> ${diasDisp}</p>
        <p style="font-size:13px;"><span class="badge badge-red">🚫 Indisponível:</span> ${diasIndisp}</p>
      </div>
    </div>`;
}

/* ---------- MINHAS ESCALAS ---------- */

function renderMinhasEscalas() {
  const vol = appState.usuarioLogado;
  const minhas = appState.escalas.filter(e => e.voluntarioId === vol.id).sort((a,b)=>a.data.localeCompare(b.data));
  return `
    <div class="page-title">📋 Minhas Escalas</div>
    <div class="page-subtitle">Todas as escalas em que você foi cadastrado</div>
    <div class="section-card">
      ${minhas.length === 0
        ? `<div class="section-body"><div class="alert alert-info">ℹ️ Você ainda não possui escalas cadastradas.</div></div>`
        : `<div class="table-wrapper"><table>
            <thead><tr><th>Data</th><th>Horário</th><th>Ministério</th><th>Função</th><th>Local / Detalhe</th></tr></thead>
            <tbody>
              ${minhas.map(e => `
                <tr>
                  <td>${formatarData(e.data)}</td>
                  <td>${e.horario}</td>
                  <td><span class="escala-tipo-badge">${e.tipo}</span></td>
                  <td>${e.funcao||e.professor||"–"}</td>
                  <td style="font-size:12px;">${e.local||e.culto||e.turma||e.focoPrayer||"–"}</td>
                </tr>`).join("")}
            </tbody>
          </table></div>`}
    </div>`;
}

/* ---------- DISPONIBILIDADE VOLUNTÁRIO ---------- */

function renderDisponibilidadeVol() {
  const vol = appState.voluntarios.find(v => v.id === appState.usuarioLogado.id) || appState.usuarioLogado;
  return `
    <div class="page-title">🗓️ Minha Disponibilidade</div>
    <div class="page-subtitle">Informe os dias em que pode ou não pode servir</div>
    <div class="section-card">
      <div class="section-header"><h3>Clique para alternar disponibilidade</h3></div>
      <div class="section-body">
        <div class="alert alert-info" style="margin-bottom:18px;">
          🟢 <strong>Verde</strong> = Disponível &nbsp;|&nbsp; 🔴 <strong>Vermelho</strong> = Indisponível &nbsp;|&nbsp; Cinza = Não informado<br>
          <small>Clique uma vez para disponível, de novo para indisponível, e novamente para limpar.</small>
        </div>
        <div class="disponibilidade-grid">
          ${DIAS_SEMANA.map(d => {
            const disp   = (vol.disponibilidade||[]).includes(d.key);
            const indisp = (vol.indisponibilidade||[]).includes(d.key);
            const cls    = disp ? "disponivel" : indisp ? "indisponivel" : "";
            return `<div class="disp-item ${cls}" data-key="${d.key}" onclick="toggleDisponibilidade('${d.key}')">
              ${d.label}
              <small>${disp ? "✅ Disponível" : indisp ? "🚫 Indisponível" : "— Não informado"}</small>
            </div>`;
          }).join("")}
        </div>
        <div class="form-actions">
          <button class="btn btn-chama" onclick="salvarDisponibilidade()">💾 Salvar Disponibilidade</button>
        </div>
      </div>
    </div>`;
}

function toggleDisponibilidade(key) {
  const vol = appState.voluntarios.find(v => v.id === appState.usuarioLogado.id);
  if (!vol) return;
  const disp   = vol.disponibilidade    || [];
  const indisp = vol.indisponibilidade  || [];
  const eDisp   = disp.includes(key);
  const eIndisp = indisp.includes(key);

  if (!eDisp && !eIndisp) {
    vol.disponibilidade = [...disp, key];
  } else if (eDisp) {
    vol.disponibilidade   = disp.filter(d => d !== key);
    vol.indisponibilidade = [...indisp, key];
  } else {
    vol.indisponibilidade = indisp.filter(d => d !== key);
  }

  appState.usuarioLogado.disponibilidade   = vol.disponibilidade;
  appState.usuarioLogado.indisponibilidade = vol.indisponibilidade;
  irPara("disponibilidade");
}

function salvarDisponibilidade() {
  toast("Disponibilidade salva com sucesso! ✅", "success");
}
