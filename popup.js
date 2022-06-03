
// Quando o botão for clicado, executa a função sendNote dentro da aba aberta do navegador.

  document.getElementById("sendNote").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    let horaInicio = document.getElementById('horaInicio').value;
    let horaFim = document.getElementById('horaFim').value;
    let descrição = document.getElementById('descrição').value;
    chrome.storage.sync.set({ "horaInicio":horaInicio,"horaFim":horaFim,"descrição":descrição });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setNote,
    });
  });

// A função setNote pega os dados inputados no front e envia eles pra um job usando a API do Jobber.

// body: JSON.stringify({"job":1138,"user":5,"description":"Teste","start":"2022-06-01T12:00:00.000Z","finish":"2022-06-01T13:00:00.000Z",}) };

function setNote() {

  chrome.storage.sync.get(["horaInicio", "horaFim", "descrição"], function(result) {

    var horaIni = result.horaInicio + ":00.000Z";

    let horaIniSemFormat = Date.parse(horaIni);
    let dataInicio = new Date(horaIniSemFormat.valueOf() + 10800000);

    var horaF = result.horaFim + ":00.000Z";

    let horaFSemFormat = Date.parse(horaF);
    let horaFim = new Date(horaFSemFormat.valueOf() + 10800000);

    let descrição = result.descrição;

    var userData = localStorage.getItem('user');
    let token = JSON.parse(userData);
  
    var myHeaders = new Headers({Authorization: "Token " + token.token,"content-type": "application/json",});
  
    var myInit = { method: 'POST',
                 headers: myHeaders,  
                 mode: 'cors',
                 cache: 'default',
                 body: JSON.stringify({"job":1138,"user":5,"description":descrição,"start":dataInicio,"finish":horaFim,}) };
  
    var myRequest = new Request('https://jobber-core.herokuapp.com/private-api/notes/', myInit);
  
    fetch(myRequest)
      .then(function(response) {
        if (response.status === 400){ alert("Preenche direito mané!")};
      return 0;
    });
  });

}