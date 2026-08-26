import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  X,
  CreditCard,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StoreView() {
  const { products, cart, addToCart, removeFromCart, addToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const categories = ['All', 'Mobility Aids', 'Visual Assistance', 'Hearing Assistance', 'Assistive Devices', 'Cognitive & Hearing', 'Travel Essentials'];

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    return true;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsOrderPlaced(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    addToast("Order placed successfully! Delivery scheduled to your hotel in 24 hours.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Certified Assistive Travel Gear</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Accessible Tourism Store
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Lightweight foldable ramps, smart obstacle canes, vibrating travel alarms, and shower commodes delivered directly to your hotel.
          </p>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="px-5 py-3 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Cart ({cart.length})</span>
          {cartTotal > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono text-xs">₹{cartTotal.toLocaleString()}</span>}
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-saarthi-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {prod.category}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 text-slate-900 font-bold text-xs px-2 py-0.5 rounded-lg shadow flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>★ {prod.rating}</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prod.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-1">
                  {prod.features?.map((f, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Price (Inc. GST)</span>
                <span className="text-lg font-black text-slate-900">₹{prod.price.toLocaleString()}</span>
              </div>

              <button
                onClick={() => addToCart(prod)}
                className="px-4 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full sm:w-96 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-saarthi-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Your Travel Gear Cart</h3>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setIsOrderPlaced(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!isOrderPlaced ? (
                <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-bold">Your cart is currently empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity} • ₹{item.price * item.quantity}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="text-lg font-black text-slate-900">Order Confirmed!</h4>
                  <p className="text-xs text-slate-600">
                    Order #SRT-2026-9921 placed. Your assistive devices will be delivered to your hotel reception before check-in.
                  </p>
                </div>
              )}
            </div>

            {!isOrderPlaced && cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-xl font-black text-saarthi-700">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Simulate Instant Hotel Delivery</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
