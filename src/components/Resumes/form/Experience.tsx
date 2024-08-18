import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type ExperienceProps = {
  experiences: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
};

const MAX_ITEMS = 4;

export const Experience: React.FC<ExperienceProps> = ({
  experiences,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <Box>
      {experiences.map((exp, index) => (
        <Box key={index} mb={2}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Experience {index + 1}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={exp.title}
                onChange={(e) => onUpdate(index, "title", e.target.value)}
                inputProps={{ maxLength: 18 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={exp.company}
                onChange={(e) => onUpdate(index, "company", e.target.value)}
                inputProps={{ maxLength: 15 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={exp.location}
                onChange={(e) => onUpdate(index, "location", e.target.value)}
                inputProps={{ maxLength: 18 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={exp.startDate}
                onChange={(e) => onUpdate(index, "startDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={exp.endDate}
                onChange={(e) => onUpdate(index, "endDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={exp.description}
                onChange={(e) => onUpdate(index, "description", e.target.value)}
                inputProps={{ maxLength: 150 }}
              />
            </Grid>
          </Grid>
          <Box mt={1}>
            <IconButton onClick={() => onRemove(index)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={onAdd}
        disabled={experiences?.length === MAX_ITEMS}
      >
        Add Experience
      </Button>
    </Box>
  );
};
