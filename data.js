/* ═══════════════════════════════════════════════════════════
   DATA.JS — Gerenciamento de Dados dos Ecopontos
   
   Estratégia de armazenamento:
     • Modo demo (padrão): localStorage do navegador
     • Modo produção: Firebase Firestore (configure em config.js)
   
   Os dados de demo são perdidos ao limpar o navegador.
   Para persistência real, configure o Firebase.
═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   DADOS DE EXEMPLO — Ecopontos de Marabá/PA
   Substitua ou complemente com seus dados reais do QGIS.
   
   Formato para importar do QGIS:
     Exporte como GeoJSON → copie as features para o array abaixo
     (ou coloque em data-ecopontos.json e carregue via fetch)
────────────────────────────────────────────────────────── */
const DADOS_DEMO = [
  {
    id: 'eco-001',
    nome: 'Ecoponto Folha 31',
    endereco: 'Av. dos Pioneiros, s/n — Folha 31',
    bairro: 'Folha 31 (Nova Marabá)',
    lat: -5.3598,
    lng: -49.1058,
    horario: 'Seg–Sex 8h–17h | Sáb 8h–12h',
    telefone: '(94) 3322-0001',
    email: '',
    foto: '',
    tipos: ['plastico', 'papel', 'metal', 'vidro'],
    status: 'ativo',
    obs: 'Ponto de referência: próximo ao campo society da Folha 31.',
    criadoEm: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'eco-002',
    nome: 'Ecoponto Cidade Nova',
    endereco: 'Rua C, Quadra 12 — Cidade Nova',
    bairro: 'Cidade Nova',
    lat: -5.3912,
    lng: -49.1340,
    horario: 'Seg–Sáb 7h–18h',
    telefone: '(94) 3322-0002',
    email: 'ecoponto@maraba.pa.gov.br',
    foto: '',
    tipos: ['plastico', 'papel', 'vidro', 'oleo'],
    status: 'ativo',
    obs: 'Aceita óleo de cozinha em recipientes fechados (máx. 5L por visita).',
    criadoEm: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'eco-003',
    nome: 'Ecoponto Velha Marabá',
    endereco: 'Av. Antônio Maia, 500 — Velha Marabá',
    bairro: 'Velha Marabá (Centro)',
    lat: -5.3734,
    lng: -49.1160,
    horario: 'Seg–Sex 8h–17h',
    telefone: '(94) 3322-0003',
    email: '',
    foto: '',
    tipos: ['plastico', 'papel', 'metal', 'vidro', 'eletronico'],
    status: 'ativo',
    obs: 'Aceita REEE (resíduos eletroeletrônicos): celulares, pilhas, baterias.',
    criadoEm: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'eco-004',
    nome: 'Ecoponto São Félix',
    endereco: 'Rua dos Ipês, s/n — São Félix',
    bairro: 'São Félix',
    lat: -5.3620,
    lng: -49.1250,
    horario: 'Ter e Qui 8h–17h | Sáb 8h–13h',
    telefone: '',
    email: '',
    foto: '',
    tipos: ['plastico', 'papel', 'organico'],
    status: 'ativo',
    obs: 'Ponto gerenciado pela associação de moradores local.',
    criadoEm: new Date('2024-03-01').toISOString(),
  },
  {
    id: 'eco-005',
    nome: 'Ecoponto Marabá Pioneira',
    endereco: 'Av. Marechal Rondon, 1200',
    bairro: 'Marabá Pioneira',
    lat: -5.3680,
    lng: -49.1230,
    horario: 'Seg–Sex 8h–17h',
    telefone: '(94) 3322-0005',
    email: '',
    foto: '',
    tipos: ['plastico', 'metal', 'vidro'],
    status: 'manutencao',
    obs: 'Temporariamente em manutenção. Previsão de reabertura: em breve.',
    criadoEm: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'eco-006',
    nome: 'Ecoponto Bairro Liberdade',
    endereco: 'Rua da Paz, s/n — Liberdade',
    bairro: 'Liberdade',
    lat: -5.3800,
    lng: -49.1050,
    horario: 'Seg–Sex 8h–17h | Sáb 8h–12h',
    telefone: '(94) 3322-0006',
    email: '',
    foto: '',
    tipos: ['plastico', 'papel', 'vidro', 'metal', 'oleo'],
    status: 'ativo',
    obs: '',
    criadoEm: new Date('2024-04-10').toISOString(),
  },
];

/* ──────────────────────────────────────────────────────────
   GERENCIADOR DE DADOS
────────────────────────────────────────────────────────── */
const DataManager = (() => {
  const STORAGE_KEY = 'ecopontos_maraba_v1';

  /* -- helpers internos -- */

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* ignora erros de parse */ }
    // Primeira execução — carrega dados de demo
    _save(DADOS_DEMO);
    return [...DADOS_DEMO];
  }

  function _save(dados) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    } catch (e) {
      console.error('[DataManager] Erro ao salvar no localStorage:', e);
    }
  }

  function _gerarId() {
    return 'eco-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
  }

  /* -- API pública -- */

  return {

    /**
     * Retorna todos os ecopontos.
     * @returns {Array}
     */
    listarTodos() {
      return _load();
    },

    /**
     * Retorna apenas os ecopontos ativos.
     * @returns {Array}
     */
    listarAtivos() {
      return _load().filter(e => e.status === 'ativo');
    },

    /**
     * Busca um ecoponto pelo ID.
     * @param {string} id
     * @returns {Object|null}
     */
    buscarPorId(id) {
      return _load().find(e => e.id === id) ?? null;
    },

    /**
     * Cria um novo ecoponto.
     * @param {Object} dados  — dados do ecoponto (sem id/criadoEm)
     * @returns {Object} ecoponto criado
     */
    criar(dados) {
      const lista = _load();
      const novo = {
        ...dados,
        id: _gerarId(),
        criadoEm: new Date().toISOString(),
      };
      lista.push(novo);
      _save(lista);
      return novo;
    },

    /**
     * Atualiza um ecoponto existente pelo ID.
     * @param {string} id
     * @param {Object} dadosAtualizados
     * @returns {Object|null} ecoponto atualizado
     */
    atualizar(id, dadosAtualizados) {
      const lista = _load();
      const idx = lista.findIndex(e => e.id === id);
      if (idx === -1) return null;
      lista[idx] = { ...lista[idx], ...dadosAtualizados, id, atualizadoEm: new Date().toISOString() };
      _save(lista);
      return lista[idx];
    },

    /**
     * Remove um ecoponto pelo ID.
     * @param {string} id
     * @returns {boolean}
     */
    remover(id) {
      const lista = _load();
      const nova = lista.filter(e => e.id !== id);
      if (nova.length === lista.length) return false;
      _save(nova);
      return true;
    },

    /**
     * Exporta todos os ecopontos como GeoJSON.
     * @returns {Object} FeatureCollection GeoJSON
     */
    exportarGeoJSON() {
      const lista = _load();
      return {
        type: 'FeatureCollection',
        name: 'Ecopontos_Maraba',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: lista.map(e => ({
          type: 'Feature',
          properties: {
            id:        e.id,
            nome:      e.nome,
            endereco:  e.endereco,
            bairro:    e.bairro,
            horario:   e.horario,
            telefone:  e.telefone,
            email:     e.email,
            foto:      e.foto,
            tipos:     e.tipos.join(','),
            status:    e.status,
            obs:       e.obs,
            criadoEm:  e.criadoEm,
          },
          geometry: {
            type: 'Point',
            coordinates: [e.lng, e.lat],
          },
        })),
      };
    },

    /**
     * Importa ecopontos a partir de um GeoJSON (FeatureCollection).
     * Sobrescreve todos os dados existentes.
     * @param {Object} geojson
     */
    importarGeoJSON(geojson) {
      if (geojson.type !== 'FeatureCollection') throw new Error('GeoJSON inválido');
      const lista = geojson.features.map(f => ({
        id:       f.properties.id ?? _gerarId(),
        nome:     f.properties.nome ?? '',
        endereco: f.properties.endereco ?? '',
        bairro:   f.properties.bairro ?? '',
        lat:      f.geometry.coordinates[1],
        lng:      f.geometry.coordinates[0],
        horario:  f.properties.horario ?? '',
        telefone: f.properties.telefone ?? '',
        email:    f.properties.email ?? '',
        foto:     f.properties.foto ?? '',
        tipos:    (f.properties.tipos ?? '').split(',').filter(Boolean),
        status:   f.properties.status ?? 'ativo',
        obs:      f.properties.obs ?? '',
        criadoEm: f.properties.criadoEm ?? new Date().toISOString(),
      }));
      _save(lista);
      return lista;
    },

    /**
     * Estatísticas rápidas.
     * @returns {Object}
     */
    estatisticas() {
      const lista = _load();
      const ativos    = lista.filter(e => e.status === 'ativo').length;
      const inativos  = lista.filter(e => e.status === 'inativo').length;
      const manut     = lista.filter(e => e.status === 'manutencao').length;
      const bairros   = new Set(lista.map(e => e.bairro)).size;
      return { total: lista.length, ativos, inativos, manutencao: manut, bairros };
    },

  };
})();
