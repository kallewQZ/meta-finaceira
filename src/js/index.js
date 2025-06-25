const cards = document.querySelectorAll('.card');
const canvas = document.getElementById('lineChart');
const ctx = canvas.getContext('2d');
const totalCards = 12;
const progressoPorCard = 100 / totalCards;
let progresso = 0;

// Cor fixa
const corBase = 'rgb(205, 74, 181)';

// Desenha gráfico de linha com estilo variável
function desenharGrafico(progressoAtual) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Eixos X e Y
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, 180);
    ctx.lineTo(390, 180);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ticks Y
    ctx.fillStyle = "#ccc";
    ctx.font = "12px Arial";
    for (let i = 0; i <= 100; i += 25) {
        const y = 180 - (i * 1.5);
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(45, y);
        ctx.stroke();
        ctx.fillText(`${i}%`, 5, y + 4);
    }

    // Ticks X
    for (let i = 1; i <= totalCards; i++) {
        const x = 40 + i * (350 / totalCards);
        ctx.beginPath();
        ctx.moveTo(x, 175);
        ctx.lineTo(x, 185);
        ctx.stroke();
    }

    ctx.fillText("Cards Completos", 200, 195);

    // Monta pontos de progresso
    const pontos = [];
    let completed = 0;
    cards.forEach((card, index) => {
        if (card.classList.contains('completed')) completed++;
        const x = 40 + ((index + 1) * (350 / totalCards));
        const y = 180 - (completed * progressoPorCard * 1.5);
        pontos.push({ x, y });
    });

    // Configura estilo da linha com base no progresso
    if (pontos.length > 0) {
        ctx.beginPath();
        ctx.moveTo(40, 180);
        pontos.forEach(p => ctx.lineTo(p.x, p.y));

        ctx.strokeStyle = corBase;

        if (progressoAtual <= 25) {
            ctx.setLineDash([5, 5]);  // tracejada
            ctx.lineWidth = 1;
        } else if (progressoAtual <= 75) {
            ctx.setLineDash([]);     // contínua
            ctx.lineWidth = 2;
        } else {
            ctx.setLineDash([]);     // contínua mais grossa
            ctx.lineWidth = 4;
        }

        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
    }

    // Texto no topo
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText(`Progresso: ${Math.round(progressoAtual)}%`, 200, 20);
}

// Removida a barra de progresso visual
function atualizarBarraProgresso() {
    // função vazia para manter compatibilidade
}

// LocalStorage
function salvarEstado() {
    const estados = Array.from(cards).map(card => card.classList.contains('completed'));
    localStorage.setItem('estadoCards', JSON.stringify(estados));
}

function carregarEstado() {
    const estadoSalvo = JSON.parse(localStorage.getItem('estadoCards'));
    if (!estadoSalvo) return;

    estadoSalvo.forEach((estado, index) => {
        if (estado) cards[index].classList.add('completed');
    });
}

function calcularProgressoInicial() {
    let progressoInicial = 0;
    cards.forEach(card => {
        if (card.classList.contains('completed')) {
            progressoInicial += progressoPorCard;
        }
    });
    return progressoInicial;
}

function verificarConclusao() {
    if (progresso >= 100) {
        alert("🎉 Parabéns! Você completou sua meta de R$ 10.000!");
    }
}

// Interatividade nos cards
cards.forEach((card) => {
    card.addEventListener('click', () => {
        if (!card.classList.contains('completed')) {
            card.classList.add('completed');
            progresso += progressoPorCard;
        } else {
            card.classList.remove('completed');
            progresso -= progressoPorCard;
        }

        progresso = Math.max(0, Math.min(100, progresso));
        desenharGrafico(progresso);
        atualizarBarraProgresso();
        salvarEstado();
        verificarConclusao();
    });
});

// Menu sandbar
const sandbarToggle = document.getElementById('sandbar-toggle');
const nav = document.getElementById('main-nav');
const closeNav = document.getElementById('close-nav');

function abrirSandbar() {
    nav.classList.add('show');
    sandbarToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fecharSandbar() {
    nav.classList.remove('show');
    sandbarToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

sandbarToggle.addEventListener('click', () => {
    nav.classList.contains('show') ? fecharSandbar() : abrirSandbar();
});

closeNav.addEventListener('click', () => fecharSandbar());

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => fecharSandbar());
});

document.addEventListener('DOMContentLoaded', () => {
    carregarEstado();
    progresso = calcularProgressoInicial();
    desenharGrafico(progresso);
    atualizarBarraProgresso();
});
