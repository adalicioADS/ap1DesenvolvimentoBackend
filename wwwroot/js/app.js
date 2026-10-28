// Estado global da aplicação
let produtos = [];
let produtoEmEdicao = null;

// Elementos do DOM
const form = document.getElementById('produto-form');
const formTitle = document.getElementById('form-title');
const inputId = document.getElementById('produto-id');
const inputNome = document.getElementById('produto-nome');
const inputCategoria = document.getElementById('produto-categoria');
const inputPreco = document.getElementById('produto-preco');
const btnSubmit = document.getElementById('btn-submit');
const btnSubmitLabel = document.getElementById('btn-submit-label');
const btnCancelar = document.getElementById('btn-cancelar');
const badgeEditMode = document.getElementById('badge-edit-mode');

const tbody = document.getElementById('produtos-tbody');
const emptyState = document.getElementById('empty-state');
const btnRecarregar = document.getElementById('btn-recarregar');

const statTotal = document.getElementById('stat-total');
const statCategorias = document.getElementById('stat-categorias');
const statPrecoMedio = document.getElementById('stat-preco-medio');

const inputBuscaId = document.getElementById('input-busca-id');
const btnBuscarId = document.getElementById('btn-buscar-id');
const buscaIdResultado = document.getElementById('busca-id-resultado');

const toastContainer = document.getElementById('toast-container');
const apiStatusBadge = document.getElementById('api-status-badge');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  verificarStatusApi();
  carregarProdutos();
  configurarEventos();
});

// Configuração dos Eventos de UI
function configurarEventos() {
  form.addEventListener('submit', tratarSubmitForm);
  btnCancelar.addEventListener('click', cancelarEdicao);
  btnRecarregar.addEventListener('click', carregarProdutos);
  btnBuscarId.addEventListener('click', buscarPorId);
  inputBuscaId.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarPorId();
    }
  });
}

// 00 - Verificar se a API está online
async function verificarStatusApi() {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      apiStatusBadge.className = 'badge badge-success';
      apiStatusBadge.innerHTML = '<span class="status-dot"></span> API Conectada';
    } else {
      throw new Error();
    }
  } catch (err) {
    apiStatusBadge.className = 'badge badge-warning';
    apiStatusBadge.innerHTML = '⚠️ API Desconectada';
  }
}

// 01 - Listar Produtos (GET /api/produtos)
async function carregarProdutos() {
  try {
    const response = await fetch('/api/produtos');
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    produtos = await response.json();
    renderizarTabela();
    atualizarEstatisticas();
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    mostrarToast(`Erro ao carregar lista de produtos (${error.message})`, 'danger');
  }
}

// Renderiza a lista na tabela HTML
function renderizarTabela() {
  tbody.innerHTML = '';

  if (produtos.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  produtos.forEach((prod) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><strong>#${prod.id}</strong></td>
      <td><span class="product-name">${escapeHtml(prod.nome)}</span></td>
      <td><span class="product-category">${escapeHtml(prod.categoria)}</span></td>
      <td><span class="product-price">${formatarMoeda(prod.preco)}</span></td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-edit-sm" onclick="iniciarEdicao(${prod.id})" title="Editar este produto">
          ✏️ Editar
        </button>
        <button class="btn btn-sm btn-danger-sm" onclick="excluirProduto(${prod.id}, '${escapeHtml(prod.nome)}')" title="Remover este produto">
          🗑️ Excluir
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// 02 - Buscar por ID (GET /api/produtos/{id})
async function buscarPorId() {
  const id = inputBuscaId.value.trim();
  if (!id) {
    mostrarToast('Informe um ID para pesquisar.', 'warning');
    return;
  }

  try {
    const response = await fetch(`/api/produtos/${id}`);
    buscaIdResultado.style.display = 'block';

    if (response.status === 200) {
      const prod = await response.json();
      buscaIdResultado.innerHTML = `
        <strong style="color: var(--success);">Encontrado (200 OK):</strong><br>
        <strong>ID:</strong> ${prod.id} | <strong>Nome:</strong> ${escapeHtml(prod.nome)}<br>
        <strong>Categoria:</strong> ${escapeHtml(prod.categoria)} | <strong>Preço:</strong> ${formatarMoeda(prod.preco)}
      `;
      mostrarToast(`Produto #${id} localizado com sucesso (200 OK)!`, 'success');
    } else if (response.status === 404) {
      buscaIdResultado.innerHTML = `
        <strong style="color: var(--danger);">Não Encontrado (404 Not Found):</strong><br>
        Nenhum produto cadastrado com o ID <code>${id}</code>.
      `;
      mostrarToast(`Produto #${id} não encontrado (404 Not Found).`, 'danger');
    } else {
      throw new Error(`Status ${response.status}`);
    }
  } catch (error) {
    console.error('Erro ao buscar por ID:', error);
    mostrarToast(`Erro ao consultar ID ${id}.`, 'danger');
  }
}

// 03 / 04 - Tratar Envio do Formulário (POST ou PUT)
async function tratarSubmitForm(e) {
  e.preventDefault();

  const nome = inputNome.value.trim();
  const categoria = inputCategoria.value.trim();
  const preco = parseFloat(inputPreco.value);

  if (!nome) {
    mostrarToast('Por favor, informe o nome do produto.', 'warning');
    inputNome.focus();
    return;
  }

  if (isNaN(preco) || preco < 0) {
    mostrarToast('Informe um valor de preço válido e maior ou igual a zero.', 'warning');
    inputPreco.focus();
    return;
  }

  const payload = {
    nome: nome,
    categoria: categoria || 'Geral',
    preco: preco
  };

  if (produtoEmEdicao) {
    // 04 - Atualizar (PUT /api/produtos/{id})
    await atualizarProduto(produtoEmEdicao.id, payload);
  } else {
    // 03 - Cadastrar (POST /api/produtos)
    await cadastrarProduto(payload);
  }
}

// Executa POST /api/produtos
async function cadastrarProduto(dados) {
  try {
    const response = await fetch('/api/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (response.status === 201) {
      const novoProduto = await response.json();
      mostrarToast(`Produto #${novoProduto.id} cadastrado com sucesso! (Status 201)`, 'success');
      limparFormulario();
      await carregarProdutos();
    } else {
      const erro = await response.json().catch(() => ({}));
      mostrarToast(erro.mensagem || `Erro ao cadastrar produto (${response.status})`, 'danger');
    }
  } catch (error) {
    console.error('Erro no POST:', error);
    mostrarToast('Falha na comunicação com a API.', 'danger');
  }
}

// Executa PUT /api/produtos/{id}
async function atualizarProduto(id, dados) {
  try {
    const response = await fetch(`/api/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (response.status === 200) {
      mostrarToast(`Produto #${id} atualizado com sucesso! (Status 200)`, 'success');
      cancelarEdicao();
      await carregarProdutos();
    } else if (response.status === 404) {
      mostrarToast(`Produto #${id} não encontrado para atualização (Status 404).`, 'danger');
    } else {
      mostrarToast(`Erro ao atualizar produto (${response.status}).`, 'danger');
    }
  } catch (error) {
    console.error('Erro no PUT:', error);
    mostrarToast('Falha ao conectar à API.', 'danger');
  }
}

// 05 - Remover Produto (DELETE /api/produtos/{id})
async function excluirProduto(id, nome) {
  const confirmacao = window.confirm(`Deseja realmente remover o produto #${id} - "${nome}"?`);
  if (!confirmacao) return;

  try {
    const response = await fetch(`/api/produtos/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      mostrarToast(`Produto #${id} removido com sucesso! (Status 204)`, 'success');
      // Se estava em edição desse produto, cancela
      if (produtoEmEdicao && produtoEmEdicao.id === id) {
        cancelarEdicao();
      }
      await carregarProdutos();
    } else if (response.status === 404) {
      mostrarToast(`Produto #${id} não foi encontrado para exclusão (Status 404).`, 'danger');
    } else {
      mostrarToast(`Erro ao excluir produto (${response.status}).`, 'danger');
    }
  } catch (error) {
    console.error('Erro no DELETE:', error);
    mostrarToast('Falha na comunicação com a API.', 'danger');
  }
}

// Inicia modo de edição no formulário
function iniciarEdicao(id) {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) return;

  produtoEmEdicao = produto;
  inputId.value = produto.id;
  inputNome.value = produto.nome;
  inputCategoria.value = produto.categoria;
  inputPreco.value = produto.preco;

  formTitle.textContent = `Editar Produto #${produto.id}`;
  btnSubmitLabel.textContent = 'Salvar Alterações';
  btnCancelar.style.display = 'inline-flex';
  badgeEditMode.style.display = 'inline-flex';

  window.scrollTo({ top: form.offsetTop - 30, behavior: 'smooth' });
  inputNome.focus();
}

// Cancela o modo de edição
function cancelarEdicao() {
  produtoEmEdicao = null;
  limparFormulario();
  formTitle.textContent = 'Cadastrar Novo Produto';
  btnSubmitLabel.textContent = 'Cadastrar Produto';
  btnCancelar.style.display = 'none';
  badgeEditMode.style.display = 'none';
}

function limparFormulario() {
  form.reset();
  inputId.value = '';
}

// Atualiza os cards estatísticos
function atualizarEstatisticas() {
  statTotal.textContent = produtos.length;

  const categoriasUnicas = new Set(produtos.map((p) => p.categoria.trim().toLowerCase()));
  statCategorias.textContent = categoriasUnicas.size;

  if (produtos.length > 0) {
    const soma = produtos.reduce((acc, p) => acc + Number(p.preco), 0);
    const media = soma / produtos.length;
    statPrecoMedio.textContent = formatarMoeda(media);
  } else {
    statPrecoMedio.textContent = 'R$ 0,00';
  }
}

// Formatadores e Helpers
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function escapeHtml(texto) {
  if (!texto) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Feedback visual com Toasts
function mostrarToast(mensagem, tipo = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;

  let icone = 'ℹ️';
  if (tipo === 'success') icone = '✅';
  if (tipo === 'danger') icone = '❌';
  if (tipo === 'warning') icone = '⚠️';

  toast.innerHTML = `<span>${icone}</span><span>${escapeHtml(mensagem)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
