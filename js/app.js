// Chave de autenticação da API do TMDB
const API_KEY = "cb77b788b5660d7f5ee541c0853a3a22";

// Seleção dos elementos HTML
const btnSearch = document.getElementById("button-search");
const inputSearch = document.getElementById("input-search");
const containerFilms = document.getElementById("container-films");
const mensagemStatus = document.getElementById("message-status");

// Função principal que busca os filmes na API
async function buscarFilmes(nomeFilme) {
  // Monta a URL dinâmica usando Templates Literals
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(nomeFilme)}`;

  try {
    // Limpando os resultados anteriores e avisa os usuários
    containerFilms.textContent = "";
    mensagemStatus.textContent = "Buscando Filmes... ";

    // Envia a requisição para a API e aguarda a resposta bruta
    const resposta = await fetch(url);

    // VERIFICAÇÃO IMEDIATA: Se a resposta não for ok, lança o erro direto para o catch
    if (!resposta.ok) {
      throw new Error(`Erro: ${resposta.status}`);
    }

    // Se a resposta for ok, converte o conteúdo para JSON
    const dados = await resposta.json();

    // Limpa a mensagem de status (string 100% vazia)
    mensagemStatus.textContent = " ";

    // Passa a lista de filmes para a função que mostrará na tela
    exibirFilmes(dados.results);
  } catch (erro) {
    // Captura qualquer erro de rede ou do 'if' acima e avisa o usuário
    mensagemStatus.textContent = "Ops! Erro ao carregar os filmes.";
  }
}

// Função que recebe a lista de filmes da API e desenha na tela
function exibirFilmes(filmes) {
  // console.log("Os filmes chegaram na função exibirFilmes!", filmes);
  // Se a lista vier vazia (nenhum filme encontrado com aquele nome)
  if (filmes.length === 0) {
    mensagemStatus.textContent = "Nenhum filme encontrado. Tente outro nome!";
    return;
  }

  // Passa por cada filme da lista (como o "for" no Python)
  filmes.forEach((filme) => {
    // Validação da imagem: se não tiver pôster, usamos uma imagem padrão (placeholder)
    const imagemCapa = filme.poster_path
      ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
      : "https://via.placeholder.com/500x750?text=Sem+Capa";

    // Cria um elemento <div> na memória do computador
    const card = document.createElement("div");

    // Adiciona a classe do CSS para ele herdar o visual estilo Netflix
    card.classList.add("card-film");

    // Monta a estrutura de tags dentro desse card com os dados reais do filme
    card.innerHTML = `
    <img src="${imagemCapa}" alt="${filme.title}">
    <div class="card-info">
        <h3>${filme.title}</h3>
        <span>⭐ ${filme.vote_average.toFixed(1)}</span>
    </div>
    `;
    containerFilms.appendChild(card);
  });
}

// Função auxiliar para disparar a busca pegando o que está no input
function dispararBusca() {
  const termo = inputSearch.value.trim(); // .trim() remove espaços inúteis antes/depois
  if (termo !== "") {
    buscarFilmes(termo);
  }
}

// 1. Escuta o clique no botão "Buscar"
btnSearch.addEventListener("click", dispararBusca);

// 2. Escuta quando o usuário aperta "Enter" dentro do campo de texto
inputSearch.addEventListener("keypress", (evento) => {
  if (evento.key === "Enter") {
    dispararBusca();
  }
});
