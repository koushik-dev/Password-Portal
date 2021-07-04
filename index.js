document.addEventListener("DOMContentLoaded", function (event) {
  const body = document.querySelector(".container__table__body");
  let data;
  chrome.storage.sync.get(["creds"], ({ creds }) => {
    createRows(body, creds);
    data = creds;
  });

  // Form Toggle EventBinding
  const container = document.querySelector(".container");
  const addOk = document.querySelector(".container__add__done");
  const addCancel = document.querySelector(".container__add__cancel");
  const add = document.querySelector(".container__add__add");
  const addContainer = document.querySelector("#add");
  const initAddContainer = document.querySelector("#addinit");
  const clearAll = document.querySelector(".container__add__clearall");
  const colorPicker = document.querySelector("#color");
  addCancel.addEventListener("click", () => {
    addContainer.style.display = "none";
    initAddContainer.style.display = "block";
  });
  add.addEventListener("click", () => {
    initAddContainer.style.display = "none";
    addContainer.style.display = "grid";
  });
  clearAll.addEventListener("click", () => {
    setStorage([]);
  });
  colorPicker.addEventListener("change", ({ target: { value } }) => {
    container.style.backgroundColor = value;
  });

  //Submit
  const addForm = document.querySelector(".container__add__form");
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let newCreds = { secret: generatePassword() };
    [...e.target.elements].map((el) => {
      if (el.type === "text") newCreds[el.id] = el.value;
    });
    setStorage([...data, newCreds]);
  });

  //Set Storage
  function setStorage(creds) {
    chrome.runtime.sendMessage({ type: "add", creds }, (resp) => {
      data = resp;
      body.innerHTML = "";
      createRows(body, resp);
      addCancel.click();
    });
  }

  // Create Rows
  function createRows(body, data) {
    data.map((r, index) => {
      const tr = createEl("tr"),
        keys = ["url", "username", "secret"];
      Array(3)
        .fill(0)
        .map((_, i) => {
          const td = createEl("td");
          td.textContent = r[keys[i]];
          td.addEventListener("click", selectAll);
          tr.append(td);
        });
      const td = createEl("td");
      td.dataset.type = "action";

      const editBtn = createEl("button");
      editBtn.className = "container__table__action__edit";
      editBtn.innerHTML = `<span class="material-icons"> edit_calendar </span>`;
      editBtn.addEventListener("click", console.log);

      const deleteBtn = createEl("button");
      deleteBtn.className = "container__table__action__delete";
      deleteBtn.innerHTML = `<span class="material-icons"> delete </span>`;
      deleteBtn.addEventListener("click", () =>
        setStorage(
          data.filter((d) => d.url !== r.url && d.username !== r.username)
        )
      );

      td.append(editBtn);
      td.append(deleteBtn);
      tr.append(td);
      body.append(tr);
    });
  }
});

// Cell Text Selection
function selectAll(e) {
  window.getSelection().selectAllChildren(e.target);
}

function createEl(el) {
  return document.createElement(el);
}

function generatePassword(length = 15) {
  let str = "";

  const alphs = [...Array(26)].map((x, i) => String.fromCharCode(i + 97));
  const caps = [...Array(26)].map((x, i) =>
    String.fromCharCode(i + 97).toLocaleUpperCase()
  );
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const symbols = [
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "-",
    "=",
    "+",
    ";",
    ":",
    ",",
    ".",
    "<",
    ">",
    "?",
    "/",
    "|",
    "/",
    "{",
    "}",
    "[",
    "]",
    "`",
  ];

  for (var i = 0; i < length; i++) {
    const items = [caps, alphs, numbers, symbols];
    const item = items[i % items.length];
    const index = item.length;
    str += item[Math.floor(Math.random() * index)];
  }

  return str;
}
