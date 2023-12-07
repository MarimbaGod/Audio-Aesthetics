import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
    palette: {
        background: {
            default: '#f0f0f0',
        },
    },
    typography: {
        fontFamily: 'Helvetica',
    },
});

export default defaultTheme;
