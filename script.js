

const defaultBear = {
  name: "Sunny",
  fur: "Caramel",
  outfit: "sweater",
  accessory: "bow",
  personality: "Kind & curious",
  favorite: false
};

let currentBear = { ...defaultBear };
let savedBears = [];

// 2. HELPER FUNCTIONS

const getElement = id => document.getElementById(id);

function getFur() {
  return BEAR_DATA.fur.find(f => f.name === currentBear.fur)
    || BEAR_DATA.fur[0];
}

function getOutfit() {
  return BEAR_DATA.outfits.find(o => o.id === currentBear.outfit)
    || BEAR_DATA.outfits[0];
}

function getAccessory() {
  return BEAR_DATA.accessories.find(a => a.id === currentBear.accessory)
    || BEAR_DATA.accessories[0];
}

function showMessage(message) {
  getElement("statusMessage").textContent = message;
}

// 3. RENDER FUR COLORS

function renderFurOptions() {
  const container = getElement("furOptions");

  container.innerHTML = BEAR_DATA.fur.map(fur => `
    <button
      class="fur-swatch ${currentBear.fur === fur.name ? "active" : ""}"
      style="background:${fur.color}"
      data-fur="${fur.name}"
      title="${fur.name}"
      aria-label="${fur.name} fur"
    ></button>
  `).join("");
}

getElement("furOptions").addEventListener("click", event => {
  const button = event.target.closest("[data-fur]");
  if (!button) return;

  currentBear.fur = button.dataset.fur;
  updateBear();
  showMessage("A new fur color! ♡");
});

// 4. RENDER OUTFITS

function renderOutfits() {
  getElement("outfitOptions").innerHTML =
    BEAR_DATA.outfits.slice(0, 3).map(outfit => `
      <button
        class="option-card ${currentBear.outfit === outfit.id ? "active" : ""}"
        data-outfit="${outfit.id}"
      >
        <span class="option-emoji">${outfit.emoji}</span>
        <span class="option-name">${outfit.name}</span>
      </button>
    `).join("");
}

getElement("outfitOptions").addEventListener("click", event => {
  const button = event.target.closest("[data-outfit]");
  if (!button) return;

  currentBear.outfit = button.dataset.outfit;
  updateBear();
  showMessage("Looking adorable in that outfit! 🎀");
});

// 5. RENDER ACCESSORIES

function renderAccessories() {
  getElement("accessoryOptions").innerHTML =
    BEAR_DATA.accessories.map(accessory => `
      <button
        class="option-card ${currentBear.accessory === accessory.id ? "active" : ""}"
        data-accessory="${accessory.id}"
      >
        <span class="option-emoji">${accessory.emoji || "♡"}</span>
        <span class="option-name">${accessory.name}</span>
      </button>
    `).join("");
}

getElement("accessoryOptions").addEventListener("click", event => {
  const button = event.target.closest("[data-accessory]");
  if (!button) return;

  currentBear.accessory = button.dataset.accessory;
  updateBear();
  showMessage("Accessory updated! ✨");
});

// 6. UPDATE THE LIVE BEAR PREVIEW

function updateBear() {
  const fur = getFur();
  const outfit = getOutfit();
  const accessory = getAccessory();

  const bear = getElement("bear");

  bear.style.setProperty("--fur", fur.color);
  bear.style.setProperty("--muzzle", fur.muzzle);

  const outfitElement = getElement("bearOutfit");

  outfitElement.className = "bear-outfit " + outfit.className;
  outfitElement.textContent = outfit.emoji;

  getElement("bearAccessory").textContent = accessory.emoji;

  getElement("bearAccessory").style.display =
    accessory.emoji ? "block" : "none";

  getElement("bearName").textContent =
    currentBear.name.trim() || "Your Bear";

  getElement("bearPersonality").textContent =
    currentBear.personality + " ♡";

  getElement("nameInput").value = currentBear.name;

  getElement("personalityInput").value =
    currentBear.personality;

  getElement("previewStatus").textContent =
    "Your bear is coming together!";

  renderFurOptions();
  renderOutfits();
  renderAccessories();
}

// 7. NAME AND PERSONALITY

getElement("nameInput").addEventListener("input", event => {
  currentBear.name = event.target.value;

  getElement("bearName").textContent =
    currentBear.name.trim() || "Your Bear";
});

getElement("personalityInput").addEventListener("change", event => {
  currentBear.personality = event.target.value;

  getElement("bearPersonality").textContent =
    currentBear.personality + " ♡";
});

// 8. RANDOM BEAR GENERATOR

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

getElement("randomButton").addEventListener("click", () => {
  const names = [
    "Mochi", "Clover", "Honey", "Biscuit",
    "Peaches", "Pudding", "Cookie", "Sunny"
  ];

  currentBear = {
    name: randomItem(names),
    fur: randomItem(BEAR_DATA.fur).name,
    outfit: randomItem(BEAR_DATA.outfits).id,
    accessory: randomItem(BEAR_DATA.accessories).id,
    personality: randomItem(BEAR_DATA.personalities),
    favorite: false
  };

  updateBear();
  showMessage("Surprise! Meet your new little friend! 🧸");
});

// 9. RESET BEAR

getElement("resetButton").addEventListener("click", () => {
  currentBear = { ...defaultBear };

  updateBear();
  showMessage("Your bear is ready for a fresh start! ♡");
});

// 10. WELCOME BUTTON

getElement("startButton").addEventListener("click", () => {
  getElement("studio").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// 11. SAVE COLLECTION TO BROWSER

function saveCollection() {
  try {
    localStorage.setItem(
      "littleBearCollection",
      JSON.stringify(savedBears)
    );
    return true;
  } catch (error) {
    showMessage("Unable to save. Check your browser storage.");
    return false;
  }
}

function loadCollection() {
  try {
    const stored = localStorage.getItem("littleBearCollection");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        savedBears = parsed.filter(bear =>
          bear &&
          typeof bear.name === "string" &&
          BEAR_DATA.fur.some(f => f.name === bear.fur) &&
          BEAR_DATA.outfits.some(o => o.id === bear.outfit) &&
          BEAR_DATA.accessories.some(a => a.id === bear.accessory) &&
          BEAR_DATA.personalities.includes(bear.personality)
        ).slice(0, 30);
      }
    }
  } catch (error) {
    savedBears = [];
  }
}

// 12. SAVE A BEAR

getElement("saveButton").addEventListener("click", () => {
  if (!currentBear.name.trim()) {
    showMessage("Give your bear a name first! ♡");
    getElement("nameInput").focus();
    return;
  }

  if (savedBears.length >= 30) {
    showMessage("Your collection is full! Delete a bear first.");
    return;
  }

  savedBears.push({ ...currentBear });

  if (saveCollection()) {
    renderCollection();
    showMessage(currentBear.name + " was added to your collection! ♡");
  } else {
    savedBears.pop();
  }
});

// 13. DISPLAY SAVED BEARS

function renderCollection() {
  const container = getElement("collectionGrid");

  if (savedBears.length === 0) {
    container.innerHTML = `
      <div class="empty-collection">
        <span>🧸</span>
        <h3>Your collection is waiting!</h3>
        <p>Create and save your first little friend.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = savedBears.map((bear, index) => {
    const fur = BEAR_DATA.fur.find(f => f.name === bear.fur);
    const accessory = BEAR_DATA.accessories.find(
      a => a.id === bear.accessory
    );

    return `
      <article class="collection-card">
        <div class="collection-art"
          style="background:${fur.muzzle}">
          🧸 ${accessory.emoji}
        </div>

        <h3>${escapeHTML(bear.name)}</h3>
        <p>${escapeHTML(bear.fur)} · ${escapeHTML(bear.personality)}</p>

        <div class="collection-actions">
          <button data-load="${index}">Load</button>
          <button data-favorite="${index}">
            ${bear.favorite ? "♥ Favorite" : "♡ Favorite"}
          </button>
          <button data-delete="${index}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

// Prevent names from being interpreted as HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}



getElement("collectionGrid").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.load !== undefined) {
    currentBear = { ...savedBears[Number(button.dataset.load)] };
    updateBear();

    getElement("studio").scrollIntoView({ behavior: "smooth" });
    showMessage("Your saved bear has returned! ♡");
  }

  if (button.dataset.delete !== undefined) {
    const index = Number(button.dataset.delete);

    savedBears.splice(index, 1);
    saveCollection();
    renderCollection();
    showMessage("Bear removed from your collection.");
  }

  if (button.dataset.favorite !== undefined) {
    const index = Number(button.dataset.favorite);

    savedBears[index].favorite =
      !savedBears[index].favorite;

    saveCollection();
    renderCollection();
  }
});



function renderWardrobe() {
  getElement("wardrobeGrid").innerHTML =
    BEAR_DATA.outfits.map(outfit => `
      <article class="wardrobe-card">
        <div class="wardrobe-art">${outfit.emoji}</div>

        <div class="wardrobe-info">
          <h3>${outfit.name}</h3>
          <p>${outfit.description}</p>
          <button data-wardrobe="${outfit.id}">
            Try this outfit ♡
          </button>
        </div>
      </article>
    `).join("");
}

getElement("wardrobeGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-wardrobe]");
  if (!button) return;

  currentBear.outfit = button.dataset.wardrobe;

  updateBear();

  getElement("studio").scrollIntoView({ behavior: "smooth" });
  showMessage("Your bear tried on a new outfit! 🎀");
});

// 16. ADOPTION CERTIFICATE

getElement("certificateButton").addEventListener("click", () => {
  if (!currentBear.name.trim()) {
    showMessage("Give your bear a name before adoption! ♡");
    getElement("nameInput").focus();
    return;
  }

  const outfit = getOutfit();
  const accessory = getAccessory();

  getElement("certificateArea").innerHTML = `
    <div class="certificate">
      <div style="font-size:35px">🧸 ♡ ✨</div>

      <h3>Official Bear Adoption Certificate</h3>

      <p>This certifies that</p>

      <h2>${escapeHTML(currentBear.name)}</h2>

      <div class="certificate-bear">🧸</div>

      <p>has officially been adopted!</p>

      <p><strong>Fur:</strong> ${escapeHTML(currentBear.fur)}</p>
      <p><strong>Outfit:</strong> ${escapeHTML(outfit.name)}</p>
      <p><strong>Accessory:</strong> ${escapeHTML(accessory.name)}</p>
      <p><strong>Personality:</strong> ${escapeHTML(currentBear.personality)}</p>

      <p style="margin-top:20px">
        Made with love at Little Bear Studio ♡
      </p>
    </div>

    <div class="certificate-actions">
      <button class="primary-button" id="printCertificate">
        🖨️ Print certificate
      </button>
    </div>
  `;

  getElement("printCertificate").addEventListener("click", () => {
    window.print();
  });

  getElement("certificateArea").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});


loadCollection();
updateBear();
renderWardrobe();
renderCollection();

console.log("Little Bear Studio is ready! 🧸");
