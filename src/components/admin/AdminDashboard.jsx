import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  DollarSign, 
  UtensilsCrossed, 
  Printer, 
  Search, 
  BellRing, 
  Receipt, 
  Layers, 
  Eye, 
  LogOut,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Flame,
  Check,
  X,
  CreditCard,
  Banknote,
  SlidersHorizontal,
  Compass,
  Award,
  User,
  RotateCcw,
  Coffee,
  Download,
  Droplets,
  Bell,
  Sparkles,
  LayoutGrid,
  Plus,
  Edit2,
  Trash2,
  Image,
  Tag,
  Leaf,
  Truck,
  MapPin
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/menuData';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Station Category Mappings
const KITCHEN_CATEGORIES = ['woodfired-pizza', 'pastas-mains', 'paninis-burgers', 'appetizers-sides', 'desserts', 'italian-specials', 'burgers', 'sides'];
const BAR_CATEGORIES = ['coffee-brews', 'shakes-coolers', 'drinks', 'cold-beverages', 'chai-coffee'];

// Preset Food Images for fast 1-tap addition
const PRESET_DISH_IMAGES = [
  { label: 'Sizzler / Platter', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Burger & Rolls', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tandoori / Grill', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Maggi / Noodles', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80' },
  { label: 'Penne Pasta', url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chai & Hot Brew', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Shake & Chiller', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' },
  { label: 'Loaded Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80' }
];

// Live Elapsed Stopwatch Timer Component
function LiveElapsedTimer({ createdAt }) {
  const [elapsed, setElapsed] = useState({ mins: 0, secs: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setElapsed({ mins, secs });
    };

    calc();
    const interval = setInterval(calc, 5000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const { mins, secs } = elapsed;
  const isUrgent = mins >= 15;
  const isWarning = mins >= 8 && mins < 15;

  return (
    <div
      className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1 ${
        isUrgent
          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
          : isWarning
          ? 'bg-amber-400/15 border-amber-400/30 text-amber-300'
          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
      }`}
      title={`Order placed ${mins}m ago`}
    >
      <Clock className="w-3 h-3" />
      <span>{mins}m {secs < 10 ? `0${secs}` : secs}s</span>
    </div>
  );
}

export function AdminDashboard({ onBackToClient }) {
  const { 
    orders, 
    menuItems = [],
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateOrderStatus, 
    revertOrderStatus,
    menuStockOverrides, 
    toggleItemStock,
    serviceRequests,
    dismissServiceRequest,
    syncWithDatabase
  } = useOrder();

  const { adminLogout } = useAuth();

  // Active Main Tab: 'kds' | 'floor' | 'inventory' | 'tables' | 'analytics'
  const [activeTab, setActiveTab] = useState('kds');
  
  // KDS Station Filter: 'all' | 'kitchen' | 'bar'
  const [activeStation, setActiveStation] = useState('all');

  // KDS Order Status Filter: 'all' | 'new' | 'prep' | 'ready' | 'completed'
  const [orderFilter, setOrderFilter] = useState('all');
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategory, setStockCategory] = useState('all');
  const [selectedTableForQR, setSelectedTableForQR] = useState(1);
  const [viewingSlip, setViewingSlip] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Menu Item Modal State (Add / Edit)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for new, item object for edit
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  // Form State for Add / Edit Item
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'woodfired-pizza',
    price: 199,
    prepTime: '10-12 mins',
    diet: 'veg', // 'veg' | 'nonveg' | 'egg'
    description: '',
    image: PRESET_DISH_IMAGES[0].url,
    isBestseller: false,
    isSpicy: false,
    spiceOptions: ['Mild', 'Medium', 'Spicy'],
    newSpiceInput: '',
    addons: [
      { id: 'addon-1', name: 'Extra Mozzarella Blanket', price: 45 },
      { id: 'addon-2', name: 'Garlic Butter Glaze', price: 25 }
    ]
  });

  // Open Add Item Modal
  const handleOpenAddModal = () => {
    sounds.playClick();
    setEditingItem(null);
    setItemForm({
      name: '',
      category: 'woodfired-pizza',
      price: 199,
      prepTime: '10-12 mins',
      diet: 'veg',
      description: '',
      image: PRESET_DISH_IMAGES[0].url,
      isBestseller: false,
      isSpicy: false,
      spiceOptions: ['Mild Zing', 'Classic Herb', 'Spicy Arrabbiata'],
      newSpiceInput: '',
      addons: [
        { id: `add-${Date.now()}-1`, name: 'Extra Cheese Slice', price: 35 },
        { id: `add-${Date.now()}-2`, name: 'Garlic Butter Dip', price: 25 }
      ]
    });
    setIsItemModalOpen(true);
  };

  // Open Edit Item Modal
  const handleOpenEditModal = (item) => {
    sounds.playClick();
    setEditingItem(item);
    setItemForm({
      name: item.name || '',
      category: item.category || 'woodfired-pizza',
      price: item.price || 199,
      prepTime: item.prepTime || '10 mins',
      diet: item.isEgg ? 'egg' : item.isVeg ? 'veg' : 'nonveg',
      description: item.description || '',
      image: item.image || PRESET_DISH_IMAGES[0].url,
      isBestseller: Boolean(item.isBestseller),
      isSpicy: Boolean(item.isSpicy),
      spiceOptions: item.spiceOptions || [],
      newSpiceInput: '',
      addons: item.addons ? [...item.addons] : []
    });
    setIsItemModalOpen(true);
  };

  // Add Addon Row
  const handleAddAddonRow = () => {
    sounds.playClick();
    setItemForm(prev => ({
      ...prev,
      addons: [
        ...prev.addons,
        { id: `addon-${Date.now()}`, name: 'New Custom Addon', price: 30 }
      ]
    }));
  };

  // Update Addon Row
  const handleUpdateAddon = (index, field, value) => {
    setItemForm(prev => {
      const updated = [...prev.addons];
      updated[index] = { ...updated[index], [field]: field === 'price' ? Number(value) || 0 : value };
      return { ...prev, addons: updated };
    });
  };

  // Delete Addon Row
  const handleDeleteAddon = (index) => {
    sounds.playClick();
    setItemForm(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  // Add Spice Option
  const handleAddSpiceOption = (e) => {
    e.preventDefault();
    if (!itemForm.newSpiceInput.trim()) return;
    sounds.playClick();
    setItemForm(prev => ({
      ...prev,
      spiceOptions: [...prev.spiceOptions, prev.newSpiceInput.trim()],
      newSpiceInput: ''
    }));
  };

  // Remove Spice Option
  const handleRemoveSpiceOption = (spiceToRemove) => {
    sounds.playClick();
    setItemForm(prev => ({
      ...prev,
      spiceOptions: prev.spiceOptions.filter(s => s !== spiceToRemove)
    }));
  };

  // Save Item (Create or Update)
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemForm.name.trim()) {
      alert('Please enter a dish name.');
      return;
    }

    sounds.playClick();
    const payload = {
      name: itemForm.name.trim(),
      category: itemForm.category,
      price: Number(itemForm.price) || 99,
      prepTime: itemForm.prepTime || '10-12 mins',
      diet: itemForm.diet,
      description: itemForm.description.trim() || 'Delicious handcrafted special from THC kitchen.',
      image: itemForm.image || PRESET_DISH_IMAGES[0].url,
      isBestseller: itemForm.isBestseller,
      isSpicy: itemForm.isSpicy,
      spiceOptions: itemForm.spiceOptions,
      addons: itemForm.addons.filter(a => a.name.trim() !== '')
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload);
    } else {
      addMenuItem(payload);
    }

    setIsItemModalOpen(false);
  };

  // Execute Item Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    sounds.playClick();
    deleteMenuItem(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  // Financial & Order Metrics
  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const onlineRevenue = validOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
  const cashRevenue = validOrders
    .filter(o => o.paymentStatus !== 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const totalGst = validOrders.reduce((sum, o) => sum + (o.gst || 0), 0);
  const totalTips = validOrders.reduce((sum, o) => sum + (o.tip || 0), 0);

  const newOrdersCount = orders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
  const inPrepCount = orders.filter(o => o.status === 'cooking').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const completedCount = orders.filter(o => o.status === 'served').length;
  const activeKDSCount = newOrdersCount + inPrepCount + readyCount;
  const avgTicketValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Filtered Orders for KDS Feed
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'new' && o.status !== 'placed' && o.status !== 'confirmed') return false;
    if (orderFilter === 'prep' && o.status !== 'cooking') return false;
    if (orderFilter === 'ready' && o.status !== 'ready') return false;
    if (orderFilter === 'completed' && o.status !== 'served') return false;

    if (activeStation === 'kitchen') {
      const hasKitchenItem = o.items?.some(i => !i.category || KITCHEN_CATEGORIES.includes(i.category));
      if (!hasKitchenItem) return false;
    } else if (activeStation === 'bar') {
      const hasBarItem = o.items?.some(i => i.category && BAR_CATEGORIES.includes(i.category));
      if (!hasBarItem) return false;
    }

    return true;
  });

  // Filtered Menu Items for Stock & Menu Editor
  const filteredMenuItems = menuItems.filter(item => {
    if (stockCategory !== 'all' && item.category !== stockCategory) return false;
    if (stockSearch.trim()) {
      const q = stockSearch.toLowerCase();
      return item.name.toLowerCase().includes(q) || (item.category && item.category.toLowerCase().includes(q));
    }
    return true;
  });

  const handleStatusChange = (orderId, newStatus) => {
    sounds.playClick();
    updateOrderStatus(orderId, newStatus);
  };

  const handleManualRefresh = async () => {
    sounds.playClick();
    setIsRefreshing(true);
    await syncWithDatabase();
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const handleLockAdmin = () => {
    sounds.playClick();
    adminLogout();
    onBackToClient();
  };

  // CSV Export for End-of-Day Z-Report
  const handleExportZReportCSV = () => {
    sounds.playClick();
    const headers = ["Order ID", "Table", "Customer Name", "Phone", "Dining Mode", "Payment Mode", "Payment Status", "Subtotal", "GST", "Tip", "Grand Total", "Status", "Timestamp"];
    const rows = orders.map(o => [
      `#${o.orderNumber}`,
      o.diningMode === 'table' ? `Table ${o.tableNumber || 4}` : 'Counter Pickup',
      `"${o.customerName || 'Guest'}"`,
      `"${o.customerPhone || 'N/A'}"`,
      o.diningMode,
      o.paymentGateway || o.paymentMethod || 'UPI',
      o.paymentStatus || 'unpaid',
      o.subtotal || o.total,
      o.gst || 0,
      o.tip || 0,
      o.total,
      o.status,
      `"${new Date(o.createdAt).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shift_z_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. MINIMAL & SLEEK POS & KDS HEADER */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Left: Clean Minimal Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm font-syne shadow-sm">
                {BRAND_CONFIG.logoInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-white font-syne tracking-tight leading-none">
                    {BRAND_CONFIG.brandName}
                  </h1>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">POS Live</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Kitchen Display & Terminal
                </p>
              </div>
            </div>

            {/* Center: Desktop Minimal Segmented Tabs */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
              <button
                onClick={() => { sounds.playClick(); setActiveTab('kds'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'kds'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>KDS Feed</span>
                {activeKDSCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono font-black">
                    {activeKDSCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => { sounds.playClick(); setActiveTab('floor'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'floor'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Floor Plan</span>
              </button>

              <button
                onClick={() => { sounds.playClick(); setActiveTab('inventory'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'inventory'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Menu & Addons</span>
              </button>

              <button
                onClick={() => { sounds.playClick(); setActiveTab('tables'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'tables'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Table QR</span>
              </button>

              <button
                onClick={() => { sounds.playClick(); setActiveTab('analytics'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Z-Report</span>
              </button>
            </div>

            {/* Right: Sleek Minimal Action Controls (Removed Storefront button, Redesigned Lock POS) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualRefresh}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                title="Sync & Refresh Orders"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleLockAdmin}
                className="btn-3d btn-3d-dark px-3.5 py-1.5 rounded-xl text-xs font-bold font-syne text-slate-300 hover:text-rose-400 border border-slate-700/80 transition flex items-center gap-1.5 shadow-md group"
                title="Lock Terminal & Sign Out"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
                <span>Lock POS</span>
              </button>
            </div>

          </div>

          {/* Mobile Tab Strip */}
          <div className="grid grid-cols-5 gap-1 py-2 border-t border-slate-800 lg:hidden">
            <button
              onClick={() => { sounds.playClick(); setActiveTab('kds'); }}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition flex items-center justify-center gap-1 ${
                activeTab === 'kds' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/80 text-slate-300'
              }`}
            >
              <ChefHat className="w-3 h-3" />
              <span>KDS</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setActiveTab('floor'); }}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition flex items-center justify-center gap-1 ${
                activeTab === 'floor' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/80 text-slate-300'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Floor</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setActiveTab('inventory'); }}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition flex items-center justify-center gap-1 ${
                activeTab === 'inventory' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/80 text-slate-300'
              }`}
            >
              <UtensilsCrossed className="w-3 h-3" />
              <span>Menu</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setActiveTab('tables'); }}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition flex items-center justify-center gap-1 ${
                activeTab === 'tables' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/80 text-slate-300'
              }`}
            >
              <QrCode className="w-3 h-3" />
              <span>QR</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setActiveTab('analytics'); }}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition flex items-center justify-center gap-1 ${
                activeTab === 'analytics' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/80 text-slate-300'
              }`}
            >
              <DollarSign className="w-3 h-3" />
              <span>Z-Report</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* ACTIVE TABLE SERVICE REQUESTS BANNER */}
        {serviceRequests && serviceRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-amber-400/10 border-2 border-amber-400/40 shadow-2xl space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
                <h3 className="text-sm font-black text-white font-syne uppercase tracking-wider">
                  Active Table Service Requests ({serviceRequests.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold">
                Captain Alert Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {serviceRequests.map(req => (
                <div
                  key={req.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-amber-400/30 flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-xs">
                        TABLE #{req.tableNumber}
                      </span>
                      <span className="text-xs font-bold text-white capitalize font-syne">
                        {req.type === 'water' ? 'Drinking Water' : req.type === 'waiter' ? 'Call Captain' : req.type === 'bill' ? 'Table Bill' : 'Table Cleaning'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={() => dismissServiceRequest(req.id)}
                    className="btn-3d btn-3d-emerald px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Attended</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: KITCHEN DISPLAY SYSTEM (LIVE KDS FEED) */}
        {/* ========================================================================= */}
        {activeTab === 'kds' && (
          <div className="space-y-6">
            
            {/* Top Workflow Overview Bar */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
              
              {/* Station Routing Filter */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 w-full lg:w-auto overflow-x-auto no-scrollbar">
                <button
                  onClick={() => { sounds.playClick(); setActiveStation('all'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    activeStation === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Stations</span>
                </button>

                <button
                  onClick={() => { sounds.playClick(); setActiveStation('kitchen'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    activeStation === 'kitchen'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Main Kitchen & Grill</span>
                </button>

                <button
                  onClick={() => { sounds.playClick(); setActiveStation('bar'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    activeStation === 'bar'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Beverage & Bar</span>
                </button>
              </div>

              {/* Realtime Stream Status */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Station: <strong className="text-white uppercase">{activeStation}</strong></span>
              </div>
            </div>

            {/* Filter Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Orders', count: orders.length, activeClass: 'bg-white text-slate-950' },
                { id: 'new', label: 'New Incoming', count: newOrdersCount, activeClass: 'bg-amber-400 text-slate-950 font-bold' },
                { id: 'prep', label: 'In Preparation', count: inPrepCount, activeClass: 'bg-cyan-400 text-slate-950 font-bold' },
                { id: 'ready', label: 'Ready for Service', count: readyCount, activeClass: 'bg-emerald-400 text-slate-950 font-bold' },
                { id: 'completed', label: 'Completed', count: completedCount, activeClass: 'bg-slate-700 text-white font-bold' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => { sounds.playClick(); setOrderFilter(f.id); }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    orderFilter === f.id
                      ? `${f.activeClass} border-transparent shadow-md`
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                    orderFilter === f.id ? 'bg-black/20 text-current' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* KDS Order Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-syne">No Orders in this Queue</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Incoming guest orders will automatically populate here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredOrders.map(order => {
                  const isNew = order.status === 'placed' || order.status === 'confirmed';
                  const isCooking = order.status === 'cooking';
                  const isReady = order.status === 'ready';
                  const isServed = order.status === 'served';

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative rounded-3xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                        isNew
                          ? 'bg-slate-900 border-amber-500/40 ring-1 ring-amber-500/30'
                          : isCooking
                          ? 'bg-slate-900 border-cyan-500/40 ring-1 ring-cyan-500/30'
                          : isReady
                          ? 'bg-slate-900 border-emerald-500/40 ring-1 ring-emerald-500/30'
                          : 'bg-slate-900/70 border-slate-800 opacity-80'
                      }`}
                    >
                      
                      {/* Ticket Header */}
                      <div className="p-5 pb-3 border-b border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {order.diningMode === 'table' ? (
                              <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs font-mono tracking-wider shadow-sm">
                                TABLE #{order.tableNumber || '04'}
                              </span>
                            ) : order.diningMode === 'delivery' ? (
                              <span className="px-3 py-1 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs font-mono tracking-wider shadow-sm inline-flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" />
                                <span>DELIVERY</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs font-mono tracking-wider shadow-sm">
                                {order.pickupToken || 'COUNTER PICKUP'}
                              </span>
                            )}

                            <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 font-bold">
                              #{order.orderNumber}
                            </span>
                          </div>

                          <LiveElapsedTimer createdAt={order.createdAt} />
                        </div>

                        {/* Customer Information */}
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="font-bold text-white truncate max-w-[160px] inline-flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{order.customerName || 'Guest Diner'}</span>
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            {order.customerPhone ? `+91 ${order.customerPhone}` : 'Dine-In Guest'}
                          </span>
                        </div>

                        {order.deliveryAddress && (
                          <div className="p-2 rounded-lg bg-slate-950 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono inline-flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{order.deliveryAddress}</span>
                          </div>
                        )}

                        {/* Payment Status Banner */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold">
                            {order.paymentStatus === 'paid' ? (
                              <>
                                <CreditCard className="w-4 h-4 text-emerald-400" />
                                <span>PAID ONLINE</span>
                              </>
                            ) : (
                              <>
                                <Banknote className="w-4 h-4 text-amber-400" />
                                <span>COLLECT CASH</span>
                              </>
                            )}
                          </div>
                          <span className="font-mono font-black text-white text-sm">
                            ₹{order.total}
                          </span>
                        </div>
                      </div>

                      {/* Items Checklist */}
                      <div className="p-5 flex-1 space-y-2.5">
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          Items to Prepare ({order.items?.length || 0}):
                        </div>

                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-white text-xs leading-snug">
                                  <span className="text-amber-400 text-sm font-black mr-1.5">{item.qty} ×</span>
                                  {item.name}
                                </p>
                                <span className="font-mono text-slate-300 font-bold text-xs shrink-0">
                                  ₹{item.price * item.qty}
                                </span>
                              </div>

                              {(item.spice || (item.addons && item.addons.length > 0)) && (
                                <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                                  {item.spice && (
                                    <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800 text-[10px] text-rose-300 font-semibold inline-flex items-center gap-1">
                                      <Flame className="w-3 h-3 text-rose-400" />
                                      <span>{item.spice}</span>
                                    </span>
                                  )}
                                  {item.addons?.map((addon, aIdx) => (
                                    <span
                                      key={aIdx}
                                      className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-[10px] text-amber-300 font-semibold"
                                    >
                                      + {addon.name} (+₹{addon.price})
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ticket Action Stages */}
                      <div className="p-5 pt-3 bg-slate-950/60 border-t border-slate-800 space-y-2.5">
                        {isNew && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'cooking')}
                            className="btn-3d btn-3d-amber w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 tracking-wide"
                          >
                            <Flame className="w-4 h-4 shrink-0" />
                            <span>Stage 1: Start Cooking</span>
                          </button>
                        )}

                        {isCooking && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => revertOrderStatus(order.id)}
                              className="btn-3d btn-3d-dark px-3.5 py-3 rounded-2xl text-slate-300 hover:text-amber-300 transition flex items-center justify-center shrink-0"
                              title="Undo Stage"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'ready')}
                              className="btn-3d btn-3d-cyan flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 tracking-wide"
                            >
                              <BellRing className="w-4 h-4 shrink-0" />
                              <span>Stage 2: Food is Ready</span>
                            </button>
                          </div>
                        )}

                        {isReady && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => revertOrderStatus(order.id)}
                              className="btn-3d btn-3d-dark px-3.5 py-3 rounded-2xl text-slate-300 hover:text-cyan-300 transition flex items-center justify-center shrink-0"
                              title="Undo Stage"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'served')}
                              className="btn-3d btn-3d-emerald flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 tracking-wide"
                            >
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>Stage 3: Complete Order</span>
                            </button>
                          </div>
                        )}

                        {isServed && (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Order Completed & Served</span>
                            </div>
                            <button
                              onClick={() => revertOrderStatus(order.id)}
                              className="btn-3d btn-3d-dark w-full py-2 px-3 rounded-xl text-xs font-bold text-amber-300 hover:text-white flex items-center justify-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Undo / Re-open to Ready</span>
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => { sounds.playClick(); setViewingSlip(order); }}
                            className="btn-3d btn-3d-dark flex-1 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span>Print KOT / Bill</span>
                          </button>

                          {!isServed && (
                            <button
                              onClick={() => {
                                if (confirm(`Void Order #${order.orderNumber}?`)) {
                                  handleStatusChange(order.id, 'cancelled');
                                }
                              }}
                              className="btn-3d btn-3d-dark px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 transition"
                            >
                              Void
                            </button>
                          )}
                        </div>

                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INTERACTIVE TABLE FLOOR PLAN */}
        {/* ========================================================================= */}
        {activeTab === 'floor' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-syne">Live Dining Floor Plan</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Real-time visual map of all tables, guest occupancy, active cooking orders, and service calls.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-slate-300">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="text-slate-300">Cooking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                  <span className="text-slate-300">Served</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block animate-pulse" />
                  <span className="text-rose-300">Service Call</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {BRAND_CONFIG.tables.map(t => {
                const tableOrder = orders.find(o => o.tableNumber === t.number && o.status !== 'served' && o.status !== 'cancelled');
                const hasServiceReq = serviceRequests?.some(r => r.tableNumber === t.number);

                let statusBadge = { bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300', label: 'Available' };
                if (hasServiceReq) {
                  statusBadge = { bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse', label: 'Service Alert' };
                } else if (tableOrder) {
                  if (tableOrder.status === 'cooking') {
                    statusBadge = { bg: 'bg-amber-400/20 border-amber-400/40 text-amber-300', label: 'Cooking' };
                  } else if (tableOrder.status === 'ready') {
                    statusBadge = { bg: 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300', label: 'Food Ready' };
                  } else {
                    statusBadge = { bg: 'bg-amber-400/15 border-amber-400/30 text-amber-200', label: 'New Order' };
                  }
                }

                return (
                  <div
                    key={t.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                      hasServiceReq
                        ? 'bg-slate-900 border-rose-500 ring-2 ring-rose-500/40'
                        : tableOrder
                        ? 'bg-slate-900 border-amber-400/40'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-base font-black text-white">
                          TABLE #{t.number < 10 ? `0${t.number}` : t.number}
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1.5">Capacity: {t.capacity} Guests</p>
                    </div>

                    {tableOrder ? (
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-300 font-bold">
                          <span>#{tableOrder.orderNumber}</span>
                          <span className="text-amber-400 font-mono">₹{tableOrder.total}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {tableOrder.items?.length} items ({tableOrder.items?.map(i => i.name).join(', ')})
                        </p>
                        <button
                          onClick={() => { sounds.playClick(); setViewingSlip(tableOrder); }}
                          className="w-full py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 hover:text-white font-mono mt-1"
                        >
                          View Live Slip
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-600 font-mono">
                        Ready for seating
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FULL MENU CRUD & STOCK MANAGER (Working Add, Edit, Delete, Addons & Rates) */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Header & Controls with prominent + Add Item Button */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-syne flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                  <span>Menu & Addon Rates Manager</span>
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Add new dishes, customize rates and addons, edit item descriptions, or 86 out-of-stock items in real time.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Search Box */}
                <div className="relative flex-1 md:w-60">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search menu..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                {/* 3D Add New Item Button */}
                <button
                  onClick={handleOpenAddModal}
                  className="btn-3d btn-3d-amber px-4 py-2.5 rounded-xl text-xs font-bold font-syne whitespace-nowrap flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => { sounds.playClick(); setStockCategory('all'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  stockCategory === 'all'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Dishes ({menuItems.length})
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { sounds.playClick(); setStockCategory(cat.id); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                    stockCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dishes Grid with Edit, Delete & Addon Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenuItems.map(item => {
                const isOutOfStock = menuStockOverrides[item.id];

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3.5 ${
                      isOutOfStock
                        ? 'bg-slate-950/60 border-rose-900/40 opacity-75'
                        : 'bg-slate-900 border-slate-800 shadow-md hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Thumbnail & Edit/Delete Toolbar */}
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-800 shrink-0 bg-slate-950">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full ring-1 ring-black ${
                              item.isEgg ? 'bg-amber-400' : item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate font-syne">{item.name}</p>
                          <p className="text-[11px] font-mono text-amber-400 font-bold mt-0.5">₹{item.price}</p>
                          <span className="text-[10px] text-slate-500 font-mono capitalize block">
                            {item.category?.replace('-', ' ')} • {item.prepTime || '10m'}
                          </span>
                        </div>
                      </div>

                      {/* Addons & Customization Summary */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{item.addons?.length || 0} Addon Rates</span>
                        {item.isBestseller && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 text-[9px] font-bold border border-amber-400/20">
                            POPULAR
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Bar: Edit, Delete, Stock Toggle */}
                    <div className="space-y-2 pt-1 border-t border-slate-800/60">
                      
                      {/* Edit & Delete 3D Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="btn-3d btn-3d-dark py-1.5 rounded-xl text-xs font-bold font-syne flex items-center justify-center gap-1 text-slate-300 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Edit Dish</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="btn-3d btn-3d-dark py-1.5 rounded-xl text-xs font-bold font-syne flex items-center justify-center gap-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      {/* Stock 86'd Toggle Switch */}
                      <button
                        onClick={() => {
                          sounds.playClick();
                          toggleItemStock(item.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold font-syne transition flex items-center justify-between border ${
                          isOutOfStock
                            ? 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-800 text-rose-300'
                            : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isOutOfStock ? (
                            <>
                              <X className="w-3 h-3 text-rose-400" />
                              <span>86'D / OUT OF STOCK</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>IN STOCK</span>
                            </>
                          )}
                        </span>
                        <span className="text-[10px] underline font-mono">
                          {isOutOfStock ? 'Enable' : 'Disable'}
                        </span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TABLE QR PLAQUES & PRINTING MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-syne">Table QR Plaque Generator</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Select any table to generate high-resolution QR plaques for acrylic stands and seat stickers.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="btn-3d btn-3d-amber px-5 py-2.5 rounded-xl font-bold text-xs font-syne transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Table Stickers</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3">
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Select Dining Table:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BRAND_CONFIG.tables.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { sounds.playClick(); setSelectedTableForQR(t.number); }}
                      className={`p-4 rounded-2xl border text-left transition ${
                        selectedTableForQR === t.number
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-lg scale-102'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-black">
                          T-{t.number < 10 ? `0${t.number}` : t.number}
                        </span>
                        <QrCode className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-syne font-bold mt-2">Table #{t.number < 10 ? `0${t.number}` : t.number}</p>
                      <p className="text-[10px] opacity-75 font-mono">Seats {t.capacity} Guests</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-center flex flex-col items-center">
                  <div className="w-full pb-3 border-b border-slate-800">
                    <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/20">
                      PLAQUE PREVIEW
                    </span>
                    <h3 className="text-lg font-black text-white font-syne mt-2">
                      {BRAND_CONFIG.brandName}
                    </h3>
                  </div>

                  <div className="p-5 bg-white rounded-3xl shadow-inner w-56 h-56 flex flex-col items-center justify-center border-4 border-slate-950">
                    <QrCode className="w-36 h-36 text-slate-950" />
                    <span className="font-mono text-slate-950 font-black text-xs tracking-widest mt-1">
                      TABLE #{selectedTableForQR < 10 ? `0${selectedTableForQR}` : selectedTableForQR}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-white font-bold text-xs font-syne">
                      Scan Table QR to View Menu & Order
                    </p>
                    <p className="text-slate-500 text-[10px] font-mono">
                      https://thccafe.in/table/{selectedTableForQR}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FINANCIAL ANALYTICS & SHIFT Z-REPORT */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-syne">Daily Shift & Z-Report Settlement</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Complete end-of-day financial reconciliation, taxes, and shift summary.
                </p>
              </div>

              <button
                onClick={handleExportZReportCSV}
                className="btn-3d btn-3d-amber px-4 py-2.5 rounded-xl font-bold text-xs font-syne flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Z-Report (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white font-syne">₹{totalRevenue}</p>
                <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Today's Shift Revenue
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Digital Payments</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-emerald-400 font-syne">₹{onlineRevenue}</p>
                <p className="text-[11px] text-slate-400 font-mono">UPI & Contactless</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Cash Register</span>
                  <Banknote className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-amber-300 font-syne">₹{cashRevenue}</p>
                <p className="text-[11px] text-slate-400 font-mono">Collect at Counter</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Avg Order Value</span>
                  <Award className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-white font-syne">₹{avgTicketValue}</p>
                <p className="text-[11px] text-slate-400 font-mono">{validOrders.length} Total Orders</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white font-syne">Shift Financial Reconciliation</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400 font-mono">Net Food Sales</p>
                  <p className="text-xl font-bold text-white font-mono">₹{totalRevenue - totalGst}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400 font-mono">GST / VAT (5%)</p>
                  <p className="text-xl font-bold text-cyan-300 font-mono">₹{totalGst}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400 font-mono">Staff Tip Pool</p>
                  <p className="text-xl font-bold text-amber-300 font-mono">₹{totalTips}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders Log Table */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-syne">Recent Transactions Log</h3>
                <span className="text-xs text-slate-400 font-mono">{orders.length} Recorded Orders</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Type / Seat</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {orders.slice(0, 10).map(o => (
                      <tr key={o.id} className="text-slate-300 hover:bg-slate-800/30">
                        <td className="py-3 font-bold text-white">#{o.orderNumber}</td>
                        <td className="py-3">
                          {o.diningMode === 'table' ? `Table #${o.tableNumber}` : 'Counter'}
                        </td>
                        <td className="py-3">{o.customerName || 'Guest'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-300'
                          }`}>
                            {o.paymentStatus === 'paid' ? 'UPI' : 'Cash'}
                          </span>
                        </td>
                        <td className="py-3 capitalize text-slate-300">{o.status}</td>
                        <td className="py-3 text-right font-black text-white">₹{o.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 3. WORKING ADD & EDIT MENU ITEM MODAL (With Addons & Rates) */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                    {editingItem ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-syne">
                      {editingItem ? `Edit Dish: ${editingItem.name}` : 'Add New Dish to Menu'}
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Changes publish instantly across customer storefront & digital menus.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsItemModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveItem} className="space-y-5 text-xs">
                
                {/* 1. Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-syne">Dish / Item Name *</label>
                    <input
                      type="text"
                      required
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder="e.g. Pahadi Butter Chicken Sizzler"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-syne">Menu Category *</label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400 capitalize"
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Price, Prep Time, Dietary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-syne">Base Price (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-syne">Prep Time</label>
                    <input
                      type="text"
                      value={itemForm.prepTime}
                      onChange={(e) => setItemForm({ ...itemForm, prepTime: e.target.value })}
                      placeholder="e.g. 10-12 mins"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-syne">Dietary Type</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {[
                        { id: 'veg', label: 'Veg', activeClass: 'bg-emerald-500 text-slate-950' },
                        { id: 'nonveg', label: 'Non-Veg', activeClass: 'bg-rose-500 text-white' },
                        { id: 'egg', label: 'Egg', activeClass: 'bg-amber-400 text-slate-950' }
                      ].map(d => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => { sounds.playClick(); setItemForm({ ...itemForm, diet: d.id }); }}
                          className={`py-1.5 rounded-lg text-[11px] font-bold text-center transition ${
                            itemForm.diet === d.id ? d.activeClass : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Description */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold font-syne">Dish Description</label>
                  <textarea
                    rows="2"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    placeholder="Describe ingredients, cooking style, and serving garnishes..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* 4. Dish Image URL & 1-Tap Preset Image Picker */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold font-syne flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dish Image URL or Quick Presets</span>
                    </label>
                  </div>

                  <input
                    type="url"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-[11px] placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />

                  {/* Preset Quick Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                    {PRESET_DISH_IMAGES.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { sounds.playClick(); setItemForm({ ...itemForm, image: p.url }); }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition border ${
                          itemForm.image === p.url
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Highlight Toggles (Bestseller, Spicy) */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-slate-300 font-syne flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bestseller / Popular</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={itemForm.isBestseller}
                      onChange={(e) => setItemForm({ ...itemForm, isBestseller: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-slate-300 font-syne flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>Spicy Tadka</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={itemForm.isSpicy}
                      onChange={(e) => setItemForm({ ...itemForm, isSpicy: e.target.checked })}
                      className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {/* 6. ADDONS & RATES SECTION (Comprehensive Working Addons Manager) */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white font-syne flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span>Custom Addons & Extra Rates</span>
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Addons shown on modal when customer clicks "Customize"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAddonRow}
                      className="btn-3d btn-3d-amber px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  {itemForm.addons.length === 0 ? (
                    <p className="text-center py-4 text-slate-600 text-xs italic font-mono">
                      No custom addons configured for this dish.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {itemForm.addons.map((addon, idx) => (
                        <div key={addon.id || idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={addon.name}
                            onChange={(e) => handleUpdateAddon(idx, 'name', e.target.value)}
                            placeholder="Addon name (e.g. Extra Amul Cheese)"
                            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                          />
                          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                            <span className="text-amber-400 font-mono text-xs">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={addon.price}
                              onChange={(e) => handleUpdateAddon(idx, 'price', e.target.value)}
                              className="w-16 bg-transparent text-white font-mono text-xs font-bold focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddon(idx)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-800 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Spice Level Options Manager */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <label className="text-slate-300 font-semibold font-syne block">
                    Spice Levels / Customization Options
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {itemForm.spiceOptions.map((spice, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1.5"
                      >
                        <span>{spice}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpiceOption(spice)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={itemForm.newSpiceInput}
                      onChange={(e) => setItemForm({ ...itemForm, newSpiceInput: e.target.value })}
                      placeholder="Add spice option (e.g. Extra Green Chillies)"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpiceOption}
                      className="btn-3d btn-3d-dark px-3 py-1.5 rounded-xl text-xs font-bold font-syne"
                    >
                      Add Option
                    </button>
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className="btn-3d btn-3d-dark px-4 py-2.5 rounded-xl font-bold font-syne text-xs text-slate-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-3d btn-3d-amber px-6 py-2.5 rounded-xl font-bold font-syne text-xs flex items-center gap-1.5 shadow-xl"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{editingItem ? 'Save & Update Dish' : 'Publish Dish to Live Menu'}</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SAFE DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-rose-900/60 rounded-3xl p-6 shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-syne">Delete Menu Item?</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Are you sure you want to delete <strong className="text-white">"{deleteConfirmItem.name}"</strong>? This will remove it permanently from the active customer menu.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className="btn-3d btn-3d-dark py-2.5 rounded-xl font-bold font-syne text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn-3d btn-3d-rose py-2.5 rounded-xl font-bold font-syne text-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. THERMAL KITCHEN KOT / RECEIPT MODAL */}
      <AnimatePresence>
        {viewingSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white text-slate-950 rounded-3xl p-6 shadow-2xl font-mono text-xs overflow-hidden"
            >
              <button
                onClick={() => setViewingSlip(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pb-3 border-b-2 border-dashed border-slate-300 space-y-1">
                <h3 className="text-base font-black tracking-tight uppercase">
                  {BRAND_CONFIG.brandName}
                </h3>
                <p className="text-[10px] text-slate-600">
                  {BRAND_CONFIG.contact.fullAddress}
                </p>
                <div className="pt-1 text-[11px] font-bold">
                  {viewingSlip.diningMode === 'table'
                    ? `TABLE #${viewingSlip.tableNumber || '04'}`
                    : 'COUNTER PICKUP'}
                </div>
                <p className="text-[10px] text-slate-500">
                  Ticket #{viewingSlip.orderNumber} • {new Date(viewingSlip.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Items */}
              <div className="py-3 border-b-2 border-dashed border-slate-300 space-y-2">
                {viewingSlip.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">
                        {item.qty} × {item.name}
                      </p>
                      {item.spice && <p className="text-[10px] text-slate-600">Spice: {item.spice}</p>}
                    </div>
                    <span className="font-bold">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Total Breakdown */}
              <div className="py-2.5 border-b-2 border-dashed border-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-bold uppercase">{viewingSlip.paymentStatus === 'paid' ? 'PAID ONLINE' : 'CASH DUE'}</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1">
                  <span>TOTAL BILL:</span>
                  <span>₹{viewingSlip.total}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
                <button
                  onClick={() => setViewingSlip(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
