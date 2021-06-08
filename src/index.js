document.addEventListener('DOMContentLoaded', () => {
// get list of dogs
getDogs();

// append each dog to the table
// make dog editable
updateDogOnFormSubmit();
})

function getDogs() {
  const BASE_URL = "http://localhost:3000/dogs"

  fetch(BASE_URL)
  .then(resp => resp.json())
  .then(function(data) {
    parseAndAppendDogs(data);
    editDogOnButtonClick();
  })
}

function parseAndAppendDogs(json) {
  const table = document.querySelector("table#dog-table");

  for (const dog of json) {
    let tr = document.createElement("tr");
    tr.setAttribute("data-dog-id", dog.id)

    tr.innerHTML = `
    <td>${dog.name}</td>
    <td>${dog.breed}</td>
    <td>${dog.sex}</td>
    <td><button class="edit-dog" data-dog-id='${dog.id}'>Edit</button></td>
    `
    table.appendChild(tr);
  }

}

function editDogOnButtonClick() {
  const editButtons = document.querySelectorAll("button.edit-dog")

  for (const editBtn of editButtons) {
    editBtn.addEventListener("click", populateEditDogForm)
  }
}

function populateEditDogForm(event) {
  event.preventDefault();

  dogId = event.target.dataset.dogId

  fetch(`http://localhost:3000/dogs/${dogId}`)
  .then(resp => resp.json())
  .then(function(data) {
    fillDogForm(data)
  })
}

function fillDogForm(dog) {
  const dogFormInputs = document.querySelector("form#dog-form");
  dogFormInputs.children[0].value = dog.name
  dogFormInputs.children[1].value = dog.breed
  dogFormInputs.children[2].value = dog.sex
  dogFormInputs.setAttribute("data-dog-id", dog.id)

}

function updateDogOnFormSubmit() {
  const dogForm = document.querySelector("form#dog-form");

  dogForm.addEventListener("submit", patchDogRecord) 
}

function patchDogRecord(event) {
  event.preventDefault();
  const dogInfoInputs = event.target.children;

  const options = {
    method: "PATCH",
    body: JSON.stringify({
      "name": dogInfoInputs[0].value,
      "breed": dogInfoInputs[1].value,
      "sex": dogInfoInputs[2].value 
    }),
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  }

  fetch(`http://localhost:3000/dogs/${event.target.dataset.dogId}`, options)
  .then(resp => resp.json())
  .then(function(data) {
    updateDogRecord(data)
    clearDogForm(event.target);
  })
}

function updateDogRecord(dogInfo) {
  const dogId = dogInfo.id
  const tableRecordForDog = document.querySelector(`tr[data-dog-id='${dogId}']`)
  
  tableRecordForDog.children[0].innerText = dogInfo.name
  tableRecordForDog.children[1].innerText = dogInfo.breed
  tableRecordForDog.children[2].innerText = dogInfo.sex
}

function clearDogForm(dogForm) {
  for (const input of dogForm.children) {
    if (input.type === "text") {
      input.value = "";
    }
  }
}