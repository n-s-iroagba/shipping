// Export all models
export {Admin} from './Admin'
export { Shipment } from './Shipment';
export { ShippingStage } from './ShippingStage';
export { Payment } from './Payment';
export { CryptoWallet } from './CryptoWallet';
export { DocumentTemplate } from './DocumentTemplate';

// Import sequelize instance
export { sequelize } from '../config/database';

// Initialize associations
import './associations';
