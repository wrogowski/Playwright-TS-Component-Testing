import React from "react";
import AlertTitle from "@mui/material/AlertTitle";
import Alert, { AlertProps } from "@mui/material/Alert";
import { test, expect } from "@playwright/experimental-ct-react17";
import { getStyle } from "../playwright/utils/utils";
import { AlertClass } from "../playwright/locators/alertClass";
import { faker } from "@faker-js/faker";

test.describe(`<Alert> component styling tests`, () => {
  const alertSeverities: AlertProps["severity"][] = ["success", "info", "warning", "error"];
  const alertVariants: AlertProps["variant"][] = ["filled", "outlined", "standard"];

  alertVariants.forEach((alertVariant) => {
    test(`colors validaton for '${alertVariant}' variant`, async ({ page, mount }) => {
      await mount(
        <div>
          <Alert variant={alertVariant} severity={alertSeverities[0]}>
            {alertVariant} variant; {alertSeverities[0]} severity Alert
          </Alert>

          <Alert variant={alertVariant} severity={alertSeverities[1]}>
            {alertVariant} variant; {alertSeverities[1]} severity Alert
          </Alert>

          <Alert variant={alertVariant} severity={alertSeverities[2]}>
            {alertVariant} variant; {alertSeverities[2]} severity Alert
          </Alert>

          <Alert variant={alertVariant} severity={alertSeverities[3]}>
            {alertVariant} variant; {alertSeverities[3]} severity Alert
          </Alert>
        </div>
      );

      const alertClass = new AlertClass(page);
      const alerts = (await alertClass.getAlertComponent()).all();

      expect((await alerts).length).toEqual(alertSeverities.length);
      const expectedFontColors = alertClass.getExpectedAlertFontColors(alertVariant);
      const expectedBackgroundColors = alertClass.getExpectedAlertBackgroundColors(alertVariant);

      let alert = (await alertClass.getAlertComponent()).nth(0);
      let fontColor = getStyle(alert, "color");
      let backgroundColor = getStyle(alert, "background-color");
      expect(await fontColor).toBe(expectedFontColors["success"]);
      expect(await backgroundColor).toBe(expectedBackgroundColors["success"]);

      alert = (await alertClass.getAlertComponent()).nth(1);
      fontColor = getStyle(alert, "color");
      backgroundColor = getStyle(alert, "background-color");
      expect(await fontColor).toBe(expectedFontColors["info"]);
      expect(await backgroundColor).toBe(expectedBackgroundColors["info"]);

      alert = (await alertClass.getAlertComponent()).nth(2);
      fontColor = getStyle(alert, "color");
      backgroundColor = getStyle(alert, "background-color");
      expect(await fontColor).toBe(expectedFontColors["warning"]);
      expect(await backgroundColor).toBe(expectedBackgroundColors["warning"]);

      alert = (await alertClass.getAlertComponent()).nth(3);
      fontColor = getStyle(alert, "color");
      backgroundColor = getStyle(alert, "background-color");
      expect(await fontColor).toBe(expectedFontColors["error"]);
      expect(await backgroundColor).toBe(expectedBackgroundColors["error"]);
    });
  });

  test("<Alert> color might be set regardless of the severity", async ({ page, mount }) => {
    await mount(
      <Alert severity="success" color="error">
        Success severity alert in the error color
      </Alert>
    );

    const alertClass = new AlertClass(page);
    const alert = await alertClass.getAlertComponent();

    const fontColor = await getStyle(alert, "color");
    const backgroundColor = await getStyle(alert, "background-color");

    expect(fontColor).toBe(alertClass.getExpectedAlertFontColors("standard")["error"]);
    expect(backgroundColor).toBe(alertClass.getExpectedAlertBackgroundColors("standard")["error"]);
  });
});

test.describe("<Alert> component functional tests", () => {
  test("It handles long content in the body", async ({ page, mount }) => {
    const content = faker.lorem.paragraphs(50);
    await mount(<Alert>{content}</Alert>);

    const alertClass = new AlertClass(page);
    const alert = await alertClass.getAlertComponent();

    await expect(alert).toHaveText(content);
  });

  test("It handles long word in the content in the body", async ({ page, mount }) => {
    const content = faker.string.alphanumeric(100);
    await mount(<Alert>{content}</Alert>);

    const alertClass = new AlertClass(page);
    const alert = await alertClass.getAlertComponent();
    const alertSizeParams = alert.boundingBox();

    await expect(alert).toHaveText(content);
    expect(await alertSizeParams).toStrictEqual({
      height: 48.015625,
      width: 1264,
      x: 8,
      y: 8,
    });
  });

  test("It handles long content in the title", async ({ page, mount }) => {
    const content = faker.lorem.paragraphs(10);
    await mount(
      <Alert>
        <AlertTitle>{content}</AlertTitle>
        Alert with a very long title
      </Alert>
    );

    const alertClass = new AlertClass(page);
    const alert = await alertClass.getAlertComponent();
    const alertTitle = await alertClass.getAlertTitle();

    await expect(alert).toBeVisible();
    await expect(alertTitle).toHaveText(content);
  });

  test("It handles long word in the title", async ({ page, mount }) => {
    const content = faker.string.alphanumeric(50);
    await mount(
      <Alert>
        <AlertTitle>{content}</AlertTitle>
        Alert with a very long title
      </Alert>
    );

    const alertClass = new AlertClass(page);
    const alert = await alertClass.getAlertComponent();
    const alertTitle = await alertClass.getAlertTitle();

    await expect(alert).toBeVisible();
    await expect(alertTitle).toHaveText(content);
    const alertSizeParams = alert.boundingBox();

    expect(await alertSizeParams).toStrictEqual({
      height: 75.609375,
      width: 1264,
      x: 8,
      y: 8,
    });
  });

  test("it handles click on the close button", async ({ page, mount }) => {
    let counter = 0;
    await mount(<Alert onClose={() => counter++}>Alert with close button</Alert>);

    const alertClass = new AlertClass(page);
    const alertCloseButton = await alertClass.getAlertButton();

    await alertCloseButton.click();
    expect(counter).toBe(1);
  });
});
