import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Search, 
  Layers, 
  Plus, 
  Minus, 
  Navigation,
  Car,
  Database,
  Activity,
  BarChart3,
  Settings,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Download,
  ChevronRight,
  Info,
  Map as MapIcon,
  Loader2,
  Bell,
  X,
  AlertCircle,
  LocateFixed
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker, Circle, Polyline, useMapEvents, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Mock Data ---
const mockClusterData = [
  { x: 100, y: 200, z: 200, cluster: 'Low Density' },
  { x: 120, y: 100, z: 260, cluster: 'Low Density' },
  { x: 170, y: 300, z: 400, cluster: 'Medium Density' },
  { x: 140, y: 250, z: 280, cluster: 'Medium Density' },
  { x: 150, y: 400, z: 500, cluster: 'High Density' },
  { x: 110, y: 280, z: 200, cluster: 'High Density' },
];

const mockBarData = [
  { name: 'Mon', volume: 4000 },
  { name: 'Tue', volume: 3000 },
  { name: 'Wed', volume: 2000 },
  { name: 'Thu', volume: 2780 },
  { name: 'Fri', volume: 1890 },
  { name: 'Sat', volume: 2390 },
  { name: 'Sun', volume: 3490 },
];

// --- Map Components ---
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}



function RealMapBackground({ center, zoom, showTraffic, onZoneClick, onMapClick }) {
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          key={showTraffic ? 'traffic' : 'standard'}
          className="map-tiles-dark"
          attribution='&copy; Google Maps'
          url={`https://mt1.google.com/vt/lyrs=y${showTraffic ? ',traffic' : ''}&x={x}&y={y}&z={z}`}
        />
        <MapUpdater center={center} zoom={zoom} />
        <MapEvents onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}

// --- Panel Content Components ---

function HomeContent() {
  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">Smart Urban Traffic System</h2>
        <p className="text-sm text-slate-600">
          Predictive traffic analytics using ML to optimize urban mobility.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center text-center">
          <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-xs font-semibold text-slate-900">Volume</span>
          <span className="text-[10px] text-slate-500">Linear Reg</span>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex flex-col items-center text-center">
          <Car className="w-6 h-6 text-amber-600 mb-2" />
          <span className="text-xs font-semibold text-slate-900">Congestion</span>
          <span className="text-[10px] text-slate-500">Decision Tree</span>
        </div>
        <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col items-center text-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
          <span className="text-xs font-semibold text-slate-900">Accidents</span>
          <span className="text-[10px] text-slate-500">KNN</span>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
          <MapPin className="w-6 h-6 text-emerald-600 mb-2" />
          <span className="text-xs font-semibold text-slate-900">Density</span>
          <span className="text-[10px] text-slate-500">K-Means</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2 text-slate-400" /> Team Details
        </h3>
        <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
            T
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Team Innovators</h4>
            <p className="text-xs text-slate-500">Data Science & Web Dev</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictContent({ inputs, setInputs, results, isPredicting, onPredict }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Live Predictions</h2>
        <p className="text-xs text-slate-600">Enter parameters to run ML models.</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Road Type</label>
            <select name="roadType" value={inputs.roadType} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Highway">Highway</option>
              <option value="City Street">City Street</option>
              <option value="Suburb">Suburb</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Weather</label>
            <select name="weather" value={inputs.weather} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Clear">Clear</option>
              <option value="Rain">Rain</option>
              <option value="Fog">Fog</option>
              <option value="Snow">Snow</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
            <select name="time" value={inputs.time} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Morning Rush">Morning Rush</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening Rush">Evening Rush</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Speed (km/h)</label>
            <input name="speed" type="number" value={inputs.speed} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        
        <button 
          onClick={onPredict}
          disabled={isPredicting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors mt-2 flex justify-center items-center disabled:opacity-70"
        >
          {isPredicting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running Models...</> : 'Run Models'}
        </button>
      </div>

      {results && (
        <div className="space-y-2 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-bottom-2">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">Results</h3>
          
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Volume (LR)</p>
              <p className="text-sm font-semibold text-slate-900">{results.volume.toLocaleString()} veh/hr</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          
          <div className={`flex justify-between items-center p-3 rounded-lg border ${results.congestion === 'High' ? 'bg-red-50 border-red-100' : results.congestion === 'Medium' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div>
              <p className={`text-[10px] font-medium uppercase ${results.congestion === 'High' ? 'text-red-600' : results.congestion === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>Congestion (DT)</p>
              <p className={`text-sm font-semibold ${results.congestion === 'High' ? 'text-red-900' : results.congestion === 'Medium' ? 'text-amber-900' : 'text-emerald-900'}`}>{results.congestion}</p>
            </div>
            <Car className={`w-4 h-4 ${results.congestion === 'High' ? 'text-red-600' : results.congestion === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
          
          <div className={`flex justify-between items-center p-3 rounded-lg border ${results.risk === 'High' ? 'bg-red-50 border-red-100' : results.risk === 'Medium' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div>
              <p className={`text-[10px] font-medium uppercase ${results.risk === 'High' ? 'text-red-600' : results.risk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>Risk (KNN)</p>
              <p className={`text-sm font-semibold ${results.risk === 'High' ? 'text-red-900' : results.risk === 'Medium' ? 'text-amber-900' : 'text-emerald-900'}`}>{results.risk}</p>
            </div>
            <AlertTriangle className={`w-4 h-4 ${results.risk === 'High' ? 'text-red-600' : results.risk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
        </div>
      )}
    </div>
  );
}

function VisualizeContent() {
  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Visualizations</h2>
        <p className="text-xs text-slate-600">Data patterns and cluster plots.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-900 mb-4">Volume by Day</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBarData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                <Bar dataKey="volume" fill="#4f46e5" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-900 mb-4">Density Clusters (K-Means)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis type="number" dataKey="x" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis type="number" dataKey="y" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <ZAxis type="number" dataKey="z" range={[20, 100]} />
                <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                <Scatter data={mockClusterData.filter(d => d.cluster === 'Low Density')} fill="#10b981" />
                <Scatter data={mockClusterData.filter(d => d.cluster === 'Medium Density')} fill="#f59e0b" />
                <Scatter data={mockClusterData.filter(d => d.cluster === 'High Density')} fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricsContent() {
  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Model Metrics</h2>
        <p className="text-xs text-slate-600">Performance evaluation of ML models.</p>
      </div>

      <div className="space-y-3">
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-slate-900">Linear Regression</h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">R² Score</span>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-indigo-600">0.89</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">MSE: 145.2</p>
        </div>
        
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-slate-900">Decision Tree</h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Accuracy</span>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-indigo-600">92%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">F1 Score: 0.91</p>
        </div>
        
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-slate-900">KNN Classifier</h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Accuracy</span>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-indigo-600">88%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Optimal K: 5</p>
        </div>
      </div>
    </div>
  );
}

// --- Main App Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [panelOpen, setPanelOpen] = useState(true);
  
  // Map State
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default to New Delhi
  const [zoom, setZoom] = useState(13);
  const [showTraffic, setShowTraffic] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customZone, setCustomZone] = useState(null);

  // Alerts State
  const [alerts, setAlerts] = useState([]);

  // Prediction State
  const [predictInputs, setPredictInputs] = useState({
    roadType: 'Highway',
    weather: 'Clear',
    time: 'Morning Rush',
    speed: 45
  });
  const [predictResults, setPredictResults] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Live Alerts Simulation
  useEffect(() => {
    if (!showTraffic) return;
    
    const messages = [
      "🔴 Red traffic ahead: Stop at now.",
      "🟡 Yellow traffic ahead: Go slow.",
      "🟢 Green traffic ahead: Drive with safety."
    ];
    
    let counter = 0;
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        text: messages[counter % messages.length],
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 3)); // Keep max 3 alerts
      counter++;
    }, 8000); // Every 8 seconds
    
    return () => clearInterval(interval);
  }, [showTraffic]);

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Map Handlers
  const handleZoomIn = () => setZoom(z => Math.min(z + 1, 18));
  const handleZoomOut = () => setZoom(z => Math.max(z - 1, 3));
  const toggleTrafficLayer = () => setShowTraffic(!showTraffic);

  const handleZoneClick = (roadType, weather, speed) => {
    setPredictInputs({
      roadType,
      weather,
      time: 'Morning Rush',
      speed
    });
    setActiveTab('predict');
    setPanelOpen(true);
    // Auto-run prediction for the clicked zone
    runPredictions({ roadType, weather, time: 'Morning Rush', speed });
  };

  const handleMapClick = (latlng) => {
    setCustomZone(latlng);
    
    const roads = ['Highway', 'City Street', 'Suburb'];
    const weathers = ['Clear', 'Rain', 'Fog', 'Snow'];
    const randomRoad = roads[Math.floor(Math.random() * roads.length)];
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
    const randomSpeed = Math.floor(Math.random() * 50) + 20;

    setPredictInputs({
      roadType: randomRoad,
      weather: randomWeather,
      time: 'Afternoon',
      speed: randomSpeed
    });
    setActiveTab('predict');
    setPanelOpen(true);
    runPredictions({ roadType: randomRoad, weather: randomWeather, time: 'Afternoon', speed: randomSpeed });
    
    const newAlert = {
      id: Date.now(),
      text: `🔍 Analyzing custom zone at ${latlng.lat.toFixed(2)}, ${latlng.lng.toFixed(2)}`,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 3));
  };

  const handleSearch = async (e?: any) => {
    if (e && e.key && e.key !== 'Enter') return;
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setMapCenter([data.results[0].latitude, data.results[0].longitude]);
        setZoom(13);
      } else {
        alert("Location not found. Try a different city or address.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("An error occurred while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(13);
        },
        () => {
          alert("Unable to retrieve your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  // Prediction Logic (Simulating ML Models)
  const runPredictions = (inputsToUse = predictInputs) => {
    setIsPredicting(true);
    
    setTimeout(() => {
      const { roadType, weather, time, speed } = inputsToUse;
      
      // 1. Linear Regression (Simulated Volume)
      let baseVol = 1200;
      let roadMult = roadType === 'Highway' ? 1.5 : (roadType === 'City Street' ? 1.2 : 0.8);
      let weatherMult = weather === 'Clear' ? 1.0 : (weather === 'Rain' ? 0.8 : 0.6);
      let timeMult = time.includes('Rush') ? 1.6 : 0.7;
      let volume = Math.round(baseVol * roadMult * weatherMult * timeMult);

      // 2. Decision Tree (Simulated Congestion)
      let congestion = 'Low';
      if (volume > 2000 || (volume > 1500 && speed < 30)) {
        congestion = 'High';
      } else if (volume > 1000 || (volume > 800 && speed < 50)) {
        congestion = 'Medium';
      }

      // 3. KNN (Simulated Accident Risk)
      let risk = 'Low';
      if ((weather === 'Rain' || weather === 'Snow') && speed > 60) {
        risk = 'High';
      } else if (weather !== 'Clear' || speed > 80 || congestion === 'High') {
        risk = 'Medium';
      }

      setPredictResults({ volume, congestion, risk });
      setIsPredicting(false);
    }, 800);
  };

  const tabs = [
    { id: 'home', label: 'Overview', icon: Navigation },
    { id: 'predict', label: 'Predict', icon: Activity },
    { id: 'visualize', label: 'Charts', icon: BarChart3 },
    { id: 'metrics', label: 'Metrics', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeContent />;
      case 'predict': return <PredictContent inputs={predictInputs} setInputs={setPredictInputs} results={predictResults} isPredicting={isPredicting} onPredict={() => runPredictions()} />;
      case 'visualize': return <VisualizeContent />;
      case 'metrics': return <MetricsContent />;
      default: return <HomeContent />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-[#e5e3df]">
      {/* 1. Real World Map Background */}
      <RealMapBackground 
        center={mapCenter}
        zoom={zoom} 
        showTraffic={showTraffic} 
        onZoneClick={handleZoneClick}
        onMapClick={handleMapClick}
      />

      {/* Floating Instruction Badge */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500 hidden md:block">
        <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg border border-slate-700/50 flex items-center">
          <MapPin className="w-3 h-3 mr-2 text-purple-400" />
          Click anywhere on the map to drop a custom analysis circle
        </div>
      </div>

      {/* Live Alerts Notifications */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 w-72 md:w-80 pointer-events-none">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-white/95 backdrop-blur-sm border-l-4 border-amber-500 p-3 rounded-lg shadow-lg pointer-events-auto flex items-start justify-between animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{alert.text}</p>
            </div>
            <button onClick={() => removeAlert(alert.id)} className="text-slate-400 hover:text-slate-600 ml-2 p-1">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* 2. Floating Left Panel (Google Maps Style) */}
      <div className={`
        absolute top-0 left-0 h-full w-full md:w-[400px] p-0 md:p-4 pointer-events-none z-[1000]
        transition-transform duration-300 ease-in-out
        ${panelOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-[380px]'}
      `}>
        <div className="bg-white w-full h-full md:h-auto md:max-h-full md:rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden border border-slate-200/60">
          
          {/* Search / Header Area */}
          <div className="p-4 border-b border-slate-100 flex items-center shadow-sm z-20 bg-white">
            <button 
              onClick={() => setPanelOpen(!panelOpen)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors mr-2 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center bg-slate-100 rounded-full px-4 py-2.5 relative">
              {isSearching ? (
                <Loader2 className="w-5 h-5 text-indigo-500 mr-3 animate-spin" />
              ) : (
                <button onClick={() => handleSearch()} className="focus:outline-none">
                  <Search className="w-5 h-5 text-slate-400 mr-3 hover:text-indigo-500 transition-colors" />
                </button>
              )}
              <input 
                type="text" 
                placeholder="Search any city or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Navigation Tabs (Scrollable horizontally) */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-100 bg-white z-10 px-2 py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center justify-center min-w-[72px] py-2 px-1 rounded-lg transition-colors
                    ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className={`p-1.5 rounded-full mb-1 ${isActive ? 'bg-indigo-50' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto bg-white relative">
            {renderContent()}
          </div>
        </div>

        {/* Toggle Button for Desktop (when panel is closed) */}
        <button 
          onClick={() => setPanelOpen(true)}
          className={`
            hidden md:flex absolute top-6 -right-12 bg-white p-2 rounded-r-xl shadow-md pointer-events-auto border border-l-0 border-slate-200
            transition-opacity duration-300 ${panelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* 3. Floating Right Controls (Map Actions) */}
      <div className="absolute right-4 bottom-8 flex flex-col gap-3 pointer-events-auto z-[1000]">
        <button 
          onClick={locateUser}
          className="w-10 h-10 rounded-full shadow-md flex items-center justify-center border transition-colors bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          title="Locate Me"
        >
          <LocateFixed className="w-5 h-5 text-indigo-600" />
        </button>
        <button 
          onClick={toggleTrafficLayer}
          className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center border transition-colors ${showTraffic ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          title="Toggle Traffic Layer"
        >
          <Layers className="w-5 h-5" />
        </button>
        <div className="bg-white rounded-xl shadow-md flex flex-col border border-slate-200 overflow-hidden">
          <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors">
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Fix leaflet z-index issues with our floating panels */
        .leaflet-container {
          z-index: 0 !important;
        }
      `}} />
    </div>
  );
}
