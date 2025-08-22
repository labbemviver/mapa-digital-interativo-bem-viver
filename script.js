// inicializa o mapa com foco específico
const map = L.map('map').setView([-23.55, -46.63], 10); // Ex: São Paulo

// camada base do OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// configurações da planilha
const apiKey = 'AIzaSyAQ9TJWCbsGG2lCt95FagqMA1mrxALsOuE';
const sheetId = '1uPLPB6iXvgFKMh-L5SqPQafFzDDbG-t4HRJ0pdkB2hA';
const range = 'A:I';

// busca título da planilha
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=properties/title&key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const titulo = data.properties.title;
    document.getElementById('sheet-title').textContent = titulo;
  })
  .catch(error => {
    console.error('Erro ao buscar título da planilha:', error);
    document.getElementById('sheet-title').textContent = 'Erro ao carregar título';
  });

// busca dados da planilha
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const linhas = data.values.slice(1);
    linhas.forEach(linha => {
      const [local, lat, lng, , , , , , descricao] = linha;
      const latitude = parseFloat(lat.replace(',', '.'));
      const longitude = parseFloat(lng.replace(',', '.'));

      if (!isNaN(latitude) && !isNaN(longitude)) {
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(`<strong>${local}</strong><br>${descricao || ''}`);
      }
    });
  })
  .catch(error => {
    console.error('Erro ao carregar dados da planilha:', error);
  });
