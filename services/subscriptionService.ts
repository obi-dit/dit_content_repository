import httpService from "./httpService";

export interface RegisterSubscriptionCheckoutRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  driversLicense: File;
}

export interface RegisterSubscriptionCheckoutResponse {
  success: boolean;
  message: string;
  checkoutUrl: string;
  sessionId: string;
}

export const subscriptionService = {
  registerCheckout: async (
    data: RegisterSubscriptionCheckoutRequest
  ): Promise<RegisterSubscriptionCheckoutResponse> => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("driversLicense", data.driversLicense);

    return httpService.post<RegisterSubscriptionCheckoutResponse>(
      "/api/subscription/register-checkout",
      formData,
      { skipAuth: true }
    );
  },
};

export default subscriptionService;
