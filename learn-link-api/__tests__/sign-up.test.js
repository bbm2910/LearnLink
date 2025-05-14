const { renderDOM } = require("./helpers");

let dom;
let document;

describe("sign-up.html", () => {
  beforeEach(async () => {
    dom = await renderDOM("../learn-link-cli/sign-up.html");
    document = dom.window.document;
  });

  it("should render the heading", () => {
    const heading = document.querySelector("h1");
    expect(heading).toBeTruthy();
    expect(heading.textContent.toLowerCase()).toContain("signup");
  });

  it("should have a sign-in form", () => {
    const form = document.querySelector("form#signupForm");
    expect(form).toBeTruthy();
  });

  it("should have email and password fields", () => {
    const email = document.querySelector('input[type="email"]');
    const password = document.querySelector('input[type="password"]');
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it("should have a signUp button", () => {
    const button = document.querySelector('button[type="submit"]');
    expect(button).toBeTruthy();
    expect(button.textContent.toLowerCase()).toContain("sign up");
  });
});
