/* =============================================
   LOGIN.JS — Autenticação e redirecionamento
   ============================================= */

function fazerLogin() {
  const usuario = document.getElementById("loginUsuario").value.trim();
  const senha   = document.getElementById("loginSenha").value.trim();
  const perfil  = document.getElementById("loginPerfil").value;

  if (!usuario || !senha) {
    toast("Preencha usuário e senha.", "danger");
    return;
  }

  if (perfil === "admin") {
    if (usuario === "admin" && senha === "1234") {
      appState.usuarioLogado = { id: 0, nome: "Administrador", perfil: "admin", ministerio: "" };
    } else {
      toast("Usuário ou senha incorretos.", "danger");
      return;
    }
  } else {
    const vol = appState.voluntarios.find(v => v.usuario === usuario && v.senha === senha);
    if (!vol) {
      toast("Usuário ou senha incorretos.", "danger");
      return;
    }
    appState.usuarioLogado = { ...vol, perfil: "voluntario" };
  }

  // Esconde login, mostra app
  document.getElementById("telaLogin").classList.add("hidden");
  document.getElementById("appContainer").classList.remove("hidden");

  // Atualiza header
  document.getElementById("headerBadge").textContent =
    perfil === "admin" ? "Administrador" : "Voluntário";
  document.getElementById("headerNome").textContent = appState.usuarioLogado.nome;

  renderSidebar();
  irPara("dashboard");
}

function fazerLogout() {
  appState.usuarioLogado = null;
  document.getElementById("telaLogin").classList.remove("hidden");
  document.getElementById("appContainer").classList.add("hidden");
  document.getElementById("loginSenha").value = "";
}

// Enter para logar
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && !document.getElementById("telaLogin").classList.contains("hidden")) {
    fazerLogin();
  }
  if (e.key === "Escape") fecharModalDireto();
});
