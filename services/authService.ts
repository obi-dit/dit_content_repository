import httpService from "./httpService";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyResetTokenResponse {
  valid: boolean;
  email?: string;
  firstName?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Request password reset - sends email with reset link
   */
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    return httpService.post<ForgotPasswordResponse>(
      "/api/auth/forgot-password",
      data,
      { skipAuth: true }
    );
  },

  /**
   * Verify if a reset token is valid
   */
  verifyResetToken: async (
    token: string
  ): Promise<VerifyResetTokenResponse> => {
    return httpService.get<VerifyResetTokenResponse>(
      `/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
      { skipAuth: true }
    );
  },

  /**
   * Reset password using token
   */
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    return httpService.post<ResetPasswordResponse>(
      "/api/auth/reset-password",
      data,
      { skipAuth: true }
    );
  },
};

export default authService;
