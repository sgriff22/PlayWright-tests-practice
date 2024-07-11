const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("./utils/APIUtils");

const loginPayload = {
  userEmail: "geor@att.net",
  userPassword: "Griffygeol2@",
};
const orderPayLoad = {
  orders: [{ country: "Cuba", productOrderedId: "6581cade9fd99c85e8ee7ff5" }],
};

let response;

//To use tokens from local storage instead of having to include all login steps
//Executes before all tests are ran
test.beforeAll(async () => {
  //Login API
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayLoad);
});

//Execute this before each test if more than one test
// test.beforeEach(() => {});

test("Place the order", async ({ page }) => {
  page.addInitScript((value) => {
    //add to token to local storage
    window.localStorage.setItem("token", value);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  //Find and view order with order Id
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  //Confirm that you are brought to order summary view
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});
