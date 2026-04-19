import httpService from "./httpService";

export interface RegisterSubscriptionCheckoutRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
    return httpService.post<RegisterSubscriptionCheckoutResponse>(
      "/api/subscription/register-checkout",
      data,
      { skipAuth: true }
    );
  },
};

export default subscriptionService;
