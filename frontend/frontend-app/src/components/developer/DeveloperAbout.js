// frontend/frontend-app/src/components/developer/DeveloperAbout.js
import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';

const DeveloperAbout = ({ developer }) => {
  const theme = useTheme();

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        About {developer?.name}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {developer?.bio ? (
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
              {developer.bio}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
              No detailed biography available yet.
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Facts
            </Typography>

            <div style={{ marginBottom: 16 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Specialization
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {developer?.specialization || 'Developer'}
              </Typography>
            </div>

            {developer?.years_experience > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Experience
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {developer.years_experience} {developer.years_experience === 1 ? 'year' : 'years'}
                </Typography>
              </div>
            )}

            {developer?.skills && developer.skills.length > 0 && (
              <div>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                  Technologies ({developer.skills.length})
                </Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {developer.skills.slice(0, 8).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {developer.skills.length > 8 && (
                    <Chip
                      label={`+${developer.skills.length - 8} more`}
                      size="small"
                      variant="outlined"
                      sx={{ opacity: 0.7 }}
                    />
                  )}
                </div>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeveloperAbout;