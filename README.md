# 🌱 WebGIS Ecopontos — Marabá/PA

> Mapa interativo de pontos de coleta de resíduos recicláveis de Marabá/PA.  
> **100% gratuito** — Leaflet.js + OpenStreetMap + GitHub Pages.

---

## 🗺️ O que é este projeto

Um WebGIS público para a comunidade de Marabá/PA encontrar os ecopontos de coleta seletiva mais próximos e descartar corretamente seus resíduos recicláveis.

**Funcionalidades:**
- 🗺️ Mapa interativo com marcadores clusterizados
- 🎨 Ícones coloridos por tipo de resíduo
- 🔍 Filtros por tipo de material (plástico, vidro, papel, metal, óleo, eletrônico, orgânico)
- 📋 Lista lateral com todos os ecopontos
- 📌 Popup rico com endereço, horário e botão "Como chegar" (Google Maps)
- 📱 100% responsivo (funciona no celular)
- 📍 Geolocalização do usuário
- 💬 Compartilhamento via WhatsApp
- 🔐 Painel de administração protegido por senha
- ➕ Adicionar/editar/excluir ecopontos via formulário
- 📥 Exportação de dados em GeoJSON (compatível com QGIS)

---

## 🚀 Como publicar (GitHub Pages — gratuito)

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login (crie uma conta gratuita se não tiver)
2. Clique em **"New repository"**
3. Nome sugerido: `ecopontos-maraba`
4. Marque **"Public"**
5. Clique em **"Create repository"**

### 2. Enviar os arquivos
**Opção A — Interface web (mais fácil):**
1. Arraste a pasta do projeto para a página do repositório
2. Clique em "Commit changes"

**Opção B — Git (linha de comando):**
```bash
cd ecopontos-maraba
git init
git add .
git commit -m "Primeiro commit — WebGIS Ecopontos Marabá"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ecopontos-maraba.git
git push -u origin main
```

### 3. Ativar GitHub Pages
1. No repositório, vá em **Settings → Pages**
2. Em "Source", selecione **"Deploy from a branch"**
3. Branch: `main` | Folder: `/ (root)`
4. Clique em **Save**
5. Aguarde ~2 minutos
6. Seu site estará disponível em:  
   `https://SEU_USUARIO.github.io/ecopontos-maraba/`

### 4. Atualizar a URL de compartilhamento
Abra `js/config.js` e atualize a linha:
```js
urlPublica: 'https://SEU_USUARIO.github.io/ecopontos-maraba/',
```

---

## 🔐 Painel de Administração

Acesse: `https://seusite.github.io/ecopontos-maraba/admin.html`

**Senha padrão:** `ecopontos2024`

> ⚠️ **IMPORTANTE:** Troque a senha antes de publicar!

### Como trocar a senha

1. Acesse: https://emn178.github.io/online-tools/sha256.html
2. Digite a nova senha
3. Copie o hash gerado
4. Abra `js/config.js` e substitua o valor de `adminPasswordHash`

```js
adminPasswordHash: 'COLE_O_NOVO_HASH_AQUI',
```

5. Publique os arquivos atualizados no GitHub

---

## 📊 Gerenciando os dados

### Via Painel Admin (recomendado)
1. Acesse `admin.html`
2. Digite a senha
3. Clique em **"Novo Ecoponto"** ou edite os existentes

> Os dados ficam salvos no navegador (localStorage). Para publicar no site, use o botão **"Exportar GeoJSON"** e substitua o arquivo no repositório.

### Via QGIS (para usuários avançados)
1. No QGIS, adicione seus pontos na tabela com os campos:
   ```
   nome, endereco, bairro, lat, lng, horario, telefone, email,
   foto, tipos (separados por vírgula), status, obs
   ```
2. Exporte como **GeoJSON**
3. No painel admin, haverá um botão de **Importar GeoJSON** (em breve)
4. Ou substitua manualmente os dados em `js/data.js` no array `DADOS_DEMO`

### Campos do GeoJSON
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | texto | Nome do ecoponto |
| `endereco` | texto | Endereço completo |
| `bairro` | texto | Bairro ou folha |
| `horario` | texto | Horário de funcionamento |
| `telefone` | texto | Telefone ou WhatsApp |
| `email` | texto | E-mail de contato |
| `foto` | URL | Link da foto do local |
| `tipos` | texto | Tipos separados por vírgula |
| `status` | texto | `ativo`, `inativo` ou `manutencao` |
| `obs` | texto | Observações adicionais |

**Tipos válidos:** `plastico`, `papel`, `vidro`, `metal`, `oleo`, `eletronico`, `organico`

---

## 💡 Próximos passos sugeridos

- [ ] 🔥 **Firebase** — ativar banco de dados em nuvem (os dados ficam persistentes sem precisar exportar GeoJSON)
- [ ] 📸 **Fotos dos ecopontos** — fotografar cada ponto e adicionar a URL no cadastro
- [ ] 📢 **Divulgação** — compartilhar o link nas redes sociais da prefeitura e associações de bairro
- [ ] 📱 **QR Codes** — gerar um QR Code para cada ecoponto e fixar uma placa no local
- [ ] 📈 **Calculadora de impacto** — mostrar toneladas de lixo desviadas do aterro
- [ ] 🗓️ **Calendário de coleta** — adicionar dia e horário de coleta do caminhão

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Uso | Custo |
|-----------|-----|-------|
| [Leaflet.js](https://leafletjs.com) | Mapa interativo | Gratuito |
| [OpenStreetMap](https://openstreetmap.org) | Tiles do mapa | Gratuito |
| [Bootstrap 5](https://getbootstrap.com) | Interface responsiva | Gratuito |
| [Font Awesome 6](https://fontawesome.com) | Ícones | Gratuito |
| [GitHub Pages](https://pages.github.com) | Hospedagem | **Gratuito** |
| localStorage | Armazenamento de dados | **Gratuito** |

---

## 📞 Suporte e contribuição

Este projeto foi criado para ajudar a comunidade de Marabá/PA a adotar hábitos de descarte responsável.

**Contribuições são bem-vindas!** Abra uma _Issue_ ou _Pull Request_ no GitHub.

---

*Desenvolvido com ❤️ para Marabá/PA*
