import {test, expect} from "@playwright/test";

const countries = [
  {country: "Andorra", code: "AD"},
  {country: "Austria", code: "AT"},
  {country: "Belgium", code: "BE"},
  {country: "Bosnia and Herzegovina", code: "BA"},
  {country: "Bulgaria", code: "BG"},
  {country: "Costa Rica", code: "CR"},
  {country: "Croatia", code: "HR"},
  {country: "Czech Republic", code: "CZ"},
  {country: "Denmark", code: "DK"},
  {country: "Estonia", code: "EE"},
  {country: "Finland", code: "FI"},
  {country: "France", code: "FR"},
  {country: "Georgia", code: "GE"},
  {country: "Germany", code: "DE"},
  {country: "Great Britain", code: "GB"},
  {country: "Greece", code: "GR"},
  {country: "Hungary", code: "HU"},
  {country: "Ireland", code: "IE"},
  {country: "Israel", code: "IL"},
];

test.beforeEach(async ({page}) => {
  // Navigate to Test Data Generator
  await page.goto("https://d2r3v7evrrggno.cloudfront.net/");

  // Open IBAN tab
  await page.getByRole("button", {name: "IBAN International Bank"}).click();
});

countries.forEach(({country, code}) => {
  test.describe("Generate IBAN number", () => {
    test(`Should generate alpha_2 ${code} based on ${country} name`, async ({
      page,
    }) => {
      // Select country
      await page
        .getByLabel("IBAN International Bank")
        .getByLabel("Default select example")
        .selectOption(country);
      // Generate IBAN number
      await page.getByRole("button", {name: "Generate"}).click();
      // Get generated IBAN number
      const ibanNumber = await page.locator('[id="iban-text"]').textContent();
      // Get alpha_2 code from string
      const alphaCode = ibanNumber?.substring(0, 2);
      // Make sure alphaCode equals code
      await expect(alphaCode).toEqual(code);
    });
  });
});

test.describe("Tests not dependend on country selection", () => {
  test("When certain amount is selected, should return IBAN numbers equal to the amount selected. Test with", async ({
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
