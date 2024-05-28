const element = document.getElementById("time");
setInterval(() => {
  element.innerText = new Date().toLocaleTimeString();
}, 1000);
var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableContent");
var closeBtn = document.getElementById("closeBtn");
var boxModal = document.querySelector(".box-info");
var bookmarks = [];
var editIndex = null;

if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  updateTable();
}

// Display Function and adding click event to visit, edit, and delete buttons
function displayBookmark(indexOfWebsite) {
  var userURL = bookmarks[indexOfWebsite].siteURL;
  var httpsRegex = /^https?:\/\//g;
  var validURL, fixedURL;
  if (httpsRegex.test(userURL)) {
    validURL = userURL;
    fixedURL = validURL
      .split("")
      .splice(validURL.match(httpsRegex)[0].length)
      .join("");
  } else {
    fixedURL = userURL;
    validURL = `https://${userURL}`;
  }
  var newBookmark = `
        <tr class="bg-transparent" data-index="${indexOfWebsite}">
            <td class="bg-transparent text-white">${indexOfWebsite + 1}</td>
            <td class="bg-transparent text-white">${
              bookmarks[indexOfWebsite].siteName
            }</td>
            <td  class="bg-transparent ">
                <button class="btn btn-visit text-white " data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                </button>
            </td>
            <td class="bg-transparent ">
                <button class="btn btn-edit text-white" data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-pen pe-2"></i>Edit
                </button>
            </td>
            <td class="bg-transparent ">
                <button class="btn btn-delete pe-2 text-white" data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-trash-can pe-2"></i>Delete
                </button>
            </td>
        </tr>
    `;
  tableContent.innerHTML += newBookmark;
}

// Add Event Listeners to buttons
function addEventListeners() {
  var deleteBtns = document.querySelectorAll(".btn-delete");
  var visitBtns = document.querySelectorAll(".btn-visit");
  var editBtns = document.querySelectorAll(".btn-edit");

  deleteBtns.forEach(function (btn) {
    btn.removeEventListener("click", deleteBookmark);
    btn.addEventListener("click", deleteBookmark);
  });

  visitBtns.forEach(function (btn) {
    btn.removeEventListener("click", visitWebsite);
    btn.addEventListener("click", visitWebsite);
  });

  editBtns.forEach(function (btn) {
    btn.removeEventListener("click", editBookmark);
    btn.addEventListener("click", editBookmark);
  });
}

// Clear Input Function
function clearInput() {
  siteName.value = "";
  siteURL.value = "";
}

// Capitalize Function to capitalize the first letter of the site name
function capitalize(str) {
  let strArr = str.split("");
  strArr[0] = strArr[0].toUpperCase();
  return strArr.join("");
}

// Submit Function
submitBtn.addEventListener("click", function () {
  var isNameValid = siteName.classList.contains("is-valid");
  var isURLValid = siteURL.classList.contains("is-valid");

  if (isNameValid || isURLValid) {
    if (editIndex === null) {
      // Add new bookmark
      var bookmark = {
        siteName: isNameValid ? capitalize(siteName.value) : "",
        siteURL: isURLValid ? siteURL.value : "",
      };
      bookmarks.push(bookmark);
      displayBookmark(bookmarks.length - 1);
    } else {
      // Update existing bookmark
      if (isNameValid) {
        bookmarks[editIndex].siteName = capitalize(siteName.value);
      }
      if (isURLValid) {
        bookmarks[editIndex].siteURL = siteURL.value;
      }
      updateTable();
      editIndex = null;
      submitBtn.textContent = "Add Bookmark";
    }
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    clearInput();
    siteName.classList.remove("is-valid");
    siteURL.classList.remove("is-valid");
    addEventListeners();
  } else {
    boxModal.classList.remove("d-none");
  }
});

// Update Table Function to refresh the displayed table content
function updateTable() {
  tableContent.innerHTML = "";
  for (var k = 0; k < bookmarks.length; k++) {
    displayBookmark(k);
  }
  addEventListeners();
}

// Delete Function
function deleteBookmark(e) {
  var deletedIndex = e.target.closest("button").dataset.index;
  bookmarks.splice(deletedIndex, 1);
  updateTable();
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}

// Visit Function
function visitWebsite(e) {
  var websiteIndex = e.target.closest("button").dataset.index;
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(bookmarks[websiteIndex].siteURL)) {
    window.open(bookmarks[websiteIndex].siteURL, "_blank");
  } else {
    window.open(`https://${bookmarks[websiteIndex].siteURL}`, "_blank");
  }
}

// Edit Function
function editBookmark(e) {
  editIndex = e.target.closest("button").dataset.index;
  siteName.value = bookmarks[editIndex].siteName;
  siteURL.value = bookmarks[editIndex].siteURL;
  submitBtn.textContent = "Update Bookmark";
}

// Input Validation
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(www\.)?\w+\.\w{2,}(:\d{2,5})?(\/\w+)*$/;

siteName.addEventListener("input", function () {
  validate(siteName, nameRegex);
});

siteURL.addEventListener("input", function () {
  validate(siteURL, urlRegex);
});

function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

// Close Modal Function
function closeModal() {
  boxModal.classList.add("d-none");
}

closeBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    closeModal();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-info")) {
    closeModal();
  }
});

addEventListeners();
