import React from "react";
import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { expect, vi, beforeEach, afterEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import userEvent from "@testing-library/user-event";
import ResumeManagement from "../../src/ResumeManagement";

const baseUrl = "http://localhost:3000";
const mockTemplates = [
  { id: "1", name: "Template 1", description: "First template" },
  { id: "2", name: "Template 2", description: "Second template" },
];

const newTemplate = { id: "3", name: "Template 3", description: "" };

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();

  fetchMock.mockResponse((req) => {
    switch (req.method) {
      case "GET":
        if (req.url.includes("/api/templates")) {
          return Promise.resolve(JSON.stringify(mockTemplates));
        }
        break;
      case "POST":
        if (req.url.includes("/api/templates")) {
          return Promise.resolve(JSON.stringify(newTemplate));
        }
        break;
      case "PUT":
        if (req.url.includes("/api/templates")) {
          return Promise.resolve(
            JSON.stringify({ ...mockTemplates[0], name: "Template 1 Updated" })
          );
        }
        break;
      default:
        return Promise.reject(new Error(`Unhandled request: ${req.url}`));
    }
  });
});

afterEach(() => {
  cleanup();
});

const mounter = () => {
  return render(
    <ThemeProvider theme={createTheme()}>
      <ResumeManagement baseUrl={baseUrl} />
    </ThemeProvider>
  );
};

describe("ResumeManagement", () => {
  it("Template Builder should render with available templates", async () => {
    mounter();

    await waitFor(() => {
      expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}/api/templates`);
    });

    expect(screen.getByText("Resumes Management")).toBeInTheDocument();
    expect(screen.getByText("Template 1")).toBeInTheDocument();
    expect(screen.getByText("Template 2")).toBeInTheDocument();
  });

  it("should render with no available templates", async () => {
    fetchMock.mockImplementationOnce((url) => {
      if (url.includes("/api/templates")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
    });

    mounter();

    await waitFor(() => {
      expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}/api/templates`);
    });

    expect(screen.getByText("No templates available")).toBeInTheDocument();
  });

  it("should add template to list when new template is created", async () => {
    mounter();

    await waitFor(() => {
      expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}/api/templates`);
    });

    expect(screen.getAllByTestId("template-list-item").length).toBe(2);

    userEvent.click(screen.getByText("New Template"));

    await waitFor(() => {
      expect(screen.getByText("Create New Template")).toBeInTheDocument();
    });

    const nameInput = await screen.findByLabelText("Template Name", {
      exact: false,
    });

    fireEvent.change(nameInput, { target: { value: "Template 3" } });

    expect(nameInput).toHaveValue("Template 3");

    userEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBe(2);
    });

    expect(screen.getByText("Template 3")).toBeInTheDocument();
    expect(screen.getAllByTestId("template-list-item").length).toBe(3);
  });

  it("should show error when new template is missing name", async () => {
    mounter();

    await waitFor(() => {
      expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}/api/templates`);
    });

    expect(screen.getAllByTestId("template-list-item").length).toBe(2);

    userEvent.click(screen.getByText("New Template"));

    await waitFor(() => {
      expect(screen.getByText("Create New Template")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(screen.getByText("A name is required")).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("template-list-item").length).toBe(2);
  });

  it("should update existing template name", async () => {
    mounter();

    await waitFor(() => {
      expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}/api/templates`);
    });

    const template1 = screen.getByText("Template 1");
    userEvent.click(template1);

    await waitFor(() => {
      expect(screen.getByText("Edit Template")).toBeInTheDocument();
    });

    const nameInput = await screen.findByLabelText("Template Name", {
      exact: false,
    });

    fireEvent.change(nameInput, { target: { value: "Template 1 Updated" } });

    expect(nameInput).toHaveValue("Template 1 Updated");

    userEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBe(2);
    });

    expect(screen.getByText("Template 1 Updated")).toBeInTheDocument();
    expect(screen.getAllByTestId("template-list-item").length).toBe(2);

    //close template editor
    userEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByText("Edit Template")).not.toBeInTheDocument();
    });
  });
});
