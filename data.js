/* ═══════════════════════════════════════════════════════════
   DATA.JS — Gerenciamento de Dados dos Ecopontos / PEVs
   Atualizado em: 26/11/2026, 18:24:18
═══════════════════════════════════════════════════════════ */

const DADOS_DEMO = [
  {
    "id": "eco-001",
    "nome": "EcoIlha01",
    "endereco": "Ministério Público do Estado do Pará",
    "bairro": "Amapá",
    "lat": -5.359675,
    "lng": -49.122923,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-002",
    "nome": "EcoIlha02",
    "endereco": "Praça São Francisco",
    "bairro": "Cidade Nova",
    "lat": -5.370558,
    "lng": -49.127927,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-003",
    "nome": "EcoIlha03",
    "endereco": "Praça da Liberdade",
    "bairro": "Liberdade",
    "lat": -5.393406,
    "lng": -49.13745,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-004",
    "nome": "EcoIlha04",
    "endereco": "Praça do Maçom",
    "bairro": "Nova Marabá",
    "lat": -5.353925,
    "lng": -49.082125,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-005",
    "nome": "EcoIlha05",
    "endereco": "Ginásio FL 16",
    "bairro": "Nova Marabá",
    "lat": -5.338396,
    "lng": -49.092878,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-006",
    "nome": "EcoIlha06",
    "endereco": "Praça FL 12",
    "bairro": "Nova Marabá",
    "lat": -5.328796,
    "lng": -49.098439,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "vidro",
      "metal"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z",
    "atualizadoEm": "2026-11-26T21:24:16.305Z"
  },
  {
    "id": "eco-007",
    "nome": "EcoIlha07",
    "endereco": "Praça da Prefeitura",
    "bairro": "Nova Marabá",
    "lat": -5.347094,
    "lng": -49.097953,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-008",
    "nome": "EcoIlha08",
    "endereco": "Hospital Municipal de Marabá",
    "bairro": "Nova Marabá",
    "lat": -5.341385,
    "lng": -49.086611,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-009",
    "nome": "EcoIlha09",
    "endereco": "Av. Tocantins",
    "bairro": "Novo Horizonte",
    "lat": -5.367,
    "lng": -49.122689,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-010",
    "nome": "EcoIlha10",
    "endereco": "Praça São Félix de Valois - Orla Sebastião Miranda",
    "bairro": "Velha Marabá",
    "lat": -5.35052,
    "lng": -49.139438,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-011",
    "nome": "EcoIlha11",
    "endereco": "Orla Sebastião Miranda - Proximo as quadras",
    "bairro": "Velha Marabá",
    "lat": -5.341289,
    "lng": -49.128844,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-012",
    "nome": "EcoIlha12",
    "endereco": "Av. Getúlio Vargas",
    "bairro": "Velha Marabá",
    "lat": -5.348494,
    "lng": -49.135669,
    "horario": "24h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "plastico",
      "papel",
      "metal",
      "vidro"
    ],
    "status": "ativo",
    "obs": "Ecoilhas da Prefeitura Municipal de Marabá. Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-013",
    "nome": "Casas Bahia",
    "endereco": "Av. Antônio Maia, 1538.",
    "bairro": "Velha Marabá",
    "lat": -5.348941,
    "lng": -49.131519,
    "horario": "Seg–Sex 8h30–17h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "eletronico"
    ],
    "status": "ativo",
    "obs": "No momento está desativado mas em breve retornará a receber. Coleta domiciliar: Não. Fonte: https://greeneletron.org.br/onde-descartar/lista-pev/?cidade=Marab%C3%A1&estado=PA",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-014",
    "nome": "Sesc",
    "endereco": "Avenida Transamazônica, 1925",
    "bairro": "Cidade Nova",
    "lat": -5.367926,
    "lng": -49.127573,
    "horario": "Seg–Sex 8h30–17h",
    "telefone": "(94) 3324-4444",
    "email": "",
    "foto": "",
    "tipos": [
      "pilhas"
    ],
    "status": "inativo",
    "obs": "EM CASO DE DÚVIDA OU PARA DESCARTE DE PRODUTOS DE MAIOR PORTE COMO GELADEIRAS E FOGÕES, POR FAVOR ENTRAR EM CONTATO VIA E-MAIL: COLETA@ABREE.ORG.BR OU VIA WHATSAPP +55 11 97811-6126 E +55 11 98991-4558. Coleta domiciliar: Não. Fonte: https://greeneletron.org.br/onde-descartar/lista-pev/?cidade=Marab%C3%A1&estado=PA",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-015",
    "nome": "MAGAZINE LUIZA - FILIAL 1312  - Abree",
    "endereco": "AVENIDA NAGIB MUTRAN, 142",
    "bairro": "Cidade Nova",
    "lat": -5.369322,
    "lng": -49.127442,
    "horario": "Seg–Sex 8h30–17h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "eletronico"
    ],
    "status": "ativo",
    "obs": "EM CASO DE DÚVIDA OU PARA DESCARTE DE PRODUTOS DE MAIOR PORTE COMO GELADEIRAS E FOGÕES, POR FAVOR ENTRAR EM CONTATO VIA E-MAIL: COLETA@ABREE.ORG.BR OU VIA WHATSAPP +55 11 97811-6126 E +55 11 98991-4558. Coleta domiciliar: Não. Fonte: https://abree.org.br/",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-016",
    "nome": "MAGAZINE LUIZA - FILIAL 1313  - Abree",
    "endereco": "AVENIDA ANTONIO MAIA, 1065",
    "bairro": "Velha Marabá",
    "lat": -5.350274,
    "lng": -49.135639,
    "horario": "Seg–Sex 8h30–17h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "eletronico"
    ],
    "status": "ativo",
    "obs": "EM CASO DE DÚVIDA OU PARA DESCARTE DE PRODUTOS DE MAIOR PORTE COMO GELADEIRAS E FOGÕES, POR FAVOR ENTRAR EM CONTATO VIA E-MAIL: COLETA@ABREE.ORG.BR OU VIA WHATSAPP +55 11 97811-6126 E +55 11 98991-4558. Coleta domiciliar: Não. Fonte: https://abree.org.br/",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-017",
    "nome": "Vivo - Loja Marabá",
    "endereco": "Avenida Frei Raimundo Lambezart Lamberzale, Lote 2237 - Quadra 21 ·",
    "bairro": "Cidade Nova",
    "lat": -5.370752,
    "lng": -49.128628,
    "horario": "Seg–Sex 8h–18h| Sab– 8h–14h",
    "telefone": "(94) 99184-4404",
    "email": "",
    "foto": "",
    "tipos": [
      "eletronico",
      "pilhas"
    ],
    "status": "ativo",
    "obs": "Recomendamos contato prévio: confirme condições e horários de coleta antes de ir. Coleta domiciliar: Não. Fonte: https://www.ecycle.com.br/posto/posto-de-entrega-voluntaria/pa/vivo--loja-maraba/16334",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "eco-018",
    "nome": "Varejão das baterias",
    "endereco": "AVENIDA ANTONIO MAIA",
    "bairro": "Velha Marabá",
    "lat": -5.348417,
    "lng": -49.130048,
    "horario": "Seg–Sex 8h30–17h",
    "telefone": "",
    "email": "",
    "foto": "",
    "tipos": [
      "eletronico",
      "pilhas"
    ],
    "status": "ativo",
    "obs": "Coleta domiciliar: Não.",
    "criadoEm": "2026-01-01T00:00:00.000Z"
  }
];

const DataManager = (() => {
  const STORAGE_KEY = 'ecopontos_maraba_v1795728258335';

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
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

  return {
    listarTodos() { return _load(); },
    listarAtivos() { return _load().filter(e => e.status === 'ativo'); },
    buscarPorId(id) { return _load().find(e => e.id === id) ?? null; },
    criar(dados) {
      const lista = _load();
      const novo = { ...dados, id: _gerarId(), criadoEm: new Date().toISOString() };
      lista.push(novo);
      _save(lista);
      return novo;
    },
    atualizar(id, dadosAtualizados) {
      const lista = _load();
      const idx = lista.findIndex(e => e.id === id);
      if (idx === -1) return null;
      lista[idx] = { ...lista[idx], ...dadosAtualizados, id, atualizadoEm: new Date().toISOString() };
      _save(lista);
      return lista[idx];
    },
    remover(id) {
      const lista = _load();
      const nova = lista.filter(e => e.id !== id);
      if (nova.length === lista.length) return false;
      _save(nova);
      return true;
    },
    exportarGeoJSON() {
      const lista = _load();
      return {
        type: 'FeatureCollection',
        name: 'Ecopontos_Maraba',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: lista.map(e => ({
          type: 'Feature',
          properties: {
            id: e.id, nome: e.nome, endereco: e.endereco, bairro: e.bairro,
            horario: e.horario, telefone: e.telefone, email: e.email,
            foto: e.foto, tipos: (e.tipos ?? []).join(','),
            status: e.status, obs: e.obs, criadoEm: e.criadoEm,
          },
          geometry: { type: 'Point', coordinates: [e.lng, e.lat] },
        })),
      };
    },
    importarGeoJSON(geojson) {
      if (geojson.type !== 'FeatureCollection') throw new Error('GeoJSON inválido');
      const lista = geojson.features.map(f => ({
        id: f.properties.id ?? _gerarId(),
        nome: f.properties.nome ?? '',
        endereco: f.properties.endereco ?? '',
        bairro: f.properties.bairro ?? '',
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        horario: f.properties.horario ?? '',
        telefone: f.properties.telefone ?? '',
        email: f.properties.email ?? '',
        foto: f.properties.foto ?? '',
        tipos: (f.properties.tipos ?? '').split(',').filter(Boolean),
        status: f.properties.status ?? 'ativo',
        obs: f.properties.obs ?? '',
        criadoEm: f.properties.criadoEm ?? new Date().toISOString(),
      }));
      _save(lista);
      return lista;
    },
    estatisticas() {
      const lista = _load();
      return {
        total: lista.length,
        ativos: lista.filter(e => e.status === 'ativo').length,
        inativos: lista.filter(e => e.status === 'inativo').length,
        manutencao: lista.filter(e => e.status === 'manutencao').length,
        bairros: new Set(lista.map(e => e.bairro)).size,
      };
    },
  };
})();
