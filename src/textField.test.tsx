import React from "react";
import { format } from "date-fns";
import { TextField } from "@mui/material";
import { test, expect } from "@playwright/experimental-ct-react17";
import { Locator } from "playwright-core";
import TextFieldClass from "../playwright/locators/textFieldClass";

test.describe("Time <TextField> tests with date-fns", () => {
  let textFieldClass: TextFieldClass;
  let textField: Locator;
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TextField type="time" />);

    textFieldClass = new TextFieldClass(page);
    textField = await textFieldClass.getTextField();
  });

  test("it renders a <TextField> component with default params", async () => {
    await expect(textField).toBeVisible();
    await expect(textField).toHaveValue("");
  });

  test("it displays correct current time", async () => {
    const currentTime = format(new Date(), "HH:mm");

    await textFieldClass.setTime(currentTime);
    await expect(textField).toHaveValue(currentTime);
  });

  test("it allows only 24h time to be used", async () => {
    const timeIn12hFormat = format(new Date("2024-05-05T22:55"), "p");

    try {
      await textFieldClass.setTime(timeIn12hFormat);
      await expect(textField).toHaveValue(timeIn12hFormat);
    } catch (error: any) {
      expect(error.message).toContain("Malformed value");
    } finally {
      await expect(textField).toHaveValue("");
    }
  });

  [
    ["senonds", "HH:mm:ss", 8],
    ["miliseconds", "HH:mm:ss.SSS", 12],
  ].forEach(([unit, timeFormat, expectedLength]) =>
    test(`it displays also ${unit} if provided`, async () => {
      const currentTimeWithSeconds = format(new Date(), timeFormat as string);

      await textFieldClass.setTime(currentTimeWithSeconds);
      let textFieldValue = await textField.inputValue();

      expect(textFieldValue).toBe(currentTimeWithSeconds);
      expect(textFieldValue).toHaveLength(expectedLength as number);
    })
  );
});

test.describe("<TextFiled> component options tests", () => {
  test("it does not allow to use disabled <TextField> component", async ({ mount, page }) => {
    await mount(<TextField type="time" disabled />);
    const textFieldClass = new TextFieldClass(page);
    const textField = await textFieldClass.getTextField();

    await expect(textField).toBeDisabled();
    await textField.focus();
    await page.keyboard.type("21:37");

    expect(textField).toHaveValue("");
  });

  test("it handles correctly styling properties", async ({ mount, page }) => {
    await mount(
      <TextField
        type="time"
        required
        label="Time"
        helperText="Please set the time"
        error
        defaultValue={"12:12:12.120"}
      />
    );

    const textFieldClass = new TextFieldClass(page);
    const textField = await textFieldClass.getTextField();

    await expect(textField).toHaveValue("12:12:12.120");
    expect(await textFieldClass.getRequiredInputLabelByText("Time")).toHaveText(" *");
    await expect(textFieldClass.helperText).toHaveText("Please set the time");
  });

  test("it allows to navite using keyboard", async ({ mount, page }) => {
    await mount(<TextField type="time" defaultValue={"10:20:30.400"} />);

    const textFieldClass = new TextFieldClass(page);
    const textField = await textFieldClass.getTextField();

    await textField.click({ position: { x: 50, y: 0 } });
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    await expect(textField).toHaveValue("09:19:00.000");
  });
});
