const { test, expect } = require("@playwright/test");

test("Playwright Special locators", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice/");

  //getByLabel()
  //Checkboxes, radio buttons, and select dropdown (can use click() or check() for these types)
  await page.getByLabel("Check me out if you Love IceCreams!").click();
  await page.getByLabel("Gender").selectOption("Female");
  await page.getByLabel("Employed").check();

  //Input password - getByPlaceHolder()
  await page.getByPlaceholder("Password").fill("abc123");

  //getByRole() - inputs/elements without placeholder or cannot get by clicking label
  await page.getByRole("button", { name: "submit" }).click();
  await page
    .getByText("Success! The Form has been submitted successfully!. ")
    .isVisible();

  await page.getByRole("link", { name: "Shop" }).click();

  //find specific product on shop landing page
  await page
    .locator("app-card")
    .filter({ hasText: "Nokia Edge" })
    .getByRole("button")
    .click();
});
