import { test, expect } from "@playwright/experimental-ct-react17";
import { Button, Tooltip, TooltipProps } from "@material-ui/core";
import { type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import TooltipClass from "../playwright/locators/tooltipClass";
import ButtonClass from "../playwright/locators/buttonClass";

const mountTooltip = async (mount: Function, page: Page, params: Omit<TooltipProps, "children">) => {
  await mount(
    <Tooltip {...params}>
      <Button variant="outlined">Test Button </Button>
    </Tooltip>
  );

  const tooltipClass = new TooltipClass(page);
  const tooltip = await tooltipClass.getTooltip();

  const button = await new ButtonClass(page).getButtonComponent();
  await button.hover();

  return { tooltip, tooltipClass, button };
};

test.describe("<Tooltip> component tests", async () => {
  test("it renders a <Tooltip> component", async ({ mount, page }) => {
    const { tooltip } = await mountTooltip(mount, page, {
      title: "Test tooltip title",
    });

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText("Test tooltip title");
    await page.mouse.move(200, 200);
    await expect(tooltip).not.toBeVisible();
  });

  test("it handles a <Tooltip> component with very long content", async ({ mount, page }) => {
    const content = faker.lorem.paragraphs(100);
    const { tooltip } = await mountTooltip(mount, page, { title: content });

    await expect(tooltip).toHaveText(content);
  });

  test("it allows to render a <Tooltip> component in a specified positiion", async ({ mount, page }) => {
    const placements: Array<TooltipProps["placement"]> = [
      "bottom-start",
      "bottom-end",
      "bottom",
      "right-start",
      "right-end",
      "right",
    ];

    for (const tooltipPosition of placements) {
      const { tooltip, tooltipClass, button } = await mountTooltip(mount, page, {
        title: "TEST",
        placement: tooltipPosition,
      });

      const position = await tooltipClass.getRelativeTooltipPosition(tooltip, button);
      expect(position).toBe(tooltipPosition);
    }
  });

  test("it renders a <Tooltip> on opposite place if there is no space", async ({ mount, page }) => {
    const placements: Array<TooltipProps["placement"]>[] = [
      ["top-start", "bottom-start"],
      ["top-end", "bottom-end"],
      ["top", "bottom"],
      ["left-start", "right-start"],
      ["left-end", "right-end"],
      ["left", "right"],
    ];

    for (const [definedPostion, renderedPostion] of placements) {
      const { tooltip, tooltipClass, button } = await mountTooltip(mount, page, {
        title: "TEST",
        placement: definedPostion,
      });

      const position = await tooltipClass.getRelativeTooltipPosition(tooltip, button);
      expect(position).toBe(renderedPostion);
    }
  });

  test("it renders a single <Tooltip> component despite of different placements", async ({ mount, page }) => {
    await mount(
      <Tooltip title="Another Tooltip" placement="bottom">
        <Tooltip title="The First One" placement="right">
          <Button variant="outlined">Test Button </Button>
        </Tooltip>
      </Tooltip>
    );

    const tooltipClass = new TooltipClass(page);
    const button = await new ButtonClass(page).getButtonComponent();
    await button.hover();

    await expect(await tooltipClass.getTooltipWithText("The First One")).toBeVisible();
    await expect(await tooltipClass.getTooltipWithText("Another Tooltip")).not.toBeVisible();
  });
});
