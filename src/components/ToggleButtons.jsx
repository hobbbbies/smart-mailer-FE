import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons({ tone, handleChange }) {
  const handleToneChange = (event, newTone) => {
    if (newTone !== null) {
      handleChange({
        target: {
          name: 'tone',
          value: newTone
        }
      });
    }
  };

  return (
    <ToggleButtonGroup
      value={tone}
      exclusive
      onChange={handleToneChange}
      aria-label="email tone"
      color="primary"
    >
      <ToggleButton value="Professional" aria-label="professional">
        Professional
      </ToggleButton>
      <ToggleButton value="Casual" aria-label="casual">
        Casual
      </ToggleButton>
      <ToggleButton value="Concise" aria-label="concise">
        Concise
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
