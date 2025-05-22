const { renderDOM } = require("./helpers");

let dom;
let document;

describe("index.html", () => {
  beforeEach(async () => {
    dom = await renderDOM("../learn-link-cli/index.html");
    document = dom.window.document;
  });

  it("should have a navigation bar with logo and login button", () => {
    const nav = document.querySelector("nav");
    const logo = document.querySelector("nav img");
    const loginBtn = document.querySelector("nav button");

    expect(nav).toBeTruthy();
    expect(logo).toBeTruthy();
    expect(logo.getAttribute("src")).toContain("logo-writing.jpeg");
    expect(loginBtn).toBeTruthy();
    expect(loginBtn.textContent.toLowerCase()).toContain("login");
  });

  it("should have three ratings with five-star images and quotes", () => {
    const ratings = document.querySelectorAll(".ratings div");
    expect(ratings.length).toBe(3);

    ratings.forEach((rating) => {
      const img = rating.querySelector("img");
      const text = rating.querySelector("p");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toContain("5star.png");
      expect(text).toBeTruthy();
    });
  });

  it("should have a footer with copyright", () => {
    const footer = document.querySelector("footer");
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain("LearnLink");
    expect(footer.textContent).toContain("2025");
  });

  it("should load external stylesheets and fonts", () => {
    const links = Array.from(document.querySelectorAll("link"));
    const bootstrapLink = links.find((link) => link.href.includes("bootstrap"));
    const fontsLink = links.find((link) =>
      link.href.includes("fonts.googleapis.com")
    );

    expect(bootstrapLink).toBeTruthy();
    expect(fontsLink).toBeTruthy();
  });
});
