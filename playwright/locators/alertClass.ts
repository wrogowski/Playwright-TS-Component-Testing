import type { Locator, Page } from "@playwright/test";
import colors from "../utils/rgbColorsDefinitions";
import { AlertProps } from "@mui/material";

export class AlertClass {
  // page context
  readonly page: Page;

  //locators
  readonly alert: Locator;
  readonly alertTitle: Locator;
  readonly alertButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alert = page.getByRole("alert");
    this.alertTitle = this.alert.locator(".MuiAlertTitle-root");
    this.alertButton = this.alert.locator("button");
  }

  // functions
  getAlertComponent = async () => this.alert;
  getAlertTitle = async () => this.alertTitle;
  getAlertButton = async () => this.alertButton;

  getAlertFontColor = async (component: Locator) => component.getAttribute("color");

  getExpectedAlertFontColors = (alertVariant: AlertProps["variant"]) => {
    switch (alertVariant) {
      case "filled":
        return {
          success: colors.white,
          info: colors.white,
          warning: colors.white,
          error: colors.white,
        };
      case "outlined":
        return {
          success: colors.darkGreen,
          info: colors.alertFontBlue,
          warning: colors.alertFontOrange,
          error: colors.alertFontRed,
        };
      case "standard":
        return {
          success: colors.darkGreen,
          info: colors.alertFontBlue,
          warning: colors.alertFontOrange,
          error: colors.alertFontRed,
        };
      default:
        return {
          success: colors.darkGreen,
          info: colors.alertFontRed,
          warning: colors.alertFontOrange,
          error: colors.alertFontRed,
        };
    }
  };

  getExpectedAlertBackgroundColors = (alertVariant: AlertProps["variant"]) => {
    switch (alertVariant) {
      case "filled":
        return {
          success: colors.alertGreen,
          info: colors.alertBlue,
          warning: colors.alertOrange,
          error: colors.alertRed,
        };
      case "outlined":
        return {
          success: colors.whiteA,
          info: colors.whiteA,
          warning: colors.whiteA,
          error: colors.whiteA,
        };
      case "standard":
        return {
          success: colors.lightGreen,
          info: colors.alertStandardBlue,
          warning: colors.alertStandardOrange,
          error: colors.alertStandardRed,
        };
      default:
        throw new Error(`${alertVariant} is not defined for an alert variant`);
    }
  };
}
