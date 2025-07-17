import { User } from './User';
import { Shipment } from './Shipment';
import { ShippingStage } from './ShippingStage';
import { Payment } from './Payment';
import { CryptoWallet } from './CryptoWallet';
import { DocumentTemplate } from './DocumentTemplate';

// Define all model associations here

// User associations
User.hasMany(Shipment, {
  foreignKey: 'adminId',
  as: 'shipments',
});

User.hasMany(CryptoWallet, {
  foreignKey: 'adminId',
  as: 'cryptoWallets',
});

User.hasMany(DocumentTemplate, {
  foreignKey: 'adminId',
  as: 'documentTemplates',
});

// Shipment associations
Shipment.belongsTo(User, {
  foreignKey: 'adminId',
  as: 'admin',
});

ShippingStage.hasMany(Payment, {
  foreignKey: 'shippingStageId',
  as: 'payments',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Shipment.hasMany(ShippingStage, {
  foreignKey: 'shipmentId',
  as: 'shippingStages',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// ShippingStage associations
ShippingStage.belongsTo(Shipment, {
  foreignKey: 'shipmentId',
  as: 'shipment',
});

// // Payment associations
// Payment.belongsTo(ShippingStage, {
//   foreignKey: 'shippingStageId',
//   as: 'shippingStage'
// });

// CryptoWallet associations
CryptoWallet.belongsTo(User, {
  foreignKey: 'adminId',
  as: 'admin',
});

// DocumentTemplate associations
DocumentTemplate.belongsTo(User, {
  foreignKey: 'adminId',
  as: 'admin',
});

export {
  User,
  Shipment,
  ShippingStage,
  Payment,
  CryptoWallet,
  DocumentTemplate,
};
