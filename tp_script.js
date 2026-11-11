const picture = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=75`;
const defaultImage = picture('photo-1500534623283-312aade485b7');

// Почетни градови
const startCities = [
  {
    id: 1, 
    name: 'Париз',
    category: 'Култура', 
    price: 110, 
    transport: 160,
    images: [picture('photo-1502602898657-3e91760cbb34'), picture('photo-1499856871958-5b9627545d1a'), picture('photo-1522093007474-d86e9bf7ba6f')],
    places: ['Ајфелова кула', 'Лувр', 'Нотр Дам', 'Триумфална порта', 'Шанзелизе', 'Монмартр', 'Сакре Кер', 'Луксембуршка градина', 'Музеј Орсе', 'Река Сена']
  },
  {
    id: 2, 
    name: 'Рим', 
    category: 'Историја', 
    price: 90, 
    transport: 130,
    images: [picture('photo-1552832230-c0197dd311b5'), picture('photo-1533105079780-92b9be482077'), picture('photo-1529260830199-42c24126f198')],
    places: ['Колосеум', 'Римски форум', 'Фонтана ди Треви', 'Пантеон', 'Шпански скали', 'Пјаца Навона', 'Ватикански музеи', 'Св. Петар', 'Замок Сант Анџело', 'Трастевере']
  },
  {
    id: 3, 
    name: 'Барселона', 
    category: 'Одмор', 
    price: 95, 
    transport: 180,
    images: [picture('photo-1539037116277-4db20889f2d4'), picture('photo-1557672172-298e090bd0f1'), picture('photo-1523531294919-4bcd7c65e216')],
    places: ['Саграда Фамилија', 'Парк Гуел', 'Каса Батљо', 'Ла Рамбла', 'Готски кварт', 'Барселонета', 'Монжуик', 'Каса Мила', 'Бокерија', 'Триумфална порта']
  }
];

let cities = [...startCities];
let comments = {};
let votes = {};
let surveyAnswers = [];
let openCity = null;

function getCity(id) { return cities.find(city => city.id === id); }

function cityCard(city, buttons) {

    let deleteButton = "";

    if (buttons == true) {
        deleteButton = `<button class="btn btn-danger btn-sm"
            onclick="deleteCity(${city.id})">Избриши</button>`;
    }

    return `
        <div class="col-md-4">
            <div class="card h-100">
                <img src="${city.images[0]}" class="card-img-top">

                <div class="card-body">
                    <h5>${city.name}</h5>
                    <p>${city.category} - ${city.price} € на ден</p>
                    ${deleteButton}
                </div>
            </div>
        </div>
    `;
}

// Прикажуавње градови и филтри
function render() {
  document.getElementById('homeCities').innerHTML = cities.slice(0, 3).map(c => cityCard(c, false)).join('');

  const category = document.getElementById('filterCategory').value;
  const budget = document.getElementById('filterBudget').value;
  const filtered = cities.filter(c => (category === 'Сите' || c.category === category) && (budget === '' || c.price <= Number(budget)));
  document.getElementById('cityList').innerHTML = filtered.map(c => cityCard(c, true)).join('') || '<p>Нема дестинации.</p>';

  document.getElementById('calcCity').innerHTML = cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('galleryCities').innerHTML = cities.map(c => `
    <div class="col-md-4 mb-3"><div class="card h-100">
      <img src="${c.images[0]}" class="card-img-top" alt="${c.name}">
      <div class="card-body"><h5>${c.name}</h5>
      <button class="btn btn-primary btn-sm" onclick="showGallery(${c.id})">Отвори галерија</button></div>
    </div></div>`).join('');

  document.getElementById('blogCities').innerHTML = cities.filter(c => c.places.length).map(c => `
    <div class="col-md-4 mb-3"><div class="card h-100"><div class="card-body">
      <h5>10 работи што мора да ги видиш во ${c.name}</h5>
      <button class="btn btn-outline-primary btn-sm" onclick="showBlog(${c.id})">Прочитај</button>
    </div></div></div>`).join('');
}

// Додавање и бришење
function addCity(event) {
  event.preventDefault();
  const name = document.getElementById('cityName').value.trim();
  const price = Number(document.getElementById('cityPrice').value);
  const transport = Number(document.getElementById('cityTransport').value);
  if (!name || price <= 0 || transport < 0) return;
  const enteredImage = document.getElementById('cityImage').value.trim();
  const image = enteredImage || defaultImage;

  cities.push({
    id: Date.now(), name,
    category: document.getElementById('cityCategory').value,
    price, transport,
    images: [image, picture('photo-1500534623283-312aade485b7'), picture('photo-1488646953014-85cb44e25828')],
    places: []  
  });
  document.getElementById('addForm').reset();
  render();
}

function deleteCity(id) {
  if (!confirm('Дали сакаш да ја избришеш дестинацијата?')) return;
  cities = cities.filter(c => c.id !== id);
  render();
  document.getElementById('galleryDetails').classList.add('d-none');
  document.getElementById('blogDetails').classList.add('d-none');
}

// Пресметка: (дневна цена * денови + превоз) * лица
function calculate() {
  const city = getCity(Number(document.getElementById('calcCity').value));
  const days = Number(document.getElementById('calcDays').value);
  const people = Number(document.getElementById('calcPeople').value);
  const result = document.getElementById('costResult');
  if (!city || !Number.isInteger(days) || days < 1 || !Number.isInteger(people) || people < 1) {
    result.textContent = 'Внеси валидни денови и број на лица.';
    return;
  }
  result.textContent = `Вкупно за ${city.name}: ${(city.price * days + city.transport) * people} €`;
}

// Галерија, реакции и коментари
function showGallery(id) {
  const city = getCity(id);
  if (!city) return;
  openCity = id;
  const reaction = votes[id] || { like: 0, dislike: 0 };
  const list = comments[id] || [];
  const box = document.getElementById('galleryDetails');
  box.classList.remove('d-none');
  box.innerHTML = `
    <h3>${city.name}</h3>
    <div class="row">${city.images.map(src => `
      <div class="col-md-4 mb-2"><img src="${src}" class="gallery-photo" alt="Слика од град"></div>`).join('')}</div>
    <div class="my-3">
      <button class="btn btn-outline-success btn-sm" onclick="vote('like')"> Like (${reaction.like})</button>
      <button class="btn btn-outline-danger btn-sm" onclick="vote('dislike')"> Dislike (${reaction.dislike})</button>
    </div>
    <h5>Коментари</h5>
    ${list.map(c => `<p class="comment"><strong>${c.name}:</strong> ${c.text}</p>`).join('') || '<p>Нема коментари.</p>'}
    <form onsubmit="addComment(event)" class="form-row">
      <div class="col-md-3 mb-2"><input id="commentName" class="form-control" placeholder="Име" maxlength="40" required></div>
      <div class="col-md-7 mb-2"><input id="commentText" class="form-control" placeholder="Коментар" maxlength="250" required></div>
      <div class="col-md-2 mb-2"><button class="btn btn-success w-100">Испрати</button></div>
    </form>`;
}

function vote(type) {
  if (!votes[openCity]) votes[openCity] = { like: 0, dislike: 0 };
  votes[openCity][type]++;
  showGallery(openCity);
}

function addComment(event) {
  event.preventDefault();
  const name = document.getElementById('commentName').value.trim();
  const text = document.getElementById('commentText').value.trim();
  if (!name || !text) return;
  if (!comments[openCity]) comments[openCity] = [];
  comments[openCity].push({ name, text });
  showGallery(openCity);
}

// Блог за трите почетни градови
function showBlog(id) {
  const city = getCity(id);
  if (!city) return;
  const box = document.getElementById('blogDetails');
  box.classList.remove('d-none');
  box.innerHTML = `<h3>Што да посетиш во ${city.name}?</h3>
    <ol>${city.places.map(place => `<li>${place}</li>`).join('')}</ol>`;
}

// Најава
document.getElementById('loginForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('username').value.trim();
  document.getElementById('loginMessage').textContent = name ? `Најавен/а си како ${name}.` : '';
  document.getElementById('password').value = '';
});
document.getElementById('logout').addEventListener('click', () => {
  document.getElementById('loginForm').reset();
  document.getElementById('loginMessage').textContent = 'Одјавен/а си.';
});

// Анкета
document.getElementById('surveyForm').addEventListener('submit', event => {
  event.preventDefault();
  surveyAnswers.push({
    name: document.getElementById('surveyName').value.trim(),
    rating: document.getElementById('surveyRating').value,
    recommend: document.querySelector('input[name="recommend"]:checked').value,
    text: document.getElementById('surveyText').value.trim()
  });
  document.getElementById('surveyForm').reset();
  document.getElementById('surveyMessage').textContent = 'Ти благодариме за одговорот!';
});

// Поврзување на формите и филтрите
document.getElementById('addForm').addEventListener('submit', addCity);
document.getElementById('filterCategory').addEventListener('change', render);
document.getElementById('filterBudget').addEventListener('input', render);
document.getElementById('resetFilters').addEventListener('click', () => {
  document.getElementById('filterCategory').value = 'Сите';
  document.getElementById('filterBudget').value = '';
  render();
});

render();
