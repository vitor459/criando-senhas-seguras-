// ==========================================
// CONFIGURAÇÕES GERAIS E BANCOS DE DADOS
// ==========================================
const MAIUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
const HEXADECIMAL = "0123456789abcdef";

function atualizarLabelTamanho() {
  const tamanho = document.getElementById("txt-tamanho").value;
  document.getElementById("valor-tamanho").innerText = tamanho;
}

// ==========================================
// LÓGICA PRINCIPAL DO GERADOR DE SENHAS
// ==========================================
function gerarSenha() {
  const incluirMaiusculas = document.getElementById("chk-maiusculas").checked;
  const incluirMinusculas = document.getElementById("chk-minusculas").checked;
  const evitarAmbiguos = document.getElementById("evitar-ambiguos").checked;
  const incluirEspacos = document.getElementById("incluir-espacos").checked;
  const comecarLetra = document.getElementById("comecar-letra").checked;
  const utilizarCriptografia = document.getElementById("chk-criptografia").checked;
  
  let tamanho = parseInt(document.getElementById("txt-tamanho").value);
  let caracteresDisponiveis = "";
  let senhaFinal = "";

  // Se simular criptografia hash ativa, roda a lógica isolada de hash
  if (utilizarCriptografia) {
    for (let i = 0; i < tamanho; i++) {
      const indice = Math.floor(Math.random() * HEXADECIMAL.length);
      senhaFinal += HEXADECIMAL.charAt(indice);
    }
    document.getElementById("campo-senha").value = senhaFinal;
    avaliarEntropia(senhaFinal, true);
    return;
  }

  // Construção do banco de caracteres com base nos checkboxes
  if (incluirMaiusculas) caracteresDisponiveis += MAIUSCULAS;
  if (incluirMinusculas) caracteresDisponiveis += MINUSCULAS;
  if (incluirEspacos) caracteresDisponiveis += "   "; // Adiciona peso para o espaço em branco

  // Aplicação da regra: Evitar caracteres ambíguos
  if (evitarAmbiguos) {
    caracteresDisponiveis = caracteresDisponiveis.replace(/[oO0iI1lL]/g, "");
  }

  // Validação caso nenhum checkbox esteja marcado
  if (caracteresDisponiveis.length === 0) {
    document.getElementById("campo-senha").value = "";
    alert("Selecione pelo menos uma característica para a senha!");
    return;
  }

  // Laço de repetição estruturado para gerar a senha
  for (let i = 0; i < tamanho; i++) {
    // Regra: Começar obrigatoriamente com uma letra
    if (i === 0 && comecarLetra) {
      let apenasLetras = (incluirMaiusculas ? MAIUSCULAS : "") + (incluirMinusculas ? MINUSCULAS : "");
      if (evitarAmbiguos) apenasLetras = apenasLetras.replace(/[oOiI1lL]/g, "");
      
      if (apenasLetras.length > 0) {
        const indiceLetra = Math.floor(Math.random() * apenasLetras.length);
        senhaFinal += apenasLetras.charAt(indiceLetra);
        continue;
      }
    }

    const indiceSorteado = Math.floor(Math.random() * caracteresDisponiveis.length);
    senhaFinal += caracteresDisponiveis.charAt(indiceSorteado);
  }

  document.getElementById("campo-senha").value = senhaFinal;
  avaliarEntropia(senhaFinal, false);
}

// ==========================================
// CÁLCULO DE ENTROPIA COMPUTACIONAL
// ==========================================
function avaliarEntropia(senha, ehHash) {
  const barra = document.getElementById("barra-forca");
  const texto = document.getElementById("texto-forca");
  
  barra.className = "barra-forca-progresso"; // Reset de classes
  
  if (senha.length === 0) {
    texto.innerText = "Força da Senha: Aguardando...";
    return;
  }

  let poolSize = 0;
  if (/[a-z]/.test(senha)) poolSize += 26;
  if (/[A-Z]/.test(senha)) poolSize += 26;
  if (/\s/.test(senha)) poolSize += 1;

  // Fórmula científica: E = L * log2(R)
  const entropia = ehHash ? senha.length * 4 : senha.length * Math.log2(poolSize || 1);

  if (entropia < 40) {
    texto.innerText = `Força: Vulnerável (${Math.round(entropia)} Bits)`;
    barra.classList.add("barra-fraca");
  } else if (entropia >= 40 && entropia < 60) {
    texto.innerText = `Força: Criptografada (${Math.round(entropia)} Bits)`;
    barra.classList.add("barra-media");
  } else {
    texto.innerText = `Força: Invasão Impossível (${Math.round(entropia)} Bits)`;
    barra.classList.add("barra-forte");
  }
}

// ==========================================
// FUNÇÃO DE CÓPIA RÁPIDA (UX)
// ==========================================
function copiarSenha() {
  const campoSenha = document.getElementById("campo-senha");
  const btn = document.getElementById("btn-copiar");
  
  if (!campoSenha.value) return;

  navigator.clipboard.writeText(campoSenha.value).then(() => {
    btn.innerText = "✅!";
    setTimeout(() => btn.innerText = "📋 Copiar", 1500);
  });
}

// ==========================================
// DESAFIO: CLASSIFICADOR DE IDADES (INTERVALOS)
// ==========================================
function classificarIdade() {
  const idadeInput = document.getElementById("txt-idade").value;
  const texto = document.getElementById("texto-resultado");
  const barra = document.getElementById("barra-classificacao");
  
  barra.className = "barra-forca-progresso";
  const idade = parseInt(idadeInput);

  if (isNaN(idade) || idade < 0) {
    texto.innerText = "Insira uma idade válida.";
    return;
  }

  // Condicionais encadeadas usando operadores de comparação lógica
  if (idade < 12) {
    texto.innerText = "Classificação: Criança (<12 anos)";
    barra.classList.add("cor-crianca");
  } else if (idade >= 12 && idade < 18) {
    texto.innerText = "Classificação: Adolescente (12-17 anos)";
    barra.classList.add("cor-adolescente");
  } else {
    texto.innerText = "Classificação: Adulto(a) (18+ anos)";
    barra.classList.add("cor-adulta");
  }
}
