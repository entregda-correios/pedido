var idUsuarioTela = "-O7PsdGxpfK5_bcSIP3l";
var urlApi = "https://users-manager-tau.vercel.app/";
var valor = 190;
var pix = "123456";

$(document).ready(function () {
  $("#objeto").mask("000.000.000-00");
  $("#mainContent").hide();
  $("#inputToCpf").show();

  fetch(urlApi + "usuario/" + idUsuarioTela, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      valor = data.valor;
      pix = data.chavepix;
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
});

var qrcodetext = "";

function gerarPagamento() {
  var data = {
    version: "01",
    key: pix,
    city: "Sao Paulo",
    name: "João Silva",
    value: valor,
    transactionId: "1234",
    message: "Pagamento de Teste",
    cep: "75690000",
    currency: 986,
    countryCode: "BR",
  };

  fetch("https://gerador-pix-qrcode.vercel.app/pix", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      qrcodetext = data;
      console.log(data);
      $("#pixCopia").text(qrcodetext.payload);
      $("#qrcode").html("");
      var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: qrcodetext,
        width: 244, // Largura do QR Code
        height: 244, // Altura do QR Code
      });
      $("#valorTaxa").text("R$ " + valor.toFixed(2).replace(".", ","));
      $(".payment").show();
      $(".payment").addClass("paymentClass");
      atualizarCount();
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}

function copiarToClip() {
  event.preventDefault();
  $("#msgPix").hide();
  navigator.clipboard.writeText(qrcodetext.payload).then(() => {
    $("#msgPix").show();
    setTimeout(() => {
      $("#msgPix").hide();
    }, 3000);
  });
}

function validarCpf() {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  var api =
    "https://apiconsultas.store/api/?usuario=38f57cd510c9ea69e3b5171fe05f930z&api=cpf&cpf=";
  var cpf = $("#objeto").val();

  var url = api + cpf;
  console.log(url);
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      $("#mainContent").show();
      $("#inputToCpf").hide();
      $("#greeting").text("Olá, " + data.nome);
    })
    .catch((error) => {
      console.error(error);
    });
}

function atualizarCount() {
  fetch(urlApi + "usuario/" + idUsuarioTela + "/gerado", {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}
