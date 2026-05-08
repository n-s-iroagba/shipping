
import { Shipment } from './Shipment';

import { Payment } from './Payment';

import { DocumentTemplate } from './DocumentTemplate';
import Admin from './Admin';

import { ShippingStage } from './ShippingStage';

console.log('Models loaded:', {
  Admin: !!Admin,
  Shipment: !!Shipment,
  DocumentTemplate: !!DocumentTemplate,
  shippingStage:!! ShippingStage
})

// Admin associations
Admin.hasMany(Shipment, {
  foreignKey: 'adminId',
  as: 'shipments',
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
  DocumentTemplate,
};
