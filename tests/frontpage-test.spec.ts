import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
  // Navigate to Test Data Generator
  await page.goto("https://d2r3v7evrrggno.cloudfront.net/");
});

test.describe("Test front page functionalities", () => {
  test("When landing on page, GO UP button should not be visible", async ({
    page,
  }) => {
    // Get GO UP button
    const goUpButton = await page.locator("#go-up").getByRole("img");
    // Check if button is hidden
    await expect(goUpButton).toBeHidden();
  });

  test("When scrolling down, GO UP button should show", async ({page}) => {
    // Scroll down the page
    await page.mouse.wheel(0, 100);
    // Get GO UP button
    const goUpButton = await page.locator("#go-up").getByRole("img");
    // Check if button is visible
    await expect(goUpButton).toBeVisible();
  });

  test("When pressing GO UP button, page should scroll to top", async ({
    page,
  }) => {
    // Scroll down the page
    await page.mouse.wheel(0, 100);
    // Click GO UP button
    await page.locator("#go-up").getByRole("img").click();
    // Check to see if page is set back to top
    const isScrolledUp = await page.evaluate(() => {
      return window.screenY === 0;
    });
    expect(isScrolledUp).toBe(true);
  });
});
