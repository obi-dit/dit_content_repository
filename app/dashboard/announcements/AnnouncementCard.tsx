"use client";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import type {
  AdminAnnouncement,
  AnnouncementKind,
} from "@/services/announcementService";

function kindChipColor(
  kind: AnnouncementKind
): "error" | "info" | "warning" {
  if (kind === "live") return "error";
  if (kind === "reminder") return "warning";
  return "info";
}

export interface AnnouncementCardProps {
  row: AdminAnnouncement;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (row: AdminAnnouncement) => void;
  onDelete: (row: AdminAnnouncement) => void;
}

export default function AnnouncementCard({
  row,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  const showActions = canUpdate || canDelete;

  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ flex: 1, pb: showActions ? 1 : 2 }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "flex-start" },
              gap: 1,
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {row.title}
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Chip size="small" label={row.kind} color={kindChipColor(row.kind)} />
              <Chip
                size="small"
                variant="outlined"
                label={row.published ? "Published" : "Draft"}
                color={row.published ? "success" : "default"}
              />
            </Stack>
          </Stack>

          <Divider />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "pre-wrap", flex: 1 }}
          >
            {row.body}
          </Typography>

          <Stack spacing={0.5}>
            {row.createdAt ? (
              <Typography variant="caption" color="text.secondary">
                Created {dayjs(row.createdAt).format("MMM D, YYYY h:mm A")}
              </Typography>
            ) : null}
            {row.expiresAt ? (
              <Typography variant="caption" color="warning.main">
                Expires {dayjs(row.expiresAt).format("MMM D, YYYY h:mm A")}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No expiry
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>

      {showActions ? (
        <CardActions
          sx={{
            justifyContent: "flex-end",
            px: 2,
            pb: 2,
            pt: 0,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {canUpdate ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<HiOutlinePencil size={16} />}
              onClick={() => onEdit(row)}
            >
              Edit
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<HiOutlineTrash size={16} />}
              onClick={() => onDelete(row)}
            >
              Delete
            </Button>
          ) : null}
        </CardActions>
      ) : null}
    </Card>
  );
}
