// pages/UsersPage.tsx
import { useEffect, useState } from "react";
import { type UserListPayload, userService } from "../../services/userService";
import {
    DataGrid,
    GridActionsCellItem,
    type GridColDef,
    type GridRowParams
} from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageContainer from "./PageContainer";
import { UserDetailsPopUp } from "./UserDetailsPopUp.tsx";
import { UserEditPopUp } from "./UserEditPopUp.tsx";
import { DeleteUserDialog } from "./DeleteUserDialog.tsx";

export function UsersList() {
    const [users, setUsers] = useState<UserListPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectUserId, setSelectUserId] = useState<number | null>(null);
    const [popUpOpen, setPopUpOpen] = useState(false);

    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editPopUpOpen, setEditPopUpOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

    const fetchUsers = () => {
        setLoading(true);
        setError("");
        userService.getUsers()
            .then(res => setUsers(res))
            .catch(() => setError("Failed to load users"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRowClick = (id: number) => {
        setSelectUserId(id);
        setPopUpOpen(true);
    };

    const handleEdit = (user: UserListPayload) => {
        setEditUserId(user.id);
        setEditPopUpOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteUserId(id);
        setDeleteDialogOpen(true);
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "firstName", headerName: "First Name", width: 150 },
        { field: "lastName", headerName: "Last Name", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "isActive", headerName: "Active", width: 100, type: "boolean" },
        { field: "role", headerName: "Role", width: 100 },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEdit(params.row)}
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteClick(params.id as number)}
                />
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
        <PageContainer title="Users List">
            <Box sx={{ width: "100%" }}>
                {error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        pageSizeOptions={[5, 10, 25]}
                        autoHeight
                        onRowClick={(params: GridRowParams) => handleRowClick(params.id)}
                    />
                )}
            </Box>

            {selectUserId && (
                <UserDetailsPopUp
                    open={popUpOpen}
                    onClose={() => setPopUpOpen(false)}
                    userId={selectUserId}
                    onEdit={(id) => {
                        setEditUserId(id);
                        setEditPopUpOpen(true);
                        setPopUpOpen(false);
                    }}
                />
            )}

            {editUserId && (
                <UserEditPopUp
                    open={editPopUpOpen}
                    onClose={() => setEditPopUpOpen(false)}
                    userId={editUserId}
                    onSaved={fetchUsers}
                />
            )}

            <DeleteUserDialog
                open={deleteDialogOpen}
                userId={deleteUserId}
                onClose={() => setDeleteDialogOpen(false)}
                onDeleted={fetchUsers}
            />
        </PageContainer>
    );
}
