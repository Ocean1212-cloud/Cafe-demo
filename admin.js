let cafeData = getCafeData();
const $ = (id) => document.getElementById(id);

function fillForm() {
  $("nameInput").value = cafeData.name || "";
  $("taglineInput").value = cafeData.tagline || "";
  $("headlineInput").value = cafeData.headline || "";
  $("aboutInput").value = cafeData.about || "";
  $("videoInput").value = cafeData.videoUrl || "";
  $("addressInput").value = cafeData.address || "";
  $("hoursInput").value = cafeData.hours || "";
  $("phoneInput").value = cafeData.phone || "";
  $("whatsappInput").value = cafeData.whatsapp || "";
  $("instagramInput").value = cafeData.instagram || "";
  $("mapInput").value = cafeData.mapEmbed || "";
  renderLogoPreview();
  renderMenuEditor();
}

function createInput(value, label, className) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value || "";
  input.setAttribute("aria-label", label);
  if (className) input.className = className;
  return input;
}

function createImagePreview(src, label) {
  const preview = document.createElement("div");
  preview.className = "image-preview";

  if (src) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = label;
    preview.appendChild(image);
  } else {
    preview.textContent = "No picture";
  }

  return preview;
}

function renderLogoPreview() {
  const logo = $("adminLogoPreview");
  if (cafeData.logo) {
    logo.src = cafeData.logo;
    logo.style.display = "block";
    return;
  }

  logo.removeAttribute("src");
  logo.style.display = "none";
}

function renderMenuEditor() {
  const editor = $("menuEditor");
  editor.innerHTML = "";

  cafeData.menuCategories.forEach((category, categoryIndex) => {
    const panel = document.createElement("div");
    panel.className = "category-editor";
    panel.dataset.categoryIndex = String(categoryIndex);

    const header = document.createElement("div");
    header.className = "category-editor-header";

    const title = document.createElement("h3");
    title.textContent = `Category ${categoryIndex + 1}`;

    const removeButton = document.createElement("button");
    removeButton.className = "icon-button";
    removeButton.type = "button";
    removeButton.textContent = "x";
    removeButton.setAttribute("aria-label", "Remove category");
    removeButton.dataset.removeCategory = String(categoryIndex);

    header.append(title, removeButton);

    const grid = document.createElement("div");
    grid.className = "form-grid";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Category Name";
    nameLabel.appendChild(createInput(category.name, "Category name", "category-name-input"));

    const pictureLabel = document.createElement("label");
    pictureLabel.textContent = "Category Picture";
    const pictureInput = document.createElement("input");
    pictureInput.type = "file";
    pictureInput.accept = "image/*";
    pictureInput.className = "category-picture-input";
    pictureLabel.appendChild(pictureInput);
    pictureLabel.appendChild(createImagePreview(category.picture, "Category picture preview"));

    const descriptionLabel = document.createElement("label");
    descriptionLabel.className = "full";
    descriptionLabel.textContent = "Description";
    const descriptionInput = document.createElement("textarea");
    descriptionInput.rows = 3;
    descriptionInput.className = "category-description-input";
    descriptionInput.value = category.description || "";
    descriptionLabel.appendChild(descriptionInput);

    grid.append(nameLabel, pictureLabel, descriptionLabel);

    const itemTitle = document.createElement("h4");
    itemTitle.textContent = "Items";

    const items = document.createElement("div");
    items.className = "item-editor-list";

    (category.items || []).forEach((item, itemIndex) => {
      items.appendChild(createItemEditor(item, categoryIndex, itemIndex));
    });

    const addItemButton = document.createElement("button");
    addItemButton.className = "button ghost dark small";
    addItemButton.type = "button";
    addItemButton.textContent = "Add Item";
    addItemButton.dataset.addItem = String(categoryIndex);

    panel.append(header, grid, itemTitle, items, addItemButton);
    editor.appendChild(panel);
  });
}

function createItemEditor(item, categoryIndex, itemIndex) {
  const row = document.createElement("div");
  row.className = "item-editor-row";
  row.dataset.categoryIndex = String(categoryIndex);
  row.dataset.itemIndex = String(itemIndex);

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Item Name";
  nameLabel.appendChild(createInput(item.name, "Item name", "item-name-input"));

  const pictureLabel = document.createElement("label");
  pictureLabel.textContent = "Item Picture";
  const pictureInput = document.createElement("input");
  pictureInput.type = "file";
  pictureInput.accept = "image/*";
  pictureInput.className = "item-picture-input";
  pictureLabel.appendChild(pictureInput);
  pictureLabel.appendChild(createImagePreview(item.picture, "Item picture preview"));

  const removeButton = document.createElement("button");
  removeButton.className = "icon-button";
  removeButton.type = "button";
  removeButton.textContent = "x";
  removeButton.setAttribute("aria-label", "Remove item");
  removeButton.dataset.removeItem = `${categoryIndex}:${itemIndex}`;

  row.append(nameLabel, pictureLabel, removeButton);
  return row;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (!file.type.startsWith("image/")) {
        resolve(reader.result);
        return;
      }

      const image = new Image();
      image.onload = () => {
        const maxSize = 1200;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => resolve(reader.result);
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleSingleImage(inputId, key) {
  const input = $(inputId);
  if (!input.files.length) return;
  cafeData[key] = await fileToDataUrl(input.files[0]);
}

async function handleGalleryImages() {
  const input = $("galleryInput");
  if (!input.files.length) return;
  cafeData.gallery = await Promise.all(Array.from(input.files).map(fileToDataUrl));
}

async function collectMenuCategories() {
  const categories = [];

  for (const panel of document.querySelectorAll(".category-editor")) {
    const existingCategory = cafeData.menuCategories[Number(panel.dataset.categoryIndex)] || {};
    const pictureInput = panel.querySelector(".category-picture-input");
    let picture = existingCategory.picture || "";

    if (pictureInput.files.length) {
      picture = await fileToDataUrl(pictureInput.files[0]);
    }

    const items = [];
    for (const row of panel.querySelectorAll(".item-editor-row")) {
      const existingItem =
        cafeData.menuCategories[Number(row.dataset.categoryIndex)]?.items?.[Number(row.dataset.itemIndex)] || {};
      const itemPictureInput = row.querySelector(".item-picture-input");
      let itemPicture = existingItem.picture || "";

      if (itemPictureInput.files.length) {
        itemPicture = await fileToDataUrl(itemPictureInput.files[0]);
      }

      const itemName = row.querySelector(".item-name-input").value.trim();
      if (itemName) {
        items.push({
          name: itemName,
          picture: itemPicture
        });
      }
    }

    const name = panel.querySelector(".category-name-input").value.trim();
    if (name) {
      categories.push({
        name,
        description: panel.querySelector(".category-description-input").value.trim(),
        picture,
        items
      });
    }
  }

  return categories;
}

function syncMenuTextOnly() {
  document.querySelectorAll(".category-editor").forEach((panel) => {
    const categoryIndex = Number(panel.dataset.categoryIndex);
    const category = cafeData.menuCategories[categoryIndex];
    if (!category) return;

    category.name = panel.querySelector(".category-name-input").value.trim();
    category.description = panel.querySelector(".category-description-input").value.trim();
    category.items = Array.from(panel.querySelectorAll(".item-editor-row")).map((row) => {
      const itemIndex = Number(row.dataset.itemIndex);
      const existingItem = cafeData.menuCategories[categoryIndex]?.items?.[itemIndex] || {};
      return {
        name: row.querySelector(".item-name-input").value.trim(),
        picture: existingItem.picture || ""
      };
    });
  });
}

$("adminForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  cafeData = {
    ...cafeData,
    name: $("nameInput").value.trim(),
    tagline: $("taglineInput").value.trim(),
    headline: $("headlineInput").value.trim(),
    about: $("aboutInput").value.trim(),
    videoUrl: $("videoInput").value.trim(),
    menuCategories: await collectMenuCategories(),
    address: $("addressInput").value.trim(),
    hours: $("hoursInput").value.trim(),
    phone: $("phoneInput").value.trim(),
    whatsapp: $("whatsappInput").value.trim(),
    instagram: $("instagramInput").value.trim(),
    mapEmbed: $("mapInput").value.trim()
  };

  await handleSingleImage("logoInput", "logo");
  await handleSingleImage("heroImageInput", "heroImage");
  await handleGalleryImages();

  saveCafeData(cafeData);
  alert("Saved. Open the website page to see your updates.");
});

$("addMenuButton").addEventListener("click", () => {
  syncMenuTextOnly();
  cafeData.menuCategories.push({
    name: "New Category",
    description: "Short description",
    picture: "",
    items: [{ name: "New Item", picture: "" }]
  });
  renderMenuEditor();
});

$("menuEditor").addEventListener("click", (event) => {
  const removeCategory = event.target.dataset.removeCategory;
  const addItem = event.target.dataset.addItem;
  const removeItem = event.target.dataset.removeItem;

  if (removeCategory !== undefined) {
    syncMenuTextOnly();
    cafeData.menuCategories.splice(Number(removeCategory), 1);
    renderMenuEditor();
    return;
  }

  if (addItem !== undefined) {
    syncMenuTextOnly();
    cafeData.menuCategories[Number(addItem)].items.push({ name: "New Item", picture: "" });
    renderMenuEditor();
    return;
  }

  if (removeItem !== undefined) {
    syncMenuTextOnly();
    const [categoryIndex, itemIndex] = removeItem.split(":").map(Number);
    cafeData.menuCategories[categoryIndex].items.splice(itemIndex, 1);
    renderMenuEditor();
  }
});

$("resetButton").addEventListener("click", () => {
  localStorage.removeItem("cafeWebsiteData");
  cafeData = getCafeData();
  fillForm();
});

$("exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(cafeData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cafe-website-content.json";
  link.click();
  URL.revokeObjectURL(url);
});

$("importInput").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const text = await file.text();
  cafeData = normalizeCafeData(JSON.parse(text));
  saveCafeData(cafeData);
  fillForm();
});

fillForm();
