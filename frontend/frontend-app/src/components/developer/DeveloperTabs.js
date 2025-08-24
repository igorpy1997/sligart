// frontend/frontend-app/src/components/developer/DeveloperTabs.js
import React, { useState } from 'react';
import { Paper, Tabs, Tab, Box } from '@mui/material';

// Sub-components
import DeveloperProjects from './DeveloperProjects';
import DeveloperAbout from './DeveloperAbout';

const DeveloperTabs = ({ developer, projects }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper sx={{ borderRadius: 3 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 2
        }}
      >
        <Tab label="Projects" />
        <Tab label="About" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {activeTab === 0 && (
          <DeveloperProjects developer={developer} projects={projects} />
        )}
        {activeTab === 1 && (
          <DeveloperAbout developer={developer} />
        )}
      </Box>
    </Paper>
  );
};

export default DeveloperTabs;