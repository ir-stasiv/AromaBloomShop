document.addEventListener("DOMContentLoaded", () => {
  let activePage = localStorage.getItem("activePage") || "catalog.html";
  let items = JSON.parse(localStorage.getItem("items")) || [];
  let contentSection = document.getElementById("contentSection");

  loadPage(activePage);

  //set active class to the current page link
  let navMenu = document.getElementById("nav-menu");
  let navLinks = navMenu.getElementsByClassName("nav-link");

  Array.from(navLinks).forEach((link) => {
    link.addEventListener("click", (e) => {
      let page = link.getAttribute("data-page");

      localStorage.setItem("activePage", page);
      loadPage(page);
    });
  });

  function loadPage(page) {
    let catalogPage = "catalog.html";
    let managerPage = "managerPage.html";

    fetch(page)
      .then((responce) => {
        if (!responce.ok) {
          throw new Error(responce.status);
        } else {
          return responce.text();
        }
      })
      .then((html) => {
        contentSection.innerHTML = html;

        //if Catalog page
        if (page === catalogPage) {
          loadCatalogPage(items);
        }
        //if Manager page
        if (page === managerPage) {
          loadManagerPage(items);
        }

        //update active link
        let updateNavMenu = document.getElementById("nav-menu");
        let updateNavLinks = updateNavMenu.getElementsByClassName("nav-link");

        Array.from(updateNavLinks).forEach((link) => {
          link.classList.remove("active-link");

          if (link.getAttribute("data-page") === page) {
            link.classList.add("active-link");
          } else {
            link.classList.remove("active-link");
          }
        });
      })
      .catch((error) => {
        console.error("Помилка при завантаженні.", error);
      });
  }

  function loadCatalogPage(items) {
    createCardsForUser(items);
  }

  function loadManagerPage(items) {
    createCardsForManager(items);
  }
});

/* ----------- Search -------------*/

function searchItemsForUser() {
  let items = searchItems();
  createCardsForUser(items);
}

function searchItemsForManager() {
  let items = searchItems();
  createCardsForManager(items);
}

function searchItems() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let items = JSON.parse(localStorage.getItem("items")) || [];
  let filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(input)
  );
  return filteredItems;
}

/*---------- Sort----------- */

// Sort by price
function sortByPriceForManager() {
  let items = sortByPrice();
  createCardsForManager(items);
}
function sortByPriceForUser() {
  let items = sortByPrice();
  createCardsForUser(items);
}

// Sort by name

function sortByNameForManager() {
  let items = sortByName();
  createCardsForManager(items);
}
function sortByNameForUser() {
  let items = sortByName();
  createCardsForUser(items);
}

function sortByPrice() {
  let items = JSON.parse(localStorage.getItem("items")) || [];
  let sortByPriceItems = items.sort((a, b) => a.price - b.price);
  return sortByPriceItems;
}

function sortByName() {
  let items = JSON.parse(localStorage.getItem("items")) || [];
  let sortByNameItems = items.sort((a, b) => a.name.localeCompare(b.name));
  return sortByNameItems;
}

// Create Cards
function createCardsForUser(items) {
  let cardContainer = document.getElementById("catalogContainer");
  cardContainer.innerHTML = "";

  items.forEach((item, index) => {
    let itemCard = document.createElement("div");
    itemCard.className = "card";
    itemCard.innerHTML = `
                        <h1 class="nameCard">${item.name}</h1>
                        <p class="descriptionCard">${item.description}</p>
                        <p class="priceCard"> ${item.price} грн</p>
                        <p class="itemCount">Кількість: ${item.count}</p>
                        <p class="cardActions">                             
                            <button class="buy-btn" onclick="buyItem(${index})">Купити</button>
                        </p>
                        </div>`;

    cardContainer.appendChild(itemCard);
  });
}

function createCardsForManager(items) {
  let cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";

  items.forEach((item, index) => {
    let itemCard = document.createElement("div");
    itemCard.className = "card";
    itemCard.innerHTML = `
                        <h1 class="nameCard">${item.name}</h1>
                        <p class="descriptionCard">${item.description}</p>
                        <p class="priceCard"> ${item.price} грн</p>
                        <p class="itemCount">Кількість: ${item.count}</p>
                        <p class="cardActions">
                            <button class="delete-btn" onclick="deleteItem(${index})">Видалити</button>
                            <button class="edit-btn" onclick="editItem(${index})">Редагувати</button>
                        </p>
                        </div>`;

    cardContainer.appendChild(itemCard);
  });
}

/* ----------- Delete card ----------*/
function deleteItem(index) {
  let userResponse = window.confirm("Ви дійсно бажаєте видалити цю карту?");
  if (userResponse) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    createCardsForManager(items);
  }
}

function closeEditCardForm() {
  let form = document.getElementById("editCardForm");
  form.style.display = "none";
}

function updateCard() {
  let form = document.getElementById("editCardForm");

  let index = form.querySelector("#itemIndex").value;
  let newName = form.querySelector("#itemName").value;
  let newDescription = form.querySelector("#itemDescription").value;
  let newPrice = form.querySelector("#itemPrice").value;
  let newCount = form.querySelector("#itemCount").value;

  let items = JSON.parse(localStorage.getItem("items"));
  let item = items[index];

  item.name = newName;
  item.description = newDescription;
  item.price = parseFloat(newPrice);
  item.itemCount = parseInt(newCount);

  localStorage.setItem("items", JSON.stringify(items));
  createCardsForManager(items);
  closeEditCardForm();
}

function editItem(index) {
  let form = document.getElementById("editCardForm");
  let items = JSON.parse(localStorage.getItem("items"));
  let item = items[index];

  form.querySelector("#itemIndex").value = index;
  form.querySelector("#itemName").value = item.name;
  form.querySelector("#itemDescription").value = item.description;
  form.querySelector("#itemPrice").value = item.price;
  form.querySelector("#itemCount").value = item.count;

  form.style.display = "block";
}

function openCreateCardForm() {
  document.getElementById("createCardForm").style.display = "block";
}
function closeCreateCardForm() {
  document.getElementById("createCardForm").style.display = "none";
}

function buyItem(index) {
  let items = JSON.parse(localStorage.getItem("items"));
  let buyItem = items[index];

  let buyItemsFromStorage = JSON.parse(localStorage.getItem("buyItems")) || [];
  buyItemsFromStorage.push(buyItem);
  localStorage.setItem("buyItems", JSON.stringify(buyItemsFromStorage));
  alert("Товар доданий до кошика.");
}

function openShoppingListForm() {
  document.getElementById("shoppingListForm").style.display = "block";

  //get all element from local storage
  let buyItems = JSON.parse(localStorage.getItem("buyItems"));

  //find orderList in form
  let orderList = document.getElementById("orderList");
  orderList.innerHTML = "";

  let totalPrice = 0;
  buyItems.forEach((item) => {
    // get sum for each item and count total price
    let itemSum = parseFloat(item.price) * parseInt(item.itemCount);
    totalPrice += itemSum;

    //create line in form
    let itemLine = document.createElement("li");
    itemLine.textContent = `${item.name} - ${item.price} грн × ${
      item.itemCount
    } = ${itemSum.toFixed(2)} грн`;

    //add this line to orderList
    orderList.append(itemLine);
  });

  let totalPriceText = document.getElementById("totalPrice");
  totalPriceText.textContent = totalPrice.toFixed(2);
}

function closeShoppingListForm() {
  document.getElementById("shoppingListForm").style.display = "none";
}

function createCard() {
  let name = document.getElementById("itemName").value.trim();
  let desc = document.getElementById("itemDescription").value.trim();
  let price = parseFloat(document.getElementById("itemPrice").value);
  let count = parseInt(document.getElementById("itemCount").value);

  if (
    !name ||
    name === "" ||
    !desc ||
    desc === "" ||
    !price ||
    price <= 0 ||
    !count ||
    count <= 0
  ) {
    alert("Будь ласка, заповніть всі поля.");
    return;
  }

  let newItem = {
    name: name,
    description: desc,
    price: price,
    count: count,
  };

  let items = JSON.parse(localStorage.getItem("items")) || [];
  items.push(newItem);
  localStorage.setItem("items", JSON.stringify(items));

  alert("Нову картку успішно створено!");

  createCardsForManager(items);

  document.getElementById("itemName").value = "";
  document.getElementById("itemDescription").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemCount").value = "";

  document.getElementById("createCardForm").style.display = "none";
}
