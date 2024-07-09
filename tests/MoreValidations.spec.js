const { test, expect } = require("@playwright/test");

test("Popup validation", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  //   Ways to navigate to other sites and go back and forth
  //   await page.goto("https://google.com")
  //   await page.goBack()
  //   await page.goForward()

  //Hide and show content
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();

  //Alert and confirmation boxes (called dialog boxes in playwright)
  //can use .accept() to click ok and .dismiss() to cancel
  page.on("dialog", (dialog) => dialog.accept());
  //the above just says what to do if a dialog box is opened we still need to click the button to get the above code to work
  await page.locator("#confirmbtn").click();

  //Handle hover
  await page.locator("#mousehover").hover();

  //frames - following line changes from main page to i frame
  const framesPage = page.frameLocator("#courses-iframe");
  await framesPage.locator("li a[href*='lifetime-access']:visible").click();
  const textCheck = await framesPage.locator(".text h2").textContent();
  console.log(textCheck.split(" ")[1]);
});
