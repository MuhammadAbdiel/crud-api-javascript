const bodyContent = document.getElementById("body-content");
const inputName = document.getElementById("name");
const inputPrice = document.getElementById("price");
const inputDescription = document.getElementById("description");
const inputActive = document.getElementById("active");
const inputQuantity = document.getElementById("quantity");
const showform = document.getElementById("show-form");
const inputForm = document.querySelector("form");
const modalContent = document.getElementById("modal-content");
const submitButton = document.getElementById("submit-button");

const url = "https://crud-rest-api-laravel.herokuapp.com/api/product";
// const url2 = 'https://jsonplaceholder.typicode.com/posts';

let content = "";

// * Read Data

async function fetchData(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      const data = response.data;
      data.forEach((product) => (content += getData(product)));
      bodyContent.innerHTML = content;
    });
}

// * Create Data

async function addData(url) {
  return await fetch(url, {
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
    })
    .then(() => {
      location.reload();

      inputName.value = "";
      inputPrice.value = "";
      inputQuantity.value = "";
      inputActive.value = "";
      inputDescription.value = "";
    });
}

// * Read Detail Data

async function detailData(url, id) {
  return await fetch(`${url}/${id}`)
    .then((response) => response.json())
    .then((response) => {
      const data = response.data;
      modalContent.innerHTML = getDetailData(data);
    });
}

// * Update Data

async function updateData(url, id) {
  return await fetch(`${url}/${id}`, {
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
}

// * Delete Data

async function deleteData(url, id) {
  return await fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => location.reload());
}

// * Show Data

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

// * Show Detail Data

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

submitButton.addEventListener("click", async function (event) {
  event.preventDefault();
  await addData(url);
});

bodyContent.addEventListener("click", async function (event) {
  event.preventDefault();

  const id = event.target.parentElement.dataset.id;

  let deleteButton = event.target.id == "delete-button";
  let editButton = event.target.id == "edit-button";
  let detailButton = event.target.id == "detail-button";

  const parent = event.target.parentElement;
  const active = parent.parentElement.dataset.active;
  const quantity = parent.parentElement.dataset.quantity;

  // * Check if Detail Button is clicked

  if (detailButton) {
    await detailData(url, id);
  }

  // * Check if Delete Button is clicked

  if (deleteButton) {
    await deleteData(url, id);
  }

  // * Check if Edit Button is clicked

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

    if (active == true) {
      inputActive.value = 1;
    } else {
      inputActive.value = 0;
    }

    inputQuantity.value = quantity;

    updateButton.addEventListener("click", async function (event) {
      event.preventDefault();

      await updateData(url, id);
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

// * Show form to Add Data or Edit Data

showform.addEventListener("click", function (event) {
  event.preventDefault();
  inputForm.classList.toggle("button-toggle");

  if (inputForm.classList.contains("button-toggle")) {
    showform.innerText = "Hide Form";
  } else {
    showform.innerText = "Show Form";
  }
});

fetchData(url);
