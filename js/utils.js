/* =============================================
   UTILS.JS — Funções auxiliares
   ============================================= */

/**
 * Formata data YYYY-MM-DD para DD/MM/YYYY
 */
function formatarData(dataStr) {
  if (!dataStr) return "–";
  const [y, m, d] = dataStr.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Retorna a inicial do nome para avatar
 */
function getIniciais(nome) {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  return partes.length >= 2
    ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
    : partes[0][0].toUpperCase();
}

/**
 * Exibe toast de notificação
 */
function toast(msg, tipo = "success") {
  const cores  = { success: "#16a34a", danger: "#dc2626", warning: "#b45309", info: "#1a3a6e" };
  const icons  = { success: "✅", danger: "❌", warning: "⚠️", info: "ℹ️" };
  const el = document.createElement("div");
  el.innerHTML = `${icons[tipo] || ""} ${msg}`;
  el.style.cssText = `
    background: ${cores[tipo] || "#333"};
    color: #fff;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.22);
    animation: fadeUp 0.3s ease;
    max-width: 320px;
    line-height: 1.4;
  `;
  document.getElementById("toastContainer").appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/**
 * Abre o modal com HTML interno
 */
function abrirModal(html) {
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modalOverlay").classList.remove("hidden");
}

/**
 * Fecha modal (pode ser chamado por clique no overlay)
 */
function fecharModal(e) {
  if (e && e.target !== document.getElementById("modalOverlay")) return;
  document.getElementById("modalOverlay").classList.add("hidden");
}

/**
 * Limpa e fecha modal diretamente
 */
function fecharModalDireto() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

/**
 * Retorna o nome do voluntário pelo ID
 */
function nomeVoluntario(id) {
  const v = appState.voluntarios.find(v => v.id === id);
  return v ? v.nome : "–";
}

/**
 * Retorna o dia da semana + período de uma data e horário
 */
function getDiaPeriodo(dataStr, horarioStr) {
  const data = new Date(dataStr + "T12:00:00");
  const diasNomes = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaSem = diasNomes[data.getDay()];
  const hora = parseInt((horarioStr || "00:00").split(":")[0]);
  const periodo = hora < 13 ? "manha" : "noite";
  return `${diaSem}-${periodo}`;
}
