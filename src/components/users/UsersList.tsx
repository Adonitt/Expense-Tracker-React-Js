// pages/UsersPage.tsx
import {useEffect, useState} from "react";
import {userService, type UserListPayload} from "../../services/userService";
import {DataGrid, type GridColDef, GridActionsCellItem} from "@mui/x-data-grid";
import {Box, Typography, Button, Stack, IconButton, Tooltip} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageContainer from "./PageContainer";

export function UsersPage() {
    const [users, setUsers] = useState<UserListPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = () => {
        setLoading(true);
        setError("");
        userService.getUsers()
            .then(res => setUsers(res))
            .catch(err => setError("Failed to load users"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateClick = () => {
        console.log("Create user clicked");
    };

    const handleEdit = (user: UserListPayload) => {
        alert(`Edit user ${user.firstName} ${user.lastName}`);
    };

    const handleDelete = async (user: UserListPayload) => {
        alert('Delete user ' + user.firstName + ' ' + user.lastName + ' ?')
    };

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 70},
        {field: "firstName", headerName: "First Name", width: 150},
        {field: "lastName", headerName: "Last Name", width: 150},
        {field: "email", headerName: "Email", width: 200},
        {field: "isActive", headerName: "Active", width: 100, type: "boolean"},
        {field: "role", headerName: "Role", width: 100},
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={() => handleEdit(params.row)}
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon/>}
                    label="Delete"
                    onClick={() => handleDelete(params.row)}
                />,
            ],
        },
    ];

    const rows = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        role: user.role,
    }));

    return (
        <PageContainer
            title="Users"
            breadcrumbs={[{title: "Users List"}]}
            actions={
                <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Reload" placement="top">
                        <IconButton onClick={fetchUsers}>
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>
                    <Button variant="contained" startIcon={<AddIcon/>} onClick={handleCreateClick}>
                        Create
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ width: "100%"}}>
                {error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        pageSizeOptions={[5, 10, 25]}
                        autoHeight
                    />
                )}
            </Box>
        </PageContainer>
    );
}
