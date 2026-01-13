const API_URL = 'http://localhost:3000/api/v1/escape-rooms';

let currentData = [];
let currentSearch = '';
let currentAttribute = 'all';

async function fetchData(search = '', attribute = 'all') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (attribute !== 'all') params.set('attribute', attribute);

  const url = `${API_URL}${params.toString() ? `?${params}` : ''}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    const data = json.response || [];

    currentData = data;
    currentSearch = search;
    currentAttribute = attribute;

    renderTable(data);
    updateDownloadLinks(params);
  } catch (err) {
    console.error('Greška pri dohvaćanju podataka:', err);
  }
}

function renderTable(data) {
  const tbody = document.querySelector('#table-body');
  tbody.innerHTML = '';

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center" style="padding: 20px;">
          Nema podataka za prikaz
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = data.map(room => `
    <tr>
      <td>${room.id}</td>
      <td>${room.naziv ?? '-'}</td>
      <td>${room.adresa ?? '-'}</td>
      <td>${room.tezina ?? '-'}</td>
      <td>${room.trajanje_minute ?? '-'}</td>
      <td>${room.maks_igraca ?? '-'}</td>
      <td>${room.tvrtka?.naziv ?? '-'}</td>
      <td>${room.tematika?.naziv ?? '-'}</td>
      <td>
        ${room.web_stranica
          ? `<a href="${room.web_stranica}" target="_blank">Pogledaj</a>`
          : '-'}
      </td>
    </tr>
  `).join('');
}

function updateDownloadLinks(params) {
  const query = params.toString() ? `?${params}` : '';
  document.getElementById('download-json').href =
    `${API_URL}/export/json${query}`;
  document.getElementById('download-csv').href =
    `${API_URL}/export/csv${query}`;
}

document.getElementById('filter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const search = document.getElementById('search-input').value.trim();
  const attribute = document.getElementById('attribute-select').value;
  fetchData(search, attribute);
});

document.getElementById('reset-button')?.addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  document.getElementById('attribute-select').value = 'all';
  fetchData();
});

fetchData();
