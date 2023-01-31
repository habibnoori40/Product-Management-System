let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let quantity = document.getElementById("count");
let category = document.getElementById("category");
let tbody = document.getElementById("table-body");
let deleteAll = document.getElementById("deleteall");
let search = document.getElementById("search")
let submit = document.getElementById("submit-btn");

let submitBtn_mood = "create";
let searchMood = "Title"
let productIndex;

// Get The Total Price After The Calculation And 
function getTotal() {
  if (price.value) {
    let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.textContent = result;
    total.classList.add("active");
  } else {
    total.textContent = "";
    total.classList.remove("active");
  }
}

// Create Product
let productData = []

if (localStorage.getItem("product") != null) {
  productData = JSON.parse(localStorage.getItem("product"));
}

submit.addEventListener("click", createData);

onkeydown = function (event) {
  if (event.key === "Enter") createData()
}

function createData() {
  let product;
  if (title.value && price.value) {
    product = {
      title: title.value.toLowerCase(),
      price: price.value,
      taxes: taxes.value || 0,
      ads: ads.value || 0,
      discount: discount.value || 0,
      total: total.textContent,
      quantity: quantity.value,
      category: category.value.toLowerCase() || "none",
    }
  } else {
    return false;
  }

  if (submitBtn_mood === "create") {
    if (product.quantity > 1) {
      for (let i = 0; i < product.quantity; i++) {
        productData.push(product);
      }
    } else {
      productData.push(product);
    }
  } else {
    productData[productIndex] = product;
  }

  submit.innerHTML = "Create";
  quantity.placeholder = "Count";
  quantity.disabled = false;

  localStorage.setItem("product", JSON.stringify(productData))

  clearData();
  ShowData();
  openInputsField()
}

// Clear User Inputs Data
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  quantity.value = "";
  category.value = "";
  total.textContent = "";
  total.classList.remove("active");
}

// Read And Show Data
function ShowData() {
  let table = "";
  for (let i = 0; i < productData.length; i++) {
    table += createElements(i);
  }
  tbody.innerHTML = table;

  if (productData.length > 0) {
    deleteAll.innerHTML = `<button onclick='deleteAllData()'>Delete All (${productData.length})</button>`;
  } else {
    deleteAll.innerHTML = "";
  }
}

function createElements(index) {
  return `
              <tr>
                <td>${index + 1}</td>
                <td>${productData[index].title}</td>
                <td>${productData[index].price}</td>
                <td>${productData[index].taxes}</td>
                <td>${productData[index].ads}</td>
                <td>${productData[index].discount}</td>
                <td>${productData[index].total}</td>
                <td>${productData[index].category}</td>
                <td><button onclick="UpdateProduct(${index})" id="update" class="update">Update</button></td>
                <td><button onclick="deleteProduct(${index})" id="delete" class="delete">Delete</button></td>
              </tr>
`;
}

ShowData();

// Delete Product
function deleteProduct(index) {
  productData.splice(index, 1);
  localStorage.product = JSON.stringify(productData);
  ShowData();
}

// Delete All Products
function deleteAllData() {
  localStorage.clear();
  productData.splice(0);
  ShowData();
}

// Update Product
function UpdateProduct(index) {
  title.value = productData[index].title;
  price.value = productData[index].price;
  taxes.value = productData[index].taxes;
  ads.value = productData[index].ads;
  discount.value = productData[index].discount;
  category.value = productData[index].category;
  quantity.placeholder = "disabled";
  quantity.disabled = true;
  getTotal();
  submit.innerHTML = "Update";
  submitBtn_mood = "update"
  productIndex = index;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Get Search Mood
function getSearch(id) {
  if (id === "searchTitle") {
    searchMood = "Title";
  } else {
    searchMood = "Category";
  }
  search.placeholder = `Search By ${searchMood}`;
  search.focus();
  search.value = ""
  ShowData()
}

// Search Product
function searchProduct(value) {
  let table = "";
  for (let i = 0; i < productData.length; i++) {
    if (searchMood === "Title") {
      if (productData[i].title.startsWith(value.toLowerCase())) {
        table += createElements(i)
      }
    } else if (productData[i].category.startsWith(value.toLowerCase())) {
      table += createElements(i)
    }
  }
  tbody.innerHTML = table
};

// Get Add Product Button For Small Screen Sizes And Add Click Event For It And Call Fn To Open The Inputs
function addProductBtn() {
  let addProductBtn = document.getElementById("add-product")
  addProductBtn.onclick = function () {
    openInputsField()
  }
}
// Get Inputs Container And Attach Toggle Class For It, To Opem And Close Inputs Whenever You Click On Add Product Button
function openInputsField() {
  let inputsContainer = document.getElementsByClassName("inputs")[0]
  inputsContainer.classList.toggle("open")
}

addProductBtn()