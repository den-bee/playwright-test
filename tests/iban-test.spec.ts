import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
  // Navigate to Test Data Generator
  await page.goto("https://d2r3v7evrrggno.cloudfront.net/");

  // Open IBAN tab
  await page.getByRole("button", {name: "IBAN International Bank"}).click();
});

test.describe("Generate IBAN number", () => {
  test("Should generate IBAN number with alpha 2 code based on chosen country", async ({
    page,
  }) => {});

  test("When certain amount is selected, should return IBAN numbers equal to the amount selected", async ({
    page,
  }) => {
    // Select country
    await page
      .getByLabel("IBAN International Bank")
      .getByLabel("Default select example")
      .selectOption("Denmark");
    // Select amount
    await page.getByRole("spinbutton", {name: "amount"}).fill("3");
    // Generate BIS number
    await page.getByRole("button", {name: "Generate"}).click();

    // Get generated BIS numbers
    const ibanNumber = await page.locator('[id="iban-text"]').textContent();
    // Convert BIS numbers string to array
    const ibanNumberArray = ibanNumber?.split("\n");
    // Check if array length is equal to selected amount
    await expect(ibanNumberArray?.length).toEqual(3);
  });

  test("When pressing x button on amount, input field should be cleared", async ({
    page,
  }) => {
    // Select date
    await page.getByRole("spinbutton", {name: "amount"}).fill("3");
    // Clear amount
    await page.locator('[id="\\/iban-1-clear-button"]').click();
    // Get current amount value
    const amount = await page
      .getByRole("spinbutton", {name: "amount"})
      .textContent();
    // Check if input field is cleared
    await expect(amount).toEqual("");
  });
});
