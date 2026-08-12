"use client";

import { useEffect, useState, use } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface OrderTrackingProps {
  params: Promise<{ id: string }>;
}

export default function OrderTracking({ params }: OrderTrackingProps) {
  // Unwrap params using React.use() as required in Next.js 15
  const resolvedParams = use(params);
  const orderId = Number(resolvedParams.id);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setError(null);
      } else {
        setError("Order not found or access denied.");
      }
    } catch (e) {
      setError("Network error fetching order status.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "order_received":
        return 0;
      case "preparing":
        return 1;
      case "out_for_delivery":
        return 2;
      case "delivered":
        return 3;
      default:
        return -1;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="text-4xl animate-bounce block">🥡</span>
          <p className="text-zinc-400 font-medium">Loading status for Order #{orderId}...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 max-w-md">
          <span className="text-4xl block mb-3">⚠️</span>
          <h2 className="text-xl font-bold text-rose-400">Error</h2>
          <p className="text-zinc-400 text-sm mt-2">{error || "Could not retrieve order details."}</p>
        </div>
        <a href="/" className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-xl font-medium transition">
          Return to Menu
        </a>
      </main>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  const STEPS = [
    { label: "Order Received", desc: "We've got your order", icon: "📝" },
    { label: "Preparing", desc: "Chefs are on it", icon: "🍳" },
    { label: "Out for Delivery", desc: "Rider is heading your way", icon: "🛵" },
    { label: "Delivered", desc: "Enjoy your food!", icon: "🍽️" },
  ];

  return (
    <main className="min-h-screen bg-black text-zinc-100 antialiased font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 border-b border-zinc-700/60 backdrop-blur-md shadow-md py-6">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍔</span>
            <span className="font-bold text-white tracking-tight">BiteSpeed Tracker</span>
          </div>
          <a
            href="/"
            className="bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-bold px-4 py-2 rounded-lg transition"
          >
            ← Return to Menu
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-8">
        
        {/* Main Status Card */}
        <section className="bg-zinc-900/95 border-2 border-zinc-700 rounded-2xl p-6 md:p-8 space-y-8 shadow-xl shadow-black/35">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-700/80 pb-6">
            <div>
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">Live Order Progress</span>
              <h2 className="text-2xl font-black text-white mt-1">Order #{order.id}</h2>
              <p className="text-zinc-400 text-xs mt-0.5">
                Total Payment: <span className="text-zinc-200 font-semibold">${parseFloat(order.amount).toFixed(2)}</span>
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchOrderDetails(false)}
              disabled={refreshing}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-amber-600 disabled:to-amber-700 text-zinc-950 font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 transition duration-200 shadow-lg shadow-amber-500/10 active:scale-95"
            >
              <span className={refreshing ? "animate-spin block" : ""}>🔄</span>
              {refreshing ? "Refreshing..." : "Refresh Status"}
            </button>
          </div>

          {/* Stepper Progress Bar */}
          {isCancelled ? (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 flex items-center gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-rose-400">This order has been cancelled</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Please check with customer support or switch users to reorder.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Stepper Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {STEPS.map((step, idx) => {
                  const isActive = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.label}
                      className="flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center"
                    >
                      {/* Step Bubble */}
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg shadow-md border-2 transition-all duration-300 ${
                        isActive
                          ? isCurrent
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400 text-zinc-950 scale-110 font-bold shadow-lg shadow-amber-500/15"
                            : "bg-zinc-800 border-amber-500 text-amber-400"
                          : "bg-zinc-950 border-zinc-700 text-zinc-500"
                      }`}>
                        {step.icon}
                      </div>

                      {/* Step Labels */}
                      <div>
                        <h4 className={`text-sm font-bold transition-colors duration-300 ${
                          isActive ? "text-white" : "text-zinc-400"
                        }`}>
                          {step.label}
                        </h4>
                        <p className={`text-xs mt-0.5 ${
                          isActive ? "text-zinc-300" : "text-zinc-500"
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

        {/* Order Details Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Items Summary (2 cols) */}
          <div className="md:col-span-2 bg-zinc-900/95 border-2 border-zinc-700 rounded-2xl p-6 space-y-4 shadow-xl shadow-black/30">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🥡</span> Items Ordered
            </h3>
            
            <div className="divide-y divide-zinc-700/40 text-sm">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-xs font-bold">x{item.quantity}</span>
                    <span className="text-zinc-200 font-semibold">{item.product?.name || "Dish"}</span>
                  </div>
                  <span className="text-zinc-300 font-bold">${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-700/85 text-base font-bold text-white">
              <span>Total Payment</span>
              <span className="text-amber-400">${parseFloat(order.amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Location (1 col) */}
          <div className="bg-zinc-900/95 border-2 border-zinc-700 rounded-2xl p-6 space-y-4 shadow-xl shadow-black/30">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>📍</span> Delivery Location
            </h3>
            
            <div className="bg-zinc-950 border border-zinc-700/50 p-4 rounded-xl space-y-3 shadow-inner">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Deliver to</span>
                <span className="font-semibold text-zinc-200">Customer ID #{order.customerId}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Address ID</span>
                <span className="text-zinc-300 text-sm">Address #{order.addressId}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Country</span>
                <span className="text-zinc-300 text-sm">USA / Local Delivery</span>
              </div>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
