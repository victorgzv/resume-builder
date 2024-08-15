// src/stories/TemplatesPage.stories.tsx
import React from "react";
import { Story, Meta } from "@storybook/react";
import { TemplatesPage } from "../components/TemplatesPage/TemplatesPage";

export default {
  title: "Components/TemplatesPage",
  component: TemplatesPage,
} as Meta;

const Template: Story = (args) => <TemplatesPage {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithExistingTemplates = Template.bind({});
WithExistingTemplates.args = {
  // You can add mock data here if you want to show the page with existing templates
};
