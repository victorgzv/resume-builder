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

const MAX_ITEMS = 4;

type EducationProps = {
  education: {
    degree: string;
    major: string;
    university: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
};

export const Education: React.FC<EducationProps> = ({
  education,
  onAdd,
  onUpdate,
  onRemove,
}) => (
  <Box>
    {education.map((edu, index) => (
      <Box key={index} mb={2}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Education {index + 1}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Degree"
              value={edu.degree}
              onChange={(e) => onUpdate(index, "degree", e.target.value)}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Major"
              value={edu.major}
              onChange={(e) => onUpdate(index, "major", e.target.value)}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="University"
              value={edu.university}
              onChange={(e) => onUpdate(index, "university", e.target.value)}
              inputProps={{ maxLength: 25 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={edu.location}
              onChange={(e) => onUpdate(index, "location", e.target.value)}
              inputProps={{ maxLength: 18 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={edu.startDate}
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
              value={edu.endDate}
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
              value={edu.description}
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
      disabled={education?.length === MAX_ITEMS}
    >
      Add Education
    </Button>
  </Box>
);
