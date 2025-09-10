
import { Shipment } from './Shipment';
import { ShippingStage } from './ShippingStage';
import { Payment } from './Payment';
import { CryptoWallet } from './CryptoWallet';
import { DocumentTemplate } from './DocumentTemplate';
import Admin from './Admin';

// Define all model associations here

// Admin associations
Admin.hasMany(Shipment, {
  foreignKey: 'adminId',
  as: 'shipments',
});

Admin.hasMany(CryptoWallet, {
  foreignKey: 'adminId',
  as: 'cryptoWallets',
});

Admin.hasMany(DocumentTemplate, {
  foreignKey: 'adminId',
  as: 'documentTemplates',
});

// Shipment associations
Shipment.belongsTo(Admin, {
  foreignKey: 'adminId',
  as: 'admin',
});


// Shipment.hasMany(ShippingStage, {
//   foreignKey: 'shipmentId',
//   as: 'shippingStages',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// // ShippingStage associations
// ShippingStage.belongsTo(Shipment, {
//   foreignKey: 'shipmentId',
//   as: 'shipment',
// });

// // Payment associations


// CryptoWallet associations
CryptoWallet.belongsTo(Admin, {
  foreignKey: 'adminId',
  as: 'admin',
});

// DocumentTemplate associations
DocumentTemplate.belongsTo(Admin, {
  foreignKey: 'adminId',
  as: 'admin',
});

export {
  Admin,
  Shipment,
  ShippingStage,
  Payment,
  CryptoWallet,
  DocumentTemplate,
};
