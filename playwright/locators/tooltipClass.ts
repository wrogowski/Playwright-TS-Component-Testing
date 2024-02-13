import type { Locator, Page } from "@playwright/test";

export default class TooltipClass {
  readonly page: Page;
  readonly tooltip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tooltip = page.getByRole("tooltip");
  }

  getTooltip = async () => this.tooltip;
  getTooltipWithText = async (text: string) => this.page.getByText(text);

  getRelativeTooltipPosition = async (tooltipLocator: Locator, buttonLocator: Locator) => {
    const buttonSize = (await buttonLocator.boundingBox()) || { width: 0, height: 0 };
    const tooltipStyleAttr = (await tooltipLocator.getAttribute("style")) || "error";
    const position = tooltipStyleAttr.split("translate3d")[1].match(/\d+/g) || [];
    const [x, y] = position.length >= 2 ? position.map((str) => Number(str)) : [0, 0];
    const tooltipPosition = { x, y };

    if (tooltipPosition.y >= buttonSize.height) {
      if (tooltipPosition.x === 8) {
        return "bottom-start";
      } else if (tooltipPosition.x === 99) {
        return "bottom-end";
      } else {
        return "bottom";
      }
    } else if (tooltipPosition.x >= buttonSize.width) {
      if (tooltipPosition.y === 8) {
        return "right-start";
      } else if (tooltipPosition.y === 23) {
        return "right-end";
      } else {
        return "right";
      }
    } else if (tooltipPosition.x === 8) {
      if (tooltipPosition.y === 8) {
        return "left-start";
      } else if (tooltipPosition.y === 23) {
        return "left-end";
      } else {
        return "left";
      }
    }
  };
}
