import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

export interface MenuButtonProps extends React.ComponentProps<typeof IconButton> {
    showBadge?: boolean;
}

export default function MenuButton({
                                       showBadge = false,
                                       ...props
                                   }: MenuButtonProps) {
    return (
        <Badge
            color="error"
            variant="dot"
            invisible={!showBadge}
            sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
        >
            <IconButton size="small" {...props} />
        </Badge>
    );
}
