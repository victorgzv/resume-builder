import React from "react";
import { Grid, TextField, Button } from "@mui/material";

type PersonalInfoProps = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    description: string;
  };
  onUpdate: (field: string, value: string) => void;
};

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  onUpdate,
}) => {
  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate("profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="profile-picture-upload"
          type="file"
          onChange={handleProfilePicture}
        />
        <label htmlFor="profile-picture-upload">
          <Button variant="contained" color="primary" component="span">
            Upload Profile Picture
          </Button>
        </label>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          value={personalInfo.firstName}
          onChange={(e) => onUpdate("firstName", e.target.value)}
          inputProps={{ maxLength: 30 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          value={personalInfo.lastName}
          onChange={(e) => onUpdate("lastName", e.target.value)}
          inputProps={{ maxLength: 30 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          value={personalInfo.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          inputProps={{ maxLength: 35 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          value={personalInfo.phoneNumber}
          onChange={(e) => onUpdate("phoneNumber", e.target.value)}
          inputProps={{
            maxLength: 15,
            pattern: "[0-9]*",
            inputMode: "numeric",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={personalInfo.address}
          onChange={(e) => onUpdate("address", e.target.value)}
          inputProps={{ maxLength: 50 }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={personalInfo.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          inputProps={{ maxLength: 350 }}
        />
      </Grid>
    </Grid>
  );
};
