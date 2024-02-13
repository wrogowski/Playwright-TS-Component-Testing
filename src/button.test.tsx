import React from "react";
import { test, expect } from "@playwright/experimental-ct-react17";
import Button, { ButtonProps } from "@material-ui/core/Button";
import ButtonClass from "../playwright/locators/buttonClass";
import { getStyle } from "../playwright/utils/utils";
import { faker } from "@faker-js/faker";
import { Checkbox } from "@mui/material";

const buttonVariants: ButtonProps["variant"][] = ["text", "outlined", "contained"];
const buttonColors: ButtonProps["color"][] = ["primary", "secondary", "default", "inherit"];

buttonVariants.forEach((buttonVariant) =>
  test.describe(`Test <Button> component in ${buttonVariant} variant`, () => {
    buttonColors.forEach((colorName) =>
      test(`render <Button> component with '${colorName}' color param`, async ({ mount, page }) => {
        await mount(
          <Button color={colorName as ButtonProps["color"]} variant={buttonVariant}>
            Test Button
          </Button>
        );

        const buttonClass = new ButtonClass(page);
        const newButton = await buttonClass.getButtonComponent();

        const fontColor = await getStyle(newButton, "color");
        const bgColor = await getStyle(newButton, "background-color");
        const expectedColors = await buttonClass.getExpectedColorsForButtonVariant(buttonVariant, colorName);
        const buttonClasses = await buttonClass.getButtonClassAttribute();
        const normalizedClass = buttonVariant === undefined ? "text" : buttonVariant;
        let colorClassSuffix = "";

        if (colorName === "primary") {
          colorClassSuffix = "Primary";
        } else if (colorName === "secondary") {
          colorClassSuffix = "Secondary";
        }

        expect({ fontColor, bgColor }).toEqual(expectedColors);
        expect(buttonClasses).toContain(`MuiButton-${normalizedClass}${colorClassSuffix}`);
      })
    );

    test("should propagate the onClick event", async ({ mount, page }) => {
      let capturedCallbackCount = 0;

      await mount(
        <Button
          variant={buttonVariant}
          onClick={() => {
            capturedCallbackCount += 1;
          }}
        >
          Test button
        </Button>
      );

      const buttonClass = new ButtonClass(page);

      await buttonClass.clickButton();
      expect(capturedCallbackCount).toBe(1);
    });

    test(`manage 'disabled' property for ${buttonVariant} <Button> variant`, async ({ mount, page }) => {
      let buttonClicked = false;

      await mount(
        <Button
          variant={buttonVariant}
          disabled
          onClick={() => {
            buttonClicked = true;
          }}
        >
          Disabled Button
        </Button>
      );

      const buttonClass = new ButtonClass(page);
      const newButton = await buttonClass.getButtonComponent();
      const fontColor = await getStyle(newButton, "color");
      const bgColor = await getStyle(newButton, "background-color");
      const expectedColors = await buttonClass.getExpectedColorsForButtonVariant(buttonVariant, "disabled");

      expect({ fontColor, bgColor }).toEqual(expectedColors);
      await expect(newButton).toBeDisabled();

      await buttonClass.clickButton(true);
      expect(buttonClicked).toBeFalsy();
    });

    [100, 10000].forEach((browserWidth) => {
      test(`'fullWidth' property should generate <Button> with ${browserWidth}px window size width`, async ({
        mount,
        page,
      }) => {
        await mount(
          <Button variant={buttonVariant} fullWidth>
            Full width button
          </Button>
        );

        page.setViewportSize({ width: browserWidth, height: 500 });

        const buttonClass = new ButtonClass(page);
        const newButton = await buttonClass.getButtonComponent();
        const buttonPadding = 16;
        const buttonWidth = await getStyle(newButton, "width");

        expect(buttonWidth).toBe(`${browserWidth - buttonPadding}px`);
      });
    });

    [
      { caseName: "empty string", buttonName: "" },
      { caseName: "emoticons", buttonName: "🤣🎅" },
      { caseName: "long string", buttonName: faker.lorem.words(100) },
    ].forEach(({ caseName, buttonName }) => {
      test(`handle ${caseName} in <Button> name`, async ({ mount, page }) => {
        await mount(<Button variant={buttonVariant}>{buttonName}</Button>);

        const buttonClass = new ButtonClass(page);
        const newButton = await buttonClass.getButtonComponent();
        const buttonText = await newButton.textContent();

        expect(buttonText).toBe(buttonName);
      });
    });

    test("it should allow to operate with the <Button> using keyboard", async ({ mount, page }) => {
      let capturedCallbacksCount = 0;

      await mount(
        <div>
          <Button
            variant={buttonVariant}
            onClick={() => {
              capturedCallbacksCount += 1;
            }}
          >
            Unfocused button
          </Button>
          <Checkbox />
          Just another element to be focused
        </div>
      );

      const buttonClass = new ButtonClass(page);
      await buttonClass.getButtonComponent().then((button) =>
        expect(button)
          .not.toBeFocused()
          .then(() => page.keyboard.press("Tab"))
          .then(() => expect(button).toBeFocused())
          .then(() => page.keyboard.press("Enter"))
          .then(() => expect(capturedCallbacksCount).toBe(1))
          .then(() => page.keyboard.press("Tab"))
          .then(() => expect(button).not.toBeFocused())
          .then(() => page.keyboard.press("Shift+Tab"))
          .then(() => expect(button).toBeFocused())
      );
    });

    test(`link may be passed via the 'href' attribute`, async ({ mount, page }) => {
      await mount(
        <Button variant={buttonVariant} href="https://my-page.test">
          Button with link
        </Button>
      );

      const button = await page.locator("a");
      const url = await button?.getAttribute("href");

      expect(url).toBe("https://my-page.test");
    });
  })
);
