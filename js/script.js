var productName = document.getElementById('productName');
var productPrice = document.getElementById('productPrice');
var productCategory = document.getElementById('productCategory');
var productImage = document.getElementById('productImage');
var productDescription = document.getElementById('productDescription');
var inputList = [productName, productPrice, productCategory, productDescription]

var regex = {
    productName: {
        value: /^([a-zA-Z]|\d| ){3,}$/,
        isValid: false
    },
    productPrice: {
        value: /^[1-9]\d*(\.\d+)?$/,
        isValid: false
    },
    productCategory: {
        value: /^(Mobiles|Tablets|Laptops|Computers|Headphones|Earbuds|Cameras)$/i,
        isValid: false
    },
    productDescription: {
        value: /^.{1,}$/,
        isValid: false
    }
}

var uniqueId;
var productList = [];

var searchValue = document.getElementById('searchValue');
var msgTxt = document.getElementById("msgTxt");

var filterBy = document.getElementById("filterBy");
var sortBy = document.getElementById("sortBy");

var mode = document.getElementById("mode");
var modeIcon = document.getElementById("modeIcon");
var currMode = localStorage.getItem("mode");

if (localStorage.getItem("uniqueId") == null) {
    localStorage.setItem("uniqueId", "1");
}
uniqueId = localStorage.getItem("uniqueId");

if (localStorage.getItem("productList") != null) {
    productList = JSON.parse(localStorage.getItem("productList"));
    for (var i = 0; i < productList.length; i++) {
        productList[i].searchName = "";
    }
    displayProducts(productList);
}

if (localStorage.getItem("mode") == null) {
    localStorage.setItem("mode", "light");
    loadMode();
}

function addProduct() {
    var product = {
        id: uniqueId,
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        image: productImage.files[0]?.name,
        description: productDescription.value
    };
    if (!checkExist(product)) {
        msgTxt.innerHTML = `Product already exist! <i class="fa-regular fa-circle-xmark text-danger"></i>`;
        return;
    }
    productList.push(product);
    updateLocalStorageProductList();
    updateLocalStorageUniqueId();
    updateMsgTxt(`Product Added Successfully! <i class="fa-regular fa-circle-check text-success"></i>`);
    updateFormInputValues();
    btnStatus();
    removeValidationMark();
    clearSearchValue();
    displayProducts(productList);
}

function deleteProduct(id) {
    var i = 0;
    for (i; i < productList.length; i++) {
        if (productList[i].id == id) {
            productList.splice(i, 1);
            break;
        }
    }
    updateLocalStorageProductList();
    updateMsgTxt(`Product deleted Successfully! <i class="fa-regular fa-circle-check text-success"></i>`)
    clearSearchValue();
    displayProducts(productList);
}

function updateProduct(index) {
    productList[index].name = productName.value;
    productList[index].price = productPrice.value;
    productList[index].category = productCategory.value;
    productList[index].description = productDescription.value;
    updateLocalStorageProductList();
    updateFormInputValues();
    document.getElementById("mainBtn").classList.replace("btn-warning", "btn-secondary");
    document.getElementById("mainBtn").onclick = function () {
        addProduct();
    };
    document.getElementById("mainBtn").innerText = "Add";
    clearSearchValue();
    displayProducts(productList);
    btnStatus();
    document.getElementById("productImage").classList.remove("d-none");

    removeValidationMark();
    msgTxt.innerHTML = `Product updated Successfully! <i class="fa-regular fa-circle-check text-success"></i>`;
}

function getDataToUpdate(id) {
    var index = 0;
    for (index; index < productList.length; index++) {
        if (productList[index].id == id) {
            break;
        }
    }
    updateFormInputValues(productList[index]);
    document.getElementById("mainBtn").classList.replace("btn-secondary", "btn-warning");
    document.getElementById("mainBtn").onclick = function () {
        updateProduct(index);
    };
    document.getElementById("mainBtn").innerText = "Update";
    document.getElementById("productImage").classList.add("d-none");
    btnStatus();
}

function displayProducts(list) {
    var products = ``;
    if (list.length == 0) {
        products += `
            <p class="font-dark">No products</p>
        `
    }
    for (var i = 0; i < list.length; i++) {
        products += `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="item light-white font-white h-100 d-flex flex-column justify-content-between  position-relative">
                <div class="image" style="background-image: url('../images/${list[i].image}')">
                </div>
                <div class="p-3 d-flex flex-column">
                    <h5 class="fs-6 fw-bold">${list[i].name}</h5>
                    <h5 class="fs-6">${list[i].price}$</h5>
                    <h6>${list[i].category}</h6>
                    <h6>${list[i].description}</h6>
                    <div class="mt-4 d-flex justify-content-between align-items-center">
                        <button class="btn btn-warning fs-12 rounded-0 text-white" onclick="getDataToUpdate(${list[i].id})">Update</button>
                       <button class="btn btn-danger fs-12 rounded-0 position-absolute top-0 end-0"
                        onclick="deleteProduct(${list[i].id})"
                        data-bs-toggle="modal" 
                        data-bs-target="#msg">
                            <i class="fa-solid fa-trash text-white"></i>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    `
    }
    document.getElementById('myProducts').innerHTML = products;
    changeColors()
}

function updateLocalStorageProductList() {
    localStorage.setItem("productList", JSON.stringify(productList));
}

function updateLocalStorageUniqueId() {
    localStorage.setItem("uniqueId", (++uniqueId));
}

function updateMsgTxt(msg) {
    msgTxt.innerHTML = msg;
}

function updateFormInputValues(obj) {
    productName.value = obj ? obj.name : null;
    productPrice.value = obj ? obj.price : null;
    productCategory.value = obj ? obj.category : null;
    productDescription.value = obj ? obj.description : null;
    document.getElementById("productImage").value = '';

    productName.dispatchEvent(new Event('input'));
    productPrice.dispatchEvent(new Event('input'));
    productCategory.dispatchEvent(new Event('input'));
    productDescription.dispatchEvent(new Event('input'));
    btnStatus();
}

for (var i = 0; i < inputList.length; i++) {
    inputList[i].addEventListener("input", function (eventInfo) {
        var currInput = eventInfo.target;
        var currInputId = eventInfo.target.id;
        var currInputValue = eventInfo.target.value;
        if (regex[currInputId].value.test(currInputValue)) {
            currInput.classList.add("is-valid");
            currInput.classList.remove("is-invalid");
            currInput.nextElementSibling.classList.replace("d-block", "d-none");
            regex[currInputId].isValid = true;
        }
        else {
            currInput.classList.add("is-invalid");
            currInput.classList.remove("is-valid");
            currInput.nextElementSibling.classList.replace("d-none", "d-block");
            regex[currInputId].isValid = false;
        }
        btnStatus();
    })
}

function btnStatus() {
    var mainBtn = document.getElementById("mainBtn");
    if (productName.value != null && productPrice.value != null && productCategory.value != null
        && productDescription.value != null) {
        if (regex.productName.isValid && regex.productPrice.isValid && regex.productCategory.isValid
            && regex.productDescription.isValid) {
            mainBtn.disabled = false;
        }
        else {
            mainBtn.disabled = true;
        }
    }
    else {
        mainBtn.disabled = true;
    }
}

function removeValidationMark() {
    for (var i = 0; i < inputList.length; i++) {
        inputList[i].classList.remove("is-invalid");
        inputList[i].classList.remove("is-valid");
        inputList[i].nextElementSibling.classList.replace("d-block", "d-none");
    }
}

function checkExist(product) {
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].name == product.name && productList[i].price == product.price
            && productList[i].category == product.category && productList[i].description == product.description
        ) {
            return false;
        }
    }
    return true;
}

function filterByFrom(category, sortedList) {
    var list = sortedList.filter(item => item.category.toLowerCase() === category);
    return list;
}

function applyFilters() {
    var sortedList = productList;
    switch (sortBy.value) {
        case "ascending":
            sortedList.sort((a, b) => a.price - b.price);
            break;
        case "descending":
            sortedList.sort((a, b) => b.price - a.price);
            break;
    }
    var filteredList = (filterBy.value == "filter by") ? sortedList : filterByFrom(filterBy.value.toLowerCase(), sortedList);
    var searchRes = [];
    for (var i = 0; i < filteredList.length; i++) {
        if (((filteredList[i].name).toLowerCase()).includes(searchValue.value.toLowerCase())) {
            searchRes.push(filteredList[i]);
        }
    }
    displayProducts(searchRes);
}

applyFilters();
sortBy.addEventListener("input", applyFilters);
filterBy.addEventListener("input", applyFilters);
searchValue.addEventListener("input", applyFilters)

function clearSearchValue() {
    document.getElementById('searchValue').value = null;
}

mode.addEventListener("click", function () {
    switchIcon();
    loadMode();
    changeColors();
})

function loadMode() {
    if (localStorage.getItem("mode") == "light") {
        modeIcon.src = "images/icons/night-mode.png";
        mode.style = "background-color: gray";
    }
    else {
        modeIcon.src = "images/icons/light.png";
        mode.style = "background-color: white";
    }
    changeColors();
}

function switchIcon() {
    if (localStorage.getItem("mode") == "light") {
        localStorage.setItem("mode", "dark");
    }
    else {
        localStorage.setItem("mode", "light");
    }
}

function changeColors() {
    if (localStorage.getItem("mode") == "light") {
        updateClasses("night-gray-1", "light-gray-1");
        updateClasses("night-gray-2", "light-gray-2");
        updateClasses("night-dark", "light-white");
        updateClasses("font-white", "font-dark");
    }
    else {
        updateClasses("light-gray-1", "night-gray-1");
        updateClasses("light-gray-2", "night-gray-2");
        updateClasses("light-white", "night-dark");
        updateClasses("font-dark", "font-white");
    }
}

function updateClasses(oldClass, newClass) {
    var list = [];
    list = document.querySelectorAll(`.${oldClass}`);
    for (var i = 0; i < list.length; i++) {
        list[i].classList.replace(oldClass, newClass);
    }
}

loadMode();