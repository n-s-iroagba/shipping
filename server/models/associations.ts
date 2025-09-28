
import { Shipment } from './Shipment';

import { Payment } from './Payment';
import { CryptoWallet } from './CryptoWallet';
import { DocumentTemplate } from './DocumentTemplate';
import Admin from './Admin';
import BankDetails from './Bank';
import { ShippingStage } from './ShippingStage';

console.log('Models loaded:', {
  Admin: !!Admin,
  Shipment: !!Shipment,
  CryptoWallet: !!CryptoWallet,
  DocumentTemplate: !!DocumentTemplate,
  BankDetails: !!BankDetails,
  shippingStage:!! ShippingStage
})

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
BankDetails.belongsTo(Admin,{
  foreignKey:'adminId',
  as:'bankOwner'
})
Admin.hasOne(BankDetails,{
  as:'bank',
  foreignKey:'adminId'
})
export {
  Admin,
  Shipment,
  ShippingStage,
  Payment,
  CryptoWallet,
  DocumentTemplate,
};
