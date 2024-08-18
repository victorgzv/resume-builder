import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Box, Typography, Grid, Button } from "@mui/material";
import type { ResumeEditorActionType } from "../../stateMachines/resumeEditorState";
import type { TemplateFetchingStateType } from "../../stateMachines/templatesState";
import type { ResumeEditorStateType } from "../../stateMachines/resumeEditorState";
import { ResumeEditor } from "./ResumeEditor";
import { ResumePreview } from "./ResumePreview";

type ResumeBuilderProps = {
  baseUrl: string;
  templatesState: TemplateFetchingStateType;
  templatesRetry: () => void;
  resumeState: ResumeEditorStateType;
  onResumeAction: (action: ResumeEditorActionType) => void;
};

const ResumeBuilder = ({
  templatesState,
  templatesRetry,
  resumeState,
  onResumeAction,
}: ResumeBuilderProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const element = resumeRef.current;
    if (element) {
      const opt = {
        margin: 10,
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 5 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(element).set(opt).save();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={6}>
          <ResumeEditor
            templatesState={templatesState}
            templatesRetry={templatesRetry}
            resumeState={resumeState}
            onResumeAction={onResumeAction}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Preview</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </Box>
          <Box
            sx={{
              height: "calc(100vh - 120px)",
              overflowY: "auto",
              border: "1px solid lightgray",
              borderRadius: "4px",
              padding: 2,
            }}
          >
            <ResumePreview
              resumeState={resumeState}
              templates={templatesState?.data?.templates}
              resumeRef={resumeRef}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeBuilder;
