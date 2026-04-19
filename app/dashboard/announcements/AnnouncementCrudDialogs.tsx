"use client";

import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import dayjs, { type Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  announcementService,
  type AdminAnnouncement,
  type AnnouncementKind,
} from "@/services/announcementService";

const KIND_OPTIONS: { value: AnnouncementKind; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "update", label: "Update" },
  { value: "reminder", label: "Reminder" },
];

export type SnackbarSeverity = "success" | "error";

interface EditAnnouncementDialogProps {
  open: boolean;
  announcement: AdminAnnouncement | null;
  onClose: () => void;
  onUpdated: () => void;
  showSnackbar: (message: string, severity: SnackbarSeverity) => void;
}

export function EditAnnouncementDialog({
  open,
  announcement,
  onClose,
  onUpdated,
  showSnackbar,
}: EditAnnouncementDialogProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<AnnouncementKind>("update");
  const [published, setPublished] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Dayjs | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && announcement) {
      setTitle(announcement.title);
      setBody(announcement.body);
      setKind(announcement.kind);
      setPublished(announcement.published);
      setExpiresAt(announcement.expiresAt ? dayjs(announcement.expiresAt) : null);
    }
  }, [open, announcement]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!announcement) return;
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      showSnackbar("Title and body are required", "error");
      return;
    }
    setSaving(true);
    try {
      await announcementService.updateAnnouncement(announcement._id, {
        title: t,
        body: b,
        kind,
        published,
        expiresAt: expiresAt?.isValid() ? expiresAt.toISOString() : "",
      });
      showSnackbar("Announcement updated", "success");
      onUpdated();
      onClose();
    } catch {
      // httpService toasts API errors
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Edit announcement</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 200 } }}
              fullWidth
              required
            />
            <TextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              multiline
              minRows={5}
              slotProps={{ htmlInput: { maxLength: 10000 } }}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel id="edit-ann-kind-label">Kind</InputLabel>
              <Select<AnnouncementKind>
                labelId="edit-ann-kind-label"
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
                    input: {
                      "aria-label": "Published",
                    } satisfies InputHTMLAttributes<HTMLInputElement>,
                  }}
                />
              }
              label="Published (visible to subscribers)"
            />
            <DateTimePicker
              label="Expires"
              value={expiresAt}
              onChange={(v) => setExpiresAt(v)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: "Clear the date to remove expiry",
                },
              }}
            />
            <Button type="button" variant="outlined" size="small" onClick={() => setExpiresAt(null)}>
              Clear expiry
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

interface DeleteAnnouncementDialogProps {
  open: boolean;
  announcementTitle: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteAnnouncementDialog({
  open,
  announcementTitle,
  loading,
  onCancel,
  onConfirm,
}: DeleteAnnouncementDialogProps) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Delete announcement?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This cannot be undone.{" "}
          <strong>{announcementTitle}</strong> will be removed for subscribers.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
