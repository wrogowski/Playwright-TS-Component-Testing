import type { Locator, Page } from "@playwright/test";

export class CheckboxClass {
  readonly page: Page;
  readonly checkbox: Locator;
  readonly checkboxIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkbox = page.locator('input[type="checkbox"]');
    this.checkboxIcon = this.checkbox.locator("+svg");
  }

  getCheckbox = async () => this.checkbox;
  getCheckboxIcon = async () => this.checkboxIcon;

  isChecked = async (checkbox: Locator) => {
    const checkboxTestidAttribute = await checkbox
      .locator("+svg")
      .getAttribute("data-testid");
    if (checkboxTestidAttribute === "CheckBoxOutlineBlankIcon") {
      return false;
    } else if (checkboxTestidAttribute === "CheckBoxIcon") {
      return true;
    } else {
      throw new Error("checkbox state reading failed");
    }
  };

  setChecboxState = async (checkbox: Locator, state: "check" | "uncheck") => {
    const checked = await this.isChecked(checkbox);

    if (
      (state === "check" && checked === false) ||
      (state === "uncheck" && checked === true)
    ) {
      await checkbox.click();
    }
  };
}
