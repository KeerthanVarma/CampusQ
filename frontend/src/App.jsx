import React, { useEffect, useState, useRef } from 'react';
import Login from './components/Login';
import StaffDashboard from './components/StaffDashboard';
import * as MenuModule from './menuData';

// Safe fallbacks to prevent crashes if menuData exports are missing
const DEFAULT_OUTLETS = MenuModule.OUTLETS || [];
const safeGetMenuByOutletId = MenuModule.getMenuByOutletId || (() => []);
const safeSearchGlobalMenu = MenuModule.searchGlobalMenu || (() => ({ dishes: [], outlets: [] }));

// ==========================================
// SVG ICONS & BADGES
// ==========================================
function TicketIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 011 1.732 2 2 0 01-1 1.732V17a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 01-1-1.732 2 2 0 011-1.732V7a2 2 0 00-2-2H5z" />
    </svg>
  );
}

function CartIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function UserIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function VegBadge({ isVeg }) {
  return (
    <div className={`w-3.5 h-3.5 border-2 ${isVeg ? 'border-emerald-600' : 'border-red-600'} flex items-center justify-center p-0.5 rounded-sm bg-white flex-shrink-0`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}></div>
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusq_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [outlets] = useState(() => {
    try {
      const saved = localStorage.getItem('campusq_outlets');
      return saved ? JSON.parse(saved) : DEFAULT_OUTLETS;
    } catch { return DEFAULT_OUTLETS; }
  });

  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFullSearchResults, setShowFullSearchResults] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState(null);

  // Checkout & Modal states
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [cookingNote, setCookingNote] = useState('');
  const [loadingMenu, setLoadingMenu] = useState(false);
  
  const [showCart, setShowCart] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const [toast, setToast] = useState(null);
  const searchContainerRef = useRef(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('campusq_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('campusq_orders', JSON.stringify(orders));
  }, [orders]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Precise outlet resolver
  const resolveOutlet = (dish) => {
    if (!dish) return null;
    if (dish.outlet && dish.outlet.name) return dish.outlet;
    
    const targetId = dish.outletId ?? dish.outlet_id ?? dish.outletID;
    if (targetId !== undefined && targetId !== null) {
      const found = outlets.find((o) => String(o.id) === String(targetId));
      if (found) return found;
    }
    return selectedOutlet || null;
  };

  // Safe search engine calculation
  const rawSearchResults = safeSearchGlobalMenu(searchQuery, outlets);
  const searchResults = {
    dishes: Array.isArray(rawSearchResults?.dishes) ? rawSearchResults.dishes : [],
    outlets: Array.isArray(rawSearchResults?.outlets) ? rawSearchResults.outlets : [],
  };

  // Group search dishes strictly Outlet-Wise
  const groupedSearchResults = searchResults.dishes.reduce((acc, dish) => {
    const outlet = resolveOutlet(dish);
    const outletKey = outlet ? String(outlet.id) : 'other';
    const outletName = outlet ? outlet.name : (dish.outlet_name || 'Campus Eatery');

    if (!acc[outletKey]) {
      acc[outletKey] = {
        outlet: outlet,
        outletName: outletName,
        dishes: []
      };
    }
    acc[outletKey].dishes.push(dish);
    return acc;
  }, {});

  const handleOpenFullSearch = () => {
    if (searchQuery.trim().length > 0) {
      setShowFullSearchResults(true);
      setSearchFocused(false);
      setSelectedOutlet(null);
    }
  };

  const handleNavigateToDish = (dish, passedOutlet) => {
    if (!dish) return;
    const outlet = passedOutlet || resolveOutlet(dish);

    setSearchFocused(false);
    setShowFullSearchResults(false);
    setHighlightedItemId(dish.id);

    if (outlet) {
      handleSelectOutlet(outlet);
    }

    setTimeout(() => {
      const element = document.getElementById(`dish-card-${dish.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);

    setTimeout(() => setHighlightedItemId(null), 3000);
  };

  const handleNavigateToOutlet = (outlet) => {
    if (!outlet) return;
    setSearchFocused(false);
    setShowFullSearchResults(false);
    handleSelectOutlet(outlet);
  };

  const handleKeyDownSearch = (e) => {
    if (e.key === 'Enter') {
      handleOpenFullSearch();
    }
  };

  const handleSelectOutlet = (outlet) => {
    if (!outlet) return;
    setSelectedOutlet(outlet);
    setShowFullSearchResults(false);
    setLoadingMenu(true);

    fetch(`http://127.0.0.1:8000/api/v1/outlets/${outlet.id}/menu`)
      .then((res) => res.json())
      .then((data) => {
        const loadedMenu = Array.isArray(data) && data.length > 0 ? data : safeGetMenuByOutletId(outlet.id);
        setMenuItems(loadedMenu);
        setLoadingMenu(false);
      })
      .catch(() => {
        setMenuItems(safeGetMenuByOutletId(outlet.id));
        setLoadingMenu(false);
      });
  };

  const addToCart = (item, passedOutlet) => {
    if (!item) return;
    const outlet = passedOutlet || resolveOutlet(item);

    if (!outlet) {
      triggerToast("Error: Outlet context missing for this item");
      return;
    }

    const cartKey = `${outlet.id}_${item.id}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) => (i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          qty: 1,
          cartKey: cartKey,
          outletId: outlet.id,
          outletName: outlet.name,
        },
      ];
    });

    triggerToast(`Added ${item.name} (${outlet.name})`);
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) =>
      prev
        .map((i) => (i.cartKey === cartKey ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const getItemQtyInCart = (itemId, outletId) => {
    if (!itemId) return 0;
    const targetOutletId = outletId || selectedOutlet?.id;

    if (!targetOutletId) {
      const found = cart.find((i) => i.id === itemId);
      return found ? found.qty : 0;
    }

    const cartKey = `${targetOutletId}_${itemId}`;
    const found = cart.find((i) => i.cartKey === cartKey);
    return found ? found.qty : 0;
  };

  const totalCartItemCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  
  const totalCartPrice = cart.reduce((sum, item) => {
    const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return sum + priceNum * item.qty;
  }, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      pickupCode: `${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PREPARING',
      paymentMethod,
      cookingNote,
      items: [...cart],
      totalAmount: totalCartPrice,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setShowConfirmModal(false);
    setShowCart(false);
    setCookingNote('');
    setShowOrdersModal(true);
    triggerToast(`Order #${newOrder.id} placed successfully!`);
  };

  if (!user) return <Login onLoginSuccess={(u) => { setUser(u); localStorage.setItem('campusq_user', JSON.stringify(u)); }} />;
  if (user.role === 'STAFF') return <StaffDashboard user={user} onLogout={() => setUser(null)} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans relative pb-20">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>{toast}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <div 
            onClick={() => { setSelectedOutlet(null); setShowFullSearchResults(false); setSearchQuery(''); }}
            className="cursor-pointer font-black text-2xl tracking-tight text-red-600 flex items-center gap-1 select-none"
          >
            campus<span className="text-gray-900">Q</span>
          </div>

          {/* Search Bar - Fixed dark mode background color flip */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-2">
            <div className="relative flex items-center bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500 border border-gray-200 rounded-2xl px-3.5 py-2 transition-all">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                style={{ colorScheme: 'light' }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                  if (e.target.value.trim() === '') setShowFullSearchResults(false);
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleKeyDownSearch}
                placeholder="Search dishes or eateries (Press Enter)..."
                className="w-full bg-transparent text-xs font-medium text-gray-900 placeholder-gray-400 outline-none focus:outline-none focus:text-gray-900"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchFocused(false);
                    setShowFullSearchResults(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && !showFullSearchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[28rem] overflow-y-auto z-50 p-2 space-y-3 text-gray-900">
                {searchResults.dishes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center px-3 py-1 border-b border-gray-100 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        Dishes ({searchResults.dishes.length})
                      </p>
                      <button
                        onClick={handleOpenFullSearch}
                        className="text-[11px] font-black text-red-600 hover:underline"
                      >
                        View Outlet-Wise →
                      </button>
                    </div>

                    {searchResults.dishes.slice(0, 8).map((dish, idx) => {
                      const dishOutlet = resolveOutlet(dish);
                      const qty = getItemQtyInCart(dish.id, dishOutlet?.id);

                      return (
                        <div
                          key={`${dishOutlet?.id || idx}-${dish.id}`}
                          className="flex items-center justify-between p-2.5 hover:bg-red-50/60 rounded-xl transition-colors group"
                        >
                          <div 
                            onClick={() => handleNavigateToDish(dish, dishOutlet)}
                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer pr-2"
                          >
                            <VegBadge isVeg={dish.is_veg} />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate group-hover:text-red-600 transition">
                                {dish.name}
                              </p>
                              <p className="text-[10px] font-bold text-red-600 bg-red-50 inline-block px-1.5 py-0.5 rounded-md mt-0.5 truncate">
                                🏪 {dishOutlet?.name || 'Specific Outlet'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs font-black font-mono text-gray-900">₹{dish.price}</span>
                            
                            {qty === 0 ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(dish, dishOutlet);
                                }}
                                className="bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black text-[10px] px-2.5 py-1 rounded-lg transition shadow-sm"
                              >
                                + ADD
                              </button>
                            ) : (
                              <div className="bg-red-600 text-white font-black text-[10px] py-1 px-2 rounded-lg flex items-center gap-1.5 shadow-sm">
                                <button onClick={(e) => { e.stopPropagation(); removeFromCart(`${dishOutlet?.id}_${dish.id}`); }}>-</button>
                                <span>{qty}</span>
                                <button onClick={(e) => { e.stopPropagation(); addToCart(dish, dishOutlet); }}>+</button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {searchResults.outlets.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-3 py-1 border-b border-gray-100 mb-1">
                      Eateries ({searchResults.outlets.length})
                    </p>
                    {searchResults.outlets.map((outlet) => (
                      <div
                        key={outlet.id}
                        onClick={() => handleNavigateToOutlet(outlet)}
                        className="flex items-center justify-between p-2.5 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-black text-gray-900">{outlet.name}</p>
                          <p className="text-[10px] text-gray-400">{outlet.cuisines}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-600">★ {outlet.rating}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.dishes.length > 0 && (
                  <button
                    onClick={handleOpenFullSearch}
                    className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition text-center sticky bottom-0 shadow-md"
                  >
                    View All {searchResults.dishes.length} Results Grouped Outlet-Wise
                  </button>
                )}

                {searchResults.dishes.length === 0 && searchResults.outlets.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-xs">
                    No items found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Nav Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOrdersModal(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
              title="Active Orders"
            >
              <TicketIcon className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
              title="Shopping Cart"
            >
              <CartIcon className="w-5 h-5" />
              {totalCartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowProfileDrawer(true)}
              className="w-8 h-8 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-xs text-gray-700 hover:bg-gray-300 transition"
              title="User Profile"
            >
              <UserIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        
        {/* VIEW 1: FULL SEARCH RESULTS SCREEN (GROUPED OUTLET-WISE) */}
        {showFullSearchResults ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <button
                  onClick={() => setShowFullSearchResults(false)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 mb-1 transition"
                >
                  ← Back to Home
                </button>
                <h1 className="text-xl font-black text-gray-900">
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-xs font-medium text-gray-500 mt-0.5">
                  Found {searchResults.dishes.length} dishes across {Object.keys(groupedSearchResults).length} eateries
                </p>
              </div>
            </div>

            {searchResults.dishes.length === 0 ? (
              <div className="py-16 text-center text-gray-400 font-bold text-sm">
                No matching dishes found.
              </div>
            ) : (
              Object.values(groupedSearchResults).map((group) => (
                <div key={group.outletName} className="space-y-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  {/* Outlet Group Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏪</span>
                      <div>
                        <h3 className="text-base font-black text-gray-900">{group.outletName}</h3>
                        {group.outlet && <p className="text-[11px] text-gray-400 font-medium">{group.outlet.cuisines}</p>}
                      </div>
                    </div>
                    {group.outlet && (
                      <button
                        onClick={() => handleNavigateToOutlet(group.outlet)}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        View Full Menu →
                      </button>
                    )}
                  </div>

                  {/* Dishes for this specific Outlet */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {group.dishes.map((dish, idx) => {
                      const dishOutlet = group.outlet;
                      const qty = getItemQtyInCart(dish.id, dishOutlet?.id);

                      return (
                        <div
                          key={`${dishOutlet?.id || idx}-${dish.id}`}
                          className="bg-gray-50/50 border border-gray-200 rounded-xl p-3 flex gap-3 transition hover:border-gray-300"
                        >
                          <div className="flex-1 space-y-1 min-w-0">
                            <VegBadge isVeg={dish.is_veg} />
                            <h4
                              onClick={() => handleNavigateToDish(dish, dishOutlet)}
                              className="text-xs font-black text-gray-900 truncate hover:text-red-600 cursor-pointer transition"
                            >
                              {dish.name}
                            </h4>
                            <div className="text-xs font-mono font-black text-gray-900">₹{dish.price}</div>
                            {dish.description && <p className="text-[10px] text-gray-500 line-clamp-2">{dish.description}</p>}
                          </div>

                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            {dish.image_url && <img src={dish.image_url} alt={dish.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />}
                            
                            {qty === 0 ? (
                              <button
                                onClick={() => addToCart(dish, dishOutlet)}
                                className="w-16 bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black text-[11px] py-1 rounded-lg shadow-sm transition"
                              >
                                ADD
                              </button>
                            ) : (
                              <div className="w-16 bg-red-600 text-white font-black text-[11px] py-1 rounded-lg flex items-center justify-between px-1.5 shadow-sm">
                                <button onClick={() => removeFromCart(`${dishOutlet?.id}_${dish.id}`)}>-</button>
                                <span>{qty}</span>
                                <button onClick={() => addToCart(dish, dishOutlet)}>+</button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : selectedOutlet ? (
          /* VIEW 2: SINGLE OUTLET MENU VIEW */
          <div className="space-y-6">
            <button
              onClick={() => setSelectedOutlet(null)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition"
            >
              ← Back to Campus Eateries
            </button>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-36 sm:h-48 w-full relative">
                <img src={selectedOutlet.image_url} alt={selectedOutlet.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h1 className="text-2xl font-black">{selectedOutlet.name}</h1>
                  <p className="text-xs text-gray-200 mt-1">{selectedOutlet.cuisines}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900">Menu Items ({menuItems.length})</h3>
              {loadingMenu ? (
                <div className="py-12 text-center text-xs font-bold text-gray-400">Loading menu...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((dish) => {
                    const qty = getItemQtyInCart(dish.id, selectedOutlet.id);
                    const isHighlighted = highlightedItemId === dish.id;

                    return (
                      <div
                        id={`dish-card-${dish.id}`}
                        key={dish.id}
                        className={`bg-white border rounded-2xl p-4 flex gap-4 transition-all duration-300 ${
                          isHighlighted ? 'border-red-500 ring-2 ring-red-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <VegBadge isVeg={dish.is_veg} />
                          <h4 className="text-sm font-black text-gray-900 truncate">{dish.name}</h4>
                          <div className="text-xs font-mono font-black text-gray-900">₹{dish.price}</div>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{dish.description}</p>
                        </div>

                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                          {dish.image_url && <img src={dish.image_url} alt={dish.name} className="w-20 h-20 rounded-xl object-cover border border-gray-100" />}
                          
                          {qty === 0 ? (
                            <button
                              onClick={() => addToCart(dish, selectedOutlet)}
                              className="w-20 bg-white border border-red-600 text-red-600 hover:bg-red-50 font-black text-xs py-1 rounded-xl shadow-sm transition"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="w-20 bg-red-600 text-white font-black text-xs py-1 rounded-xl flex items-center justify-between px-2 shadow-sm">
                              <button onClick={() => removeFromCart(`${selectedOutlet.id}_${dish.id}`)} className="hover:opacity-75">-</button>
                              <span>{qty}</span>
                              <button onClick={() => addToCart(dish, selectedOutlet)} className="hover:opacity-75">+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIEW 3: HOME OUTLET GRID */
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-gray-900">Campus Eateries</h1>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Order ahead and skip the counter lines.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(outlets || []).map((outlet) => (
                <div
                  key={outlet.id}
                  onClick={() => handleSelectOutlet(outlet)}
                  className="bg-white border border-gray-200 hover:border-red-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
                >
                  <div className="h-40 w-full relative">
                    <img src={outlet.image_url} alt={outlet.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-900 truncate">{outlet.name}</h3>
                        <span className="text-xs font-black text-amber-600">★ {outlet.rating}</span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-500 mt-1 line-clamp-1">{outlet.cuisines}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400">
                      <span>₹{outlet.cost_for_two} for two</span>
                      <span className="text-red-600 font-black">View Menu →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* MODAL DRAWERS & OVERLAYS                   */}
      {/* ========================================== */}

      {/* 1. SHOPPING CART DRAWER */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Your Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <CartIcon className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
                <p className="font-bold text-sm">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Add delicious items from campus eateries to get started!</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.cartKey} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <VegBadge isVeg={item.is_veg} />
                          <span className="text-xs font-bold text-gray-900 truncate">{item.name}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.outletName}</p>
                        <p className="text-xs font-mono font-black text-gray-800 mt-1">₹{item.price * item.qty}</p>
                      </div>
                      <div className="bg-red-600 text-white font-black text-xs py-1 px-2.5 rounded-lg flex items-center gap-2 shadow-sm">
                        <button onClick={() => removeFromCart(item.cartKey)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => addToCart(item, resolveOutlet(item))}>+</button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Cooking Instructions / Notes</label>
                      <textarea
                        value={cookingNote}
                        style={{ colorScheme: 'light' }}
                        onChange={(e) => setCookingNote(e.target.value)}
                        placeholder="e.g., Less spicy, extra sauce, separate pack..."
                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-red-500 focus:bg-white text-gray-900"
                        rows="2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["UPI", "CASH", "CARD"].map((method) => (
                          <button
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 text-xs font-bold rounded-xl border transition ${
                              paymentMethod === method
                                ? "bg-red-600 text-white border-red-600 shadow-sm"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-sm font-black text-gray-900">
                    <span>Total Amount</span>
                    <span className="font-mono">₹{totalCartPrice}</span>
                  </div>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm py-3 rounded-xl transition shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. CONFIRM ORDER MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-black text-gray-900">Confirm Order</h3>
              <p className="text-xs text-gray-500 mt-1">Please double check your order summary</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto border border-gray-100">
              {cart.map((item) => (
                <div key={item.cartKey} className="flex justify-between text-xs text-gray-700">
                  <span className="truncate pr-2">{item.qty}x {item.name}</span>
                  <span className="font-mono font-bold">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-gray-900">{paymentMethod}</span>
              </div>
              {cookingNote && (
                <div className="flex justify-between">
                  <span>Notes:</span>
                  <span className="font-medium text-gray-900 truncate max-w-[150px]">{cookingNote}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
                <span>Total Payable:</span>
                <span className="font-mono text-red-600">₹{totalCartPrice}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE ORDERS MODAL */}
      {showOrdersModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md max-h-[85vh] rounded-2xl p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-black text-gray-900">Active Orders</h3>
              </div>
              <button onClick={() => setShowOrdersModal(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-xs font-bold">No active orders right now.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div>
                        <p className="text-xs font-black text-gray-900">{ord.id}</p>
                        <p className="text-[10px] text-gray-400">{ord.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {ord.status}
                        </span>
                        <p className="text-xs font-mono font-black text-gray-900 mt-1">
                          Pickup Token: <span className="text-red-600">#{ord.pickupCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {ord.items.map((it) => (
                        <div key={it.cartKey} className="flex justify-between text-xs text-gray-700">
                          <span>{it.qty}x {it.name} <span className="text-[10px] text-gray-400">({it.outletName})</span></span>
                          <span className="font-mono">₹{it.price * it.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs font-black">
                      <span className="text-gray-500">Paid via {ord.paymentMethod}</span>
                      <span className="font-mono text-gray-900 text-sm">Total: ₹{ord.totalAmount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. USER PROFILE DRAWER */}
      {showProfileDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-base font-black text-gray-900">User Profile</h3>
                <button onClick={() => setShowProfileDrawer(false)} className="text-gray-400 hover:text-gray-600">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col items-center text-center border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-xl mb-3">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h4 className="text-base font-black text-gray-900">{user.name || 'Campus Student'}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{user.email || 'student@campus.edu'}</p>
                <span className="mt-2 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Role: {user.role || 'STUDENT'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('campusq_user');
                setUser(null);
              }}
              className="w-full bg-gray-100 hover:bg-red-50 text-red-600 font-bold text-xs py-3 rounded-xl transition border border-gray-200 hover:border-red-200 flex items-center justify-center gap-2"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

    </div>
  );
}