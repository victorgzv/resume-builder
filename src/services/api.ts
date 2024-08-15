import fetchMock from "fetch-mock";
import { Template } from "../types/Template";

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Default Template",
    description: "A simple template with default layout settings",
    fontFamily: "Arial, sans-serif",
    fontSize: "12",
    color: "#000000",
  },
];

fetchMock.get("/api/templates", mockTemplates);

fetchMock.post("/api/templates", (url, options) => {
  const newTemplate = JSON.parse(options.body as string);
  newTemplate.id = String(mockTemplates.length + 1);
  mockTemplates.push(newTemplate);
  return newTemplate;
});

fetchMock.put(/^\/api\/templates\/\d+$/, (url, options) => {
  const updatedTemplate = JSON.parse(options.body as string);
  const index = mockTemplates.findIndex((t) => t.id === updatedTemplate.id);
  if (index !== -1) {
    mockTemplates[index] = updatedTemplate;
    return updatedTemplate;
  }
  return {
    status: 404,
    body: { message: "Template not found" },
  };
});

export const getTemplates = (): Promise<Template[]> => {
  return fetch("/api/templates").then((res) => res.json());
};

export const createTemplate = (
  template: Omit<Template, "id">
): Promise<Template> => {
  return fetch("/api/templates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(template),
  }).then((res) => res.json());
};

export const updateTemplate = (template: Template): Promise<Template> => {
  return fetch(`/api/templates/${template.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(template),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
};
