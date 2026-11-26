/* ═══════════════════════════════════════════════════════════
   MAP.JS — Lógica do Mapa Interativo (Leaflet.js)
   
   Funcionalidades:
   - Mapa base OpenStreetMap (gratuito)
   - Marcadores clusterizados por tipo de resíduo / categoria
   - Ícone personalizado para Ecoilhas e ícones por tipo para PEVs
   - Exibição de fotos no popup com ampliação ao clicar
   - Filtros por tipo de resíduo na sidebar
   - Busca por nome/bairro
   - Geolocalização do usuário
   - Popups ricos com botão de rotas ("Como chegar")
   - Lista de ecopontos na sidebar
═══════════════════════════════════════════════════════════ */

/* ── Estado Global ─────────────────────────────────────── */
let _map = null;
let _clusterGroup = null;
let _allMarkers = [];
let _activeFilter = 'all';
let _userLocationMarker = null;

/* ── Inicialização ─────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  _iniciarMapa();
  _carregarEcopontos();
  _configurarBusca();
  _configurarGeolocalizacao();
  _configurarSidebarToggle();
  _configurarWhatsApp();
});

/* ── Helpers de Ícone, Imagem e Cor ────────────────────── */

function _ehEcoIlha(eco) {
  return Boolean(eco.imagem) || /^ecoilha/i.test(eco.nome ?? '') || eco.categoria === 'ecoilha';
}

function _getImagemEcoIlha(eco) {
  return eco.imagem || (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.iconeEcoIlha) || 'img/ecoilha-icon.png';
}

function _resolverIconePonto(eco) {
  if (eco.icone) return eco.icone;
  const tipo = getPrimaryType(eco);
  return tipo ? getWasteIcon(tipo) : 'fa-recycle';
}

function _resolverCorPonto(eco) {
  if (eco.cor) return eco.cor;
  if (_ehEcoIlha(eco)) return APP_CONFIG.corPadrao;
  const tipo = getPrimaryType(eco);
  return tipo ? getWasteColor(tipo) : APP_CONFIG.corPadrao;
}

/* ── Mapa ──────────────────────────────────────────────── */

function _iniciarMapa() {
  const cfg = APP_CONFIG.mapa;

  _map = L.map('map', {
    center: cfg.centro,
    zoom: cfg.zoom,
    minZoom: cfg.zoomMin,
    maxZoom: cfg.zoomMax,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(_map);

  _clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 60,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      const size = count < 10 ? 36 : count < 50 ? 44 : 52;
      return L.divIcon({
        html: `<div class="cluster-icon" style="
          width:${size}px; height:${size}px;
          background:${APP_CONFIG.corPadrao};
          color:#fff; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-weight:700; font-size:.85rem;
          box-shadow: 0 2px 8px rgba(0,0,0,.35);
          border: 3px solid rgba(255,255,255,.8);
        ">${count}</div>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    },
  });

  _map.addLayer(_clusterGroup);
}

/* ── Carregamento dos Ecopontos ────────────────────────── */

function _carregarEcopontos() {
  const ecopontos = DataManager.listarTodos();

  _allMarkers = [];
  _clusterGroup.clearLayers();

  ecopontos.forEach(eco => {
    const marker = _criarMarcador(eco);
    if (marker) {
      _allMarkers.push({ marker, eco });
      _clusterGroup.addLayer(marker);
    }
  });

  _atualizarStats();
  _renderizarFiltros();
  _renderizarLista();
}

/* ── Criação de Marcador ───────────────────────────────── */

function _criarMarcador(eco) {
  const lat = Number(eco.lat);
  const lng = Number(eco.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  let iconHtml = '';
  let iconSize = [36, 48];
  let iconAnchor = [18, 48];
  let popupAnchor = [0, -48];

  if (_ehEcoIlha(eco)) {
    const imgUrl = _getImagemEcoIlha(eco);
    iconSize = [46, 46];
    iconAnchor = [23, 23];
    popupAnchor = [0, -24];
    iconHtml = `
      <div style="
        width:46px; height:46px;
        background:#ffffff;
        border-radius:10px;
        padding:3px;
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 3px 8px rgba(0,0,0,.35);
        border:2px solid #2d7d46;
      ">
        <img src="${imgUrl}" alt="${eco.nome}"
             style="width:100%; height:100%; object-fit:contain; display:block;">
      </div>
    `;
  } else {
    const cor = _resolverCorPonto(eco);
    const icone = _resolverIconePonto(eco);
    iconHtml = `
      <div style="
        width:36px; height:48px;
        display:flex; align-items:center; justify-content:center;
        position:relative;
      ">
        <div style="
          width:36px; height:36px;
          background:${cor};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow: 0 3px 8px rgba(0,0,0,.4);
          border: 3px solid rgba(255,255,255,.85);
        "></div>
        <i class="fas ${icone}" style="
          position:absolute; top:5px;
          font-size:.85rem; color:#fff;
          pointer-events:none;
        "></i>
      </div>
    `;
  }

  const icon = L.divIcon({
    html: iconHtml,
    className: '',
    iconSize,
    iconAnchor,
    popupAnchor,
  });

  const marker = L.marker([lat, lng], { icon });
  marker.bindPopup(_criarPopup({ ...eco, lat, lng }), {
    maxWidth: 320,
    className: 'eco-popup-wrapper',
  });

  marker.on('click', () => _destacarSidebarItem(eco.id));

  return marker;
}

/* ── Popup do Ecoponto ─────────────────────────────────── */

function _criarPopup(eco) {
  const cor = _resolverCorPonto(eco);

  const tags = (eco.tipos ?? []).map(t =>
    `<span class="eco-popup-tag" style="background:${getWasteColor(t)}">
      <i class="fas ${getWasteIcon(t)}" style="font-size:.6rem"></i>
      ${getWasteLabel(t)}
    </span>`
  ).join('');

  const statusMap = {
    ativo: '<span class="status-badge status-ativo">✅ Ativo</span>',
    inativo: '<span class="status-badge status-inativo">❌ Inativo</span>',
    manutencao: '<span class="status-badge status-manutencao">🔧 Manutenção</span>',
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${eco.lat},${eco.lng}`;

  const whatsappBtn = eco.telefone
    ? `<a href="https://wa.me/55${eco.telefone.replace(/\D/g, '')}?text=Ol%C3%A1!%20Tenho%20d%C3%BAvidas%20sobre%20o%20ecoponto." 
           target="_blank" rel="noopener" class="btn btn-sm btn-success">
         <i class="fab fa-whatsapp"></i>
       </a>`
    : '';

  const fotoHtml = eco.foto
    ? `<a href="${eco.foto}" target="_blank" rel="noopener" title="Clique para ampliar a foto">
         <img src="${eco.foto}" alt="Foto de ${eco.nome}" class="w-100 rounded mb-2"
              style="max-height:135px; object-fit:cover; cursor:zoom-in;"
              onerror="this.parentElement.style.display='none'">
       </a>`
    : '';

  return `
    <div class="eco-popup">
      <div class="eco-popup-header text-white" style="background:${cor}; margin:-13px -20px 8px; padding:10px 14px; border-radius:4px 4px 0 0;">
        <div>
          <div style="font-weight:700; font-size:.9rem">${eco.nome}</div>
          <div style="font-size:.75rem; opacity:.9">${eco.bairro}</div>
        </div>
      </div>

      ${fotoHtml}

      ${statusMap[eco.status] ?? ''}

      <div class="eco-popup-row mt-2">
        <i class="fas fa-map-marker-alt text-danger"></i>
        <span>${eco.endereco}</span>
      </div>

      ${eco.horario ? `
      <div class="eco-popup-row">
        <i class="fas fa-clock" style="color:${cor}"></i>
        <span>${eco.horario}</span>
      </div>` : ''}

      ${eco.telefone ? `
      <div class="eco-popup-row">
        <i class="fas fa-phone text-success"></i>
        <span>${eco.telefone}</span>
      </div>` : ''}

      ${eco.obs ? `
      <div class="eco-popup-row">
        <i class="fas fa-info-circle text-primary"></i>
        <span style="font-size:.76rem; color:#666">${eco.obs}</span>
      </div>` : ''}

      <div style="margin-top:.5rem">
        <div style="font-size:.7rem; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin-bottom:.3rem">Resíduos aceitos</div>
        <div class="eco-popup-tags">${tags}</div>
      </div>

      <div class="eco-popup-actions mt-2">
        <a href="${googleMapsUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">
          <i class="fas fa-route me-1"></i>Como chegar
        </a>
        ${whatsappBtn}
      </div>
    </div>
  `;
}

/* ── Filtros ───────────────────────────────────────────── */

function _renderizarFiltros() {
  const container = document.getElementById('filterList');
  if (!container) return;

  const ecopontos = DataManager.listarTodos();

  const contagens = { all: ecopontos.length };
  Object.keys(APP_CONFIG.tiposResiduos).forEach(tipo => {
    contagens[tipo] = ecopontos.filter(e => (e.tipos ?? []).includes(tipo)).length;
  });

  const fcAll = document.getElementById('fc-all');
  if (fcAll) fcAll.textContent = contagens.all;

  const chipsHtml = Object.entries(APP_CONFIG.tiposResiduos)
    .map(([tipo, cfg]) => `
      <div class="filter-chip" data-filter="${tipo}">
        <span class="filter-dot" style="background:${cfg.cor}"></span>
        ${cfg.label}
        <span class="ms-auto badge bg-secondary">${contagens[tipo] ?? 0}</span>
      </div>
    `).join('');

  const todosChip = container.querySelector('[data-filter="all"]');
  container.innerHTML = '';
  if (todosChip) container.appendChild(todosChip);
  container.insertAdjacentHTML('beforeend', chipsHtml);

  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => _aplicarFiltro(chip.dataset.filter));
  });

  _aplicarFiltro(_activeFilter);
}

function _aplicarFiltro(tipo) {
  _activeFilter = tipo;

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === tipo);
  });

  _clusterGroup.clearLayers();
  _allMarkers.forEach(({ marker, eco }) => {
    const visivel = tipo === 'all' || (eco.tipos ?? []).includes(tipo);
    if (visivel) _clusterGroup.addLayer(marker);
  });

  _renderizarLista(tipo);
}

/* ── Lista de Ecopontos na Sidebar ─────────────────────── */

function _renderizarLista(filtro = _activeFilter) {
  const container = document.getElementById('ecopointsList');
  if (!container) return;

  const ecopontos = DataManager.listarTodos();
  const termoBusca = document.getElementById('searchInput')?.value.toLowerCase() ?? '';

  const filtrados = ecopontos.filter(eco => {
    const passaFiltro = filtro === 'all' || (eco.tipos ?? []).includes(filtro);
    const passaBusca = !termoBusca ||
      eco.nome.toLowerCase().includes(termoBusca) ||
      eco.bairro.toLowerCase().includes(termoBusca) ||
      eco.endereco.toLowerCase().includes(termoBusca);
    return passaFiltro && passaBusca;
  });

  if (filtrados.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search-minus"></i>
        <p class="small">Nenhum ecoponto encontrado<br>para o filtro selecionado.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtrados.map(eco => {
    const cor = _resolverCorPonto(eco);
    const icone = _resolverIconePonto(eco);
    const temCoords = Number.isFinite(Number(eco.lat)) && Number.isFinite(Number(eco.lng));

    const iconeHtml = _ehEcoIlha(eco)
      ? `<div class="ecoponto-card-icon" style="background:#ffffff; border:1px solid #d5e5da; padding:3px;">
           <img src="${_getImagemEcoIlha(eco)}" alt="${eco.nome}"
                style="width:100%; height:100%; object-fit:contain; display:block;">
         </div>`
      : `<div class="ecoponto-card-icon" style="background:${cor}">
           <i class="fas ${icone}"></i>
         </div>`;

    const statusDot = eco.status !== 'ativo'
      ? `<span class="ms-1" title="${eco.status}">
           ${eco.status === 'inativo' ? '🔴' : '🟡'}
         </span>`
      : '';

    const semCoordsBadge = !temCoords
      ? `<span class="ms-1 badge bg-light text-dark border" style="font-size:.6rem">Sem coord.</span>`
      : '';

    const tipos = eco.tipos ?? [];
    const tiposTags = tipos.slice(0, 3).map(t =>
      `<span style="
        font-size:.65rem; font-weight:700; padding:.1rem .4rem;
        border-radius:999px; background:${getWasteColor(t)}22;
        color:${getWasteColor(t)}; border:1px solid ${getWasteColor(t)}55;
      ">${getWasteLabel(t)}</span>`
    ).join('') + (tipos.length > 3
      ? `<span style="font-size:.65rem; color:#999">+${tipos.length - 3}</span>`
      : '');

    return `
      <div class="ecoponto-card" data-id="${eco.id}" role="button" title="${eco.nome}">
        ${iconeHtml}
        <div class="ecoponto-card-info flex-fill" style="min-width:0">
          <div class="title text-truncate">${eco.nome}${statusDot}${semCoordsBadge}</div>
          <div class="subtitle text-truncate">${eco.bairro}</div>
          <div class="badges mt-1">${tiposTags}</div>
        </div>
        <i class="fas fa-chevron-right text-muted small align-self-center ms-1"></i>
      </div>`;
  }).join('');

  container.querySelectorAll('.ecoponto-card').forEach(card => {
    card.addEventListener('click', () => _focarEcoponto(card.dataset.id));
  });
}

function _focarEcoponto(id) {
  const item = _allMarkers.find(m => m.eco.id === id);
  if (!item) {
    alert('Este ponto ainda não possui coordenadas cadastradas para exibição no mapa.');
    return;
  }

  _map.setView([Number(item.eco.lat), Number(item.eco.lng)], 16, { animate: true });
  setTimeout(() => item.marker.openPopup(), 400);
  _destacarSidebarItem(id);

  if (window.innerWidth < 992) {
    document.getElementById('sidebar')?.classList.remove('open');
  }
}

function _destacarSidebarItem(id) {
  document.querySelectorAll('.ecoponto-card').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

/* ── Busca ─────────────────────────────────────────────── */

function _configurarBusca() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');

  if (!input) return;

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => _renderizarLista(), 300);
  });

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    _renderizarLista();
    input.focus();
  });
}

/* ── Estatísticas ──────────────────────────────────────── */

function _atualizarStats() {
  const stats = DataManager.estatisticas();
  _setEl('stat-total', stats.total);
  _setEl('stat-active', stats.ativos);
  _setEl('stat-types', Object.keys(APP_CONFIG.tiposResiduos).length);
}

/* ── Geolocalização ────────────────────────────────────── */

function _configurarGeolocalizacao() {
  const btn = document.getElementById('btnGeo');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i><span class="d-none d-sm-inline">Localizando...</span>';

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;

        if (_userLocationMarker) _map.removeLayer(_userLocationMarker);

        const userIcon = L.divIcon({
          html: `<div style="
            width:20px; height:20px; background:#4285f4;
            border-radius:50%; border:3px solid #fff;
            box-shadow:0 2px 6px rgba(0,0,0,.4);
          "></div>`,
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        _userLocationMarker = L.marker([lat, lng], { icon: userIcon })
          .addTo(_map)
          .bindPopup('<strong>📍 Você está aqui</strong>')
          .openPopup();

        _map.setView([lat, lng], 15, { animate: true });

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-location-crosshairs me-1"></i><span class="d-none d-sm-inline">Me encontrar</span>';
      },
      err => {
        console.warn('[Geolocalização]', err.message);
        alert('Não foi possível obter sua localização.\nVerifique as permissões do navegador.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-location-crosshairs me-1"></i><span class="d-none d-sm-inline">Me encontrar</span>';
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  });
}

/* ── Sidebar Toggle (mobile) ───────────────────────────── */

function _configurarSidebarToggle() {
  const btn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  btn?.addEventListener('click', () => sidebar?.classList.toggle('open'));

  _map?.on('click', () => {
    if (window.innerWidth < 992) sidebar?.classList.remove('open');
  });
}

/* ── WhatsApp Share ────────────────────────────────────── */

function _configurarWhatsApp() {
  const texto = encodeURIComponent(`Encontre o ecoponto mais próximo em Marabá/PA e descarte corretamente seus recicláveis! 🌱♻️ ${APP_CONFIG.urlPublica}`);
  const shareEl = document.getElementById('whatsappShare');
  if (shareEl) shareEl.href = `https://wa.me/?text=${texto}`;
}

/* ── Helpers ───────────────────────────────────────────── */

function _setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
