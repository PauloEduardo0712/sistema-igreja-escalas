/* =============================================
   ADMIN.JS — Painel Administrativo
   ============================================= */

/* ---------- SIDEBAR / NAVEGAÇÃO ---------- */

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  const isAdmin = appState.usuarioLogado.perfil === "admin";

  const logoHTML = `
    <div class="sidebar-logo-area">
      <img src="img/logo-shekinah.png" alt="Shekinah IAD" onerror="this.style.display='none'">
      <span>Shekinah IAD</span>
      <small>Sistema de Escalas</small>
    </div>`;

  const navAdmin = `
    <div class="sidebar-section">Menu Principal</div>
    <div class="nav-item" data-page="dashboard"       onclick="irPara('dashboard')"><span class="nav-icon">📊</span> Dashboard</div>
    <div class="nav-item" data-page="voluntarios"     onclick="irPara('voluntarios')"><span class="nav-icon">👥</span> Voluntários</div>
    <div class="nav-item" data-page="escalas"         onclick="irPara('escalas')"><span class="nav-icon">📅</span> Escalas</div>
    <div class="sidebar-section">Relatórios</div>
    <div class="nav-item" data-page="conflitos"       onclick="irPara('conflitos')"><span class="nav-icon">⚠️</span> Conflitos</div>
    <div class="nav-item" data-page="disponibilidades" onclick="irPara('disponibilidades')"><span class="nav-icon">🗓️</span> Disponibilidades</div>`;

  const navVol = `
    <div class="sidebar-section">Meu Painel</div>
    <div class="nav-item" data-page="dashboard"      onclick="irPara('dashboard')"><span class="nav-icon">🏠</span> Início</div>
    <div class="nav-item" data-page="minhas-escalas" onclick="irPara('minhas-escalas')"><span class="nav-icon">📋</span> Minhas Escalas</div>
    <div class="nav-item" data-page="disponibilidade" onclick="irPara('disponibilidade')"><span class="nav-icon">🗓️</span> Disponibilidade</div>`;

  sidebar.innerHTML = logoHTML + (isAdmin ? navAdmin : navVol);
}

function irPara(pagina) {
  appState.paginaAtual = pagina;
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === pagina);
  });
  renderPagina(pagina);
}

function renderPagina(pagina) {
  const main    = document.getElementById("mainContent");
  const isAdmin = appState.usuarioLogado.perfil === "admin";

  const mapa = {
    "dashboard":        isAdmin ? renderDashboardAdmin      : renderDashboardVoluntario,
    "voluntarios":      isAdmin ? renderVoluntarios          : null,
    "escalas":          isAdmin ? renderEscalas              : null,
    "conflitos":        isAdmin ? renderConflitos            : null,
    "disponibilidades": isAdmin ? renderDisponibilidades     : null,
    "minhas-escalas":             renderMinhasEscalas,
    "disponibilidade":            renderDisponibilidadeVol,
  };

  const fn = mapa[pagina];
  if (fn) main.innerHTML = fn();
}

/* ---------- DASHBOARD ADMIN ---------- */

function renderDashboardAdmin() {
  const hoje = new Date();
  const domingoProx = new Date(hoje);
  domingoProx.setDate(hoje.getDate() + (7 - hoje.getDay()));
  const domingoStr = domingoProx.toISOString().slice(0, 10);
  const escalasProxDom = appState.escalas.filter(e => e.data === domingoStr).length;
  const conflitos = detectarTodosConflitos();

  return `
    <div class="welcome-banner">
      <h2>Bem-vindo, Administrador! 🙏</h2>
      <p>Gerencie as escalas ministeriais da Igreja Shekinah IAD.</p>
    </div>

    <div class="cards-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">${appState.voluntarios.length}</div>
        <div class="stat-label">Voluntários</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${appState.escalas.length}</div>
        <div class="stat-label">Escalas Cadastradas</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⛪</div>
        <div class="stat-value">${escalasProxDom}</div>
        <div class="stat-label">Próximo Domingo</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-value" style="color:${conflitos.length > 0 ? 'var(--vermelho)' : 'var(--verde)'}">${conflitos.length}</div>
        <div class="stat-label">Conflitos</div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <h3>📅 Próximas Escalas</h3>
        <button class="btn btn-chama btn-sm" onclick="irPara('escalas')">Ver todas</button>
      </div>
      <div class="section-body">
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Data</th><th>Horário</th><th>Ministério</th><th>Voluntário</th><th>Função</th></tr></thead>
            <tbody>
              ${appState.escalas.slice().sort((a,b)=>a.data.localeCompare(b.data)).slice(0,5).map(e => `
                <tr>
                  <td>${formatarData(e.data)}</td>
                  <td>${e.horario}</td>
                  <td><span class="escala-tipo-badge">${e.tipo}</span></td>
                  <td>${nomeVoluntario(e.voluntarioId)}</td>
                  <td>${e.funcao || e.professor || "–"}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    ${conflitos.length > 0 ? `
    <div class="section-card">
      <div class="section-header"><h3>⚠️ Alertas de Conflito</h3></div>
      <div class="section-body">
        ${conflitos.slice(0,3).map(c => `<div class="alert alert-danger">⚠️ ${c.conflito.msg}</div>`).join("")}
        ${conflitos.length > 3 ? `<button class="btn btn-ghost btn-sm" onclick="irPara('conflitos')">Ver todos (${conflitos.length})</button>` : ""}
      </div>
    </div>` : `<div class="alert alert-success">✅ Nenhum conflito encontrado! Todas as escalas estão em ordem.</div>`}
  `;
}

/* ---------- VOLUNTÁRIOS ---------- */

function renderVoluntarios(filtro = "") {
  const lista = filtro
    ? appState.voluntarios.filter(v =>
        v.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        v.ministerio.toLowerCase().includes(filtro.toLowerCase()))
    : appState.voluntarios;

  return `
    <div class="page-title">👥 Voluntários</div>
    <div class="page-subtitle">Gerencie os voluntários da igreja</div>
    <div class="filter-bar">
      <input type="text" placeholder="🔍 Buscar por nome ou ministério..." oninput="filtrarVoluntarios(this.value)" value="${filtro}" style="flex:1;min-width:200px;">
      <button class="btn btn-chama" onclick="abrirModalNovoVoluntario()">+ Novo Voluntário</button>
    </div>
    <div class="section-card">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Nome</th><th>Usuário</th><th>Ministério</th><th>Disponibilidade</th><th>Ações</th></tr></thead>
          <tbody>
            ${lista.map(v => `
              <tr>
                <td><strong>${v.nome}</strong></td>
                <td><span class="badge badge-blue">${v.usuario}</span></td>
                <td>${v.ministerio}</td>
                <td style="font-size:12px;">${(v.disponibilidade||[]).map(d => DIAS_SEMANA.find(x=>x.key===d)?.label||d).join(", ")||"–"}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="abrirModalEditarVoluntario(${v.id})">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmarExcluirVoluntario(${v.id})">🗑️</button>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

function filtrarVoluntarios(v) {
  document.getElementById("mainContent").innerHTML = renderVoluntarios(v);
}

function abrirModalNovoVoluntario() {
  abrirModal(`
    <div class="modal-title">➕ Novo Voluntário</div>
    <div class="form-grid">
      <div class="form-group"><label>Nome completo *</label><input id="vNome" placeholder="Nome"></div>
      <div class="form-group"><label>Usuário (login) *</label><input id="vUsuario" placeholder="usuario"></div>
      <div class="form-group"><label>Senha *</label><input id="vSenha" type="password" value="1234"></div>
      <div class="form-group"><label>Ministério *</label>
        <select id="vMinisterio">${MINISTERIOS.map(m=>`<option>${m}</option>`).join("")}</select>
      </div>
    </div>
    <div class="form-group" style="margin-top:14px;">
      <label>Observações</label><textarea id="vObs" placeholder="Observações..."></textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-chama" onclick="salvarNovoVoluntario()">💾 Salvar</button>
      <button class="btn btn-ghost" onclick="fecharModalDireto()">Cancelar</button>
    </div>`);
}

function salvarNovoVoluntario() {
  const nome     = document.getElementById("vNome").value.trim();
  const usuario  = document.getElementById("vUsuario").value.trim();
  const senha    = document.getElementById("vSenha").value.trim();
  const ministerio = document.getElementById("vMinisterio").value;
  const erro = validarCamposObrigatorios({ "Nome": nome, "Usuário": usuario, "Senha": senha });
  if (erro) { toast(erro, "danger"); return; }
  if (usuarioJaExiste(usuario)) { toast("Este usuário já está cadastrado.", "danger"); return; }
  appState.voluntarios.push({
    id: appState.nextVolId++, nome, usuario, senha, ministerio,
    disponibilidade: [], indisponibilidade: [],
    obs: document.getElementById("vObs").value
  });
  fecharModalDireto();
  toast("Voluntário cadastrado com sucesso!", "success");
  irPara("voluntarios");
}

function abrirModalEditarVoluntario(id) {
  const v = appState.voluntarios.find(x => x.id === id);
  if (!v) return;
  abrirModal(`
    <div class="modal-title">✏️ Editar Voluntário</div>
    <div class="form-grid">
      <div class="form-group"><label>Nome completo</label><input id="vNome" value="${v.nome}"></div>
      <div class="form-group"><label>Usuário</label><input id="vUsuario" value="${v.usuario}"></div>
      <div class="form-group"><label>Senha</label><input id="vSenha" type="password" value="${v.senha}"></div>
      <div class="form-group"><label>Ministério</label>
        <select id="vMinisterio">${MINISTERIOS.map(m=>`<option ${m===v.ministerio?"selected":""}>${m}</option>`).join("")}</select>
      </div>
    </div>
    <div class="form-group" style="margin-top:14px;">
      <label>Observações</label><textarea id="vObs">${v.obs||""}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-chama" onclick="salvarEdicaoVoluntario(${id})">💾 Salvar</button>
      <button class="btn btn-ghost" onclick="fecharModalDireto()">Cancelar</button>
    </div>`);
}

function salvarEdicaoVoluntario(id) {
  const v = appState.voluntarios.find(x => x.id === id);
  v.nome = document.getElementById("vNome").value.trim();
  v.usuario = document.getElementById("vUsuario").value.trim();
  v.senha = document.getElementById("vSenha").value.trim();
  v.ministerio = document.getElementById("vMinisterio").value;
  v.obs = document.getElementById("vObs").value;
  fecharModalDireto();
  toast("Voluntário atualizado!", "success");
  irPara("voluntarios");
}

function confirmarExcluirVoluntario(id) {
  abrirModal(`
    <div class="modal-title">🗑️ Confirmar Exclusão</div>
    <div class="alert alert-warning">⚠️ Tem certeza que deseja excluir este voluntário?</div>
    <div class="form-actions">
      <button class="btn btn-danger" onclick="excluirVoluntario(${id})">Sim, excluir</button>
      <button class="btn btn-ghost" onclick="fecharModalDireto()">Cancelar</button>
    </div>`);
}

function excluirVoluntario(id) {
  appState.voluntarios = appState.voluntarios.filter(v => v.id !== id);
  fecharModalDireto();
  toast("Voluntário excluído.", "success");
  irPara("voluntarios");
}

/* ---------- DISPONIBILIDADES (admin view) ---------- */

function renderDisponibilidades() {
  return `
    <div class="page-title">🗓️ Disponibilidades</div>
    <div class="page-subtitle">Visualize os dias disponíveis de cada voluntário</div>
    <div class="section-card">
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Voluntário</th><th>Ministério</th><th>Disponível</th><th>Indisponível</th><th>Obs</th></tr></thead>
          <tbody>
            ${appState.voluntarios.map(v => `
              <tr>
                <td><strong>${v.nome}</strong></td>
                <td>${v.ministerio}</td>
                <td style="font-size:12px;color:#16a34a;">${(v.disponibilidade||[]).map(d=>DIAS_SEMANA.find(x=>x.key===d)?.label||d).join(", ")||"–"}</td>
                <td style="font-size:12px;color:#dc2626;">${(v.indisponibilidade||[]).map(d=>DIAS_SEMANA.find(x=>x.key===d)?.label||d).join(", ")||"–"}</td>
                <td style="font-size:12px;color:var(--cinza-texto);">${v.obs||"–"}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}
