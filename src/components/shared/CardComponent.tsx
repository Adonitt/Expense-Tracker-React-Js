import {styled} from "@mui/material/styles";
import MuiCard from "@mui/material/Card";

const CardComponent = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '420px',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[10],
    },
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
}));

export default CardComponent