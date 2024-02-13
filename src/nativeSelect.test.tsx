import { faker } from "@faker-js/faker";
import { type Page } from "@playwright/test";
import { test, expect } from "@playwright/experimental-ct-react17";
import { InputLabel, NativeSelect, NativeSelectProps } from "@material-ui/core";
import nativeSelectClass from "../playwright/locators/nativeSelectClass";

const mountSelect = async (
  mount: Function,
  page: Page,
  labelName: string = "TEST",
  selectParams?: NativeSelectProps
) => {
  await mount(
    <div>
      <InputLabel>{labelName}</InputLabel>
      <NativeSelect {...selectParams}>
        <option value={0}></option>
        <option value={10}>Ten</option>
        <option value={20}>Twenty</option>
        <option value={30}>Thirty</option>
      </NativeSelect>
    </div>
  );
  const selectClass = new nativeSelectClass(page);
  const select = await selectClass.getSelect();
  const options = await selectClass.getOptions();
  const label = await selectClass.getSelectLabel();

  return {
    select,
    options,
    label,
  };
};

test.describe("<NativeSelect> component tests", async () => {
  test("it handles <NativeSelect> values change", async ({ mount, page }) => {
    const { select, options } = await mountSelect(mount, page);

    await expect(select).toBeVisible();
    await expect(select).toHaveValue("0");
    await select.selectOption("20");
    await expect(select).toHaveValue("20");
    expect(options.length).toBe(4);
  });

  test("it hanldes long input label", async ({ mount, page }) => {
    const longContent = faker.lorem.paragraphs(50);
    const { label } = await mountSelect(mount, page, longContent);

    await expect(label).toHaveText(longContent);
  });

  test("it handles <NativeSelect> onChage function", async ({ mount, page }) => {
    let counter = 0;
    const raiseCounter = () => counter++;
    const { select } = await mountSelect(mount, page, "Counter Strike", { onChange: raiseCounter });

    await select.selectOption("10");
    await select.selectOption("20");
    await select.selectOption("0");
    await select.selectOption("30");
    await select.selectOption("0");

    await expect(select).toHaveValue("0");
    expect(counter).toBe(5);
  });
});
