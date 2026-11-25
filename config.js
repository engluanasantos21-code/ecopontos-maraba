/* ═══════════════════════════════════════════════════════════
   CONFIGURAÇÃO — Ecopontos Marabá/PA
   Edite aqui as configurações do projeto.
═══════════════════════════════════════════════════════════ */

const APP_CONFIG = {

  // ── Informações da cidade ──────────────────────────────
  cidade:   'Marabá',
  estado:   'PA',
  titulo:   'Ecopontos Marabá/PA',
  descricao:'Mapa de pontos de coleta de recicláveis em Marabá/PA',

  // ── Configurações do mapa (Leaflet) ───────────────────
  mapa: {
    centro:  [-5.3686, -49.1178],  // Centro de Marabá
    zoom:    13,
    zoomMin: 10,
    zoomMax: 19,
  },

  // ── Autenticação do painel admin ──────────────────────
  // SHA-256 da senha de acesso ao painel admin.
  // SENHA PADRÃO: ecopontos2024  (troque antes de publicar!)
  //
  // Para gerar um novo hash:
  //   1. Acesse: https://emn178.github.io/online-tools/sha256.html
  //   2. Digite a nova senha
  //   3. Cole o hash gerado abaixo
  //
  adminPasswordHash: '7bab2f86c89c8e30a7de0f9b9748d0a44fe3bda9fdf8f07bfef28b0b0c649e4f',
  // Senha padrão acima = "ecopontos2024"

  // ── Firebase (opcional — para backend em nuvem) ───────
  // Deixe como null para usar localStorage (modo demo/offline).
  // Para usar Firebase:
  //   1. Crie um projeto em https://console.firebase.google.com
  //   2. Ative o Firestore Database (modo teste para começar)
  //   3. Cole as credenciais abaixo
  firebase: null,
  // firebase: {
  //   apiKey:            "AIzaSy...",
  //   authDomain:        "meu-projeto.firebaseapp.com",
  //   projectId:         "meu-projeto",
  //   storageBucket:     "meu-projeto.appspot.com",
  //   messagingSenderId: "123456789",
  //   appId:             "1:123456789:web:abcdef",
  // },
  // firestoreCollection: 'ecopontos',  // nome da coleção no Firestore

  // ── Tipos de Resíduos ─────────────────────────────────
  // Adicione ou remova tipos conforme a necessidade.
  tiposResiduos: {
    plastico:   { label: 'Plástico',          cor: '#e74c3c', icone: 'fa-wine-bottle'  },
    papel:      { label: 'Papel / Papelão',   cor: '#3498db', icone: 'fa-newspaper'    },
    vidro:      { label: 'Vidro',             cor: '#27ae60', icone: 'fa-glass-water'  },
    metal:      { label: 'Metal / Alumínio',  cor: '#f1c40f', icone: 'fa-gear'         },
    oleo:       { label: 'Óleo de Cozinha',   cor: '#e67e22', icone: 'fa-droplet'      },
    eletronico: { label: 'Eletrônico (REEE)', cor: '#9b59b6', icone: 'fa-laptop'       },
    organico:   { label: 'Orgânico',          cor: '#795548', icone: 'fa-seedling'     },
  },

  // ── Cor principal do marcador (ecopontos com múltiplos tipos) ─
  corPadrao: '#2d7d46',

  // ── URL de compartilhamento (WhatsApp) ────────────────
  // Substitua pela URL real do seu site após publicar no GitHub Pages
  urlPublica: 'https://seuusuario.github.io/ecopontos-maraba/',

};

/* ══════════════════════════════════════════════════════════
   Utilitários de configuração (não editar abaixo)
══════════════════════════════════════════════════════════ */

/**
 * Retorna a cor de um tipo de resíduo (ou a cor padrão se não encontrado).
 */
function getWasteColor(tipo) {
  return APP_CONFIG.tiposResiduos[tipo]?.cor ?? APP_CONFIG.corPadrao;
}

/**
 * Retorna o ícone Font Awesome de um tipo de resíduo.
 */
function getWasteIcon(tipo) {
  return APP_CONFIG.tiposResiduos[tipo]?.icone ?? 'fa-recycle';
}

/**
 * Retorna o label legível de um tipo de resíduo.
 */
function getWasteLabel(tipo) {
  return APP_CONFIG.tiposResiduos[tipo]?.label ?? tipo;
}

/**
 * Retorna o primeiro tipo de resíduo de um ecoponto (para definir a cor do marcador).
 */
function getPrimaryType(ecoponto) {
  const tipos = ecoponto.tipos ?? [];
  return tipos.length > 0 ? tipos[0] : null;
}

/**
 * Verifica a senha admin comparando o hash SHA-256.
 */
async function verificarSenha(senha) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === APP_CONFIG.adminPasswordHash;
}
