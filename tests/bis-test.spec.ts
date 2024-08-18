import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
  // Navigate to Test Data Generator
  await page.goto("https://d2r3v7evrrggno.cloudfront.net/");

  // Open BIS tab
  await page.getByRole("button", {name: "BIS Belgisch identificatie"}).click();
});

test.describe("Generate BIS number", () => {
  test("When pressing MORE INFO button, more info text should show", async ({
    page,
  }) => {
    // Click MORE INFO button
    await page.getByRole("button", {name: "More info"}).click();
    // Get MORE INFO text
    const moreInfo = await page.getByText("The BIS number derives it's");
    // Check if MORE INFO text is visible
    await expect(moreInfo).toBeVisible();
  });

  test("When pressing LESS INFO button, more info text should not be visible", async ({
    page,
  }) => {
    // Click MORE INFO button
    await page.getByRole("button", {name: "More info"}).click();
    // Get MORE INFO text
    const moreInfo = await page.getByText("The BIS number derives it's");
    // Click LESS INFO button
    await page.getByRole("button", {name: "Less info"}).click();
    // Check if MORE INFO text is not visible
    await expect(moreInfo).toBeHidden();
  });

  test("When gender and date are unknown, month should be 20", async ({
    page,
  }) => {
    // Check "No" on isGenderKnown
    await page.locator('[id="/bis-no-0"]').check();

    // Check "No" on isBirthdateKnown
    await page.locator('[id="/bis-no-1"]').check();

    // Generate BIS number
    await page.getByRole("button", {name: "Generate"}).click();

    // Get generated BIS number
    const bisNumber = await page.locator('[id="bis-text"]').textContent();
    // Splice string to get month
    const monthValue = bisNumber?.substring(2, 4);
    // Convert string to number
    const monthValueNumber = parseInt(monthValue || "");
    // Make sure month in BIS number equals 20
    await expect(monthValueNumber).toEqual(20);
  });

  test("When gender is known and date is unknown, month should be 40", async ({
    page,
  }) => {
    // Check "Yes" on isGenderKnown
    await page.locator('[id="/bis-yes-0"]').check();

    // Check "No" on isBirthdateKnown
    await page.locator('[id="/bis-no-1"]').check();

    // Generate BIS number
    await page.getByRole("button", {name: "Generate"}).click();

    // Get generated BIS number
    const bisNumber = await page.locator('[id="bis-text"]').textContent();
    // Get month from string
    const monthValue = bisNumber?.substring(2, 4);
    // Convert string to number
    const monthValueNumber = parseInt(monthValue || "");
    // Make sure month in BIS number equals 20
    await expect(monthValueNumber).toEqual(40);
  });

  test("When gender is known and date is known, month should be month + 40", async ({
    page,
  }) => {
    // Check "Yes" on isGenderKnown
    await page.locator('[id="/bis-yes-0"]').check();

    // Check "Yes" on isBirthdateKnown
    await page.locator('[id="/bis-yes-1"]').check();

    // Fill in date
    await page.getByRole("textbox", {name: "date"}).fill("2024-08-17");

    // Generate BIS number
    await page.getByRole("button", {name: "Generate"}).click();

    // Get generated BIS number
    const bisNumber = await page.locator('[id="bis-text"]').textContent();
    // Get month from string
    const monthValue = bisNumber?.substring(2, 4);
    // Convert string to number
    const monthValueNumber = parseInt(monthValue || "");
    // Make sure month in BIS number equals 20
    await expect(monthValueNumber).toEqual(48);
  });

  test("When gender is unknown and date is known, month should be month + 20", async ({
    page,
  }) => {
    // Check "No" on isGenderKnown
    await page.locator('[id="/bis-no-0"]').check();

    // Check "Yes" on isBirthdateKnown
    await page.locator('[id="/bis-yes-1"]').check();

    // Fill in date
    await page.getByRole("textbox", {name: "date"}).fill("2024-08-17");

    // Generate BIS number
    await page.getByRole("button", {name: "Generate"}).click();

    // Get generated BIS number
    const bisNumber = await page.locator('[id="bis-text"]').textContent();
    // Splice string to get month
    const monthValue = bisNumber?.substring(2, 4);
    // Convert string to number
    const monthValueNumber = parseInt(monthValue || "");
    // Make sure month in BIS number equals 20
    await expect(monthValueNumber).toEqual(28);
  });

  test("When date is unknown, date input field should be disabled", async ({
    page,
  }) => {
    // Check "No" on isBirthdateKnown
    await page.locator('[id="/bis-no-1"]').check();
    // Get date input field
    const date = await page.getByRole("textbox", {name: "date"});
    // Check if date input field is disabled
    await expect(date).toBeDisabled();
  });

  test("When certain amount is selected, should return BIS numbers equal to the amount selected", async ({
    page,
  }) => {
    // Select amount
    await page.getByRole("spinbutton", {name: "amount"}).fill("3");
    // Generate BIS number
    await page.getByRole("button", {name: "Generate"}).click();

    // Get generated BIS numbers
    const bisNumber = await page.locator('[id="bis-text"]').textContent();
    // Convert BIS numbers string to array
    const bisNumberArray = bisNumber?.split("\n");
    // Check if array length is equal to selected amount
    await expect(bisNumberArray?.length).toEqual(3);
  });

  test("When pressing x button on date, input field should be cleared", async ({
    page,
  }) => {
    // Select date
    await page.getByRole("textbox", {name: "date"}).fill("2024-08-17");
    // Clear date
    await page.locator('[id="\\/bis-2-clear-button"]').click();
    // Get current date
    const date = await page.getByRole("textbox", {name: "date"});
    // Check if input field is cleared
    await expect(date).toBeEmpty();
  });

  test("When pressing x button on amount, input field should be cleared", async ({
    page,
  }) => {
    // Select amount
    await page.getByRole("spinbutton", {name: "amount"}).fill("3");
    // Clear amount
    await page.locator('[id="/bis-3-clear-button"]').click();
    // Get current amount value
    const amount = await page.getByRole("spinbutton", {name: "amount"});
    // Check if input field is cleared
    await expect(amount).toBeEmpty();
  });
});
