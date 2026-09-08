import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Lock, 
  TrendingUp, 
  RefreshCw, 
  Flame, 
  Check, 
  X, 
  CreditCard, 
  Banknote, 
  RotateCcw, 
  Coffee, 
  Download, 
  LayoutGrid, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Tag, 
  Truck, 
  MapPin,
  User,
  Award,
  Upload,
  Copy,
  ExternalLink,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES } from '../../data/menuData';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';
import { generateQRCodeDataUrl, getTableOrderUrl } from '../../utils/qrCode';

// Station Category Mappings
const KITCHEN_CATEGORIES = ['woodfired-pizza', 'pastas-mains', 'paninis-burgers', 'appetizers-sides', 'desserts', 'italian-specials', 'burgers', 'sides'];
const BAR_CATEGORIES = ['coffee-brews', 'shakes-coolers', 'drinks', 'cold-beverages', 'chai-coffee'];

// Preset Food Images for fast addition (all verified closeup food photography)
const PRESET_DISH_IMAGES = [
  { label: 'Butter Chicken Roll', url: '/images/butter_chicken_kathi_roll.jpg' },
  { label: 'Paneer Tikka Roll', url: '/images/paneer_tikka_kathi_roll.jpg' },
  { label: 'Charcoal Murgh Tikka', url: '/images/charcoal_murgh_tikka.jpg' },
  { label: 'Cheesy Garlic Focaccia', url: '/images/cheesy_garlic_focaccia.jpg' },
  { label: 'Smash Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Artisan Penne Pasta', url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Truffle Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80' },
  { label: 'Specialty Chai & Coffee', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Shake & Chiller', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' },
  { label: 'Decadent Tiramisu', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80' }
];

// Live Elapsed Stopwatch Timer Component
function LiveElapsedTimer({ createdAt }) {
  const [elapsed, setElapsed] = useState({ hours: 0, mins: 0, secs: 0, totalMins: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
      const totalMins = Math.floor(diff / 60);
      const hours = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      const secs = diff % 60;
      setElapsed({ hours, mins, secs, totalMins });
    };

    calc();
    const interval = setInterval(calc, 5000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const { hours, mins, secs, totalMins } = elapsed;
  const isUrgent = totalMins >= 15;
  const isWarning = totalMins >= 8 && totalMins < 15;

  let displayTime = '';
  if (hours >= 24) {
    displayTime = `${Math.floor(hours / 24)}d ${hours % 24}h`;
  } else if (hours > 0) {
    displayTime = `${hours}h ${mins}m`;
  } else {
    displayTime = `${mins}m ${secs < 10 ? `0${secs}` : secs}s`;
  }

  return (
    <div
      className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-number font-bold flex items-center gap-1 transition-colors ${
        isUrgent
          ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse'
          : isWarning
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
          : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
      }`}
      title={`Order placed ${totalMins}m ago`}
    >
      <Clock className="w-3 h-3" />
      <span>{displayTime}</span>
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
    collectPaymentAndStartCooking,
    revertOrderStatus,
    menuStockOverrides, 
    toggleItemStock,
    serviceRequests,
    dismissServiceRequest,
    syncWithDatabase,
    tables = [],
    setTableCount,
    addTable,
    removeTable,
    resetTablesToDefault,
    vacateTable,
    getTableOccupancy
  } = useOrder();

  const { adminLogout } = useAuth();
  const { isLight } = useTheme();

  // Active Main Tab: 'kds' | 'floor' | 'inventory' | 'tables' | 'analytics'
  const [activeTab, setActiveTab] = useState('kds');
  
  // KDS Station Filter: 'all' | 'kitchen' | 'bar'
  const [activeStation, setActiveStation] = useState('all');

  // KDS Order Status Filter: 'all' | 'new' | 'prep' | 'ready' | 'completed'
  const [orderFilter, setOrderFilter] = useState('all');
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategory, setStockCategory] = useState('all');
  const [selectedTableForQR, setSelectedTableForQR] = useState(1);
  const [tableQrDataUrl, setTableQrDataUrl] = useState('');
  const [isGeneratingTableQR, setIsGeneratingTableQR] = useState(false);
  const [copiedTableUrl, setCopiedTableUrl] = useState(false);
  const [viewingSlip, setViewingSlip] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live 3-Second Table Service Alarm State
  const [activeAlarmNotification, setActiveAlarmNotification] = useState(null);
  const [alarmCountdown, setAlarmCountdown] = useState(3);
  const alarmTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const autoDismissBannerRef = useRef(null);

  // Menu Item Modal State (Add / Edit)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  // Form State for Add / Edit Item
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'woodfired-pizza',
    price: 199,
    prepTime: '10-12 mins',
    diet: 'veg',
    description: '',
    image: PRESET_DISH_IMAGES[0].url,
    isBestseller: false,
    isSpicy: false,
    spiceOptions: ['Mild', 'Medium', 'Spicy'],
    newSpiceInput: '',
    addons: [
      { id: 'addon-1', name: 'Extra Mozzarella', price: 45 },
      { id: 'addon-2', name: 'Garlic Herb Glaze', price: 25 }
    ]
  });

  const dishFileInputRef = useRef(null);
  const [isDraggingDishImage, setIsDraggingDishImage] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState(null); // 'uploading' | 'success' | 'error'

  // Process and resize user-uploaded image for lightning performance and lightweight storage
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    
    setImageUploadStatus('uploading');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High-definition aspect ratio preserved with max 1200px limit
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to high-fidelity JPEG data URL
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setItemForm(prev => ({ ...prev, image: optimizedDataUrl }));
        setImageUploadStatus('success');
        sounds.playClick();
        setTimeout(() => setImageUploadStatus(null), 3000);
      };
      img.onerror = () => {
        setImageUploadStatus('error');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDishImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDishImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDishImage(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

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

  const handleUpdateAddon = (index, field, value) => {
    setItemForm(prev => {
      const updated = [...prev.addons];
      updated[index] = { ...updated[index], [field]: field === 'price' ? Number(value) || 0 : value };
      return { ...prev, addons: updated };
    });
  };

  const handleDeleteAddon = (index) => {
    sounds.playClick();
    setItemForm(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

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

  const handleRemoveSpiceOption = (spiceToRemove) => {
    sounds.playClick();
    setItemForm(prev => ({
      ...prev,
      spiceOptions: prev.spiceOptions.filter(s => s !== spiceToRemove)
    }));
  };

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
      description: itemForm.description.trim() || 'Handcrafted specialty from our kitchen atelier.',
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

  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    sounds.playClick();
    deleteMenuItem(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  // Live QR Code Generation for Admin Stand Preview
  const currentTableOrderUrl = getTableOrderUrl(selectedTableForQR);

  useEffect(() => {
    let active = true;
    setIsGeneratingTableQR(true);
    generateQRCodeDataUrl(currentTableOrderUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#12100E',
        light: '#FFFFFF'
      }
    })
      .then((url) => {
        if (active) setTableQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate table QR:', err);
      })
      .finally(() => {
        if (active) setIsGeneratingTableQR(false);
      });

    return () => {
      active = false;
    };
  }, [selectedTableForQR, currentTableOrderUrl]);

  const handleDownloadTableQR = () => {
    sounds.playClick();
    if (!tableQrDataUrl) return;
    const a = document.createElement('a');
    a.href = tableQrDataUrl;
    a.download = `THC-Cafe-Table-${selectedTableForQR < 10 ? `0${selectedTableForQR}` : selectedTableForQR}-QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyTableUrl = () => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentTableOrderUrl);
    }
    setCopiedTableUrl(true);
    setTimeout(() => setCopiedTableUrl(false), 2000);
  };

  const handlePrintSinglePlaque = () => {
    sounds.playClick();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Table ${selectedTableForQR} Standee - ${BRAND_CONFIG.brandName}</title>
          <style>
            @page { size: A5 portrait; margin: 10mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 90vh;
              background: #fff;
              color: #12100E;
              margin: 0;
              padding: 20px;
            }
            .standee {
              width: 320px;
              padding: 32px 24px;
              border: 3px solid #12100E;
              border-radius: 28px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.06);
            }
            .tag {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #D04834;
              margin-bottom: 8px;
            }
            .title {
              font-size: 26px;
              font-weight: 800;
              margin: 0 0 4px 0;
              color: #12100E;
            }
            .subtitle {
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }
            .table-badge {
              display: inline-block;
              background: #12100E;
              color: #fff;
              padding: 7px 22px;
              border-radius: 999px;
              font-size: 15px;
              font-weight: 800;
              letter-spacing: 1.5px;
              margin-bottom: 16px;
            }
            .qr-box {
              background: #fff;
              padding: 12px;
              border-radius: 20px;
              border: 2px solid #12100E;
              display: inline-block;
              margin-bottom: 16px;
            }
            .qr-box img {
              width: 200px;
              height: 200px;
              display: block;
            }
            .instruct {
              font-size: 13px;
              font-weight: 700;
              color: #12100E;
              margin-bottom: 4px;
            }
            .url {
              font-size: 10px;
              color: #777;
              word-break: break-all;
              font-family: monospace;
            }
            .wifi-box {
              margin-top: 20px;
              padding-top: 14px;
              border-top: 1px dashed #ccc;
              font-size: 11px;
              color: #444;
            }
          </style>
        </head>
        <body>
          <div class="standee">
            <div class="tag">ORDER FROM TABLE</div>
            <h1 class="title">${BRAND_CONFIG.brandName}</h1>
            <div class="subtitle">Artisanal Highway Cafe & Kitchen</div>
            <div class="table-badge">TABLE ${selectedTableForQR < 10 ? `0${selectedTableForQR}` : selectedTableForQR}</div>
            <div class="qr-box">
              <img src="${tableQrDataUrl}" alt="Table ${selectedTableForQR} QR" />
            </div>
            <div class="instruct">Scan QR to View Menu &amp; Order</div>
            <div class="url">${currentTableOrderUrl}</div>
            <div class="wifi-box">
              📶 <strong>Cafe WiFi:</strong> THC-HighSpeed &bull; <strong>Pass:</strong> highwaycafe
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleBatchPrintAllTables = async () => {
    sounds.playClick();
    const tableList = tables && tables.length > 0 ? tables : (BRAND_CONFIG.tables || []);
    const qrPromises = tableList.map(async (t) => {
      const url = getTableOrderUrl(t.number);
      const dataUrl = await generateQRCodeDataUrl(url, { width: 220, margin: 1 });
      return { ...t, qr: dataUrl, url };
    });

    const allQrs = await Promise.all(qrPromises);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const itemsHtml = allQrs.map((t) => `
      <div class="card">
        <div class="tag">THC CAFE &bull; STAND</div>
        <div class="table-label">TABLE #${t.number < 10 ? `0${t.number}` : t.number}</div>
        <div class="qr-wrap"><img src="${t.qr}" /></div>
        <div class="help">Point camera to order directly</div>
        <div class="subhelp">${t.capacity} Guests &bull; THC-HighSpeed WiFi</div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>All 12 Table Standees - ${BRAND_CONFIG.brandName}</title>
          <style>
            @page { size: A4 portrait; margin: 8mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 10px; color: #12100E; }
            h2 { text-align: center; margin: 0 0 12px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            .card { border: 2px solid #12100E; border-radius: 14px; padding: 12px 8px; text-align: center; page-break-inside: avoid; }
            .tag { font-size: 8px; font-weight: 800; letter-spacing: 1.5px; color: #D04834; }
            .table-label { font-size: 14px; font-weight: 900; margin: 4px 0 6px 0; letter-spacing: 1px; }
            .qr-wrap img { width: 140px; height: 140px; display: block; margin: 0 auto; border-radius: 6px; }
            .help { font-size: 10px; font-weight: 700; color: #12100E; margin-top: 6px; }
            .subhelp { font-size: 8px; color: #666; margin-top: 2px; }
          </style>
        </head>
        <body>
          <h2>${BRAND_CONFIG.brandName} &mdash; Official Table Standees (Cut & Place on Tables)</h2>
          <div class="grid">${itemsHtml}</div>
          <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 400); };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Trigger 3-Second Cinematic Alarm for Table Requests
  const triggerTableAlarm = useCallback((serviceReq) => {
    sounds.playCinematicTableAlarm();
    setActiveAlarmNotification(serviceReq);
    setAlarmCountdown(3);

    if (alarmTimerRef.current) clearTimeout(alarmTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (autoDismissBannerRef.current) clearTimeout(autoDismissBannerRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setAlarmCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Stop acoustic sound at exactly 3.0 seconds
    alarmTimerRef.current = setTimeout(() => {
      sounds.stopCinematicTableAlarm();
    }, 3000);

    // Auto-dismiss visual HUD banner after 10 seconds if unattended
    autoDismissBannerRef.current = setTimeout(() => {
      setActiveAlarmNotification(null);
    }, 10000);
  }, []);

  const handleDismissActiveAlarm = useCallback((attend = false) => {
    if (alarmTimerRef.current) clearTimeout(alarmTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (autoDismissBannerRef.current) clearTimeout(autoDismissBannerRef.current);
    sounds.stopCinematicTableAlarm();
    if (attend && activeAlarmNotification?.id) {
      dismissServiceRequest(activeAlarmNotification.id);
    }
    setActiveAlarmNotification(null);
  }, [activeAlarmNotification, dismissServiceRequest]);

  useEffect(() => {
    const handleAlarmEvent = (e) => {
      if (e.detail) {
        triggerTableAlarm(e.detail);
      }
    };
    window.addEventListener('thc_table_service_alarm', handleAlarmEvent);
    return () => {
      window.removeEventListener('thc_table_service_alarm', handleAlarmEvent);
      if (alarmTimerRef.current) clearTimeout(alarmTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (autoDismissBannerRef.current) clearTimeout(autoDismissBannerRef.current);
    };
  }, [triggerTableAlarm]);

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

  // Filtered Menu Items
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
    <div className={`min-h-screen pb-24 font-sans transition-colors duration-300 ${
      isLight 
        ? 'bg-[#FAF7F2] text-[#12100E]' 
        : 'bg-[#12100E] text-[#FAF7F2]'
    }`}>
      
      {/* 1. MILAN CULINARY ATELIER TERMINAL HEADER */}
      <header className={`backdrop-blur-xl sticky top-0 z-30 shadow-sm border-b transition-colors ${
        isLight 
          ? 'bg-white/85 border-[#E8E2D5]' 
          : 'bg-[#0E0C0B]/90 border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Left: Atelier Brand Identity */}
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                isLight ? 'bg-[#12100E] text-white' : 'bg-white text-black'
              }`}>
                {BRAND_CONFIG.logoInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-editorial tracking-tight font-normal leading-none">
                    {BRAND_CONFIG.brandName}
                  </h1>
                  <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono border ${
                    isLight 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Atelier Terminal</span>
                  </span>
                </div>
                <p className={`text-[10px] font-mono tracking-wider uppercase mt-0.5 ${
                  isLight ? 'text-stone-500' : 'text-stone-400'
                }`}>
                  Kitchen Display &amp; Order Matrix
                </p>
              </div>
            </div>

            {/* Center: Segmented Navigation Pills */}
            <div className={`hidden lg:flex items-center gap-1 p-1 rounded-2xl border shadow-inner ${
              isLight 
                ? 'bg-stone-100/80 border-stone-200' 
                : 'bg-[#1C1917] border-white/10'
            }`}>
              {[
                { id: 'kds', label: 'KDS Feed', icon: ChefHat, badge: activeKDSCount },
                { id: 'floor', label: 'Floor Plan', icon: LayoutGrid },
                { id: 'inventory', label: 'Menu & Addons', icon: UtensilsCrossed },
                { id: 'tables', label: 'Table QR', icon: QrCode },
                { id: 'analytics', label: 'Z-Report', icon: DollarSign }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-syne font-bold transition flex items-center gap-1.5 ${
                      isActive
                        ? isLight
                          ? 'bg-[#12100E] text-[#FAF7F2] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#12100E] shadow-sm'
                        : isLight
                        ? 'text-stone-600 hover:text-black'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#D04834] text-white text-[10px] font-mono font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Quick Controls & Lock */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualRefresh}
                className={`p-2 rounded-xl border transition ${
                  isLight 
                    ? 'bg-white border-stone-200 text-stone-600 hover:text-black hover:bg-stone-50' 
                    : 'bg-[#1C1917] border-white/10 text-stone-400 hover:text-white'
                }`}
                title="Sync & Refresh Orders"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D04834]' : ''}`} />
              </button>

              <button
                onClick={handleLockAdmin}
                className={`px-3 py-1.5 rounded-xl text-xs font-syne font-bold border transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  isLight 
                    ? 'bg-white border-stone-200 text-stone-700 hover:text-[#D04834] hover:border-stone-300' 
                    : 'bg-[#1C1917] border-white/10 text-stone-300 hover:text-rose-400'
                }`}
                title="Lock Terminal & Return"
              >
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Lock POS</span>
              </button>
            </div>

          </div>

          {/* Mobile Navigation Strip */}
          <div className={`grid grid-cols-5 gap-1 py-2 border-t lg:hidden ${
            isLight ? 'border-stone-200' : 'border-white/10'
          }`}>
            {[
              { id: 'kds', label: 'KDS', icon: ChefHat },
              { id: 'floor', label: 'Floor', icon: LayoutGrid },
              { id: 'inventory', label: 'Menu', icon: UtensilsCrossed },
              { id: 'tables', label: 'QR', icon: QrCode },
              { id: 'analytics', label: 'Z-Report', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-syne font-bold text-center transition flex items-center justify-center gap-1 ${
                    isActive
                      ? isLight ? 'bg-[#12100E] text-white' : 'bg-white text-black'
                      : isLight ? 'bg-stone-100 text-stone-600' : 'bg-[#1C1917] text-stone-400'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* FLOATING 3-SECOND CINEMATIC TABLE ALARM HUD BANNER */}
      <AnimatePresence>
        {activeAlarmNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed top-3 sm:top-5 inset-x-0 mx-auto z-50 w-[94%] max-w-2xl px-2 pointer-events-auto"
          >
            <div className={`relative overflow-hidden rounded-3xl border-2 p-4 sm:p-5 backdrop-blur-2xl shadow-2xl transition-all ${
              isLight
                ? 'bg-white/95 border-amber-400/90 text-stone-900 shadow-amber-500/20'
                : 'bg-[#1C1814]/95 border-[#E8E439]/60 text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(232,228,57,0.2)]'
            }`}>
              {/* Animated Top Progress Line for 3-Second Alarm */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-black/10 dark:bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${Math.max(0, (alarmCountdown / 3) * 100)}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-[#D04834] via-amber-400 to-[#E8E439]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-0.5">
                {/* Left Info: Table Badge & Service Details */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    activeAlarmNotification.type === 'water'
                      ? 'bg-sky-500/20 text-sky-500 border border-sky-500/40'
                      : 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                  }`}>
                    {activeAlarmNotification.type === 'water' ? (
                      <Droplets className="w-6 h-6 animate-pulse" />
                    ) : (
                      <BellRing className="w-6 h-6 animate-bounce" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#D04834] text-white font-mono font-black text-xs tracking-wider shadow-xs uppercase">
                        TABLE #{activeAlarmNotification.tableNumber}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#D04834] font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#D04834] animate-ping" />
                        Live Service Call
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-syne font-black tracking-tight mt-0.5">
                      {activeAlarmNotification.type === 'water'
                        ? 'Drinking Water Refill Requested'
                        : 'Captain / Waiter Assistance Requested'}
                    </h4>

                    {/* Alarm Acoustic Status & Visualizer */}
                    <div className="flex items-center gap-2 mt-1">
                      {alarmCountdown > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 h-3.5">
                            <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.35s_ease-in-out_infinite] h-3" />
                            <span className="w-1 bg-[#D04834] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3.5" />
                            <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2.5" />
                            <span className="w-1 bg-[#E8E439] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4" />
                          </div>
                          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-300">
                            Cinematic Alarm Ringing ({alarmCountdown}s)
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                          Chime Complete • Table waiting for server
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleDismissActiveAlarm(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-syne font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Attend Table #{activeAlarmNotification.tableNumber}</span>
                  </button>

                  <button
                    onClick={() => handleDismissActiveAlarm(false)}
                    className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                      isLight 
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-300' 
                        : 'bg-white/10 hover:bg-white/15 text-stone-300 border-white/10'
                    }`}
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN DASHBOARD CANVAS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* ACTIVE TABLE SERVICE REQUESTS BANNER */}
        {serviceRequests && serviceRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-3xl border shadow-lg space-y-2.5 ${
              isLight 
                ? 'bg-amber-50 border-amber-200 text-stone-800' 
                : 'bg-amber-950/20 border-amber-500/30 text-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#D04834] animate-bounce" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
                  Active Table Requests ({serviceRequests.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#D04834] uppercase tracking-widest font-bold">
                Attention Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {serviceRequests.map(req => (
                <div
                  key={req.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
                    isLight 
                      ? 'bg-white border-stone-200' 
                      : 'bg-[#1C1917] border-white/10'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        isLight ? 'bg-[#12100E] text-white' : 'bg-white text-black'
                      }`}>
                        TABLE #{req.tableNumber}
                      </span>
                      <span className="text-xs font-syne font-bold capitalize">
                        {req.type === 'water' ? 'Drinking Water' : 'Call Waiter'}
                      </span>
                    </div>
                    <p className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                      {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={() => dismissServiceRequest(req.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-syne font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shrink-0 cursor-pointer"
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
            
            {/* Station Routing & Status Bar */}
            <div className={`p-4 rounded-3xl border flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm transition-colors ${
              isLight 
                ? 'bg-white border-[#E8E2D5]' 
                : 'bg-[#1C1917] border-white/10'
            }`}>
              
              {/* Station Routing Selector */}
              <div className={`flex items-center gap-1.5 p-1 rounded-2xl border w-full lg:w-auto overflow-x-auto no-scrollbar ${
                isLight ? 'bg-stone-100 border-stone-200' : 'bg-[#0E0C0B] border-white/5'
              }`}>
                {[
                  { id: 'all', label: 'All Stations', icon: Layers },
                  { id: 'kitchen', label: 'Kitchen & Oven', icon: Flame },
                  { id: 'bar', label: 'Bar & Coffee', icon: Coffee }
                ].map(st => {
                  const Icon = st.icon;
                  const isActive = activeStation === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => { sounds.playClick(); setActiveStation(st.id); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-syne font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                        isActive
                          ? isLight
                            ? 'bg-[#12100E] text-white shadow-xs'
                            : 'bg-white text-black shadow-xs'
                          : isLight
                          ? 'text-stone-600 hover:text-black'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Realtime Stream Info */}
              <div className={`flex items-center gap-2 text-xs font-mono ${
                isLight ? 'text-stone-600' : 'text-stone-400'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Routing: <strong className="uppercase font-bold">{activeStation}</strong></span>
              </div>
            </div>

            {/* Filter Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'new', label: 'New Incoming', count: newOrdersCount },
                { id: 'prep', label: 'In Preparation', count: inPrepCount },
                { id: 'ready', label: 'Ready for Service', count: readyCount },
                { id: 'completed', label: 'Completed', count: completedCount }
              ].map(f => {
                const isSelected = orderFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => { sounds.playClick(); setOrderFilter(f.id); }}
                    className={`px-4 py-2 rounded-xl text-xs font-syne font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                      isSelected
                        ? isLight
                          ? 'bg-[#12100E] text-[#FAF7F2] border-[#12100E] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#12100E] border-[#FAF7F2] shadow-sm'
                        : isLight
                        ? 'bg-white border-[#E8E2D5] text-stone-600 hover:text-black'
                        : 'bg-[#1C1917] border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isSelected 
                        ? isLight ? 'bg-white/20 text-white' : 'bg-black/20 text-black' 
                        : isLight ? 'bg-stone-100 text-stone-700' : 'bg-white/10 text-stone-300'
                    }`}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* KDS Order Slips Grid */}
            {filteredOrders.length === 0 ? (
              <div className={`text-center py-20 rounded-3xl border space-y-3 ${
                isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                  isLight ? 'bg-stone-100 text-stone-400' : 'bg-white/5 text-stone-500'
                }`}>
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-editorial tracking-tight font-normal">No orders in this queue</h3>
                <p className={`text-xs max-w-sm mx-auto leading-relaxed ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Incoming customer slips will automatically populate this kitchen station in real time.
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
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative rounded-3xl border flex flex-col justify-between overflow-hidden shadow-md transition-all ${
                        isLight 
                          ? 'bg-white border-[#E8E2D5]' 
                          : 'bg-[#1C1917] border-white/10'
                      }`}
                    >
                      
                      {/* Physical Slip Top Perforation Accents */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#D04834] to-transparent opacity-70" />

                      {/* Ticket Header */}
                      <div className={`p-5 pb-3 border-b space-y-3 ${
                        isLight ? 'border-stone-200' : 'border-white/10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {order.diningMode === 'table' ? (
                              <span className={`px-3 py-1 rounded-xl font-mono font-bold text-xs tracking-wider shadow-xs ${
                                isLight ? 'bg-[#12100E] text-white' : 'bg-white text-black'
                              }`}>
                                TABLE #{order.tableNumber || '04'}
                              </span>
                            ) : order.diningMode === 'delivery' ? (
                              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs tracking-wider shadow-xs inline-flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" />
                                <span>DELIVERY</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-xl bg-[#D04834] text-white font-mono font-bold text-xs tracking-wider shadow-xs">
                                {order.pickupToken || 'COUNTER PICKUP'}
                              </span>
                            )}

                            <span className={`px-2 py-1 rounded-lg border text-[11px] font-number font-bold ${
                              isLight ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-[#0E0C0B] border-white/10 text-stone-300'
                            }`}>
                              #{order.orderNumber}
                            </span>
                          </div>

                          <LiveElapsedTimer createdAt={order.createdAt} />
                        </div>

                        {/* Customer Information */}
                        <div className={`flex items-center justify-between text-xs ${
                          isLight ? 'text-stone-600' : 'text-stone-300'
                        }`}>
                          <span className="font-bold truncate max-w-[160px] inline-flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            <span>{order.customerName || 'Table Guest'}</span>
                          </span>
                          <span className="font-mono text-[11px]">
                            {order.customerPhone ? `+91 ${order.customerPhone}` : 'Dine-In Guest'}
                          </span>
                        </div>

                        {order.deliveryAddress && (
                          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 font-mono inline-flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="truncate">{order.deliveryAddress}</span>
                          </div>
                        )}

                        {/* Payment Status Banner */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-500/15 border-amber-500/35 text-amber-900 dark:text-amber-200'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold font-mono">
                            {order.paymentStatus === 'paid' ? (
                              <>
                                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>PAID ONLINE (UPI)</span>
                              </>
                            ) : (
                              <>
                                <Banknote className="w-4 h-4 text-[#D04834]" />
                                <span className="text-[#D04834]">DUE AT COUNTER • HOLD COOKING</span>
                              </>
                            )}
                          </div>
                          <span className="font-number font-bold text-sm text-[#D04834]">
                            ₹{order.total}
                          </span>
                        </div>
                      </div>

                      {/* Items to Prepare Checklist */}
                      <div className="p-5 flex-1 space-y-2.5">
                        <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                          isLight ? 'text-stone-500' : 'text-stone-400'
                        }`}>
                          Items to Prepare ({order.items?.length || 0}):
                        </div>

                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-2xl border space-y-1.5 ${
                                isLight 
                                  ? 'bg-stone-50/70 border-stone-200' 
                                  : 'bg-[#0E0C0B] border-white/5'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-xs leading-snug">
                                  <span className="text-[#D04834] text-sm font-number font-bold mr-1.5">
                                    {item.qty} ×
                                  </span>
                                  {item.name}
                                </p>
                                <span className="font-number font-bold text-xs shrink-0">
                                  ₹{item.price * item.qty}
                                </span>
                              </div>

                              {(item.spice || (item.addons && item.addons.length > 0)) && (
                                <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                                  {item.spice && (
                                    <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-700 dark:text-rose-300 font-mono inline-flex items-center gap-1">
                                      <Flame className="w-3 h-3 text-[#D04834]" />
                                      <span>{item.spice}</span>
                                    </span>
                                  )}
                                  {item.addons?.map((addon, aIdx) => (
                                    <span
                                      key={aIdx}
                                      className="px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-white/10 text-[10px] font-mono"
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

                      {/* Ticket Progression Action Stage Buttons */}
                      <div className={`p-5 pt-3 border-t space-y-2.5 ${
                        isLight ? 'bg-stone-50/50 border-stone-200' : 'bg-[#0E0C0B]/60 border-white/10'
                      }`}>
                        {order.paymentStatus !== 'paid' ? (
                          <div className="space-y-2.5">
                            <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                              isLight 
                                ? 'bg-amber-500/15 border-amber-500/35 text-amber-950' 
                                : 'bg-amber-500/15 border-amber-500/25 text-amber-200'
                            }`}>
                              <AlertTriangle className="w-4 h-4 text-[#D04834] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-rose-600 dark:text-rose-400">
                                  ⚠️ Preparation On Hold — Awaiting Counter Payment
                                </p>
                                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                                  Policy: Food is NOT to be cooked until guest settles ₹{order.total} at the counter. Tap below once payment is received to fire ticket to kitchen.
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => collectPaymentAndStartCooking(order.id)}
                              className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-syne font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                            >
                              <Banknote className="w-4 h-4 shrink-0 text-amber-200" />
                              <span>💰 Collect ₹{order.total} &amp; Start Cooking</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            {isNew && (
                              <button
                                onClick={() => handleStatusChange(order.id, 'cooking')}
                                className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-syne font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                                  isLight 
                                    ? 'bg-[#12100E] text-white hover:bg-stone-800' 
                                    : 'bg-white text-black hover:bg-stone-200'
                                }`}
                              >
                                <Flame className="w-4 h-4 shrink-0 text-[#D04834]" />
                                <span>Stage 1: Start Cooking</span>
                              </button>
                            )}

                            {isCooking && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => revertOrderStatus(order.id)}
                                  className={`p-3 rounded-2xl border transition flex items-center justify-center shrink-0 cursor-pointer ${
                                    isLight 
                                      ? 'bg-white border-stone-200 text-stone-600 hover:text-black' 
                                      : 'bg-[#1C1917] border-white/10 text-stone-300 hover:text-white'
                                  }`}
                                  title="Revert Stage"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order.id, 'ready')}
                                  className="flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-syne font-bold bg-[#D04834] hover:bg-[#b83d2b] text-white flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                                >
                                  <BellRing className="w-4 h-4 shrink-0" />
                                  <span>Stage 2: Food Ready for Service</span>
                                </button>
                              </div>
                            )}

                            {isReady && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => revertOrderStatus(order.id)}
                                  className={`p-3 rounded-2xl border transition flex items-center justify-center shrink-0 cursor-pointer ${
                                    isLight 
                                      ? 'bg-white border-stone-200 text-stone-600 hover:text-black' 
                                      : 'bg-[#1C1917] border-white/10 text-stone-300 hover:text-white'
                                  }`}
                                  title="Revert Stage"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order.id, 'served')}
                                  className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-syne font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                                    isLight 
                                      ? 'bg-[#12100E] text-white hover:bg-stone-800' 
                                      : 'bg-white text-black hover:bg-stone-200'
                                  }`}
                                >
                                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                                  <span>Stage 3: Order Served</span>
                                </button>
                              </div>
                            )}

                            {isServed && (
                              <div className="space-y-2">
                                <div className={`p-2.5 rounded-xl border text-center text-xs font-mono font-bold flex items-center justify-center gap-1.5 ${
                                  isLight 
                                    ? 'bg-stone-100 border-stone-200 text-stone-700' 
                                    : 'bg-[#1C1917] border-white/10 text-stone-300'
                                }`}>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  <span>Order Completed &amp; Served</span>
                                </div>
                                <button
                                  onClick={() => revertOrderStatus(order.id)}
                                  className={`w-full py-2 px-3 rounded-xl border text-xs font-mono transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isLight 
                                      ? 'bg-white border-stone-200 text-stone-600 hover:text-black' 
                                      : 'bg-[#1C1917] border-white/10 text-stone-300 hover:text-white'
                                  }`}
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-[#D04834]" />
                                  <span>Reopen Order as Ready</span>
                                </button>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => { sounds.playClick(); setViewingSlip(order); }}
                            className={`flex-1 py-2 rounded-xl border text-xs font-syne font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                              isLight 
                                ? 'bg-white border-stone-200 text-stone-700 hover:text-black hover:bg-stone-100' 
                                : 'bg-[#1C1917] border-white/10 text-stone-300 hover:text-white'
                            }`}
                          >
                            <Printer className="w-3.5 h-3.5 text-[#D04834]" />
                            <span>Print Order Slip / Receipt</span>
                          </button>

                          {!isServed && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel order #${order.orderNumber}?`)) {
                                  handleStatusChange(order.id, 'cancelled');
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl text-xs font-mono text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                            >
                              Cancel
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
        {/* ========================================================================= */}
        {/* TAB 2: INTERACTIVE TABLE FLOOR PLAN & CAPACITY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'floor' && (() => {
          const activeTablesList = tables && tables.length > 0 ? tables : BRAND_CONFIG.tables;
          const tableOccupancyMap = activeTablesList.map(t => {
            const occ = getTableOccupancy ? getTableOccupancy(t.number) : { isBusy: false, status: 'vacant' };
            const hasServiceReq = serviceRequests?.some(r => r.tableNumber === t.number);
            return { table: t, occ, hasServiceReq };
          });

          const totalTablesCount = activeTablesList.length;
          const busyTablesCount = tableOccupancyMap.filter(item => item.occ.isBusy || item.hasServiceReq).length;
          const vacantTablesCount = totalTablesCount - busyTablesCount;

          return (
            <div className="space-y-6">
              {/* Floor Plan Header & Legend */}
              <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
                isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
              }`}>
                <div>
                  <h2 className="text-2xl font-editorial tracking-tight font-normal">Floor Plan &amp; Table Management</h2>
                  <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Real-time guest occupancy, 30-min served dining turnover, and staff table capacity controls.
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Vacant ({vacantTablesCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D04834] inline-block" />
                    <span>Occupied ({busyTablesCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                    <span>Served (30m Dining)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D04834] inline-block animate-pulse" />
                    <span>Table Call</span>
                  </div>
                </div>
              </div>

              {/* Staff Table Capacity Control Bar */}
              <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
                isLight ? 'bg-[#F9F6F0] border-[#E8E2D5]' : 'bg-[#141210] border-white/10'
              }`}>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-[#D04834]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Cafe Table Capacity:
                    </span>
                  </div>
                  
                  {/* Stepper Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeTable()}
                      disabled={totalTablesCount <= 1}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-base transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isLight ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                      }`}
                      title="Remove highest-numbered table"
                    >
                      -
                    </button>
                    <span className={`px-3 py-1 rounded-xl border text-sm font-mono font-bold ${
                      isLight ? 'bg-white border-stone-300 text-[#12100E]' : 'bg-[#1C1917] border-white/15 text-white'
                    }`}>
                      {totalTablesCount} Tables
                    </span>
                    <button
                      onClick={() => addTable()}
                      disabled={totalTablesCount >= 40}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-base transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isLight ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                      }`}
                      title="Add a new dining table"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets & Reset */}
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto justify-end scrollbar-none">
                  <span className={`text-[10px] font-mono hidden md:inline ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Presets:
                  </span>
                  {[8, 12, 16, 20].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setTableCount(cnt)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono border transition cursor-pointer ${
                        totalTablesCount === cnt
                          ? 'bg-[#D04834] text-white border-[#D04834] font-bold shadow-xs'
                          : isLight
                          ? 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                          : 'bg-[#1C1917] border-white/10 text-stone-400 hover:text-white'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                  <button
                    onClick={() => resetTablesToDefault()}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono border transition cursor-pointer ${
                      isLight 
                        ? 'bg-stone-100 border-stone-300 text-stone-600 hover:bg-stone-200' 
                        : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Reset tables to default 12"
                  >
                    Reset (12)
                  </button>
                </div>
              </div>

              {/* Table Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tableOccupancyMap.map(({ table: t, occ, hasServiceReq }) => {
                  let statusBadge = { 
                    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300', 
                    label: '🟢 Vacant' 
                  };

                  if (hasServiceReq) {
                    statusBadge = { 
                      bg: 'bg-rose-500/20 border-rose-500/50 text-rose-600 dark:text-rose-400 animate-pulse', 
                      label: '🚨 Table Call' 
                    };
                  } else if (occ.isBusy) {
                    if (occ.status === 'served_dining') {
                      statusBadge = { 
                        bg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-bold', 
                        label: `🍽️ Served (${occ.remainingMins}m left)` 
                      };
                    } else if (occ.stage === 'cooking') {
                      statusBadge = { 
                        bg: 'bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300', 
                        label: '🔥 Cooking' 
                      };
                    } else if (occ.stage === 'ready') {
                      statusBadge = { 
                        bg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-700 dark:text-cyan-300', 
                        label: '🛎️ Food Ready' 
                      };
                    } else {
                      statusBadge = { 
                        bg: 'bg-amber-400/15 border-amber-400/30 text-amber-700 dark:text-amber-200', 
                        label: '⏳ New Order' 
                      };
                    }
                  }

                  const tableOrder = occ.order;

                  return (
                    <div
                      key={t.id}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                        hasServiceReq
                          ? 'border-[#D04834] ring-2 ring-[#D04834]/40 bg-white dark:bg-[#1C1917]'
                          : occ.isBusy
                          ? isLight ? 'bg-white border-[#12100E] shadow-md' : 'bg-[#1C1917] border-white/20 shadow-md'
                          : isLight ? 'bg-white/80 border-stone-200' : 'bg-[#1C1917]/70 border-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-bold">
                            TABLE #<span className="font-number font-bold">{t.number < 10 ? `0${t.number}` : t.number}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold ${statusBadge.bg}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                        <p className={`text-xs font-mono mt-1.5 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                          Capacity: <span className="font-number font-bold">{t.capacity}</span> Seats • {t.zoneName || 'Main Dining'}
                        </p>
                      </div>

                      {tableOrder ? (
                        <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
                          isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#0E0C0B] border-white/5'
                        }`}>
                          <div className="flex items-center justify-between font-bold">
                            <span>#<span className="font-number font-bold">{tableOrder.orderNumber}</span></span>
                            <span className="font-number font-bold text-[#D04834]">₹{tableOrder.total}</span>
                          </div>
                          <p className={`text-[11px] truncate ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                            {tableOrder.items?.length} items ({tableOrder.items?.map(i => i.name).join(', ')})
                          </p>
                          
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              onClick={() => { sounds.playClick(); setViewingSlip(tableOrder); }}
                              className={`flex-1 py-1.5 rounded-lg border text-[11px] font-mono transition cursor-pointer ${
                                isLight 
                                  ? 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700' 
                                  : 'bg-[#1C1917] border-white/10 hover:bg-white/10 text-stone-300'
                              }`}
                            >
                              Slip
                            </button>

                            {/* Mark Vacant / Release Button */}
                            <button
                              onClick={() => { sounds.playClick(); vacateTable(t.number); }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                              title="Immediately mark table vacant and release guest seat"
                            >
                              <Check className="w-3 h-3" />
                              <span>Vacate</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 py-2">
                          <div className={`text-center text-xs font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                            Ready for new guests
                          </div>
                          <button
                            onClick={() => {
                              sounds.playClick();
                              setSelectedTableForQR(t.number);
                              setActiveTab('tables');
                            }}
                            className={`w-full py-1.5 rounded-xl border text-[11px] font-mono transition cursor-pointer ${
                              isLight
                                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                                : 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/10'
                            }`}
                          >
                            Print QR Stand
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* TAB 3: FULL MENU CRUD & STOCK MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Header with Add Item Button */}
            <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
              isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
            }`}>
              <div>
                <h2 className="text-2xl font-editorial tracking-tight font-normal flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-[#D04834]" />
                  <span>Menu &amp; Dish Catalog</span>
                </h2>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Add new dishes, update prices, configure add-on options, or mark out-of-stock items instantly.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Search Box */}
                <div className="relative flex-1 md:w-60">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search dishes..."
                    className={`w-full pl-10 pr-3 py-2 rounded-xl border text-xs focus:outline-none transition ${
                      isLight 
                        ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#12100E]' 
                        : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                    }`}
                  />
                </div>

                {/* Add New Item Button */}
                <button
                  onClick={handleOpenAddModal}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-syne font-bold whitespace-nowrap flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                    isLight 
                      ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                      : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                  }`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Dish</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => { sounds.playClick(); setStockCategory('all'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-syne font-bold whitespace-nowrap transition border ${
                  stockCategory === 'all'
                    ? isLight
                      ? 'bg-[#12100E] text-white border-[#12100E]'
                      : 'bg-white text-black border-white'
                    : isLight
                    ? 'bg-white border-stone-200 text-stone-600 hover:text-black'
                    : 'bg-[#1C1917] border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                All Dishes ({menuItems.length})
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { sounds.playClick(); setStockCategory(cat.id); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-syne font-bold whitespace-nowrap transition border ${
                    stockCategory === cat.id
                      ? isLight
                        ? 'bg-[#12100E] text-white border-[#12100E]'
                        : 'bg-white text-black border-white'
                      : isLight
                      ? 'bg-white border-stone-200 text-stone-600 hover:text-black'
                      : 'bg-[#1C1917] border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenuItems.map(item => {
                const isOutOfStock = menuStockOverrides[item.id];

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3.5 shadow-sm ${
                      isOutOfStock
                        ? isLight ? 'bg-stone-100/70 border-stone-300 opacity-60' : 'bg-stone-900/40 border-stone-800 opacity-60'
                        : isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
                    }`}
                  >
                    <div>
                      {/* Top Thumbnail & Info */}
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
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
                          <p className="text-sm font-editorial font-normal truncate">{item.name}</p>
                          <p className="text-xs font-number text-[#D04834] font-bold mt-0.5">₹{item.price}</p>
                          <span className={`text-[10px] font-mono capitalize block ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                            {item.category?.replace('-', ' ')} • {item.prepTime || '10m'}
                          </span>
                        </div>
                      </div>

                      {/* Addon count */}
                      <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                        isLight ? 'border-stone-100 text-stone-500' : 'border-white/5 text-stone-400'
                      }`}>
                        <span><span className="font-number font-bold">{item.addons?.length || 0}</span> Add-ons</span>
                        {item.isBestseller && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[9px] font-mono font-bold">
                            POPULAR
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Bar: Edit, Delete, Stock Toggle */}
                    <div className={`space-y-2 pt-1 border-t ${isLight ? 'border-stone-100' : 'border-white/5'}`}>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className={`py-1.5 rounded-xl text-xs font-syne font-bold flex items-center justify-center gap-1 border transition cursor-pointer ${
                            isLight 
                              ? 'bg-stone-50 border-stone-200 text-stone-700 hover:text-black hover:bg-stone-100' 
                              : 'bg-[#0E0C0B] border-white/5 text-stone-300 hover:text-white'
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#D04834]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className={`py-1.5 rounded-xl text-xs font-syne font-bold flex items-center justify-center gap-1 border transition cursor-pointer ${
                            isLight 
                              ? 'bg-stone-50 border-stone-200 text-rose-600 hover:bg-rose-50' 
                              : 'bg-[#0E0C0B] border-white/5 text-rose-400 hover:bg-rose-950/20'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      {/* Out of Stock Toggle */}
                      <button
                        onClick={() => {
                          sounds.playClick();
                          toggleItemStock(item.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-syne font-bold transition flex items-center justify-between border cursor-pointer ${
                          isOutOfStock
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isOutOfStock ? (
                            <>
                              <X className="w-3 h-3 text-rose-500" />
                              <span>OUT OF STOCK / 86'D</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>IN STOCK</span>
                            </>
                          )}
                        </span>
                        <span className="text-[10px] underline font-mono">
                          {isOutOfStock ? 'Mark Available' : 'Mark Out of Stock'}
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
        {/* TAB 4: TABLE QR PLAQUES */}
        {/* ========================================================================= */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
              isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
            }`}>
              <div>
                <h2 className="text-2xl font-editorial tracking-tight font-normal">Table QR Code Generator</h2>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Select a table to print acrylic stands or table QR code stickers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleBatchPrintAllTables}
                  className={`px-4 py-2.5 rounded-2xl font-syne font-bold text-xs transition flex items-center gap-1.5 border cursor-pointer ${
                    isLight 
                      ? 'bg-white border-stone-300 text-stone-700 hover:border-stone-900' 
                      : 'bg-white/10 border-white/10 text-stone-200 hover:bg-white/20'
                  }`}
                  title="Print all 12 table stands in a ready-to-cut A4 sheet"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D04834]" />
                  <span>Batch Print 12 Tables</span>
                </button>

                <button
                  onClick={handlePrintSinglePlaque}
                  className={`px-5 py-2.5 rounded-2xl font-syne font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                    isLight 
                      ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                      : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Table #{selectedTableForQR < 10 ? `0${selectedTableForQR}` : selectedTableForQR} Stand</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Select Table to Generate QR:
                  </p>
                  <span className="text-[11px] font-mono text-[#D04834] font-semibold">
                    {(tables && tables.length > 0 ? tables : BRAND_CONFIG.tables).length} Active Tables Configured
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(tables && tables.length > 0 ? tables : BRAND_CONFIG.tables).map(t => (
                    <button
                      key={t.id}
                      onClick={() => { sounds.playClick(); setSelectedTableForQR(t.number); }}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                        selectedTableForQR === t.number
                          ? isLight
                            ? 'bg-[#12100E] text-white border-[#12100E] shadow-sm ring-2 ring-[#D04834]'
                            : 'bg-white text-black border-white shadow-sm ring-2 ring-[#D04834]'
                          : isLight
                          ? 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                          : 'bg-[#1C1917] border-white/10 text-stone-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold">
                          T-{t.number < 10 ? `0${t.number}` : t.number}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${selectedTableForQR === t.number ? 'bg-[#D04834]' : 'bg-emerald-500'}`}></span>
                      </div>
                      <p className="text-sm font-editorial mt-2">Table #{t.number < 10 ? `0${t.number}` : t.number}</p>
                      <p className="text-[10px] opacity-75 font-mono">Seats: {t.capacity} Guests</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className={`p-6 rounded-3xl border shadow-lg space-y-5 text-center flex flex-col items-center transition-colors ${
                  isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
                }`}>
                  <div className={`w-full pb-3 border-b flex items-center justify-between ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border border-stone-300">
                      ACRYLIC STAND PREVIEW
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>100% REAL QR</span>
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-3xl shadow-inner w-64 min-h-64 flex flex-col items-center justify-center border-4 border-stone-900 relative">
                    {isGeneratingTableQR || !tableQrDataUrl ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-2 text-stone-500">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#D04834]" />
                        <span className="text-[10px] font-mono">Generating Live QR...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <img 
                          src={tableQrDataUrl} 
                          alt={`Table ${selectedTableForQR} QR`} 
                          className="w-48 h-48 object-contain rounded-lg"
                        />
                        <span className="font-mono text-stone-950 font-black text-xs tracking-widest mt-2 bg-stone-100 px-3 py-1 rounded-full border border-stone-300 shadow-xs">
                          TABLE #{selectedTableForQR < 10 ? `0${selectedTableForQR}` : selectedTableForQR}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 w-full">
                    <p className="font-syne font-bold text-xs">
                      Scan with any smartphone camera to place order
                    </p>
                    <p className={`text-[10px] font-mono break-all px-2.5 py-1.5 rounded-xl border ${
                      isLight ? 'bg-stone-50 border-stone-200 text-stone-600' : 'bg-white/5 border-white/10 text-stone-400'
                    }`}>
                      {currentTableOrderUrl}
                    </p>
                  </div>

                  {/* Actions for Table QR */}
                  <div className="w-full grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleDownloadTableQR}
                      disabled={!tableQrDataUrl}
                      className={`py-2 px-3 rounded-xl font-syne font-bold text-xs border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isLight 
                          ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800' 
                          : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PNG</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyTableUrl}
                      className={`py-2 px-3 rounded-xl font-syne font-bold text-xs border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        copiedTableUrl
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : isLight 
                          ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800' 
                          : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
                      }`}
                    >
                      {copiedTableUrl ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={currentTableOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-2 px-3 rounded-xl font-syne font-bold text-xs border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isLight 
                          ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800' 
                          : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test in Tab</span>
                    </a>

                    <button
                      type="button"
                      onClick={handlePrintSinglePlaque}
                      className={`py-2 px-3 rounded-xl font-syne font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        isLight 
                          ? 'bg-[#12100E] text-white hover:bg-stone-800' 
                          : 'bg-white text-black hover:bg-stone-200'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Stand</span>
                    </button>
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
            <div className={`p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
              isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
            }`}>
              <div>
                <h2 className="text-2xl font-editorial tracking-tight font-normal">Shift Summary &amp; Z-Report</h2>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Daily financial reconciliation, GST breakdown, and shift sales summary.
                </p>
              </div>

              <button
                onClick={handleExportZReportCSV}
                className={`px-4 py-2.5 rounded-2xl font-syne font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                  isLight 
                    ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                    : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Export Z-Report (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-5 rounded-3xl border space-y-2 shadow-sm ${
                isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
              }`}>
                <div className={`flex items-center justify-between text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  <span>Total Sales</span>
                  <DollarSign className="w-4 h-4 text-[#D04834]" />
                </div>
                <p className="text-2xl font-number font-bold text-[#D04834]">₹{totalRevenue}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Active Shift Revenue
                </p>
              </div>

              <div className={`p-5 rounded-3xl border space-y-2 shadow-sm ${
                isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
              }`}>
                <div className={`flex items-center justify-between text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  <span>Digital Payments</span>
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl font-number font-bold text-emerald-700 dark:text-emerald-400">₹{onlineRevenue}</p>
                <p className={`text-[11px] font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>UPI &amp; Contactless</p>
              </div>

              <div className={`p-5 rounded-3xl border space-y-2 shadow-sm ${
                isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
              }`}>
                <div className={`flex items-center justify-between text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  <span>Cash at Till</span>
                  <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-2xl font-number font-bold text-amber-700 dark:text-amber-300">₹{cashRevenue}</p>
                <p className={`text-[11px] font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>Collected at Counter</p>
              </div>

              <div className={`p-5 rounded-3xl border space-y-2 shadow-sm ${
                isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
              }`}>
                <div className={`flex items-center justify-between text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  <span>Average Ticket Value</span>
                  <Award className="w-4 h-4 text-stone-400" />
                </div>
                <p className="text-2xl font-number font-bold">₹{avgTicketValue}</p>
                <p className={`text-[11px] font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}><span className="font-number font-bold">{validOrders.length}</span> Orders Recorded</p>
              </div>
            </div>

            {/* Reconciliation Cards */}
            <div className={`p-6 rounded-3xl border space-y-4 shadow-sm ${
              isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
            }`}>
              <h3 className="text-base font-syne font-bold">Shift Tax &amp; Revenue Breakdown</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#0E0C0B] border-white/5'
                }`}>
                  <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>Net Food Sales</p>
                  <p className="text-xl font-bold font-number">₹{totalRevenue - totalGst}</p>
                </div>
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#0E0C0B] border-white/5'
                }`}>
                  <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>GST Tax (5%)</p>
                  <p className="text-xl font-bold text-[#D04834] font-number">₹{totalGst}</p>
                </div>
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#0E0C0B] border-white/5'
                }`}>
                  <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>Staff Tip Pool</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-300 font-number">₹{totalTips}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders Log Table */}
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-syne font-bold">Recent Orders Register</h3>
                <span className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  <span className="font-number font-bold">{orders.length}</span> Orders in System
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b font-mono text-[10px] uppercase ${
                      isLight ? 'border-stone-200 text-stone-500' : 'border-white/10 text-stone-400'
                    }`}>
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Table / Type</th>
                      <th className="pb-3">Guest</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono ${isLight ? 'divide-stone-100' : 'divide-white/5'}`}>
                    {orders.slice(0, 10).map(o => (
                      <tr key={o.id} className={`transition ${isLight ? 'hover:bg-stone-50' : 'hover:bg-white/5'}`}>
                        <td className="py-3 font-bold">#<span className="font-number font-bold">{o.orderNumber}</span></td>
                        <td className="py-3">
                          {o.diningMode === 'table' ? `Table #${o.tableNumber}` : 'Counter'}
                        </td>
                        <td className="py-3">{o.customerName || 'Guest'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === 'paid' 
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          }`}>
                            {o.paymentStatus === 'paid' ? 'UPI' : 'Cash'}
                          </span>
                        </td>
                        <td className="py-3 capitalize">{o.status}</td>
                        <td className="py-3 text-right font-number font-bold text-[#D04834]">₹{o.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 3. WORKING ADD & EDIT MENU ITEM MODAL */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto border transition-colors ${
                isLight ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' : 'bg-[#141210] text-[#FAF7F2] border-white/10'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between pb-4 border-b ${
                isLight ? 'border-stone-200' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isLight ? 'bg-white text-[#12100E] border border-[#E8E2D5]' : 'bg-white/10 text-white'
                  }`}>
                    {editingItem ? <Edit2 className="w-5 h-5 text-[#D04834]" /> : <Plus className="w-5 h-5 text-[#D04834] stroke-[2.5]" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-editorial font-normal">
                      {editingItem ? `Edit: ${editingItem.name}` : 'Add Dish to Menu'}
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                      Changes reflect instantly on customer menus and table QR orders.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsItemModalOpen(false)}
                  className={`p-2 rounded-xl border transition ${
                    isLight ? 'border-stone-200 text-stone-500 hover:text-black' : 'border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                
                {/* 1. Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`font-syne font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder="e.g. Margherita Basilico Pizza"
                      className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none transition ${
                        isLight 
                          ? 'bg-white border-stone-300 text-stone-900 focus:border-[#12100E]' 
                          : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`font-syne font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      Category *
                    </label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none capitalize transition ${
                        isLight 
                          ? 'bg-white border-stone-300 text-stone-900 focus:border-[#12100E]' 
                          : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                      }`}
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
                    <label className={`font-syne font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      Base Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold focus:outline-none transition ${
                        isLight 
                          ? 'bg-white border-stone-300 text-stone-900 focus:border-[#12100E]' 
                          : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`font-syne font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      Prep / Cooking Time
                    </label>
                    <input
                      type="text"
                      value={itemForm.prepTime}
                      onChange={(e) => setItemForm({ ...itemForm, prepTime: e.target.value })}
                      placeholder="e.g. 10-12 mins"
                      className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none transition ${
                        isLight 
                          ? 'bg-white border-stone-300 text-stone-900 focus:border-[#12100E]' 
                          : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`font-syne font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      Dietary Preference
                    </label>
                    <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${
                      isLight ? 'bg-white border-stone-200' : 'bg-[#0E0C0B] border-white/10'
                    }`}>
                      {[
                        { id: 'veg', label: 'Veg', activeClass: 'bg-emerald-600 text-white' },
                        { id: 'nonveg', label: 'Non-Veg', activeClass: 'bg-rose-600 text-white' },
                        { id: 'egg', label: 'Egg', activeClass: 'bg-amber-500 text-white' }
                      ].map(d => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => { sounds.playClick(); setItemForm({ ...itemForm, diet: d.id }); }}
                          className={`py-1.5 rounded-lg text-[11px] font-mono font-bold text-center transition cursor-pointer ${
                            itemForm.diet === d.id ? d.activeClass : 'text-stone-400 hover:text-black dark:hover:text-white'
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
                  <label className={`font-syne font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                    Dish Description
                  </label>
                  <textarea
                    rows="2"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    placeholder="Describe ingredients, preparation, herbs, and flavors..."
                    className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none resize-none transition ${
                      isLight 
                        ? 'bg-white border-stone-300 text-stone-900 focus:border-[#12100E]' 
                        : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                    }`}
                  />
                </div>

                {/* 4. Dish Image: Upload from Computer/Gallery, URL or Quick Presets */}
                <div className={`space-y-3 p-4 rounded-2xl border transition-colors ${
                  isLight ? 'bg-white border-stone-200' : 'bg-[#0E0C0B] border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className={`font-syne font-bold text-xs flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      <ImageIcon className="w-3.5 h-3.5 text-[#D04834]" />
                      <span>Dish Image (Upload from Computer, URL or Presets)</span>
                    </label>
                    {itemForm.image?.startsWith('data:') && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                        Uploaded from Computer
                      </span>
                    )}
                  </div>

                  {/* Hidden Native File Input for Gallery / Local Filesystem */}
                  <input 
                    type="file" 
                    ref={dishFileInputRef} 
                    onChange={handleDishImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  {/* Upload Drop Zone & Live Preview Box */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingDishImage(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingDishImage(false); }}
                    onDrop={handleDishImageDrop}
                    className={`rounded-2xl border-2 border-dashed transition-all p-3.5 flex flex-col sm:flex-row items-center gap-4 ${
                      isDraggingDishImage
                        ? 'border-[#D04834] bg-[#D04834]/10 scale-[1.01]'
                        : isLight 
                        ? 'border-stone-200 bg-stone-50/80 hover:border-stone-400' 
                        : 'border-white/15 bg-[#141210] hover:border-white/30'
                    }`}
                  >
                    {/* Live Image Preview Thumbnail */}
                    {itemForm.image ? (
                      <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-black/10 shadow-sm group">
                        <img 
                          src={itemForm.image} 
                          alt="Dish Preview" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                          <button
                            type="button"
                            onClick={() => dishFileInputRef.current?.click()}
                            className="px-2 py-1 rounded-lg bg-white text-black text-[10px] font-mono font-bold shadow hover:bg-stone-200 transition cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full sm:w-36 h-28 rounded-xl border border-dashed flex flex-col items-center justify-center text-stone-400 shrink-0 bg-black/5">
                        <ImageIcon className="w-6 h-6 opacity-40 mb-1" />
                        <span className="text-[10px] font-mono">No Photo</span>
                      </div>
                    )}

                    {/* Upload Controls & Drag Area */}
                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => { sounds.playClick(); dishFileInputRef.current?.click(); }}
                          className="px-3.5 py-2 rounded-xl text-xs font-syne font-bold uppercase tracking-wider flex items-center gap-2 bg-[#D04834] hover:bg-[#b03b29] text-white shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload from Gallery (Computer)</span>
                        </button>

                        {itemForm.image && (
                          <button
                            type="button"
                            onClick={() => { sounds.playClick(); setItemForm(prev => ({ ...prev, image: '' })); }}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono border transition cursor-pointer ${
                              isLight ? 'border-stone-300 text-stone-600 hover:text-rose-600 hover:border-rose-300' : 'border-white/20 text-stone-400 hover:text-rose-400 hover:border-rose-400/30'
                            }`}
                          >
                            Clear Photo
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] opacity-60 font-mono">
                        Select any dish photo from your gallery/files, or drag and drop it here. Automatically compressed and optimized for high-speed loading.
                      </p>

                      {imageUploadStatus === 'success' && (
                        <p className="text-[11px] font-mono text-emerald-500 font-semibold flex items-center gap-1 justify-center sm:justify-start">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Image successfully uploaded from gallery!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Alternative: Enter Image URL */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider opacity-60">
                      <span>Or paste an image link:</span>
                    </div>
                    <input
                      type="url"
                      value={itemForm.image}
                      onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/... or /images/..."
                      className={`w-full px-3 py-2 rounded-xl border font-mono text-[11px] focus:outline-none transition ${
                        isLight 
                          ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#12100E]' 
                          : 'bg-[#1C1917] border-white/10 text-white focus:border-white/30'
                      }`}
                    />
                  </div>

                  {/* Quick Presets */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 block">Quick Culinary Presets:</span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                      {PRESET_DISH_IMAGES.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { sounds.playClick(); setItemForm({ ...itemForm, image: p.url }); }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition border cursor-pointer ${
                            itemForm.image === p.url
                              ? isLight ? 'bg-[#12100E] text-white border-[#12100E]' : 'bg-white text-black border-white'
                              : isLight ? 'bg-white border-stone-200 text-stone-600 hover:border-stone-400' : 'bg-[#1C1917] border-white/10 text-stone-400 hover:border-white/30'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Highlight Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                    isLight ? 'bg-white border-stone-200' : 'bg-[#0E0C0B] border-white/10'
                  }`}>
                    <span className="font-syne font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Chef's Special / Bestseller</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={itemForm.isBestseller}
                      onChange={(e) => setItemForm({ ...itemForm, isBestseller: e.target.checked })}
                      className="w-4 h-4 accent-[#12100E] rounded cursor-pointer"
                    />
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                    isLight ? 'bg-white border-stone-200' : 'bg-[#0E0C0B] border-white/10'
                  }`}>
                    <span className="font-syne font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#D04834]" />
                      <span>Spicy / Hot</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={itemForm.isSpicy}
                      onChange={(e) => setItemForm({ ...itemForm, isSpicy: e.target.checked })}
                      className="w-4 h-4 accent-[#D04834] rounded cursor-pointer"
                    />
                  </label>
                </div>

                {/* 6. Custom Addons Manager */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isLight ? 'bg-white border-stone-200' : 'bg-[#0E0C0B] border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-syne font-bold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#D04834]" />
                        <span>Custom Add-ons &amp; Extra Ingredients</span>
                      </h4>
                      <p className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                        Options shown to guests when customizing their dish
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAddonRow}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-syne font-bold flex items-center gap-1 transition cursor-pointer ${
                        isLight ? 'bg-[#12100E] text-white' : 'bg-white text-black'
                      }`}
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  {itemForm.addons.length === 0 ? (
                    <p className={`text-center py-4 text-xs italic font-mono ${isLight ? 'text-stone-400' : 'text-stone-500'}`}>
                      No add-ons configured for this dish.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {itemForm.addons.map((addon, idx) => (
                        <div key={addon.id || idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={addon.name}
                            onChange={(e) => handleUpdateAddon(idx, 'name', e.target.value)}
                            placeholder="Option name (e.g. Buffalo Mozzarella)"
                            className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition ${
                              isLight 
                                ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#12100E]' 
                                : 'bg-[#1C1917] border-white/10 text-white focus:border-white/30'
                            }`}
                          />
                          <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border ${
                            isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1C1917] border-white/10'
                          }`}>
                            <span className="text-[#D04834] font-mono text-xs font-bold">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={addon.price}
                              onChange={(e) => handleUpdateAddon(idx, 'price', e.target.value)}
                              className="w-14 bg-transparent font-mono text-xs font-bold focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddon(idx)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-500 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Spice Levels */}
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isLight ? 'bg-white border-stone-200' : 'bg-[#0E0C0B] border-white/10'
                }`}>
                  <label className="font-syne font-bold block">
                    Spice Level Options
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {itemForm.spiceOptions.map((spice, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 ${
                          isLight ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-[#1C1917] border-white/10 text-stone-300'
                        }`}
                      >
                        <span>{spice}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpiceOption(spice)}
                          className="text-stone-400 hover:text-rose-500 cursor-pointer"
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
                      placeholder="New level (e.g. Extra Spicy)"
                      className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition ${
                        isLight 
                          ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#12100E]' 
                          : 'bg-[#1C1917] border-white/10 text-white focus:border-white/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddSpiceOption}
                      className={`px-3 py-1.5 rounded-xl text-xs font-syne font-bold border transition cursor-pointer ${
                        isLight ? 'bg-white border-stone-200 text-stone-700' : 'bg-[#1C1917] border-white/10 text-stone-300'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className={`pt-4 border-t flex items-center justify-end gap-2.5 ${
                  isLight ? 'border-stone-200' : 'border-white/10'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className={`px-4 py-2.5 rounded-xl font-syne font-bold text-xs border transition cursor-pointer ${
                      isLight ? 'border-stone-200 text-stone-600 hover:text-black' : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl font-syne font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer ${
                      isLight 
                        ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                        : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{editingItem ? 'Save Changes' : 'Publish to Menu'}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 text-center border ${
                isLight ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' : 'bg-[#141210] text-[#FAF7F2] border-white/10'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-editorial font-normal">Delete this dish?</h3>
                <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Are you sure you want to remove <strong className="font-bold">"{deleteConfirmItem.name}"</strong>? This dish will be permanently removed from all digital menus and table ordering.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className={`py-2.5 rounded-xl font-syne font-bold text-xs border transition cursor-pointer ${
                    isLight ? 'border-stone-200 text-stone-600' : 'border-white/10 text-stone-400'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="py-2.5 rounded-xl font-syne font-bold text-xs bg-[#D04834] text-white hover:bg-[#b83d2b] transition cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. THERMAL KITCHEN KOT / RECEIPT SLIP MODAL */}
      <AnimatePresence>
        {viewingSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white text-stone-950 rounded-3xl p-6 shadow-2xl text-xs overflow-hidden border border-stone-300"
            >
              <button
                onClick={() => setViewingSlip(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pb-3 border-b-2 border-dashed border-stone-300 space-y-1">
                <h3 className="text-base font-bold tracking-tight uppercase">
                  {BRAND_CONFIG.brandName}
                </h3>
                <p className="text-[10px] text-stone-600">
                  {BRAND_CONFIG.contact.fullAddress}
                </p>
                <div className="pt-1 text-[11px] font-bold">
                  {viewingSlip.diningMode === 'table' 
                    ? <>TABLE #<span className="font-number font-bold">{viewingSlip.tableNumber || '04'}</span></>
                    : 'COUNTER PICKUP'}
                </div>
                <p className="text-[10px] text-stone-500">
                  Order #<span className="font-number font-bold">{viewingSlip.orderNumber}</span> • {new Date(viewingSlip.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Items */}
              <div className="py-3 border-b-2 border-dashed border-stone-300 space-y-2">
                {viewingSlip.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">
                        <span className="font-number font-bold">{item.qty}</span> × {item.name}
                      </p>
                      {item.spice && <p className="text-[10px] text-stone-600">Spice: {item.spice}</p>}
                    </div>
                    <span className="font-number font-bold">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Total Breakdown */}
              <div className="py-2.5 border-b-2 border-dashed border-stone-300 space-y-1">
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-bold uppercase">{viewingSlip.paymentStatus === 'paid' ? 'PAID ONLINE' : 'DUE AT COUNTER'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span>TOTAL:</span>
                  <span className="text-[#D04834] font-number font-bold">₹{viewingSlip.total}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-stone-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
                <button
                  onClick={() => setViewingSlip(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer"
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
