import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'; // ikonë për Income/Expense

const Avatar = styled(MuiAvatar)(({ theme }) => ({
    width: 28,
    height: 28,
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.secondary,
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
    minWidth: 0,
    marginRight: 12,
});

export default function SelectContent() {
    const [selected, setSelected] = React.useState<string>('income');

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelected(event.target.value);
    };

    return (
        <Select
            value={selected}
            onChange={handleChange}
            displayEmpty
            fullWidth
            sx={{
                maxHeight: 56,
                width: 215,
                [`& .MuiSelect-select`]: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pl: 1,
                },
            }}
        >
            <MenuItem value="income">
                <ListItemAvatar>
                    <Avatar>
                        <AccountBalanceWalletRoundedIcon sx={{ fontSize: '1rem' }} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Manager" />
            </MenuItem>

        </Select>
    );
}
