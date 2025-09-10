export const routes = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    verifyEmail: "/auth/verify-email",
    resendVerificationCode: "/auth/resend-code",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    me: "/auth/me",
    refreshToken: "/auth/refresh-token",
    logout: "/auth/logout",
  },
  shipment: {
    create: (adminId: number) => `/shipment/${adminId}`,
    list: (adminId: number) => `/shipment/admin/${adminId}`,
    details: (id: number) => `/shipment/${id}`,
    update: (id: number) => `/shipment/${id}`,
    delete: (id: number) => `/shipment/${id}`,
    trackPublic: (trackingId: string) => `/shipment/track/public/${trackingId}`,
  },
  stage: {
    create: (shipmentId: string) => `stage/bulk/${shipmentId}`,
    update: (stageId: number) => `/stage/${stageId}`,
    getAll: (shipmentId: string) => `/stage/all/${shipmentId}`,
    get: (stageId: string): string => `/stage/${stageId}`,
    delete: (stageId: number) => `/stage/${stageId}`,
  },

  cryptoWallet: {
    list: (adminId: number) => `/crypto-wallet/${adminId}`,
    create: (adminId: number) => `/crypto-wallet/${adminId}`,
    update: (id: number) => `/crypto-wallet/${id}`,
    delete: (id: number) => `/crypto-wallet/${id}`,
  },

  payment: {
    unapproved: (adminId: string | number) => `/payment/un-approved/${adminId}`,
    list:(adminId:string|number)=>`/payment/all/${adminId}`
  },
  templates: {
    list: (adminId: number) => `/templates/${adminId}`,
    create: (adminId: number) => `/templates/${adminId}`,
    update: (adminId: number, id: number) => `/templates/${adminId}/${id}`,
    delete: (id: number) => `/templates/${id}`,
    download: (adminId: number, id: number) =>
      `/templates/${adminId}/${id}/download`,
  },
};
