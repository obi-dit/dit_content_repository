"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type SyntheticEvent,
} from "react";
import { type Dayjs } from "dayjs";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { HiOutlineRefresh } from "react-icons/hi";
import MainLoader from "@/app/components/MainLoader";
import NotAllowed from "@/app/components/NotAllowed";
import AnnouncementCard from "./AnnouncementCard";
import {
  DeleteAnnouncementDialog,
  EditAnnouncementDialog,
  type SnackbarSeverity,
} from "./AnnouncementCrudDialogs";
import {
  announcementService,
  type AdminAnnouncement,
  type AnnouncementKind,
} from "@/services/announcementService";
import {
  PermissionResource,
  PermissionAction,
  canAccessAnnouncementsDashboard,
} from "@/typings/permissions";
import { usePermissions } from "@/contexts/PermissionContext";

const KIND_OPTIONS: { value: AnnouncementKind; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "update", label: "Update" },
  { value: "reminder", label: "Reminder" },
];

export default function AnnouncementsAdminPage() {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const canRead = hasPermission(PermissionResource.ANNOUNCEMENT, PermissionAction.READ);
  const canCreate = hasPermission(PermissionResource.ANNOUNCEMENT, PermissionAction.CREATE);
  const canUpdate = hasPermission(PermissionResource.ANNOUNCEMENT, PermissionAction.UPDATE);
  const canDelete = hasPermission(PermissionResource.ANNOUNCEMENT, PermissionAction.DELETE);
  const canUsePage = canAccessAnnouncementsDashboard(hasPermission);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<AnnouncementKind>("update");
  const [published, setPublished] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Dayjs | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [rows, setRows] = useState<AdminAnnouncement[]>([]);

  const [editingRow, setEditingRow] = useState<AdminAnnouncement | null>(null);
  const [deleteRow, setDeleteRow] = useState<AdminAnnouncement | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>("success");

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback(
    (_event?: SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setSnackbarOpen(false);
    },
    []
  );

  const loadList = useCallback(async () => {
    if (!canRead) return;
    setListLoading(true);
    try {
      const res = await announcementService.listAnnouncements({ page: 1, limit: 50 });
      setRows(res.items);
    } catch {
      // API errors surfaced by httpService (react-toastify)
    } finally {
      setListLoading(false);
    }
  }, [canRead]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const handleRefreshList = useCallback(async () => {
    await loadList();
    showSnackbar("Announcements list updated", "success");
  }, [loadList, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteRow) return;
    setDeleteLoading(true);
    try {
      await announcementService.deleteAnnouncement(deleteRow._id);
      showSnackbar("Announcement deleted", "success");
      setDeleteRow(null);
      await loadList();
    } catch {
      // API errors via httpService
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteRow, loadList, showSnackbar]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      showSnackbar("Title and body are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload: Parameters<typeof announcementService.createAnnouncement>[0] = {
        title: t,
        body: b,
        kind,
        published,
      };
      if (expiresAt?.isValid()) {
        payload.expiresAt = expiresAt.toISOString();
      }
      await announcementService.createAnnouncement(payload);
      showSnackbar("Announcement created", "success");
      setTitle("");
      setBody("");
      setKind("update");
      setPublished(false);
      setExpiresAt(null);
      await loadList();
    } catch {
      // httpService surfaces validation errors
    } finally {
      setSubmitting(false);
    }
  };

  if (permissionsLoading) {
    return <MainLoader message="Checking permissions..." />;
  }

  if (!canUsePage) {
    return (
      <NotAllowed
        title="Access denied"
        message="You need announcement permissions to manage announcements."
      />
    );
  }

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex-1 overflow-y-auto">
          <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 sm:px-6 py-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Announcements
              </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Create, view, edit, or remove subscriber announcements. Published items appear on the
              subscriber dashboard when not expired.
            </p>
            </div>
          </header>

          <Box className="px-4 sm:px-6 py-6 max-w-6xl mx-auto space-y-8">
            {canCreate && (
            <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider" }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                New announcement
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2.5}>
                  <TextField
                    id="ann-title"
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Short headline"
                    slotProps={{ htmlInput: { maxLength: 200 } }}
                    fullWidth
                    required
                  />
                  <TextField
                    id="ann-body"
                    label="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Full message for subscribers"
                    multiline
                    minRows={6}
                    slotProps={{ htmlInput: { maxLength: 10000 } }}
                    fullWidth
                    required
                  />
                  <FormControl fullWidth>
                    <InputLabel id="ann-kind-label">Kind</InputLabel>
                    <Select<AnnouncementKind>
                      labelId="ann-kind-label"
                      id="ann-kind"
                      label="Kind"
                      value={kind}
                      onChange={(e: SelectChangeEvent<AnnouncementKind>) =>
                        setKind(e.target.value as AnnouncementKind)
                      }
                    >
                      {KIND_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        slotProps={{
                          input: { "aria-label": "Publish immediately" } satisfies InputHTMLAttributes<HTMLInputElement>,
                        }}
                      />
                    }
                    label="Publish immediately (visible to subscribers)"
                  />
                  <DateTimePicker
                    label="Expires (optional)"
                    value={expiresAt}
                    onChange={(v) => setExpiresAt(v)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        helperText: "Leave empty for no expiry",
                      },
                    }}
                  />
                  <Button type="submit" variant="contained" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                    {submitting ? "Saving…" : "Create announcement"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
            )}

            {canRead && (
              <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
                >
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    All announcements
                  </Typography>
                  <Tooltip title="Refresh list">
                    <span>
                      <IconButton
                        onClick={() => void handleRefreshList()}
                        disabled={listLoading}
                        aria-label="Refresh announcements list"
                        size="small"
                      >
                        {listLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <HiOutlineRefresh size={20} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                {listLoading && rows.length === 0 ? (
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", py: 1 }}>
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                      Loading…
                    </Typography>
                  </Stack>
                ) : rows.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No announcements yet.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(3, minmax(0, 1fr))",
                      },
                    }}
                  >
                    {rows.map((row) => (
                      <AnnouncementCard
                        key={row._id}
                        row={row}
                        canUpdate={canUpdate}
                        canDelete={canDelete}
                        onEdit={setEditingRow}
                        onDelete={setDeleteRow}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            )}
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <EditAnnouncementDialog
            open={editingRow !== null}
            announcement={editingRow}
            onClose={() => setEditingRow(null)}
            onUpdated={() => void loadList()}
            showSnackbar={showSnackbar}
          />
          <DeleteAnnouncementDialog
            open={deleteRow !== null}
            announcementTitle={deleteRow?.title ?? ""}
            loading={deleteLoading}
            onCancel={() => {
              if (!deleteLoading) setDeleteRow(null);
            }}
            onConfirm={() => void handleDeleteConfirm()}
          />
        </div>
      </LocalizationProvider>
  );
}
