import type { Locator, Page } from "@playwright/test";

export default class NativeSelectClass {
  readonly page: Page;
  readonly select: Locator;
  readonly option: Locator;
  readonly label: Locator;

  constructor(page: Page) {
    this.page = page;
    this.select = page.locator("select");
    this.option = this.select.locator("option");
    this.label = page.locator("label");
  }

  getSelectLabel = async () => this.label;
  getSelect = async () => this.select;
  getOptions = async () => await this.option.all();
}
