import type { Locator, Page } from "@playwright/test";

export class DateClass {
  // page context
  readonly page: Page;

  //locators
  readonly date_picker: Locator;

  constructor(page: Page) {
    this.page = page;
    this.date_picker = page.locator("#date-picker-inline");
  }

  // functions
  async getDateComponent() {
    return this.date_picker;
  }
}
