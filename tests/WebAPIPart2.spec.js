//Login UI -> collect all session storage/ token, etc. to a .json file
//test browser -> json, cart, order, order details, order history

const { test, expect } = require("@playwright/test");
let webContext;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("geor@att.net");
  await page.locator("#userPassword").fill("Griffygeol2@");
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");
  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("@QA Client App login", async () => {
  const email = "geor@att.net";
  const productName = "ZARA COAT 3";
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  const products = page.locator(".card-body");
  const cardTitles = page.locator(".card-body h5");
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);

  // ZARA COAT 3
  const count = await products.count();

  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //Add Product to cart
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }
  //go to cart
  await page.locator("[routerlink*='cart']").click();
  //make sure the cart is full loaded and all the items have loaded in the cart
  //we use this step because the isVisible() will not automatically wait for everything to load first before checking
  await page.locator("div li").first().waitFor();
  //Check if item is in cart
  const bool = await page.locator(`h3:has-text("${productName}")`).isVisible();
  console.log(bool);
  expect(bool).toBeTruthy();
});

test("test case 2", async () => {
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  const products = page.locator(".card-body");
  const cardTitles = page.locator(".card-body h5");
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});
