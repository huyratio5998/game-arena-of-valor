const heroSelect = document.getElementById("heroSelect");
const result = document.getElementById("result");
const showCountersBtn = document.getElementById("showCounters");
const searchHeroInput = document.getElementById("searchHero");

// Populate dropdown with heroes (filtered or all)
function populateDropdown(filteredHeroes = heroes) {
  heroSelect.innerHTML = "";
  filteredHeroes.forEach((h) => {
    const opt = document.createElement("option");
    opt.value = heroes.indexOf(h);
    opt.textContent = h.name;
    heroSelect.appendChild(opt);
  });
}

// Initial dropdown population
populateDropdown();

// Filter dropdown as user types
searchHeroInput.addEventListener("input", function () {
  const query = removeDiacritics(this.value);
  const filtered = heroes.filter((h) =>
    removeDiacritics(h.name).includes(query)
  );
  populateDropdown(filtered);

  if (this.value.length > 2) {
    handleShowResult(filtered[0]);
  } else {
    result.innerHTML = "";
    result.style.display = "none";
  }
});

searchHeroInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const query = removeDiacritics(this.value);
    const filtered = heroes.filter((h) =>
      removeDiacritics(h.name).includes(query)
    );
    populateDropdown(filtered);
    if (filtered.length > 0) {
      heroSelect.value = heroes.indexOf(filtered[0]);
    }
    showCountersBtn.click();
  }
});

// Handle show result
function handleShowResult(hero) {
  if (!hero) {
    result.innerHTML = `<div class="text-center text-danger fw-bold py-4">No result</div>`;
    result.style.display = "block";
    return;
  }
  const allCounters = [...hero.counters]
    .filter((c) => c && typeof c.score === "number")
    .sort((a, b) => b.score - a.score);

  result.innerHTML = `
    <div class="row g-4">
      <div class="col-md-4 text-center">
        <h3 class="text-danger fw-bold">${capitalizeWords(hero.name)}</h3>
        <p class="text-secondary">${hero.role}</p>
        <img src="${hero.img}" alt="${
    hero.name
  }" class="img-fluid rounded shadow main-hero-img">
      </div>
      <div class="col-md-8">
        <h3 class="text-danger fw-bold">Counters</h3>
        <div class="counter-grid">
          ${allCounters
            .map((c) => {
              if (!c || !c.name) return "";
              const counterHero = heroes.find(
                (h) => removeDiacritics(h.name) === removeDiacritics(c.name)
              );
              const roleClass = counterHero.role
                ? `role-${counterHero.role.toLowerCase()}-bg`
                : "";
              const imgTag = counterHero
                ? `<img src="${counterHero.img}" alt="${c.name}" class="counter-hero-img">`
                : "";
              const roleNameClass = counterHero.role
                ? `role-${counterHero.role.toLowerCase()}-name`
                : "";
              return `<div class="counter-grid-item d-flex align-items-center ${roleClass}" data-hero="${
                counterHero.name
              }">
                ${imgTag}
                <div class="ms-2">
                  <span class="fw-bold ${roleNameClass}">${capitalizeWords(
                c.name
              )}</span>
                  <div class="counter-role role-${(
                    counterHero.role || ""
                  ).toLowerCase()}">${counterHero.role}</div>
                </div>
                <span class="badge bg-danger ms-auto">${c.score}</span>
              </div>`;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;

  // Add click event to each counter-grid-item
  document.querySelectorAll(".counter-grid-item").forEach((item) => {
    item.addEventListener("click", function () {
      const heroName = this.getAttribute("data-hero");
      searchHeroInput.value = heroName;
      const filtered = heroes.filter(
        (h) => removeDiacritics(h.name) === removeDiacritics(heroName)
      );
      populateDropdown(filtered);
      if (filtered.length > 0) {
        heroSelect.value = heroes.indexOf(filtered[0]);
        handleShowResult(filtered[0]);
      }
    });
  });

  result.style.display = "block";
}

// Show counters for selected hero
showCountersBtn.addEventListener("click", () => {
  const selectedIndex = heroSelect.value;
  if (selectedIndex === "" || !heroes[selectedIndex]) {
    result.innerHTML = "Please choose a hero.";
    result.style.display = "block";
    return;
  }
  handleShowResult(heroes[selectedIndex]);
});

// Helper
function removeDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
