import React from "react";
import { Story, Meta } from "@storybook/react";
import fetchMock from "fetch-mock";
import { v4 as uuidv4 } from "uuid";

import { template } from "../mockData";
import ResumeManagement from "../ResumeManagement";

interface StoryProps {
  shouldFailTemplatesFetch: boolean;
  templatesDelay: number;
}

export default {
  title: "Components/ResumeManagement",
  component: ResumeManagement,
  argTypes: {
    shouldFailTemplatesFetch: {
      control: "boolean",
    },
    templatesDelay: {
      options: [0, 250, 500, 1000, 2000, 5000],
      control: { type: "select" },
    },
  },
} as Meta;

const ResumeManagementStory: Story<StoryProps> = ({
  shouldFailTemplatesFetch,
  templatesDelay,
}: StoryProps) => {
  const baseUrl = "http://localhost:3000";

  fetchMock.config.fallbackToNetwork = true;
  fetchMock.restore();

  fetchMock
    .get(
      `${baseUrl}/api/templates`,
      () => {
        if (shouldFailTemplatesFetch) {
          return new Response(null, { status: 500 });
        }
        return new Response(JSON.stringify([template]));
      },
      { delay: templatesDelay }
    )
    .post(`${baseUrl}/api/templates`, (url, opts) => {
      const body = JSON.parse(opts.body as string);
      return new Response(
        JSON.stringify({
          ...body,
          id: uuidv4(),
        }),
        { status: 201 }
      );
    })
    .put(`begin:${baseUrl}/api/templates/`, (url, opts) => {
      const id = url.split("/").pop();
      const body = JSON.parse(opts.body as string);
      return new Response(
        JSON.stringify({
          ...body,
          id: id,
        }),
        { status: 200 }
      );
    })
    .delete(`begin:${baseUrl}/api/templates/`, (url) => {
      return new Response(null, { status: 204 });
    });

  return (
    <ResumeManagement
      baseUrl={baseUrl}
      key={JSON.stringify({
        shouldFailTemplatesFetch,
        templatesDelay,
      })}
    />
  );
};

export const Default = ResumeManagementStory.bind({});
Default.args = {
  shouldFailTemplatesFetch: false,
  templatesDelay: 500,
};
