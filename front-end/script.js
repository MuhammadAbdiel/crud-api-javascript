const bodyContent = document.getElementById("body-content");
const inputName = document.getElementById("name");
const inputPrice = document.getElementById("price");
const inputDescription = document.getElementById("description");
const inputActive = document.getElementById("active");
const inputQuantity = document.getElementById("quantity");

let content = "";

const url = "http://127.0.0.1:8000/api/product";
// const url2 = 'https://jsonplaceholder.typicode.com/posts';

// Menampilkan form untuk tambah data atau edit data

const showform = document.getElementById("show-form");
const inputForm = document.querySelector("form");

showform.addEventListener("click", function (event) {
  event.preventDefault();
  inputForm.classList.toggle("button-toggle");

  if (inputForm.classList.contains("button-toggle")) {
    showform.innerText = "Hide Form";
  } else {
    showform.innerText = "Show Form";
  }
});

// * Read Data

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    const data = response.data;
    data.forEach((product) => (content += getData(product)));
    bodyContent.innerHTML = content;
  });

function getData(product) {
  return `
    <div class="col-lg-4 col-md-6 mb-3">
      <div class="card shadow rounded" data-quantity="${product.quantity}" data-active="${product.active}">
        <div class="card-body" data-id="${product.id}">
          <h5 class="card-title name">${product.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Rp. <span class="price">${product.price}</span></h6>
          <p class="card-text description">${product.description}</p>
          <a href="#" class="card-link text-decoration-none" id="detail-button" data-bs-toggle="modal" data-bs-target="#exampleModal">Detail</a>
          <a href="#" class="card-link text-decoration-none" id="edit-button">Edit</a>
          <a href="#" class="card-link text-decoration-none" id="delete-button">Delete</a>
        </div>
      </div>
    </div>
  `;
}

function getDetailData(product) {
  return `
    <ul class="list-group">
      <li class="list-group-item">Nama Makanan : ${product.name}</li>
      <li class="list-group-item text-muted">Harga : Rp. ${product.price}</li>
      <li class="list-group-item">Stok : ${product.quantity}</li>
      <li class="list-group-item">Deskripsi : ${product.description}</li>
      ${
        product.quantity != 0
          ? `<li class="list-group-item badge bg-success text-white">Tersedia</li>`
          : `<li class="list-group-item badge bg-danger text-white">Tidak Tersedia</li>`
      }
    </ul>
  `;
}

const submitButton = document.getElementById("submit-button");
bodyContent.addEventListener("click", function (event) {
  event.preventDefault();

  const id = event.target.parentElement.dataset.id;

  let deleteButton = event.target.id == "delete-button";
  let editButton = event.target.id == "edit-button";
  let detailButton = event.target.id == "detail-button";

  const parent = event.target.parentElement;
  const active = parent.parentElement.dataset.active;
  const quantity = parent.parentElement.dataset.quantity;

  // * Detail Data

  const modalContent = document.getElementById("modal-content");
  if (detailButton) {
    fetch(`${url}/${id}`)
      .then((response) => response.json())
      .then((response) => {
        const data = response.data;
        modalContent.innerHTML = getDetailData(data);
      });
  }

  // * Delete Data

  if (deleteButton) {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => location.reload());
  }

  // * Edit Data

  if (editButton) {
    submitButton.style.display = "none";
    const updateButton = document.getElementById("update-button");
    updateButton.style.display = "block";

    let name = parent.querySelector(".name").innerText;
    let price = parent.querySelector(".price").innerText;
    let description = parent.querySelector(".description").innerText;

    inputName.value = name;
    inputPrice.value = price;
    inputDescription.value = description;
    inputActive.value = active;
    inputQuantity.value = quantity;

    updateButton.addEventListener("click", function (event) {
      event.preventDefault();

      fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputName.value,
          price: inputPrice.value,
          quantity: inputQuantity.value,
          active: inputActive.value,
          description: inputDescription.value,
        }),
      })
        .then((response) => response.json())
        .then(() => location.reload());
    });

    const addData = document.getElementById("add-data");
    addData.style.display = "inline";

    addData.addEventListener("click", function (event) {
      event.preventDefault();

      addData.style.display = "none";

      updateButton.style.display = "none";
      submitButton.style.display = "block";

      inputName.value = "";
      inputPrice.value = "";
      inputQuantity.value = "";
      inputActive.value = "";
      inputDescription.value = "";
    });
  }
});

// * Create Data

submitButton.addEventListener("click", function (event) {
  event.preventDefault();

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: inputName.value,
      price: inputPrice.value,
      quantity: inputQuantity.value,
      active: inputActive.value,
      description: inputDescription.value,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      let dataArray = [];
      dataArray.push(response.data);
      dataArray.forEach((product) => (content += getData(product)));
    });

  inputName.value = "";
  inputPrice.value = "";
  inputQuantity.value = "";
  inputActive.value = "";
  inputDescription.value = "";
});
