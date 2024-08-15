import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { TemplateEditor } from "../../src/components/TemplatesPage/TemplateEditor";
import { expect, vi, beforeEach, afterEach, describe, it } from "vitest";

const mockTemplate = {
  id: "1",
  name: "Test Template",
  description: "A test template",
  fontSize: "12",
  color: "#000000",
  layout: {
    headerStyle: "default",
    showDividers: true,
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
  },
};

const mockOnTemplateChange = vi.fn();
const mockOnSave = vi.fn();
const mockOnCancel = vi.fn();

const mounter = (template = mockTemplate) => {
  return render(
    <ThemeProvider theme={createTheme()}>
      <TemplateEditor
        template={template}
        onTemplateChange={mockOnTemplateChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    </ThemeProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe("TemplateEditor", () => {
  it("renders the component with template data", async () => {
    mounter();

    expect(await screen.findByText("Edit Template")).toBeInTheDocument();

    const nameInput = await screen.findByLabelText("Template Name", {
      exact: false,
    });
    expect(nameInput).toHaveValue("Test Template");

    const descriptionInput = await screen.findByLabelText(
      "Template Description"
    );
    expect(descriptionInput).toHaveValue("A test template");
  });

  it("calls onTemplateChange when name is updated", async () => {
    mounter();
    const nameInput = await screen.findByLabelText("Template Name", {
      exact: false,
    });

    expect(nameInput).toHaveValue("Test Template");

    fireEvent.change(nameInput, { target: { value: " 3" } });

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });

  it("handles watermark upload", async () => {
    mounter();
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const uploadButton = screen.getByText("Upload");
    const input = uploadButton.querySelector('input[type="file"]');

    await waitFor(() => {
      userEvent.upload(input, file);
    });

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });

  it("handles adjusting watermark opacity", async () => {
    mounter({ ...mockTemplate, watermark: "test.png" });

    const opacitySlider = screen.getByTestId("opacity-slider");
    const sliderRect = opacitySlider.getBoundingClientRect();
    const targetX = sliderRect.left + sliderRect.width * 0.5;
    const targetY = sliderRect.top + sliderRect.height / 2;

    fireEvent.mouseDown(opacitySlider, {
      clientX: sliderRect.left,
      clientY: targetY,
    });
    fireEvent.mouseMove(opacitySlider, { clientX: targetX, clientY: targetY });
    fireEvent.mouseUp(opacitySlider);

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });

  it("handles removing watermark", async () => {
    mounter({ ...mockTemplate, watermark: "test.png" });

    const removeButton = screen.getByText("Remove");
    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });

  it("should expand layout settings when accordion is clicked", async () => {
    mounter();

    const accordionSummary = screen.getByText("Layout Settings");

    await userEvent.click(accordionSummary);

    const enableDividersCheckbox = screen.getByText("Show Dividers");
    expect(enableDividersCheckbox).toBeInTheDocument();

    // Toggle the dividers checkbox
    await userEvent.click(enableDividersCheckbox);

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });

    // Adjust the top margin
    const topMarginSlider = screen.getByTestId("top-margin-slider");
    const sliderRect = topMarginSlider.getBoundingClientRect();
    const targetX = sliderRect.left + sliderRect.width * 0.5;
    const targetY = sliderRect.top + sliderRect.height / 2;

    fireEvent.mouseDown(topMarginSlider, {
      clientX: sliderRect.left,
      clientY: targetY,
    });
    fireEvent.mouseMove(topMarginSlider, {
      clientX: targetX,
      clientY: targetY,
    });
    fireEvent.mouseUp(topMarginSlider);

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });
});
