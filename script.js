// inicializa o mapa em SP (exemplo)
const map = L.map('map').setView([-23.7046008767975, -46.6442860338516], 15);;

// camada base do OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Configurações da planilha
const apiKey = 'AIzaSyAQ9TJWCbsGG2lCt95FagqMA1mrxALsOuE';
const sheetId = '1uPLPB6iXvgFKMh-L5SqPQafFzDDbG-t4HRJ0pdkB2hA';
const range = 'A:I';

let markers = []; // armazena todos os marcadores
let tiposSet = new Set(); // armazena tipos únicos

// Título da planilha
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=properties/title&key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('sheet-title').textContent = data.properties.title;
  })
  .catch(() => {
    document.getElementById('sheet-title').textContent = 'Erro ao carregar título';
  });

// Dados da planilha
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const linhas = data.values.slice(1);

    linhas.forEach(linha => {
      const [local, lat, lng, , , , , tipo, descricao] = linha;
      const latitude = parseFloat(lat.replace(',', '.'));
      const longitude = parseFloat(lng.replace(',', '.'));

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const marker = L.marker([latitude, longitude])
          .bindPopup(`<strong>${local}</strong><br>${descricao || ''}<br><em>${tipo}</em>`)
          .addTo(map);

        markers.push({ marker, tipo });
        tiposSet.add(tipo);
      }
    });

    // popula o select com tipos únicos
    const select = document.getElementById('filter');
    tiposSet.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo;
      select.appendChild(option);
    });

    // evento de filtro
    select.addEventListener('change', e => {
      const valor = e.target.value;
      markers.forEach(({ marker, tipo }) => {
        if (valor === "all" || tipo === valor) {
          map.addLayer(marker);
        } else {
          map.removeLayer(marker);
        }
      });
    });
  })
  .catch(error => {
    console.error('Erro ao carregar dados da planilha:', error);
  });
