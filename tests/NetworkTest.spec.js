const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("./utils/APIUtils");

const loginPayload = {
  userEmail: "geor@att.net",
  userPassword: "Griffygeol2@",
};
const orderPayLoad = {
  orders: [{ country: "Cuba", productOrderedId: "6581cade9fd99c85e8ee7ff5" }],
};

const fakePayloadOrders = { data: [], message: "Nor Orders" };

let response;

test.beforeAll(async () => {
  //Login API
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayLoad);
});

test("Intercept my orders fetch response", async ({ page }) => {
  page.addInitScript((value) => {
    //add to token to local storage
    window.localStorage.setItem("token", value);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client/");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      //intercepting the response - Api response -> {playwright fake response}-> browser->render data on front end
      const response = await page.request.fetch(route.request());
      //to convert js object to JSON before sending
      let body = JSON.stringify(fakePayloadOrders);
      //fulfill means sending response to browser
      //below we are sending the response but changing the body to our fakePayloadOrders
      route.fulfill({
        response,
        body,
      });
    }
  );
  //to send fake body you have to do so before the action/call to api.
  //in this case it is when the user clicks orders button which is why this step is after

  //Find and view order with order Id
  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
  console.log(await page.locator(".mt-4").textContent())
});
