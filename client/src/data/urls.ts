const SERVER_URL = 'http://localhost:5000'

export const registerUserUrl = `${SERVER_URL}/api/signup`
export const loginUserUrl = `${SERVER_URL}/api/login`
export const logoutUserUrl = `${SERVER_URL}/api/logout`
export const verifyEmailUrl = `${SERVER_URL}/api/verify-email`
export const createShipmentUrl = `${SERVER_URL}/api/shipments`
export const shipmentUrl = `${SERVER_URL}/api/shipments/`

export const adminShipmentUrl = `${SERVER_URL}/api/shipments/admin/:shipmentDetailsId`
