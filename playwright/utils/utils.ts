import type { Locator, Page } from "@playwright/test";
// import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/experimental-ct-react17";
/**
 * Retrieve a computed style for an element.
 *
 * @function getStyle
 * @async
 * @param locator {Locator} The Playwright locator to evaluate (see: https://playwright.dev/docs/locators)
 * @param cssProp {string} The CSS property for the style to retrieve
 * @returns Promise<string> The style value
 * @example await getStyle(locator, "width");
 */
export const getStyle = async (
  locator: Locator,
  cssProp: string
): Promise<string> => {
  return locator.evaluate(
    (el, property) => window.getComputedStyle(el).getPropertyValue(property),
    cssProp
  );
};

/**
 * Check the accessibility rules for an element.
 *
 * @function checkAccessibility
 * @async
 * @param page {Page}
 * @returns void
 * @example await checkAccessibility(page);
 */
// export const checkAccessibility = async (page: Page) => {
//   const accessibilityScanResults = await new AxeBuilder({ page })
//     .withTags([
//       "wcag2a", // WCAG 2.0 & WCAG 2.1 Level A
//       "wcag2aa", // WCAG 2.0 & WCAG 2.1 Level AA
//       "wcag21a", // WCAG 2.1 Level A
//       "wcag21aa", // WCAG 2.1 Level AA
//       "best-practice", // Best practices endorsed by Deque
//     ])
//     .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
//     .analyze();

//   expect(accessibilityScanResults.violations).toEqual([]);
// };
