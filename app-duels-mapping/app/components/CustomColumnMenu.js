import { GridColumnMenu } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';

export default function CustomColumnMenu(props) {
  const theme = useTheme();

  return (
    <GridColumnMenu
      {...props}
      slots={{
        paper: (slotProps) => (
          <Paper
            {...slotProps}
            elevation={0}
            sx={{
              mt: '30px', 
              backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
              border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#000'}`,
              borderRadius: 0,
              boxShadow: 'none',
              padding: 0,
              '& .MuiMenuItem-root': {
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: '0.875rem',
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              },
              '& .MuiSvgIcon-root': {
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              },
            }}
          />
        ),
      }}
    />
  );
}



  