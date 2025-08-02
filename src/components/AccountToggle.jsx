import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function AccountToggle({ serviceType, setServiceType }) {
  const handleAccountChange = (event, newService) => {
    if (newService !== null) {
      setServiceType(newService);
    }
  };

  return (
    <div className='toggle-wrapper'>
        <ToggleButtonGroup
          value={serviceType}
          exclusive
          onChange={handleAccountChange}
          aria-label="account type"
          color="primary"
          className="custom-toggle-group"
        >
          <ToggleButton 
            value="Third Party" 
            aria-label="third party"
            className="custom-toggle-button"
          >
            Third Party
          </ToggleButton>
          <ToggleButton 
            value="Gmail" 
            aria-label="gmail"
            className="custom-toggle-button"
          >
            Gmail
          </ToggleButton>
        </ToggleButtonGroup>
    </div>
  );
}
