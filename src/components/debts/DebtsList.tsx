import {DataGrid, GridActionsCellItem, type GridColDef} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {Button, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";

import PageContainer from "../users/PageContainer.tsx";
import {debtsService} from "../../services/debtsService.ts";
import {CreateDebtPopUp} from "./CreateDebtPopUp.tsx";
import {DebtDetailsPopUp} from "./DebtsDetailsPopUp.tsx";
import {DebtEditPopUp} from "./DebtEditPopUp.tsx";
import {DebtDeleteDialog} from "./DebtDeleteDialog.tsx";
import {TransactionDetailsPopUp} from "../transactions/TransactionDetailsPopUp.tsx";

export function DebtsList() {

    const [debts, setDebts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [openCreate, setOpenCreate] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedDebtId, setSelectedDebtId] = useState<number | null>(null);

    const [transactionPopupOpen, setTransactionPopupOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);


    const fetchDebts = () => {
        setLoading(true);
        setError(null);

        debtsService.getAllDebts()
            .then(res => setDebts(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDebts();
    }, []);

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 90, align: "center"},

        {
            field: "amount",
            headerName: "Amount €",
            width: 120,
            align: "center",
            renderCell: (params) => {
                const isLent = params.row.type === "LENT";
                return (
                    <span
                        style={{
                            backgroundColor: isLent ? "green" : "red",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                        }}
                    >
            {isLent ? `+${params.value}` : `-${params.value}`}
          </span>
                );
            },
        },

        {field: "person", headerName: "Person", width: 160},
        {field: "type", headerName: "Type", width: 120},
        {field: "status", headerName: "Status", width: 120},
        {field: "date", headerName: "Date", width: 120},
        {
            field: "transactionId",
            headerName: "Transaction",
            width: 130,
            renderCell: (params) => {
                const id = params.value;
                if (!id) return "-";
                return (
                    <Button
                        variant="text"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransactionId(id);
                            setTransactionPopupOpen(true);
                        }}
                    >
                        {id}
                    </Button>
                );
            },
        },
        {
            field: "actions",
            type: "actions",
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDebtId(params.id as number);
                        setEditOpen(true);
                    }}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon/>}
                    label="Delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDebtId(params.id as number);
                        setDeleteOpen(true);
                    }}
                />
            ],
        },
    ];

    return (
        <>
            <PageContainer title="Debts List">

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{mb: 2}}
                >
                    <Typography variant="h6">Debts</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => setOpenCreate(true)}
                    >
                        Create
                    </Button>
                </Stack>

                <div style={{height: 520, width: "100%"}}>
                    <DataGrid
                        rows={debts}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        onRowClick={(params) => {
                            setSelectedDebtId(params.id as number);
                            setDetailsOpen(true);
                        }}
                    />
                </div>

            </PageContainer>

            {/* CREATE */}
            <CreateDebtPopUp
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={fetchDebts}
            />

            {selectedDebtId && (
                <DebtDetailsPopUp
                    open={detailsOpen}
                    debtId={selectedDebtId}
                    onClose={() => setDetailsOpen(false)}
                    onDetails={fetchDebts}
                />
            )}

            {selectedDebtId && (
                <DebtEditPopUp
                    open={editOpen}
                    debtId={selectedDebtId}
                    onClose={() => setEditOpen(false)}
                    onSaved={fetchDebts}
                />
            )}

            {selectedDebtId && (
                <DebtDeleteDialog
                    open={deleteOpen}
                    debtId={selectedDebtId}
                    onClose={() => setDeleteOpen(false)}
                    onDelete={fetchDebts}
                />
            )}

            {selectedTransactionId && (
                <TransactionDetailsPopUp
                    open={transactionPopupOpen}
                    transactionId={selectedTransactionId}
                    onClose={() => setTransactionPopupOpen(false)}
                />
            )}

        </>
    );
}
