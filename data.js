const defaultCafeData = {
  name: "Morning Table Cafe",
  tagline: "Fresh coffee, comfort food, quiet corners.",
  headline: "Your neighbourhood cafe for slow mornings and easy meals.",
  about:
    "Morning Table Cafe serves espresso drinks, brunch plates, cakes, and simple comfort food in a relaxed space made for friends, families, and everyday catch-ups.",
  logo: "",
  heroImage: "assets/cafe-hero.png",
  videoUrl: "",
  gallery: ["assets/cafe-gallery-1.png", "assets/cafe-gallery-2.png", "assets/cafe-gallery-3.png"],
  menuCategories: [
    {
      name: "Coffee & Tea",
      description: "Espresso, latte, matcha, chocolate, and iced drinks.",
      picture: "assets/cafe-gallery-1.png",
      items: [
        { name: "Iced Latte", picture: "assets/cafe-gallery-1.png" },
        { name: "Matcha Milk", picture: "assets/cafe-gallery-2.png" }
      ]
    },
    {
      name: "Brunch",
      description: "Eggs, toast, sandwiches, pasta, and hearty cafe plates.",
      picture: "assets/cafe-gallery-2.png",
      items: [
        { name: "Big Breakfast", picture: "assets/cafe-gallery-2.png" },
        { name: "Chicken Sandwich", picture: "assets/cafe-gallery-3.png" }
      ]
    },
    {
      name: "Cakes & Desserts",
      description: "Fresh cakes, pastries, waffles, and sweet treats.",
      picture: "assets/cafe-gallery-3.png",
      items: [
        { name: "Chocolate Cake", picture: "assets/cafe-gallery-3.png" },
        { name: "Butter Waffle", picture: "assets/cafe-gallery-1.png" }
      ]
    }
  ],
  address: "12, Jalan Example, 50450 Kuala Lumpur, Malaysia",
  hours: "Open daily, 9:00 AM - 10:00 PM",
  phone: "+60123456789",
  whatsapp: "60123456789",
  instagram: "https://www.instagram.com/",
  mapEmbed:
    "https://www.google.com/maps?q=Kuala%20Lumpur%20Malaysia&output=embed"
};

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function normalizeCafeData(data) {
  const merged = { ...cloneData(defaultCafeData), ...(data || {}) };
  merged.menuCategories = (merged.menuCategories || []).map((category) => ({
    name: category.name || "",
    description: category.description || "",
    picture: category.picture || "",
    items: (category.items || []).map((item) => ({
      name: item.name || "",
      picture: item.picture || ""
    }))
  }));
  return merged;
}

function getCafeData() {
  const saved = localStorage.getItem("cafeWebsiteData");
  if (!saved) return cloneData(defaultCafeData);

  try {
    return normalizeCafeData(JSON.parse(saved));
  } catch {
    return cloneData(defaultCafeData);
  }
}

function saveCafeData(data) {
  localStorage.setItem("cafeWebsiteData", JSON.stringify(data));
}
