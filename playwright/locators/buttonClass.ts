import type { Locator, Page } from "@playwright/test";
import { ButtonProps } from "@material-ui/core/Button";
import colors from "../utils/rgbColorsDefinitions";

export default class ButtonClass {
  // page context
  readonly page: Page;

  //locators
  readonly button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.button = page.locator("button");
  }

  // functions
  async getButtonComponent() {
    return this.button;
  }

  async clickButton(forceClick = false) {
    await this.button.click({ force: forceClick });
  }

  getButtonClassAttribute = () => this.button.getAttribute("class");

  // button Helpers
  getExpectedColorsForButtonVariant = (
    buttonVariant: ButtonProps["variant"],
    colorName: ButtonProps["color"] | "disabled"
  ) => {
    if (buttonVariant === "text" || buttonVariant === "outlined") {
      const colorVariants = {
        primary: { fontColor: colors.blue, bgColor: colors.whiteA },
        secondary: { fontColor: colors.red, bgColor: colors.whiteA },
        default: { fontColor: colors.blackA, bgColor: colors.whiteA },
        inherit: { fontColor: colors.black, bgColor: colors.whiteA },
        disabled: { fontColor: colors.darkGrayA, bgColor: colors.whiteA },
      };
      return colorVariants[colorName!] as {
        fontColor: string;
        bgColor: string;
      };
    } else if (buttonVariant === "contained") {
      const colorVariants = {
        primary: { fontColor: colors.white, bgColor: colors.blue },
        secondary: { fontColor: colors.white, bgColor: colors.red },
        default: { fontColor: colors.blackA, bgColor: colors.gray },
        inherit: { fontColor: colors.black, bgColor: colors.gray },
        disabled: { fontColor: colors.darkGrayA, bgColor: colors.grayA },
      };
      return colorVariants[colorName!] as {
        fontColor: string;
        bgColor: string;
      };
    } else {
      throw new Error(`Test parameters are not set for ${buttonVariant} <Button> variant`);
    }
  };
}
