import React from "react";
import { Grid, Box, Typography, Rating } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

interface Skill {
  name: string;
  score: number;
}

interface SkillRatingProps {
  skills: Skill[];
  color: string;
}

const SkillRating: React.FC<SkillRatingProps> = ({ skills, color }) => {
  return (
    <Grid container spacing={2}>
      {skills.map((skill, index) => (
        <Grid item xs={12} sm={6} md={12} lg={6} key={index}>
          {skill.name && (
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 100 }}>
                {skill.name}
              </Typography>
              <Rating
                name={`skill-rating-${index}`}
                value={skill.score}
                readOnly
                max={10}
                icon={<CircleIcon fontSize="inherit" />}
                emptyIcon={<CircleOutlinedIcon fontSize="inherit" />}
                sx={{
                  ml: -3,
                  fontSize: "12px",
                  color: color,
                }}
              />
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default SkillRating;
