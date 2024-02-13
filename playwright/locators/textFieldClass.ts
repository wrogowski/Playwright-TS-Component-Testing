import type { Locator, Page } from "@playwright/test";

export default class TextFieldClass {
  readonly page: Page;
  readonly textField: Locator;
  readonly helperText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.textField = page.locator("input[type='time']");
    this.helperText = page.locator("p.Mui-error");
  }

  getTextField = async () => this.textField;
  setTime = async (time: string) => this.textField.fill(time);
  getRequiredInputLabelByText = async (labelText: string) =>
    this.page
      .locator("label", { hasText: labelText })
      .locator("span.MuiFormLabel-asterisk");
}
