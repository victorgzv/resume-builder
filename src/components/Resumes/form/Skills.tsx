import React from "react";
import { Box, Grid, TextField, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type SkillsProps = {
  skills: {
    name: string;
    score: number;
  }[];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
};

const MAX_ITEMS = 8;

export const Skills: React.FC<SkillsProps> = ({
  skills,
  onAdd,
  onUpdate,
  onRemove,
}) => (
  <Box>
    {skills.map((skill, index) => (
      <Box key={index} mb={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Skill"
              value={skill.name}
              onChange={(e) => onUpdate(index, "name", e.target.value)}
              inputProps={{ maxLength: 15 }}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="Score (0-10)"
              type="number"
              inputProps={{ min: 0, max: 10 }}
              value={skill.score}
              onChange={(e) =>
                onUpdate(index, "score", parseInt(e.target.value, 10))
              }
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => onRemove(index)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    ))}
    <Button
      startIcon={<AddIcon />}
      onClick={onAdd}
      disabled={skills?.length === MAX_ITEMS}
    >
      Add Skill
    </Button>
  </Box>
);
