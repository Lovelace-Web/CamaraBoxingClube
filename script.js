function carregarCSV() {
    const url = "https://raw.githubusercontent.com/Lovelace-Web/CamaraBoxingClube/main/produtos.csv";
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar o arquivo CSV.');
            return response.text();
        })
        .then(data => {
            const produtos = processarCSV(data);
            gerarProdutos(produtos); // Exibe todos os produtos
        })
        .catch(error => console.error('Erro:', error));
}
function metodo_trocapontoevirgulapor_virgula(texto) {
    return texto.replace(/;/g, ',');
}

// Processa o arquivo CSV e converte para um array de produtos
function processarCSV(data) {
    const linhas = data.split('\n');
    const produtos = [];

    for (let i = 1; i < linhas.length; i++) { // Ignora o cabeçalho
        const dados = linhas[i].split(',');
        if (dados.length >= 13) {
            produtos.push({
                nome: dados[0].trim(),
                categoria: dados[1].trim(),
                preco: dados[2].trim(),
                video: dados[3].trim(),
                tipo: dados[4].trim(),
                caracteristica: dados[5].trim(),
                tamanho: dados[6].trim(),
                localizacao: dados[7].trim(),
                forma_pagamento: dados[8].trim(),
                status: dados[9].trim(),
                imagem_fundo: dados[10].trim(),
                tem_multipla_escolha: dados[11].trim(),
                lista_escolhas: dados[12].trim()
            });
        }
    }
    return produtos;
}

function gerarProdutos(produtos) {
    produtos.forEach(produto => {
        if (produto.status === "true" && produto.categoria === "musica") {
            const container = document.getElementById(`fileira_produtos_${produto.categoria.toLowerCase()}`) ||
                document.getElementById('fileira_produtos_outros');

            if (container) {
                const produtoHTML = `
                    <div class="produtos">
                        <p class="quadrado"></p>
                        <img class="imagem_fundo" src="${produto.imagem_fundo}" alt="Disco">
                        <img class="imagem_disco" src="imagens/disco.png" alt="Disco">
                        <p class="titulo">${produto.nome}</p>
                        <audio controls class="audio">
                            <source src="${produto.video}" type="audio/ogg">
                        </audio>
                    </div>
                `;
                container.innerHTML += produtoHTML;
            }
        } 
        
        else if (produto.status === "true" && produto.categoria === "loja") {
            const container = document.getElementById(`fileira_produtos_${produto.categoria.toLowerCase()}`) ||
                document.getElementById('fileira_produtos_outros');

            if (container) {
                const produtoHTML = `
                    <div class="produtos_loja" id="produtos_loja_${produto.nome}">
                        <img class="imagem_comida" src="${produto.imagem_fundo}" alt="comida">
                        <p class="titulo_loja">${produto.nome}</p>
                        <p data-preco="${produto.preco}">Preço: R$ ${produto.preco}</p>
                        <div class="quantity-controls">
                            <button onclick="quantidade(-1, this);">-</button>
                            <span class="quantidade" id="quantidade_${produto.nome}">1</span>
                            <button onclick="quantidade(1, this);">+</button>
                        </div>
                        <button onclick="moverObjeto_loja('${produto.nome}', '${produto.preco}', '${produto.imagem_fundo}', '${produto.categoria.toLowerCase()}')">
                            Comprar
                        </button>
                    </div>
                `;
                container.innerHTML += produtoHTML;
            }
        } 
        
        else if (produto.status === "true" && produto.categoria === "anotai") {
            const container = document.getElementById(`fileira_produtos_${produto.categoria.toLowerCase()}`) ||
                              document.getElementById('fileira_produtos_outros');

            if (container) {
                const produtoHTML = `
                    <div class="produto_item" data-tipo="${produto.tipo}">
                        <div class="produtos_loja" id="produtos_loja_${produto.nome}">
                        <p>${produto.imagem_fundo}</p>
                            <img class="imagem_comida" src="${produto.imagem_fundo}" alt="${produto.nome}">
                            <p class="titulo_loja">${produto.nome}</p>
                            <p class="tipo_loja">${produto.tipo}</p>
                            <p data-preco="${produto.preco}">Preço: R$ ${produto.preco}</p>
                            <div class="quantity-controls">
                                <button class="quantity-decrease" onclick="quantidade(-1, this)">-</button>
                                <span class="quantidade" id="quantidade_${produto.nome}">1</span>
                                <button class="quantity-increase" onclick="quantidade(1, this)">+</button>
                            </div>
                            <button onclick="moverObjeto_loja('${produto.lista_escolhas}', '${produto.nome}', '${produto.preco}', '${produto.imagem_fundo}', '${produto.categoria.toLowerCase()}', '${produto.tem_multipla_escolha.toLowerCase()}')" class="btn-comprar">
                                Comprar
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML += produtoHTML;
            }
        } 
        
        else if (produto.categoria === "academia") {
            if (produto.tipo === "nome") {
                const menu = document.getElementById("menu");
                if (menu) {
                    menu.innerHTML = `<img src="${produto.imagem_fundo}" alt="Logo">`;
                }
            } 
            else if (produto.tipo === "home") {
                const home = document.getElementById("home");
                if (home) {
                    home.innerHTML = `
                        <img src="${produto.imagem_fundo}" alt="Imagem Home">
                        <p>${metodo_trocapontoevirgulapor_virgula(produto.caracteristica)}</p>
                    `;
                }
            } 
            if (/^Nivel \d+$/.test(produto.tipo) || produto.tipo==="Personalizado")  {
                const aula = document.getElementById("aula");
                if (aula) {
                    aula.innerHTML += `
                    <div class="quadrado_produtos">
                    <h3>${produto.tipo}</h3>
                    <p>${produto.caracteristica}</p>
                    <p>Preço: R$ ${produto.preco}</p>
                    <label for="dia">Dia desejado:</label>
                    <input type="text" id="dia" placeholder="Ex: Segunda-feira">

                    <label for="horario">Horário desejado:</label>
                    <input type="text" id="horario" placeholder="Ex: 14h">

                    <button onclick="enviar_whatsapp('${produto.lista_escolhas}', '${produto.preco}', '${produto.caracteristica}', '${produto.tipo}')" class="btn-comprar">
                        Solicitar Aula
                    </button>
                    </div>

                `;
                

                let quadrados = document.querySelectorAll('.quadrado_produtos');
                let ultimoQuadrado = quadrados[quadrados.length - 1];

                // Aplica o estilo somente se for "Nivel 3"
                if (produto.tipo === "Nivel 3") {
                    ultimoQuadrado.classList.add("ouro");
                } 
                else if (produto.tipo === "Nivel 2") {
                    ultimoQuadrado.classList.add("prata");
                } 
                else if (produto.tipo === "Nivel 1") {
                    ultimoQuadrado.classList.add("bronze");
                }
                
    
                }
            } 
            
            else if (produto.nome === "informações") {

                const info = document.getElementById("info");
                if (info) {
                    if(produto.tipo==="info_contato"){
                        info.innerHTML += `<h3 style="color:white">Contato: ${produto.caracteristica}</h3>`;

                    }
                    
                    else if(produto.tipo==="info_localização"){
                        let valor=metodo_trocapontoevirgulapor_virgula(produto.caracteristica)
                        info.innerHTML += `<h3 style="color:white">Localização: ${valor}</h3>
                        <iframe
    class="map-iframe"
    width="900"
    height="310"
    src="https://www.google.com/maps/embed?pb=!4v1676968130874!6m8!1m7!1s6Kx9rYjFNRwUvx1p87kAVQ!2m2!1d-30.030918!2d-51.2327404!3f340.77!4f90!5f0.4000000000000002"
    frameborder="0"
    style="border:0;"
    allowfullscreen=""
    aria-hidden="false"
    tabindex="0">
</iframe>
                        `;
                    }
                    
                }
            }
        }
    });
}




function eliminarEspacosEmBrancoEErros(contato) {
    // Remove espaços e caracteres não numéricos do contato
    return contato.replace(/\D/g, "");
}

function pegarHorario() {
    let hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
        return "Bom dia";
    } else if (hora >= 12 && hora < 18) {
        return "Boa tarde";
    } else {
        return "Boa noite";
    }
}

function enviar_whatsapp(contato, preco, produto, nome_produto) {
    let mensagem = "";
    let horario = pegarHorario();

    // Pegando os valores dos campos de "dia" e "horario"
    let dia = document.getElementById("dia").value;
    let horarioDesejado = document.getElementById("horario").value;

    // Criando a mensagem inicial
    if (nome_produto === "Personalizado") {
        mensagem += `${horario}, professor. Venho do site e gostaria de saber se podemos combinar algum valor para uma quantidade de aulas diferentes das disponibilizadas.`;
    } else {
        mensagem += `${horario}, professor. Venho do site e me interessei na academia de boxing.
        Escolhi: ${produto}
        Preço: R$ ${preco}`;
    }

    // Adicionando as informações adicionais (dia e horário) se preenchidas
    if (dia && horarioDesejado) {
        mensagem += `Informações adicionais:
        Dia desejado: ${dia}
        Horário desejado: ${horarioDesejado}`;
    }

    // Gerando o link do WhatsApp
    const linkWhatsApp = `https://wa.me/${eliminarEspacosEmBrancoEErros("5551985109343")}?text=${encodeURIComponent(mensagem)}`;

    // Abre o link em uma nova aba
    window.open(linkWhatsApp, "_blank");
}
window.onload = carregarCSV();
