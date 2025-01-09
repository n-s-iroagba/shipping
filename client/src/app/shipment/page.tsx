import React from 'react';
const Shipment = () => {
  const shipments = [
    { id: '123456', status: 'In Transit', port: 'Port of Shanghai', eta: '2023-10-20' },
    { id: '789123', status: 'Waiting at Port', port: 'Port of Rotterdam', eta: '2023-10-22' },
  ];

  const payments = [
    { port: 'Port of Shanghai', amountDue: '$1,200' },
    { port: 'Port of Rotterdam', amountDue: '$900' },
    { port: 'Port of Los Angeles', amountDue: '$1,500' },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg rounded-lg min-h-[800px]">
      <header className="bg-[goldenrod] text-neutral-950 p-6 rounded-t-lg text-center">
        <h1 className="text-3xl font-title">Shipment Dashboard</h1>
      </header>
      <div className="p-4 md:p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-950 mb-4">Track Shipments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-neutral-950 border border-neutral-300 rounded-md">
              <thead className="bg-neutral-200">
                <tr>
                  <th className="px-4 py-2">Shipment ID</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Port</th>
                  <th className="px-4 py-2">ETA</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="border-t border-neutral-300">
                    <td className="px-4 py-2">{shipment.id}</td>
                    <td className="px-4 py-2">{shipment.status}</td>
                    <td className="px-4 py-2">{shipment.port}</td>
                    <td className="px-4 py-2">{shipment.eta}</td>
                    <td className="px-4 py-2">
                      <button className="bg-[goldenrod] rounded-md px-4 py-2 text-black">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-neutral-950 mb-4">Pending Payments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment, index) => (
              <div key={index} className="p-4 border border-neutral-300 rounded-md bg-neutral-50">
                <p className="text-neutral-950 mb-2">Port: {payment.port}</p>
                <p className="text-neutral-950 mb-4">Amount Due: {payment.amountDue}</p>
                <button className="bg-[goldenrod] rounded-md px-4 py-2 text-black w-full">Pay Now</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shipment;