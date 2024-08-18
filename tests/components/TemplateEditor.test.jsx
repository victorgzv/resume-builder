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
import { TemplateEditor } from "../../src/components/Templates/TemplateEditor";
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
    margins: { x: 20, y: 20 },
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

    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Show Dividers")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Upload Image")).toBeInTheDocument();
    });

    const uploadButton = screen.getByText("Upload Image");
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const input = uploadButton.querySelector('input[type="file"]');

    userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });

  it("handles adjusting watermark opacity", async () => {
    mounter({ ...mockTemplate, watermark: "test.png" });

    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Show Dividers")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Upload Image")).toBeInTheDocument();
    });

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

    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Show Dividers")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Upload Image")).toBeInTheDocument();
    });

    const removeButton = screen.getByText("Remove");
    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });

  it("should update layout settings when clicked", async () => {
    mounter();

    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Show Dividers")).toBeInTheDocument();
    });

    // Toggle the dividers checkbox
    await userEvent.click(screen.getByText("Show Dividers"));

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });

    // Adjust the top margin
    const horizontalMarginSlider = screen.getByTestId("x-margin-slider");
    const sliderRect = horizontalMarginSlider.getBoundingClientRect();
    const targetX = sliderRect.left + sliderRect.width * 0.5;
    const targetY = sliderRect.top + sliderRect.height / 2;

    fireEvent.mouseDown(horizontalMarginSlider, {
      clientX: sliderRect.left,
      clientY: targetY,
    });
    fireEvent.mouseMove(horizontalMarginSlider, {
      clientX: targetX,
      clientY: targetY,
    });
    fireEvent.mouseUp(horizontalMarginSlider);

    await waitFor(() => {
      expect(mockOnTemplateChange).toHaveBeenCalled();
    });
  });
});
