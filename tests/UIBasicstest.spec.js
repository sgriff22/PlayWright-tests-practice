const { test, expect } = require("@playwright/test");

test("Browser Context Playwright test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const cardTitles = page.locator(".card-body a");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  //css, xpath are 2 ways to find and write elements on the page
  await userName.fill("rahulshetty");
  await page.locator("[type='password']").fill("learning");
  await signIn.click();
  //wait until this locator shows up on the page
  console.log(await page.locator("[style*='block']").textContent());
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");
  await userName.fill("");
  await userName.fill("rahulshettyacademy");
  await signIn.click();
  //To get 1 element
  //.nth(0) means the zero index (there was 4 cards which is why we need to add this. we want the very first one)
  //console.log(await page.locator(".card-body a").nth(0).textContent())

  //To get more than one element
  //or you can do .first to do the same thing (by add ing the line below you can get the first and then the second line gets the second)
  console.log(await cardTitles.first().textContent());
  console.log(await cardTitles.nth(1).textContent());

  //to get all the cards results is an array of strings
  //if you comment out the top 2 console.log lines the test will still pass but the array result will not show
  //You need to have already used textContext() to get the text content before you can use allTextContents()
  //The reason for this is that textContent waits to get the elements on the page when loading and the allTextContents doesn't which results with no elements on initial render which is an empty array
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});

test("Page Playwright test", async ({ page }) => {
  //if no context(cookies/proxy) added to the newContext or newPage, the browser fixture and the 2 lines can be omitted because those are default lines that will be automatically ran.
  await page.goto("https://google.com");
  //get title -assertion
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test("UI Controls", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const documentLink = page.locator("[href*='documents-request']");
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("consult");
  await page.locator(".radiotextsty").last().click();
  await page.locator("#okayBtn").click();
  //assertion
  await expect(page.locator(".radiotextsty").last()).toBeChecked();
  //can do the following as well to check if true, but the except is the better way to do it since console.log is not
  console.log(await page.locator(".radiotextsty").last().isChecked());

  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked();
  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy();

  await expect(documentLink).toHaveAttribute("class", "blinkingText");
  //Since the test is fast and the browser closes before you can see the select you can add pause to open playwright inspector so that you can see that the right option was selected
  //   await page.pause();
});

test("Child windows handling", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");

  //use when new page/tab is opened
  const [newPage] = await Promise.all([
    context.waitForEvent("page"), //listen for any new pages to open
    documentLink.click(), // new page is opened
  ]);

  const text = await newPage.locator(".red").textContent();
  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(domain);

  await userName.fill(domain);
});
