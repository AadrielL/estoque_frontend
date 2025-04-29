const API_URL = "http://localhost:8080/estoque";

const form = document.getElementById('formAdicionar');
const hospitalSelect = document.getElementById('hospital');
const hospitalDiv = document.getElementById('hospitalSelectDiv');
const nomeInput = document.getElementById('nome');
const quantidadeInput = document.getElementById('quantidade');
const categoriaInput = document.getElementById('categoria');
const botaoSubmit = document.getElementById('botaoSubmit');
const tituloPagina = document.getElementById('tituloPagina');
const mensagem = document.getElementById('mensagem');

let produtoEditandoId = null;

// Função para pegar parâmetros da URL
function getParams() {
  return new URLSearchParams(window.location.search);
}

const params = getParams();
const hospitalFromUrl = params.get('hospital');
const editarId = params.get('editar');

// Se veio hospital pela URL, setar e esconder o select
if (hospitalFromUrl) {
  hospitalSelect.value = hospitalFromUrl;
  hospitalDiv.style.display = 'none';
}

// Se veio editar, carregar os dados
if (editarId) {
  produtoEditandoId = editarId;
  carregarProdutoParaEdicao(editarId);
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const hospital = hospitalSelect.value;
  const categoria = categoriaInput.value;
  const nome = nomeInput.value;
  const quantidade = parseInt(quantidadeInput.value);

  if (!hospital) {
    alert('Selecione um hospital.');
    return;
  }

  const item = { hospital, categoria, nome, quantidade };

  try {
    if (produtoEditandoId) {
      // Editar produto
      const response = await fetch(`${API_URL}/${produtoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        mostrarMensagem('Item atualizado com sucesso!', false);
      } else {
        mostrarMensagem('Erro ao atualizar item.', true);
      }
    } else {
      // Adicionar novo produto
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        mostrarMensagem('Item adicionado com sucesso!', false);
        form.reset();
      } else {
        mostrarMensagem('Erro ao adicionar item.', true);
      }
    }

    // Redirecionar para estoque se hospital vier da URL
    if (hospitalFromUrl) {
      setTimeout(() => {
        window.location.href = `estoque.html?hospital=${encodeURIComponent(hospital)}`;
      }, 1500);
    }

  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem('Erro de conexão.', true);
  }
});

// Função para carregar produto para edição
async function carregarProdutoParaEdicao(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Produto não encontrado.');

    const produto = await response.json();

    hospitalSelect.value = produto.hospital;
    categoriaInput.value = produto.categoria;
    nomeInput.value = produto.nome;
    quantidadeInput.value = produto.quantidade;

    if (hospitalFromUrl) {
      hospitalSelect.value = hospitalFromUrl;
      hospitalDiv.style.display = 'none';
    }

    tituloPagina.textContent = 'Editar Item do Estoque';
    botaoSubmit.textContent = 'Salvar Alterações';
    mostrarMensagem('Edite o produto abaixo:');

  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    alert('Erro ao carregar produto para edição.');
    window.location.href = "index.html";
  }
}

// Função para mostrar mensagens
function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.style.color = erro ? 'red' : 'green';

  setTimeout(() => {
    mensagem.textContent = "";
  }, 3000);
}
