import React, { useState, useEffect } from 'react';

export default function StaffDashboard({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Confirmation Modal State for Item Unavailability
  const [unavailModal, setUnavailModal] = useState(null); // { orderId, itemIdx, itemName, itemPrice, itemQty }

  const staffOutletName = user?.outletName || 'Tea Post';

  const fetchOrders = () => {
    fetch('http://127.0.0.1:8000/api/v1/orders/staff')
      .then((res) => {
        if (!res.ok) throw new Error('API Offline');
        return res.json();
      })
      .then((data) => {
        setOrders(data.filter((o) => o.outletName === staffOutletName));
        setLoading(false);
      })
      .catch(() => {
        const sharedOrders = localStorage.getItem('campusq_orders');
        if (sharedOrders) {
          const parsed = JSON.parse(sharedOrders);
          setOrders(parsed.filter((o) => o.outletName === staffOutletName));
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, [staffOutletName]);

  const handleUpdateStatus = (orderId, newStatus) => {
    const sharedOrders = localStorage.getItem('campusq_orders');
    if (sharedOrders) {
      const parsed = JSON.parse(sharedOrders);
      const updatedAll = parsed.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem('campusq_orders', JSON.stringify(updatedAll));
      setOrders(updatedAll.filter((o) => o.outletName === staffOutletName));
    }

    fetch(`http://127.0.0.1:8000/api/v1/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
  };

  // Cuts off the amount and updates order total
  const confirmMarkUnavailable = () => {
    if (!unavailModal) return;
    const { orderId, itemIdx, itemName, itemPrice, itemQty } = unavailModal;
    const deductionAmount = itemPrice * itemQty;

    const sharedOrders = localStorage.getItem('campusq_orders');
    if (sharedOrders) {
      const parsed = JSON.parse(sharedOrders);
      const updatedAll = parsed.map((o) => {
        if (o.id === orderId) {
          const updatedItems = o.items.map((item, idx) =>
            idx === itemIdx ? { ...item, status: 'UNAVAILABLE' } : item
          );
          
          const newTotal = Math.max(0, o.total - deductionAmount);

          return {
            ...o,
            items: updatedItems,
            total: newTotal,
            status: 'ITEM_UNAVAILABLE',
            alertMessage: `⚠️ '${itemName}' is out of stock at ${staffOutletName}! ₹${deductionAmount} was deducted. New Total: ₹${newTotal}`,
          };
        }
        return o;
      });

      localStorage.setItem('campusq_orders', JSON.stringify(updatedAll));
      setOrders(updatedAll.filter((o) => o.outletName === staffOutletName));
    }

    setUnavailModal(null);
  };

  const filteredOrders = orders.filter((o) => (activeTab === 'ALL' ? true : o.status === activeTab));

  const pendingCount = orders.filter((o) => o.status === 'RECEIVED').length;
  const inProgressCount = orders.filter((o) => o.status === 'IN_PROGRESS').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      
      {/* Confirmation Modal */}
      {unavailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-xl mb-4">
              ⚠️
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-1">Confirm Item Removal</h3>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Are you sure <strong className="text-red-600">"{unavailModal.itemName}"</strong> is unavailable?
            </p>

            <div className="bg-red-50 border border-red-200 p-3 rounded-2xl mb-5 text-xs text-red-800 space-y-1">
              <p className="font-extrabold">💸 Bill Adjustment Notice:</p>
              <p>• <strong>₹{unavailModal.itemPrice * unavailModal.itemQty}</strong> will be cut off from total order.</p>
              <p>• Immediate alert will be sent to student.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUnavailModal(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold py-3 rounded-xl text-xs transition"
              >
                NO, Keep Item
              </button>
              <button
                onClick={confirmMarkUnavailable}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-xs transition shadow-lg shadow-red-600/20 active:scale-95"
              >
                YES, Deduct & Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/20">
              KDS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-gray-900">{staffOutletName} Merchant Portal</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                  LIVE KITCHEN
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Logged in as {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              Refresh Queue
            </button>
            <button
              onClick={onLogout}
              className="bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setActiveTab('RECEIVED')}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              activeTab === 'RECEIVED' ? 'bg-amber-50 border-amber-400 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">New Orders</p>
            <p className="text-3xl font-black text-amber-600 mt-2">{pendingCount}</p>
          </div>

          <div
            onClick={() => setActiveTab('IN_PROGRESS')}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              activeTab === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-400 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Preparing</p>
            <p className="text-3xl font-black text-blue-600 mt-2">{inProgressCount}</p>
          </div>

          <div
            onClick={() => setActiveTab('COMPLETED')}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              activeTab === 'COMPLETED' ? 'bg-emerald-50 border-emerald-400 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Ready for Pickup</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{completedCount}</p>
          </div>

          <div
            onClick={() => setActiveTab('ALL')}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              activeTab === 'ALL' ? 'bg-gray-100 border-gray-400 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Tickets</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{orders.length}</p>
          </div>
        </div>

        {/* Live Order Queue */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Live Kitchen Display System</h2>
          <span className="text-xs text-gray-400 font-medium">Auto-syncing every 2s</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm font-medium">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-medium">
            No active orders in this view.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition shadow-md ${
                  order.status === 'ITEM_UNAVAILABLE'
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : order.status === 'RECEIVED'
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : order.status === 'IN_PROGRESS'
                    ? 'border-blue-400 ring-2 ring-blue-400/20'
                    : 'border-gray-200'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {order.id}
                        </span>
                        <span className="text-xs font-extrabold text-gray-900">{order.studentName || 'Student'}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium">Placed at {order.timestamp}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, itemIdx) => {
                      const isItemUnavail = item.status === 'UNAVAILABLE';

                      return (
                        <div
                          key={itemIdx}
                          className={`flex justify-between items-center text-xs p-2.5 rounded-xl border ${
                            isItemUnavail ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200/60'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className={`font-bold ${isItemUnavail ? 'line-through text-red-700' : 'text-gray-800'}`}>
                              <strong className="text-red-600 mr-2">{item.qty}x</strong>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {isItemUnavail ? `<s>₹${item.price * item.qty}</s> (Deducted)` : `₹${item.price * item.qty}`}
                            </span>
                          </div>

                          {isItemUnavail ? (
                            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                              UNAVAILABLE
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                setUnavailModal({
                                  orderId: order.id,
                                  itemIdx: itemIdx,
                                  itemName: item.name,
                                  itemPrice: item.price,
                                  itemQty: item.qty,
                                })
                              }
                              className="bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition active:scale-95 shadow-sm"
                            >
                              ✕ Not Available
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold">Updated Order Total</span>
                    <span className="text-emerald-700 font-black text-base font-mono">₹{order.total}</span>
                  </div>

                  {order.status === 'ITEM_UNAVAILABLE' && (
                    <div className="bg-red-100 border border-red-300 text-red-800 p-2 rounded-xl text-center text-xs font-bold">
                      ⚠️ Student Notified & Bill Adjusted
                    </div>
                  )}

                  {(order.status === 'RECEIVED' || order.status === 'ITEM_UNAVAILABLE') && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'IN_PROGRESS')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20"
                    >
                      Accept & Start Cooking
                    </button>
                  )}

                  {order.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-600/20"
                    >
                      Mark Ready for Pickup
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-2 rounded-xl text-center text-xs font-bold">
                      ✓ Ready at Counter
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}