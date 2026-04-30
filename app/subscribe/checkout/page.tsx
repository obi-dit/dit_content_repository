"use client";

import { useState, FormEvent, useCallback, useEffect } from "react";
import Link from "next/link";
import dayjs, { type Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";
import SubscribeNav from "../../components/subscribe/SubscribeNav";
import SubscribeFooter from "../../components/subscribe/SubscribeFooter";
import { subscriptionService } from "@/services/subscriptionService";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBSCRIBER_AGE = 18;

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  driversLicense?: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Dayjs | null;
  driversLicense: File | null;
}

const emptyFormData: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: null,
  driversLicense: null,
};

function calculateAge(dateOfBirth: Dayjs): number {
  return dayjs().diff(dateOfBirth, "year");
}

function validate(formData: RegisterFormData): FieldErrors {
  const e: FieldErrors = {};
  if (!formData.firstName.trim()) {
    e.firstName = "First name is required";
  }
  if (!formData.lastName.trim()) {
    e.lastName = "Last name is required";
  }
  if (!formData.email.trim()) {
    e.email = "Email is required";
  } else if (!EMAIL_RE.test(formData.email.trim())) {
    e.email = "Enter a valid email address";
  }
  if (!formData.password) {
    e.password = "Password is required";
  } else if (formData.password.length < 8) {
    e.password = "Password must be at least 8 characters";
  }
  if (!formData.confirmPassword) {
    e.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    e.confirmPassword = "Passwords do not match";
  }
  if (!formData.dateOfBirth) {
    e.dateOfBirth = "Date of birth is required";
  } else if (!formData.dateOfBirth.isValid()) {
    e.dateOfBirth = "Enter a valid date of birth";
  } else if (calculateAge(formData.dateOfBirth) < MIN_SUBSCRIBER_AGE) {
    e.dateOfBirth = `You must be at least ${MIN_SUBSCRIBER_AGE} to subscribe`;
  }
  if (!formData.driversLicense) {
    e.driversLicense = "Driver license image is required";
  } else if (!formData.driversLicense.type.startsWith("image/")) {
    e.driversLicense = "Upload a driver license image (JPG, PNG, or WebP)";
  } else if (formData.driversLicense.size > 8 * 1024 * 1024) {
    e.driversLicense = "Driver license image must be smaller than 8MB";
  }
  return e;
}

export default function SubscribeCheckoutPage() {
  const [formData, setFormData] = useState<RegisterFormData>(emptyFormData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = useCallback(
    <K extends keyof RegisterFormData>(name: K, value: RegisterFormData[K]) => {
      setFormData((current) => ({ ...current, [name]: value }));
      setErrors((current) => ({ ...current, [name]: undefined }));
    },
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cancelled") === "1") {
      toast.info("Checkout was cancelled. You can try again when you're ready.");
      window.history.replaceState({}, "", "/subscribe/checkout");
    }
  }, []);

  const onSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault();
      const next = validate(formData);
      setErrors(next);
      if (Object.keys(next).length > 0) {
        return;
      }

      setSubmitting(true);
      try {
        const res = await subscriptionService.registerCheckout({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          dateOfBirth: formData.dateOfBirth?.format("YYYY-MM-DD") ?? "",
          driversLicense: formData.driversLicense as File,
        });
        if (res.checkoutUrl) {
          window.location.assign(res.checkoutUrl);
          return;
        }
        toast.error("No payment URL returned. Please try again.");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Registration failed. Please try again.";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SubscribeNav />

      <main className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-lg">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-wide text-amber-500/90">
            Full Lounge Pass · $50/mo
          </p>
          <h1 className="mb-2 text-center text-3xl font-bold text-zinc-50 sm:text-4xl">
            Create your account
          </h1>
          <p className="mb-8 text-center text-zinc-400">
            Enter your details and upload a driver license image for age verification, then
            you&apos;ll be redirected to secure Stripe checkout.
          </p>

          <Box
            component="form"
            onSubmit={onSubmit}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-xl"
            noValidate
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    id="sub-first"
                    label="First name"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName}
                    fullWidth
                  />
                  <TextField
                    id="sub-last"
                    label="Last name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName}
                    fullWidth
                  />
                </Stack>

                <TextField
                  id="sub-email"
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  fullWidth
                />

                <TextField
                  id="sub-pass"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  fullWidth
                />

                <TextField
                  id="sub-pass2"
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  fullWidth
                />

                <DatePicker
                  label="Date of birth"
                  value={formData.dateOfBirth}
                  onChange={(value) => updateField("dateOfBirth", value)}
                  maxDate={dayjs().subtract(MIN_SUBSCRIBER_AGE, "year")}
                  slotProps={{
                    textField: {
                      id: "sub-dob",
                      fullWidth: true,
                      error: Boolean(errors.dateOfBirth),
                      helperText:
                        errors.dateOfBirth ??
                        `You must be at least ${MIN_SUBSCRIBER_AGE} years old.`,
                    },
                  }}
                />

                <TextField
                  id="sub-license"
                  label="Driver license image"
                  name="driversLicense"
                  type="file"
                  error={Boolean(errors.driversLicense)}
                  helperText={
                    errors.driversLicense ?? "JPG, PNG, or WebP only. Max size 8MB."
                  }
                  slotProps={{
                    htmlInput: {
                      accept: "image/jpeg,image/png,image/webp",
                    },
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    updateField("driversLicense", input.files?.[0] ?? null);
                  }}
                  fullWidth
                />
              </Stack>
            </LocalizationProvider>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1.05rem",
                fontWeight: 700,
                background: "linear-gradient(90deg, #f59e0b, #ea580c)",
                "&:hover": {
                  background: "linear-gradient(90deg, #d97706, #c2410c)",
                },
              }}
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Redirecting…
                </>
              ) : (
                "Pay now"
              )}
            </Button>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/subscribe/login" className="text-amber-400 hover:text-amber-300">
                Member sign in
              </Link>
            </p>
          </Box>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link href="/subscribe" className="text-zinc-400 hover:text-zinc-300">
              ← Back to subscribe
            </Link>
          </p>
        </div>
      </main>

      <SubscribeFooter />
    </div>
  );
}
