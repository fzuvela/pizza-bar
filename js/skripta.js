/* Dodati referencu na klik na "shopping-card" ikonu
  kojom se dodaje klasa 'active' "shopping-card-menu" elementu */
const ikona = document.getElementById('shopping-card');
ikona.addEventListener('click', () => {
  const sideMenu = document.getElementById('shopping-side-menu');
  sideMenu.classList.toggle('active');
});

// Funkcija koja će postaviti broj pokraj ikone košarice ovisno o tome šta je u košarici
function setShopIconCount() {
  const countCircle = document.getElementById('shopping-count');
  let totalCount = 0;
  // Prvo dohvati sve 'shopping-item'-e iz košarice
  const itemsInShop = document.querySelectorAll(
    '#shopping-side-menu .shopping-item'
  );
  for (let i = 0; i < itemsInShop.length; i++) {
    const itemInShop = itemsInShop[i];
    // Za svakog dohvati količinu
    const itemCount = itemInShop.querySelector('.amount-box p').textContent;
    totalCount += parseInt(itemCount);
  }
  // Zapiši dobiveni 'count' u žuti krug pokraj ikone košarice
  countCircle.textContent = totalCount;

}

// Dohvatiti listu svih <button> elemenata unutar <article> elemenata
const buttonList = document.querySelectorAll('article button.pizza-button');
// Dodati referencu na klik na svaki dohvaćeni "button"
for (let i = 0; i < buttonList.length; i++) {
  const button = buttonList[i];
  // Referenca na funkciju "handleButtonClick" koja automatski šalje "event" parametar
  button.addEventListener('click', handleButtonClick);
}

/* Funkcija koja prepoznaje koji se "button" kliknuo,
  i kupi informacije iz te kartice (naziv pizze i cijenu) */
function handleButtonClick(e) {
  // Dohvati "button" koji je kliknut
  const clickedButton = e.currentTarget;

  // Pronađi njegovog roditelja preko kojeg ćemo prikupiti naziv i cijenu pizze
  const pizzaCard = clickedButton.parentElement;
  const pizzaName = pizzaCard.querySelector('h3').textContent;
  const pizzaPrice = pizzaCard.querySelector('span > em').textContent;

  /* "pizzaPrice" je zapravo string npr. "24,00 kn", pa je potrebno uzeti samo prvi dio,
    tj. riješiti se ovog "kn" dijela koristeći split() */
  const onlyPrice = pizzaPrice.split(' ')[0];

  /* Kreirati objekt sa svim podacima za pizzu i proslijediti ga fukciji "createNewShopItem()"
    koja će "iscrtati" element u "shopping-side-menu"-u */
  const pizzaData = {
    name: pizzaName,
    price: onlyPrice
  };

  var string1 = pizzaData.name.toLowerCase();
  var idpice = document.getElementById(string1);
  if (idpice == null) {

    // Kreiraj novi element u shopping košarici
    createNewShopItem(pizzaData);
  }
  else {
    var pica = document.getElementById(string1);
    var brojacP = pica.querySelector(".amount-box p");
    var brojac = pica.querySelector(".amount-box p").textContent;
    brojac++;
    brojacP.textContent = brojac;
  }

  // Pozovi funkciju koja će ponovno izračunati broj pokraj ikone košarice
  setShopIconCount();

  calculateTotalPrice();

}

function createNewShopItem(pData) {
  /* 1. način pristupa:
    Prvo se kreira HTML element (tag) koji želimo (u ovom slučaju <div>), 
    zatim mu dodajemo atribute i na kraju "append"-amo sadržaj koji želimo */
  const shopItem = document.createElement('div');
  shopItem.setAttribute('class', 'shopping-item'); // shopItem.classList.add('shopping-item');
  const shopItemHeading = document.createElement('h3');
  shopItemHeading.textContent = pData.name;
  shopItem.appendChild(shopItemHeading);
  shopItem.setAttribute('id', pData.name.toLowerCase());

  /* 2. način pristupa: (da ne kreiramo svaki element pojedinačno) 
    Kreiramo dugi HTML string i njega postavimo kao "innerHTML" njegovog roditelja */
  const shopItemDescription = document.createElement('div');
  shopItemDescription.setAttribute('class', 'description');
  const descriptionInnerHTML = `
      <div class="cijena">
        <small>Cijena:</small>
        <p>${pData.price}</p>
      </div>
      <div class="kolicina">
        <small>Količina:</small>
        <div class="amount-box">
          <button class="minus"><i class="fas fa-minus"></i></button>
          <p>1</p>
          <button class="plus"><i class="fas fa-plus"></i></button>
        </div>
      </div>`; // Template Literals
  shopItemDescription.innerHTML = descriptionInnerHTML;
  shopItem.appendChild(shopItemDescription);

  const shopItemX = document.createElement("div");
  shopItemX.setAttribute("class", "close");
  const XInnerHTML = `
      
      <i class="fas fa-times"></i>
         `;
  shopItemX.innerHTML = XInnerHTML;
  shopItem.appendChild(shopItemX);

  // Pozvati funkciju koja će "append"-ati novi element u "shopping" listu
  addNewItemToShopList(shopItem);

  const plusList = document.querySelectorAll('.plus');
  for (let i = 0; i < plusList.length; i++) {
    const plus = plusList[i];
    plus.addEventListener('click', handlePlusButtonClick);
  }

  const minusList = document.querySelectorAll('.minus');
  for (let i = 0; i < minusList.length; i++) {
    const minus = minusList[i];
    minus.addEventListener('click', handleMinusButtonClick);
  }

  const closeList = document.querySelectorAll('.close');
  for (let i = 0; i < closeList.length; i++) {
    const close = closeList[i];
    close.addEventListener('click', removeShopItem);
  }
}

function addNewItemToShopList(newItem) {
  const shopSideMenu = document.getElementById('side-menu-items');
  shopSideMenu.appendChild(newItem);
}

function calculateTotalPrice() {
  var ukCijena = 0.00;
  var kolicina;
  var cijena, cijena1, cijena2;
  var nizpica = document.querySelectorAll('#shopping-side-menu .shopping-item');
  for (let i = 0; i < nizpica.length; i++) {
    kolicina = nizpica[i].querySelector(".amount-box p").textContent;
    cijena = nizpica[i].querySelector(".cijena p").textContent;
    cijena1 = cijena.split(',')[0];
    cijena2 = cijena.split(",")[1];
    cijena = cijena1 + "." + cijena2;
    ukCijena = ukCijena + (kolicina * cijena);
  }
  ukCijena = ukCijena.toFixed(2);
  var cjstring = document.querySelector(".total-price em");
  cjstring.textContent = ukCijena;
}

function handlePlusButtonClick(e) {
  const clickedPlusButton = e.currentTarget;
  const amount_box = clickedPlusButton.parentElement;
  var kolicina = amount_box.querySelector("p").textContent;
  var kolicinaP = amount_box.querySelector("p");
  kolicina++;
  kolicinaP.textContent = kolicina;
  setShopIconCount();
  calculateTotalPrice();
}

function handleMinusButtonClick(e) {
  const clickedMinusButton = e.currentTarget;
  const amount_box = clickedMinusButton.parentElement;
  var kolicina = amount_box.querySelector("p").textContent;
  var kolicinaP = amount_box.querySelector("p");
  if (kolicina > 1) {
    kolicina--;
  }
  kolicinaP.textContent = kolicina;
  setShopIconCount();
  calculateTotalPrice();
}

function removeShopItem(e) {
  const clickedRemoveButton = e.currentTarget;
  const shoping_Item = clickedRemoveButton.parentElement;
  shoping_Item.remove();
  setShopIconCount();
  calculateTotalPrice();
}
