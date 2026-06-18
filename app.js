const data = getCafeData();

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value || "";
}

function imageMarkup(src, alt) {
  if (!src) return "";
  return `<img src="${src}" alt="${alt}" />`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getYoutubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.includes("/embed/")) return url;
    }
  } catch {
    return "";
  }

  return "";
}

function phoneHref(phone) {
  return `tel:${String(phone || "").replace(/\s+/g, "")}`;
}

function whatsappHref(number) {
  const clean = String(number || "").replace(/\D/g, "");
  return clean ? `https://wa.me/${clean}` : "#";
}

function renderLogo() {
  const logo = $("logoImage");
  if (data.logo) {
    logo.src = data.logo;
    logo.style.display = "block";
    return;
  }

  logo.removeAttribute("src");
  logo.style.display = "none";
}

function renderHeroMedia() {
  const heroMedia = $("heroMedia");
  const heroImage = data.heroImage || defaultCafeData.heroImage;
  const youtubeEmbed = getYoutubeEmbedUrl(data.videoUrl);

  if (youtubeEmbed) {
    heroMedia.innerHTML = `
      <iframe
        src="${youtubeEmbed}"
        title="${data.name} video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
    return;
  }

  if (data.videoUrl) {
    heroMedia.innerHTML = `
      <video src="${data.videoUrl}" poster="${heroImage}" autoplay muted loop playsinline></video>
    `;
    return;
  }

  heroMedia.innerHTML = imageMarkup(heroImage, `${data.name} cafe interior`);
}

function renderGallery() {
  const gallery = $("gallery");
  const items = (data.gallery && data.gallery.length ? data.gallery : defaultCafeData.gallery).slice(0, 6);

  gallery.innerHTML = items
    .map((src, index) => `<figure>${imageMarkup(src, `${data.name} gallery ${index + 1}`)}</figure>`)
    .join("");
}

function renderMenu() {
  const menuGrid = $("menuGrid");
  menuGrid.innerHTML = data.menuCategories
    .map(
      (item) => `
        <article class="menu-card category-card">
          <figure class="category-picture">
            ${imageMarkup(item.picture || defaultCafeData.heroImage, `${escapeHtml(item.name)} category`)}
          </figure>
          <div class="category-copy">
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
          <div class="item-grid">
            ${(item.items || [])
              .map(
                (menuItem) => `
                  <div class="item-card">
                    <figure>${imageMarkup(menuItem.picture || item.picture || defaultCafeData.heroImage, `${escapeHtml(menuItem.name)} menu item`)}</figure>
                    <span>${escapeHtml(menuItem.name)}</span>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderContact() {
  $("phoneLink").href = phoneHref(data.phone);
  $("phoneLink").textContent = data.phone ? "Call" : "Phone unavailable";
  $("whatsappLink").href = whatsappHref(data.whatsapp);
  $("instagramLink").href = data.instagram || "#";
  $("mapFrame").src = data.mapEmbed || defaultCafeData.mapEmbed;
}

renderLogo();
renderHeroMedia();
renderGallery();
renderMenu();
renderContact();

document.title = `${data.name} | Cafe Information`;
setText("brandName", data.name);
setText("footerName", data.name);
setText("tagline", data.tagline);
setText("headline", data.headline);
setText("aboutTitle", `Welcome to ${data.name}`);
setText("aboutText", data.about);
setText("address", data.address);
setText("hours", data.hours);
