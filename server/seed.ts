
import { ShipmentDetails } from "./models/ShipmentDetails";
import { Step } from "./models/Step";
import { User } from "./models/User";


export async function seedDatabase() {
  try {
   
    // Create an Admin User
    const admin = await User.create({
      name: "John Doe",
      email: "admin@example.com",
      password: "hashedpassword",
      isVerified: true,
    });

    console.log("✅ Admin User Created:", admin.toJSON());

    // Create a Shipment under the Admin
    const shipment = await ShipmentDetails.create({
      shipmentID: "SHIP-001",
      senderName: "Alice",
      sendingAddress: "123 Sender St, City A",
      receivingAddress: "456 Receiver Ave, City B",
      recipientName: "Bob",
      shipmentDescription: "Electronics",
      adminId: admin.id,
    });

    console.log("✅ Shipment Created:", shipment.toJSON());

    // Create Steps for the Shipment
    const steps = await Step.bulkCreate([
      { orderStage: "Processing", processedStatus: "Pending", shipmentDetailsId: shipment.id },
      { orderStage: "In Transit", processedStatus: "Ongoing", shipmentDetailsId: shipment.id },
      { orderStage: "Delivered", processedStatus: "Completed", shipmentDetailsId: shipment.id },
    ]);

    console.log("✅ Steps Created:", steps.map((s) => s.toJSON()));

    console.log("✅ Seeding Completed!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
}

