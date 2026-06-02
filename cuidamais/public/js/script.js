const form = document.getElementById("formRegistro");

let grafico = null;
let registroEditando = null;

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const dados = {
        nomePaciente: document.getElementById("nomePaciente").value,
        dataRegistro: document.getElementById("dataRegistro").value,
        pressaoArterial: document.getElementById("pressaoArterial").value,
        glicemia: document.getElementById("glicemia").value,
        temperatura: document.getElementById("temperatura").value,
        humor: document.getElementById("humor").value,
        observacoes: document.getElementById("observacoes").value
    };

        let url = "/registros";
        let metodo = "POST";

    if(registroEditando){

        url = `/registros/${registroEditando}`;
        metodo = "PUT";

    }

    const resposta = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    form.reset();

    registroEditando = null;

    carregarRegistros();
});

async function carregarRegistros() {

    const resposta = await fetch("/registros");

    const registros = await resposta.json();

    atualizarDashboard(registros);
    atualizarGrafico(registros);

    const tabela = document.getElementById("listaRegistros");

    tabela.innerHTML = "";

    registros.forEach(registro => {

        tabela.innerHTML += `
            <tr>
                <td>${registro.nomePaciente}</td>
                <td>${registro.dataRegistro}</td>
                <td>${registro.pressaoArterial}</td>
                <td>${registro.glicemia || "-"}</td>
                <td>${registro.temperatura || "-"}</td>
                <td>${registro.humor || "-"}</td>

                <td>
                    <button
                        class="btn-editar"
                        onclick="editarRegistro(${registro.id})">
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirRegistro(${registro.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

async function excluirRegistro(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este registro?"
    );

    if (!confirmar) return;

    const resposta = await fetch(`/registros/${id}`, {
        method: "DELETE"
    });

    const resultado = await resposta.json();

    alert(resultado.mensagem);

    carregarRegistros();
}

function editarRegistro(registro){

    registroEditando = registro.id;

    document.getElementById("nomePaciente").value =
        registro.nomePaciente;

    document.getElementById("dataRegistro").value =
        registro.dataRegistro;

    document.getElementById("pressaoArterial").value =
        registro.pressaoArterial;

    document.getElementById("glicemia").value =
        registro.glicemia || "";

    document.getElementById("temperatura").value =
        registro.temperatura || "";

    document.getElementById("humor").value =
        registro.humor || "";

    document.getElementById("observacoes").value =
        registro.observacoes || "";

}

function atualizarDashboard(registros){

    document.getElementById("totalRegistros").textContent =
        registros.length;

    if(registros.length > 0){

        document.getElementById("ultimaPressao").textContent =
            registros[0].pressaoArterial || "-";

        document.getElementById("ultimaGlicemia").textContent =
            registros[0].glicemia || "-";

        document.getElementById("ultimaTemperatura").textContent =
            registros[0].temperatura || "-";

    }
}

function atualizarGrafico(registros){

    const labels = [...registros]
        .reverse()
        .map(r => r.dataRegistro);

    const glicemia = [...registros]
        .reverse()
        .map(r => r.glicemia || 0);

    const temperatura = [...registros]
        .reverse()
        .map(r => r.temperatura || 0);

    const contexto =
        document.getElementById("graficoSaude");

    if(grafico){
        grafico.destroy();
    }

    grafico = new Chart(contexto, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "Glicemia",
                    data: glicemia,
                    borderWidth: 3,
                    tension: 0.4
                },

                {
                    label: "Temperatura",
                    data: temperatura,
                    borderWidth: 3,
                    tension: 0.4
                }

            ]

        },

        options: {

            responsive: true,

            plugins: {
                legend: {
                    position: "top"
                }
            }

        }

    });

}

// =========================
// GERAR PDF
// =========================

document
    .getElementById("btnPdf")
    .addEventListener("click", gerarPDF);

async function gerarPDF() {

    try {

        const resposta = await fetch("/registros");

        const registros = await resposta.json();

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.text("Relatório CuidaMais", 14, 20);

        // Data de geração
        const dataAtual = new Date().toLocaleDateString("pt-BR");

        doc.setFontSize(10);
        doc.text(
            `Gerado em: ${dataAtual}`,
            14,
            28
        );

        // Dados da tabela
        const dados = registros.map(registro => [
            registro.nomePaciente,
            registro.dataRegistro,
            registro.pressaoArterial,
            registro.glicemia || "-",
            registro.temperatura || "-",
            registro.humor || "-"
        ]);

        // Tabela
        doc.autoTable({
            startY: 35,
            head: [[
                "Paciente",
                "Data",
                "Pressão",
                "Glicemia",
                "Temperatura",
                "Humor"
            ]],
            body: dados
        });

        // Salvar PDF
        doc.save("relatorio-cuidaMais.pdf");

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao gerar PDF."
        );

    }

}

carregarRegistros();