import React from "react";
import { test, expect } from "@playwright/experimental-ct-react17";
import "date-fns";

import DateComponent from "../playwright/components/date.component";
import { DateClass } from "../playwright/locators/dateClass";

test.describe("Test <Date> component", () => {
  test("should render <Date> component with default params", async ({ mount, page }) => {
    await mount(<DateComponent />);

    const dateClass = new DateClass(page);
    const datePicker = await dateClass.getDateComponent();

    await expect(datePicker).toHaveAttribute("value", "09/01/2021");
  });
});
