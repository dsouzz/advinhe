let correctCountry;
let options = [];
let tentativas = 0; // Inicializa o contador de tentativas
let acertos = 0;
let erros = 0;

function getCountryNameInPortuguese(country) {
    // Verifica se há tradução para português
    return country.translations && country.translations.por ?
        country.translations.por.common : country.name.common;
}

function getRandomCountries() {
    fetch('https://restcountries.com/v3.1/all').then(response => response.json()).then(data => {
        // Seleciona um país aleatório como o correto
        const randomIndex = Math.floor(Math.random() * data.length);
        correctCountry = data[randomIndex];
        options = [correctCountry];

        // Adiciona mais 3 opções aleatórias de países
        while (options.length < 4) {
            const randomOption = data[Math.floor(Math.random() * data.length)];
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        // Embaralha as opções
        options.sort(() => Math.random() - 0.5);

        displayQuestion();
    }).catch(error => console.error('Erro:', error));
}

function displayQuestion() {
    // Exibe a bandeira do país correto
    document.getElementById('flagImage').src = correctCountry.flags.png;
    document.getElementById('flagImage').style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores

    // Cria botões para as opções de países
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = getCountryNameInPortuguese(option);
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

// Variaveis para tocar os audios
let correto = document.getElementById("taCerto");
let errado = document.getElementById("taErrado");

function checkAnswer(selected) {
    tentativas++; // Incrementa o contador de tentativas
    document.getElementById('tentativas').innerText = `Tentativas: ${tentativas}`; // Atualiza o texto


    const resultDiv = document.getElementById('result');

    if (selected.name.common === correctCountry.name.common) {
        resultDiv.innerHTML = '<p style="color: limegreen;"><strong>Correto!</strong></p>';
        document.getElementById('options').style.display = 'none';
        correto.play(); // Toca o audio de acerto quando o usuário acerta, obviamente...
        acertos++;
        document.getElementById('acertos').innerText = `Acertos: ${acertos}`; // Atualiza o contador de acertos
    } else {
        // alert("Resposta Incorreta!! >:(");
        resultDiv.innerHTML = `<p style="color: red;"><u>O país correto era: ${getCountryNameInPortuguese(correctCountry)}</u></p>`;
        document.getElementById('options').style.display = 'none';
        errado.play(); // Toca o audio de erro quando o usuário erra '-'
        erros++;
        document.getElementById('erros').innerText = `Erros: ${erros}`; // Atualiza o contador de acertos
    }
    document.getElementById('nextButton').style.display = 'block'; // Exibe o botão "Próximo"

}

document.getElementById('nextButton').onclick = () => {
    document.getElementById('options').style.display = 'flex';
    document.getElementById('result').innerHTML = ''; // Limpa o resultado anterior
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    getRandomCountries(); // Carrega uma nova bandeira
};

getRandomCountries();
