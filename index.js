//'https://api.rawg.io/api/games?dates=2022,2023-03-26&ordering=-popularity&page_size=10&key=617e338437104212aac41ca5875ec598'
const lastYear = new Date().getFullYear() - 1;
const currentDate = new Date().toISOString().slice(0, 10);
const nextYear = new Date().getFullYear() + 1;
console.log(currentDate);
const url = `https://api.rawg.io/api/games?dates=${currentDate},${nextYear}&page_size=9&key=617e338437104212aac41ca5875ec598`;
const urlPopular = `https://api.rawg.io/api/games?ordering=rating&page_size=9&key=617e338437104212aac41ca5875ec598`;
let urlNew = `https://api.rawg.io/api/games?dates=${lastYear},${currentDate}&page_size=9&key=617e338437104212aac41ca5875ec598`;

function searchFunc(e, value) {
  e.preventDefault();
  //window сделал в угоду сокращения кода, чтобы в функции поиска не писать новую отрисовку или такого способа лучше избежать?
  window.urlSearch = `https://api.rawg.io/api/games?search=${value}&page_size=9&key=617e338437104212aac41ca5875ec598`;
  const searchBlock = document.getElementById('searchBlock');
  searchBlock.classList.remove('hidden');
  const listSearch = document.getElementById('listSearch');
  listSearch.textContent = ''; //При попытке очистки жалуется на modal, якобы не определён

  fetch(urlSearch)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      dataGlobal = [...dataGlobal, ...data.results];
      data.results.forEach((game) => {
        viewItems(game, urlSearch);
      });
    })
    .catch((err) => console.log(err));
  // console.log(urlSearch);
}

let dataGlobal = [];
const list = document.getElementById('list');
const listPopular = document.getElementById('listPopular');
const listNew = document.getElementById('listNew');
const listSearch = document.getElementById('listSearch');

listSearch.onclick = modalFunc;
listNew.onclick = modalFunc;
listPopular.onclick = modalFunc;
list.onclick = modalFunc;
function viewItems(game, urlFetch) {
  // listSearch.textContent = ''; //При попытке очистки здесь, в результат выдаётся лишь одна строка
  const item = document.createElement('div');
  item.className = 'list__item';
  item.dataset.id = game.id;
  const imgBox = document.createElement('div');
  imgBox.className = 'list__item__img__box';
  imgBox.dataset.id = game.id;
  const img = document.createElement('img');
  img.dataset.id = game.id;
  img.src = game.background_image;
  img.alt = game.name;
  img.className = 'list__item__img';
  imgBox.append(img);
  const title = document.createElement('a');
  title.className = 'list__item__title';
  title.textContent = game.name;
  title.dataset.id = game.id;
  item.append(imgBox, title);

  if (urlFetch === url) {
    list.append(item);
  } else if (urlFetch === urlPopular) {
    listPopular.append(item);
  } else if (urlFetch === urlNew) {
    listNew.append(item);
  } else if (urlFetch === urlSearch) {
    listSearch.append(item);
  }
}

function modalFunc(e) {
  if (
    e.target.classList.contains('list__item') ||
    e.target.parentNode.classList.contains('list__item')
  ) {
    // e.target.dataset.id;
    const modal = document.getElementById('modal');

    const game = dataGlobal.find(
      ({ id }) => id === Number(e.target.dataset.id)
    );
    const modalContent = document.getElementById('modalContent');
    modalContent.textContent = '';
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = game.name;
    const modalRate = document.createElement('p');
    modalRate.textContent = `Rate: ${game.rating}`;
    const screenBox = document.createElement('div');
    for (let i = 0; i < game.short_screenshots.length; i++) {
      const imgScreen = document.createElement('img');
      imgScreen.src = game.short_screenshots[i].image;
      imgScreen.alt = game.name;
      imgScreen.className = 'screen';
      screenBox.append(imgScreen);
    }
    const modalDescription = document.createElement('p');
    modalDescription.textContent = game.description;
    modalContent.append(modalTitle, modalRate, modalDescription, screenBox);
    modal.classList.remove('hidden');
    console.log(game);
    // console.log(dataGlobal);
  }
}

const searchText = document.getElementById('search');
const form = document.getElementById('form');
form.onsubmit = (e) => searchFunc(e, searchText.value);
// form.onsubmit = (e) => searchFunc(e, dataGlobal, searchText.value); //в слушателях событий всегда только параметр событие

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    dataGlobal = [...dataGlobal, ...data.results];
    data.results.forEach((game) => {
      viewItems(game, url);
    });
  })
  .catch((err) => console.log(err));

fetch(urlPopular)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    dataGlobal = [...dataGlobal, ...data.results];
    data.results.forEach((game) => {
      viewItems(game, urlPopular);
    });
  })
  .catch((err) => console.log(err));

fetch(urlNew)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    dataGlobal = [...dataGlobal, ...data.results];
    data.results.forEach((game) => {
      viewItems(game, urlNew);
    });
  })
  .catch((err) => console.log(err));

window.onclick = function (e) {
  if (e.target.classList.contains('list__item__modal')) {
    e.target.classList.add('hidden');
  }
};
