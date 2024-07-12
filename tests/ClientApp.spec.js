const { test, expect } = require("@playwright/test");

test(
  "Login playwright test",
  async ({ page }) => {
    const email = "geor@att.net";
    const productName = "ZARA COAT 3";
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    console.log(await page.title());
    const cardTitles = page.locator(".card-body h5");
    //login
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Griffygeol2@");
    await page.locator("#login").click();

    //instead of using first().textContent() you can use the following so that allTextContents has all items
    //This waits for the network/fetch calls are complete and the state has been received then it will do the allTextContents()
    //   await page.waitForLoadState("networkidle");

    //an alternate way instead of networkidle
    await cardTitles.first().waitFor();

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
    const bool = await page
      .locator(`h3:has-text("${productName}")`)
      .isVisible();
    console.log(bool);
    expect(bool).toBeTruthy();

    //Click Checkout button
    await page.locator("text=Checkout").click();

    // //ADD PAYMENT INFORMATION
    // // ---Expiry Date---
    // const monthSelect = page.locator("select").first();
    // await monthSelect.selectOption({ value: "03" });
    // const daySelect = page.locator("select").last();
    // await daySelect.selectOption({ value: "29" });

    // // ---CVV Code---
    // const cvvInput = page.locator(".field.small").nth(1).locator("input");
    // await cvvInput.fill("717");

    // // ---Name on Card---
    // const nameInput = page.locator(".field").nth(3).locator("input");
    // await nameInput.fill("George E Griffy");

    // // ---Apply Coupon---
    // const couponInput = page.locator("input[name='coupon']");
    // await couponInput.fill("rahulshettyacademy");
    // await page.locator("button:has-text('Apply Coupon')").click();

    //SHIPPING INFORMATION
    // ---Check that email is correct---
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(
      email
    );

    // ---Select Country---
    await page
      .locator('[placeholder="Select Country"]')
      .pressSequentially("united", { delay: 100 });
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();

    const optionCount = await dropdown.locator("button").count();

    for (let i = 0; i < optionCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " United States") {
        await dropdown.locator("button").nth(i).click();
        break;
      }
    }

    //PLACE ORDER
    await page.locator(".action__submit").click();

    //Confirm it was successful
    await expect(page.locator(".hero-primary")).toHaveText(
      " Thankyou for the order. "
    );

    //Get Order Id
    const orderId = await page
      .locator(".em-spacer-1 .ng-star-inserted")
      .textContent();

    //Find and view order with order Id
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = page.locator("tbody tr");

    for (let i = 0; i < (await rows.count()); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click();
        break;
      }
    }

    //Confirm that you are brought to order summary view
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
  },
  { timeout: 60000 }
);
