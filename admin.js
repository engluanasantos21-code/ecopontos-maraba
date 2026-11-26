/* ═══════════════════════════════════════════════════════════
   ADMIN.JS — Painel de Administração dos Ecopontos
   
   Funcionalidades:
     • Login com senha (SHA-256) via Web Crypto API
     • Dashboard com estatísticas rápidas
     • Tabela de ecopontos com ações
     • Modal para criar/editar ecoponto
     • Exclusão com confirmação
     • Exportação de GeoJSON
     • Importação de GeoJSON (do QGIS)
═══════════════════════════════════════════════════════════ */

/* ── Estado ─────────────────────────────────────────────── */
let _modalBS    = null;
let _deleteModal = null;
let _editandoId  = null;
let _deletandoId = null;

/* ── Inicialização ──────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
 _verificarSessao();
  _configurarLogin();
  _configurarAdmin();
  _renderizarChipsTipos();
  document.getElementById('exportDataJsBtn')?.addEventListener('click', _exportarDataJS);
});

/* ── Autenticação ───────────────────────────────────────── */

function _verificarSessao() {
  const autenticado = sessionStorage.getItem('admin_auth') === 'true';
  if (autenticado) _mostrarPainel();
}

function _configurarLogin() {
  const loginBtn  = document.getElementById('loginBtn');
  const pwdInput  = document.getElementById('loginPassword');
  const toggleBtn = document.getElementById('togglePwd');
  const errorEl   = document.getElementById('loginError');

  // Toggle visibilidade da senha
  toggleBtn?.addEventListener('click', () => {
    const isText = pwdInput.type === 'text';
    pwdInput.type = isText ? 'password' : 'text';
    toggleBtn.querySelector('i').className = isText ? 'fas fa-eye' : 'fas fa-eye-slash';
  });

  // Enter no campo de senha
  pwdInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginBtn.click();
  });

  // Clique no botão de login
  loginBtn?.addEventListener('click', async () => {
    errorEl.classList.add('d-none');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Verificando...';

    const senha = pwdInput?.value ?? '';
    const ok    = await verificarSenha(senha);  // função em config.js

    if (ok) {
      sessionStorage.setItem('admin_auth', 'true');
      _mostrarPainel();
    } else {
      errorEl.classList.remove('d-none');
      pwdInput.value = '';
      pwdInput.focus();
    }

    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Entrar';
  });
}

function _mostrarPainel() {
  document.getElementById('loginScreen').classList.add('d-none');
  document.getElementById('adminPanel').classList.remove('d-none');
  _carregarTabela();
  _atualizarCards();
}

/* ── Logout ────────────────────────────────────────────── */

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  sessionStorage.removeItem('admin_auth');
  location.reload();
});

/* ── Dashboard — Cards de Estatísticas ─────────────────── */

function _atualizarCards() {
  const s = DataManager.estatisticas();
  _setEl('adm-total',    s.total);
  _setEl('adm-active',   s.ativos);
  _setEl('adm-inactive', s.inativos + s.manutencao);
  _setEl('adm-bairros',  s.bairros);
}

/* ── Tabela de Ecopontos ───────────────────────────────── */

function _carregarTabela() {
  const tbody = document.getElementById('ecoTable');
  if (!tbody) return;

  const lista = DataManager.listarTodos();

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-5 text-muted">
          <i class="fas fa-map-pin fa-2x mb-3 d-block text-success opacity-50"></i>
          Nenhum ecoponto cadastrado ainda.<br>
          <button class="btn btn-success btn-sm mt-3" id="firstEco">
            <i class="fas fa-plus me-1"></i>Cadastrar o primeiro
          </button>
        </td>
      </tr>`;
    document.getElementById('firstEco')?.addEventListener('click', _abrirModalNovo);
    return;
  }

  tbody.innerHTML = lista.map(eco => {
    const statusHtml = {
      ativo:      '<span class="badge bg-success">Ativo</span>',
      inativo:    '<span class="badge bg-danger">Inativo</span>',
      manutencao: '<span class="badge bg-warning text-dark">Manutenção</span>',
    }[eco.status] ?? '';

    const tiposTags = (eco.tipos ?? []).map(t =>
      `<span class="badge me-1 badge-type" style="background:${getWasteColor(t)}">${getWasteLabel(t)}</span>`
    ).join('');

    return `
      <tr class="ecoponto-row">
        <td>
          <div class="fw-semibold">${eco.nome}</div>
          <div class="text-muted small text-truncate" style="max-width:200px">${eco.endereco}</div>
        </td>
        <td class="d-none d-md-table-cell text-muted small">${eco.bairro}</td>
        <td class="d-none d-lg-table-cell text-muted small">${eco.horario || '—'}</td>
        <td style="max-width:200px">${tiposTags || '<span class="text-muted small">—</span>'}</td>
        <td>${statusHtml}</td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-outline-primary btn-sm" data-id="${eco.id}" data-action="editar" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" data-id="${eco.id}" data-action="excluir" title="Excluir">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  // Event delegation para ações
  tbody.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const { id, action } = btn.dataset;
      if (action === 'editar')  _abrirModalEditar(id);
      if (action === 'excluir') _confirmarExclusao(id);
    });
  });
}

/* ── Modal — Novo / Editar ─────────────────────────────── */

function _configurarAdmin() {
  _modalBS    = new bootstrap.Modal(document.getElementById('ecoModal'));
  _deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

  document.getElementById('newEcoBtn')?.addEventListener('click', _abrirModalNovo);
  document.getElementById('saveEcoBtn')?.addEventListener('click', _salvarEcoponto);
  document.getElementById('confirmDeleteBtn')?.addEventListener('click', _executarExclusao);
  document.getElementById('exportBtn')?.addEventListener('click', _exportarGeoJSON);
}

function _renderizarChipsTipos() {
  const container = document.getElementById('tiposResiduos');
  if (!container) return;

  container.innerHTML = Object.entries(APP_CONFIG.tiposResiduos).map(([tipo, cfg]) => `
    <label class="chip-toggle me-2 mb-2">
      <input type="checkbox" value="${tipo}" name="tipo_${tipo}">
      <span class="chip-label" style="color:${cfg.cor}; border-color:${cfg.cor}">
        <i class="fas ${cfg.icone} me-1"></i>${cfg.label}
      </span>
    </label>
  `).join('');
}

function _abrirModalNovo() {
  _editandoId = null;
  document.getElementById('modalTitle').innerHTML =
    '<i class="fas fa-plus me-2"></i>Novo Ecoponto';
  document.getElementById('ecoForm').reset();
  _limparCheckboxes();
  _modalBS.show();
}

function _abrirModalEditar(id) {
  const eco = DataManager.buscarPorId(id);
  if (!eco) return;

  _editandoId = id;
  document.getElementById('modalTitle').innerHTML =
    '<i class="fas fa-edit me-2"></i>Editar Ecoponto';

  // Preenche campos
  _setVal('ecoId',      eco.id);
  _setVal('ecoNome',    eco.nome);
  _setVal('ecoEndereco',eco.endereco);
  _setVal('ecoBairro',  eco.bairro);
  _setVal('ecoLat',     eco.lat);
  _setVal('ecoLng',     eco.lng);
  _setVal('ecoHorario', eco.horario);
  _setVal('ecoTelefone',eco.telefone);
  _setVal('ecoEmail',   eco.email);
  _setVal('ecoFoto',    eco.foto);
  _setVal('ecoObs',     eco.obs);

  const statusEl = document.getElementById('ecoStatus');
  if (statusEl) statusEl.value = eco.status;

  // Marca checkboxes dos tipos
  _limparCheckboxes();
  (eco.tipos ?? []).forEach(t => {
    const cb = document.querySelector(`input[name="tipo_${t}"]`);
    if (cb) cb.checked = true;
  });

  _modalBS.show();
}

function _limparCheckboxes() {
  document.querySelectorAll('#tiposResiduos input[type=checkbox]')
    .forEach(cb => { cb.checked = false; });
}

function _coletarTipos() {
  return Array.from(
    document.querySelectorAll('#tiposResiduos input[type=checkbox]:checked')
  ).map(cb => cb.value);
}

function _salvarEcoponto() {
  const nome = document.getElementById('ecoNome')?.value.trim();
  const end  = document.getElementById('ecoEndereco')?.value.trim();
  const bairro = document.getElementById('ecoBairro')?.value.trim();
  const lat  = parseFloat(document.getElementById('ecoLat')?.value);
  const lng  = parseFloat(document.getElementById('ecoLng')?.value);

  // Validação básica
  if (!nome || !end || !bairro || isNaN(lat) || isNaN(lng)) {
    alert('Preencha os campos obrigatórios:\nNome, Endereço, Bairro, Latitude e Longitude.');
    return;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    alert('Coordenadas inválidas. Verifique Latitude e Longitude.');
    return;
  }

  const dados = {
    nome:     nome,
    endereco: end,
    bairro:   bairro,
    lat,
    lng,
    horario:  document.getElementById('ecoHorario')?.value.trim() ?? '',
    telefone: document.getElementById('ecoTelefone')?.value.trim() ?? '',
    email:    document.getElementById('ecoEmail')?.value.trim() ?? '',
    foto:     document.getElementById('ecoFoto')?.value.trim() ?? '',
    obs:      document.getElementById('ecoObs')?.value.trim() ?? '',
    status:   document.getElementById('ecoStatus')?.value ?? 'ativo',
    tipos:    _coletarTipos(),
  };

  if (_editandoId) {
    DataManager.atualizar(_editandoId, dados);
  } else {
    DataManager.criar(dados);
  }

  _modalBS.hide();
  _carregarTabela();
  _atualizarCards();

  _mostrarToast(_editandoId ? 'Ecoponto atualizado com sucesso!' : 'Ecoponto criado com sucesso!');
}

/* ── Exclusão ───────────────────────────────────────────── */

function _confirmarExclusao(id) {
  const eco = DataManager.buscarPorId(id);
  if (!eco) return;
  _deletandoId = id;
  _setEl('deleteEcoName', eco.nome);
  _deleteModal.show();
}

function _executarExclusao() {
  if (!_deletandoId) return;
  DataManager.remover(_deletandoId);
  _deletandoId = null;
  _deleteModal.hide();
  _carregarTabela();
  _atualizarCards();
  _mostrarToast('Ecoponto excluído.', 'warning');
}

/* ── Exportar GeoJSON ───────────────────────────────────── */

function _exportarGeoJSON() {
  const geojson = DataManager.exportarGeoJSON();
  const blob    = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
  const url     = URL.createObjectURL(blob);
  const link    = document.createElement('a');
  link.href     = url;
  link.download = 'ecopontos-maraba.geojson';
  link.click();
  URL.revokeObjectURL(url);
  _mostrarToast('GeoJSON exportado! Substitua o arquivo no repositório.');
}

/* ── Toast de Notificação ───────────────────────────────── */

function _mostrarToast(msg, tipo = 'success') {
  const cores = { success: '#2d7d46', warning: '#e67e22', error: '#c0392b' };
  const toastEl = document.createElement('div');
  toastEl.style.cssText = `
    position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%);
    background:${cores[tipo] ?? cores.success}; color:#fff;
    padding:.7rem 1.5rem; border-radius:8px;
    box-shadow:0 4px 12px rgba(0,0,0,.3);
    z-index:9999; font-weight:600; font-size:.9rem;
    animation: fadeIn .3s ease;
  `;
  toastEl.textContent = msg;
  document.body.appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 3500);
}

/* ── Helpers ───────────────────────────────────────────── */

function _setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function _setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}
