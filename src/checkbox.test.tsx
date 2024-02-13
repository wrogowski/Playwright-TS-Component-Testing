import React from "react";
import { test, expect } from "@playwright/experimental-ct-react17";
import { Checkbox } from "@mui/material";
import { CheckboxClass } from "../playwright/locators/checkboxClass";
import IndeterminateCheckbox from "../playwright/components/indeterminateCheckbox.component";

test.describe(`<Checkbox> component functional tests`, () => {
  test("it allows to check checkbox", async ({ mount, page }) => {
    await mount(<Checkbox />);
    const checkboxClass = new CheckboxClass(page);
    const checkbox = await checkboxClass.getCheckbox();

    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test("it does not allow to operate on disabled checkbox", async ({ mount, page }) => {
    await mount(
      <div>
        <Checkbox disabled />
        <Checkbox disabled checked />
      </div>
    );

    const checkboxClass = new CheckboxClass(page);
    const uncheckedCheckbox = (await checkboxClass.getCheckbox()).first();
    const checkedCheckbox = (await checkboxClass.getCheckbox()).last();

    expect(uncheckedCheckbox).toBeDisabled();
    expect(checkedCheckbox).toBeDisabled();
    expect(await checkboxClass.isChecked(uncheckedCheckbox)).toBe(false);
    expect(await checkboxClass.isChecked(checkedCheckbox)).toBe(true);
  });

  test("it handles indeterminate checkbox state correctly", async ({ page, mount }) => {
    await mount(<IndeterminateCheckbox />);

    type CheckboxState = boolean | "indeterminate";
    const checkboxClass = new CheckboxClass(page);
    const checkboxes = {
      parent: (await checkboxClass.getCheckbox()).first(),
      firstChild: (await checkboxClass.getCheckbox()).nth(1),
      secondChild: (await checkboxClass.getCheckbox()).nth(2),
    };

    const assertCheckboxState = async (checkbox: keyof typeof checkboxes, expectedState: CheckboxState) => {
      if (expectedState === "indeterminate") {
        return expect(checkboxes[checkbox]).toHaveAttribute("data-indeterminate", "true");
      } else {
        return expect(checkboxes[checkbox]).toBeChecked({
          checked: expectedState,
        });
      }
    };

    const verfiyCheckboxes = async (
      parent: CheckboxState,
      firstChild: CheckboxState,
      secondChild: CheckboxState
    ) => {
      await assertCheckboxState("parent", parent);
      await assertCheckboxState("firstChild", firstChild);
      await assertCheckboxState("secondChild", secondChild);
    };

    // Initial state: first child unchecked, parent indeterminate
    await verfiyCheckboxes("indeterminate", true, false);

    checkboxes.secondChild.check();
    await verfiyCheckboxes(true, true, true);

    checkboxes.parent.uncheck();
    await verfiyCheckboxes(false, false, false);

    checkboxes.secondChild.check();
    await verfiyCheckboxes("indeterminate", false, true);

    checkboxes.firstChild.check();
    await verfiyCheckboxes(true, true, true);
  });
});
