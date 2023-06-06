let submitButton = document.getElementById("register-button");
let editButton = document.getElementById("edit-button");

let tableContainerContent = document.querySelector(".table-container-content");

let tradeTable = document.getElementById("table-content");

let addModal = document.getElementById("modalRegister")
let editModal = document.getElementById("modalEdit")

tableContainerContent.addEventListener("click", deleteRowRecord);

// tableContainerContent.addEventListener("click", editRow);

let corretora = document.getElementById("corretora");
let notaCorretagem = document.getElementById("notaCorretagem");
let dataPregao = document.getElementById("dataPregao");
let ativo = document.getElementById("ativo");
let quantidade = document.getElementById("quantidade");
let operacao = document.getElementById("operacao");
let tipoAtivo = document.getElementById("tipoAtivo");
let preco = document.getElementById("preco");
let corretagem = document.getElementById("corretagem");
let outrosCustos = document.getElementById("outrosCustos");
let valorTotal = document.getElementById("valorTotal");
let uniqueId = document.getElementById("uniqueId");

let tr = null;
let tradeData = [];

let editID = "";

function getData() {
    var tempData = localStorage.getItem("tradeData");
    if (tempData != null) {
        tradeData = JSON.parse(tempData);
    }
}

//// submit data

submitButton.addEventListener("click", function () {
    
    getData();

    console.log(tradeData);

    if (corretora && notaCorretagem && dataPregao && ativo && quantidade && operacao && tipoAtivo && preco && corretagem && outrosCustos != "") {

        let tempData = {
            id: new Date().getTime(),
            data: {
                corretora: corretora.value,
                notaCorretagem: notaCorretagem.value,
                dataPregao: dataPregao.value,
                ativo: ativo.value,
                quantidade: quantidade.value,
                operacao: operacao.value,
                tipoAtivo: tipoAtivo.value,
                preco: preco.value,
                corretagem: corretagem.value,
                outrosCustos: outrosCustos.value,
                uniqueId: new Date().getTime(),
            },
        };

        // replace decimal digit character in order to calculate total value
        preco = tempData.data.preco.replace(',', '.');
        tempData.data.preco = parseFloat(preco).toFixed(2);
        corretagem = tempData.data.corretagem.replace(',', '.');
        tempData.data.corretagem = parseFloat(corretagem).toFixed(2);
        outrosCustos = tempData.data.outrosCustos.replace(',', '.');
        tempData.data.outrosCustos = parseFloat(outrosCustos).toFixed(2);
        valorTotal = (parseFloat(tempData.data.quantidade) * parseFloat(preco)) + parseFloat(corretagem) + parseFloat(outrosCustos);
        tempData.data.valorTotal = valorTotal.toFixed(2);

        tradeData.push(tempData);

        localStorage.setItem("tradeData", JSON.stringify(tradeData));

        createTableRow(tempData);
    }
});


//// create table row

function createTableRow(tempData) {
    const element = document.createElement("tr");
    let attr = document.createAttribute("data-id");
    attr.value = tempData.id;
    element.setAttributeNode(attr);
    element.classList.add("fulltempData");
    element.innerHTML = `
        <td id="tdCorretora">${tempData.data.corretora}</td>
        <td id="tdNotaCorretagem">${tempData.data.notaCorretagem}</td>
        <td id="tdDataPregao">${tempData.data.dataPregao}</td>
        <td id="tdAtivo">${tempData.data.ativo}</td>
        <td id="tdQuantidade">${tempData.data.quantidade}</td>
        <td id="tdOperacao">${tempData.data.operacao}</td>
        <td id="tdTipoAtivo">${tempData.data.tipoAtivo}</td>
        <td id="tdPreco">${tempData.data.preco}</td>
        <td id="tdCorretagem">${tempData.data.corretagem}</td>
        <td id="tdOutrosCustos">${tempData.data.outrosCustos}</td>
        <td id="tdValorTotal">${tempData.data.valorTotal}</td>
        <td>
            <i value="Edit" type="button" id="update-row" class="edit-row fas fa-pencil-alt"></i>
            <i class="fa-thin fa-square" style="color: #00FFFFFF;"></i>
            <i value="Delete" type="button" class="remove-row fas fa-trash-alt"></i>
        </td>
  `;
  
    tradeTable.appendChild(element);

}


//// remove table row and data record

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("remove-row")) {
        var row = e.target.parentNode.parentNode;
        var uniqueId = row.closest("tr").getAttribute("data-id");
        deleteRowRecord(uniqueId);
    }
});

function deleteRowRecord(uniqueId) {

    var confirmed = confirm("Are you sure you want to delete this row?");
    if (!confirmed) {
      return; // Do nothing if user cancels the delete operation
    }

    getData();
    var table = document.getElementById("table-content");
    var rows = table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].closest("tr").getAttribute("data-id");
        // console.log(uniqueId);
        if (cell === uniqueId) {
        // remove the row from the table
            tradeData.splice(i,1);   
            localStorage.setItem("tradeData", JSON.stringify(tradeData));
            table.deleteRow(i);
            setTimeout(() => {
                document.location.reload();
            }, 1000);
            break; // exit the loop after remove row and record
        }
    }
}


//// edit table row

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-row")) {
        tr = e.target.parentNode.parentNode;
        $("#modalEdit").modal("show");
        var row = e.target.parentNode.parentNode;
        var uniqueId = row.closest("tr").getAttribute("data-id");
        // console.log("uniqueId ", uniqueId);
        editLocalStorage(tr,uniqueId);
    }
});

// 

function editLocalStorage(tr,uniqueId) {
    
    getData();
  
    if (tempData.id === parseInt(uniqueId)) {
        tempData.data.corretora = tr.cells[0].textContent;
        tempData.data.notaCorretagem = tr.cells[1].textContent;
        tempData.data.dataPregao = tr.cells[2].textContent;
        tempData.data.tipoAtivo = tr.cells[3].textContent;
        tempData.data.operacao = tr.cells[4].textContent;
        tempData.data.ativo = tr.cells[5].textContent;
        tempData.data.quantidade = tr.cells[6].textContent;
        tempData.data.preco = tr.cells[7].textContent;
        tempData.data.corretagem = tr.cells[8].textContent;
        tempData.data.outrosCustos = tr.cells[9].textContent;
        tempData.data.valorTotal = tr.cells[10].textContent;
      

        preco = tempData.data.preco.replace(',', '.');
        tempData.data.preco = parseFloat(preco).toFixed(2);
        corretagem = tempData.data.corretagem.replace(',', '.');
        tempData.data.corretagem = parseFloat(corretagem).toFixed(2);
        outrosCustos = tempData.data.outrosCustos.replace(',', '.');
        tempData.data.outrosCustos = parseFloat(outrosCustos).toFixed(2);
        valorTotal = (parseFloat(tempData.data.quantidade) * parseFloat(preco)) + parseFloat(corretagem) + parseFloat(outrosCustos);
        tempData.data.valorTotal = valorTotal.toFixed(2);

        return tempData;
    };

    localStorage.setItem("tradeData", JSON.stringify(tradeData));
}

editButton.addEventListener("click", function () {
    console.log("teste");
});




// function editRow(e, uniqueId) {
  
//         tr = e.target.parentNode.parentNode;
    
//         let edCorretora = document.getElementById("edCorretora");
//         let edNotaCorretagem = document.getElementById("edNotaCorretagem");
//         let edDataPregao = document.getElementById("edDataPregao");
//         let edAtivo = document.getElementById("edAtivo");
//         let edQuantidade = document.getElementById("edQuantidade");
//         let edOperacao = document.getElementById("edOperacao");
//         let edTipoAtivo = document.getElementById("edTipoAtivo");
//         let edPreco = document.getElementById("edPreco");
//         let edCorretagem = document.getElementById("edCorretagem");
//         let edOutrosCustos = document.getElementById("edOutrosCustos");
//         let edValorTotal = document.getElementById("edValorTotal");
    
//         edCorretora.value = tr.cells[0].textContent;
//         edNotaCorretagem.value = tr.cells[1].textContent;
//         edDataPregao.value = tr.cells[2].textContent;
//         edAtivo.value = tr.cells[3].textContent;
//         edQuantidade.value = tr.cells[4].textContent;
//         edOperacao.value = tr.cells[5].textContent;
//         edTipoAtivo.value = tr.cells[6].textContent;
//         edPreco.value = tr.cells[7].textContent;
//         edCorretagem.value = tr.cells[8].textContent;
//         edOutrosCustos.value = tr.cells[9].textContent;
//         edValorTotal.value = tr.cells[10].textContent;
//         let edUniqueId = uniqueId;
    
//         // editLocalStorage(tr,edCorretora,edNotaCorretagem,edDataPregao,edAtivo,edQuantidade,edOperacao,edTipoAtivo,edPreco,edCorretagem,edOutrosCustos,edValorTotal);
//     }


//// update table row

// function tableUpdate(tr) {

//     let tdCorretora = document.getElementById("tdCorretora");
//     let tdNotaCorretagem = document.getElementById("tdNotaCorretagem");
//     let tdDataPregao = document.getElementById("tdDataPregao");
//     let tdAtivo = document.getElementById("tdAtivo");
//     let tdQuantidade = document.getElementById("tdQuantidade");
//     let tdOperacao = document.getElementById("tdOperacao");
//     let tdTipoAtivo = document.getElementById("tdTipoAtivo");
//     let tdPreco = document.getElementById("tdPreco");
//     let tdCorretagem = document.getElementById("tdCorretagem");
//     let tdOutrosCustos = document.getElementById("tdOutrosCustos");
//     let tdValorTotal = document.getElementById("tdValorTotal");
  
//     console.log(tr);

//     tr.cells[0].textContent = corretora.value;
//     tr.cells[1].textContent = notaCorretagem.value;3
//     tr.cells[2].textContent = dataPregao.value;
//     tr.cells[3].textContent = ativo.value;
//     tr.cells[4].textContent = quantidade.value;
//     tr.cells[5].textContent = operacao.value;
//     tr.cells[6].textContent = tipoAtivo.value;
//     tr.cells[7].textContent = preco.value;
//     tr.cells[8].textContent = corretagem.value;
//     tr.cells[9].textContent = outrosCustos.value;
//     tr.cells[10].textContent = valorTotal.value;
  
//     editID = tr.dataset.id;
  
//     modalForm.reset();
//     modal.close();
  
//     editLocalStorage(editID, tr);
// }

//// Edit Local Storage



document.addEventListener("DOMContentLoaded", function() {
    
    if (localStorage.getItem("tradeData") != null) {

        let tradeData = JSON.parse(localStorage.getItem("tradeData"));

        for (let i = 0; i < tradeData.length; i++) {
            createTableRow(tradeData[i]);
        }
    }

});
