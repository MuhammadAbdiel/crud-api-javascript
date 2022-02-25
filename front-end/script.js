const bodyContent = document.getElementById('body-content');
const inputName = document.getElementById('name');
const inputPrice = document.getElementById('price');
const inputDescription = document.getElementById('description');
const inputActive = document.getElementById('active');
const inputQuantity = document.getElementById('quantity');

let content = '';

const url = 'http://127.0.0.1:8000/api/product';
const url2 = 'https://jsonplaceholder.typicode.com/posts';

// * Read Data

fetch(url)
    .then(response => response.json())
    .then(response => {
        const data = response.data;
        data.forEach(product => content += getData(product));
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
                    <a href="#" class="card-link text-decoration-none" id="edit-button">Edit</a>
                    <a href="#" class="card-link text-decoration-none" id="delete-button">Delete</a>
                </div>
            </div>
        </div>
    `;
}

const submitButton = document.getElementById('submit-button');
bodyContent.addEventListener('click', function (event) {
    event.preventDefault();

    let deleteButton = event.target.id == 'delete-button';
    let editButton = event.target.id == 'edit-button';

    // * Delete Data

    const id = event.target.parentElement.dataset.id;
    if (deleteButton) {
        fetch(`${url}/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => location.reload());
    }

    // * Edit Data

    if (editButton) {
        submitButton.style.display = 'none';
        const updateButton = document.getElementById('update-button');
        updateButton.style.display = 'block';

        const parent = event.target.parentElement;
        const active = parent.parentElement.dataset.active;
        const quantity = parent.parentElement.dataset.quantity;

        let name = parent.querySelector('.name').innerText;
        let price = parent.querySelector('.price').innerText;
        let description = parent.querySelector('.description').innerText;

        inputName.value = name;
        inputPrice.value = price;
        inputDescription.value = description;
        inputActive.value = active;
        inputQuantity.value = quantity;

        updateButton.addEventListener('click', function (event) {
            event.preventDefault();

            fetch(`${url}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: inputName.value,
                        price: inputPrice.value,
                        quantity: inputQuantity.value,
                        active: inputActive.value,
                        description: inputDescription.value,
                    })
                })
                .then(response => response.json())
                .then(() => location.reload());
        });
    }
});

// * Create Data

submitButton.addEventListener('click', function (event) {
    event.preventDefault();

    fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: inputName.value,
                price: inputPrice.value,
                quantity: inputQuantity.value,
                active: inputActive.value,
                description: inputDescription.value,
            })
        })
        .then(response => response.json())
        .then(response => {
            let dataArray = [];
            dataArray.push(response.data);
            dataArray.forEach(product => content += getData(product));
        });

    inputName.value = '';
    inputPrice.value = '';
    inputQuantity.value = '';
    inputActive.value = '';
    inputDescription.value = '';
});