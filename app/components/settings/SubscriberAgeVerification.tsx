"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import MainLoader from "../MainLoader";
import {
  settingsService,
  type AgeVerificationStatus,
  type SubscriberUser,
} from "@/services/settingsService";

function formatDate(dateString?: string) {
  if (!dateString) return "Not provided";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function calculateAge(dateString?: string) {
  if (!dateString) return "Unknown";
  const birthDate = new Date(dateString);
  if (Number.isNaN(birthDate.getTime())) return "Unknown";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return String(age);
}

function paidBadge(hasPaid: boolean | undefined) {
  if (hasPaid === true) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
        Paid
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
      Not paid
    </span>
  );
}

function statusBadge(status: AgeVerificationStatus) {
  const styles: Record<AgeVerificationStatus, string> = {
    not_required:
      "bg-zinc-100 dark:bg-zinc-900/30 text-zinc-800 dark:text-zinc-300",
    pending:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    approved:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    declined: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function SubscriberAgeVerification() {
  const [subscribers, setSubscribers] = useState<SubscriberUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineTarget, setDeclineTarget] = useState<SubscriberUser | null>(null);
  const [declineReason, setDeclineReason] = useState(
    "Age does not match requirement",
  );

  const filteredSubscribers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((subscriber) => {
      const name =
        `${subscriber.firstName} ${subscriber.lastName}`.toLowerCase();
      return (
        name.includes(q) ||
        subscriber.email.toLowerCase().includes(q) ||
        subscriber._id.toLowerCase().includes(q) ||
        subscriber.ageVerificationStatus.includes(q) ||
        (q === "paid" && subscriber.hasPaid === true) ||
        (q === "not paid" && subscriber.hasPaid === false) ||
        (q === "unpaid" && subscriber.hasPaid === false)
      );
    });
  }, [searchQuery, subscribers]);

  const fetchSubscribers = async () => {
    try {
      const response = await settingsService.getSubscribers();
      setSubscribers(response.subscribers);
    } catch {
      toast.error("Failed to load subscribers");
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchSubscribers();
      setIsLoading(false);
    };
    void load();
  }, []);

  const openDeclineDialog = (subscriber: SubscriberUser) => {
    setDeclineTarget(subscriber);
    setDeclineReason("Age does not match requirement");
    setDeclineDialogOpen(true);
  };

  const closeDeclineDialog = () => {
    if (updatingId) return;
    setDeclineDialogOpen(false);
    setDeclineTarget(null);
  };

  const submitVerification = async (
    subscriber: SubscriberUser,
    status: Extract<AgeVerificationStatus, "approved" | "declined">,
    reason?: string,
  ) => {
    setUpdatingId(subscriber._id);
    try {
      const response = await settingsService.updateSubscriberAgeVerification(
        subscriber._id,
        {
          status,
          declineReason: reason?.trim() || undefined,
        },
      );
      setSubscribers((current) =>
        current.map((item) =>
          item._id === subscriber._id ? response.subscriber : item,
        ),
      );
      toast.success(
        status === "approved" ? "Subscriber approved" : "Subscriber declined",
      );
    } catch {
      toast.error("Failed to update subscriber");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApprove = (subscriber: SubscriberUser) => {
    void submitVerification(subscriber, "approved");
  };

  const handleDeclineSubmit = () => {
    if (!declineTarget) return;
    const reason = declineReason.trim();
    if (!reason) {
      toast.error("Please enter a reason for declining");
      return;
    }
    setDeclineDialogOpen(false);
    void submitVerification(declineTarget, "declined", reason);
    setDeclineTarget(null);
  };

  if (isLoading) {
    return <MainLoader message="Loading subscribers..." />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Dialog
        open={declineDialogOpen}
        onClose={(_event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            closeDeclineDialog();
          }
        }}
        fullWidth
        maxWidth="sm"
        aria-labelledby="decline-dialog-title"
      >
        <DialogTitle id="decline-dialog-title">Decline subscriber</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {declineTarget ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                {declineTarget.firstName} {declineTarget.lastName} ({declineTarget.email})
              </p>
            ) : null}
            <TextField
              label="Reason for decline"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              multiline
              minRows={3}
              fullWidth
              required
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeclineDialog} disabled={updatingId !== null}>
            Cancel
          </Button>
          <Button
            onClick={handleDeclineSubmit}
            color="error"
            variant="contained"
            disabled={updatingId !== null}
          >
            Decline subscriber
          </Button>
        </DialogActions>
      </Dialog>

      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Subscriber Age Verification
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Review driver licenses and approve or decline subscriber access.
          </p>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, ID, paid, not paid, or verification status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                🔍
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Date of Birth / Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber._id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">
                          {subscriber.firstName} {subscriber.lastName}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {paidBadge(subscriber.hasPaid)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <div>{formatDate(subscriber.dateOfBirth)}</div>
                        <div>Age: {calculateAge(subscriber.dateOfBirth)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {subscriber.driversLicenseUrl ? (
                          <a
                            href={subscriber.driversLicenseUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View license
                          </a>
                        ) : (
                          <span className="text-sm text-zinc-500">No file</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {statusBadge(subscriber.ageVerificationStatus)}
                        </div>
                        {subscriber.ageVerificationDeclineReason ? (
                          <p className="mt-1 max-w-xs text-xs text-red-500">
                            {subscriber.ageVerificationDeclineReason}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {subscriber.ageVerificationStatus !== "approved" ? (
                            <button
                              type="button"
                              disabled={updatingId === subscriber._id}
                              onClick={() => handleApprove(subscriber)}
                              className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                          ) : null}
                          {subscriber.ageVerificationStatus !== "declined" ? (
                            <button
                              type="button"
                              disabled={updatingId === subscriber._id}
                              onClick={() => openDeclineDialog(subscriber)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
