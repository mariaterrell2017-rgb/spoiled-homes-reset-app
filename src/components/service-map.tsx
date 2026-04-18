import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface Pin {
  id: number;
  top: string;
  left: string;
  delay: string;
}

const NEIGHBORHOODS = [
  { name: "Scottsdale", top: "25%", left: "70%" },
  { name: "Tempe", top: "55%", left: "65%" },
  { name: "Mesa", top: "60%", left: "85%" },
  { name: "Chandler", top: "80%", left: "75%" },
  { name: "Gilbert", top: "75%", left: "90%" },
  { name: "Glendale", top: "35%", left: "25%" },
  { name: "Phoenix DT", top: "50%", left: "45%" },
];

export function ServiceMap() {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    // Generate random pins for "active requests"
    const newPins = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 70) + 15}%`,
      left: `${Math.floor(Math.random() * 70) + 15}%`,
      delay: `${Math.random() * 2}s`,
    }));
    setPins(newPins);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] bg-slate-50 overflow-hidden rounded-3xl border border-slate-200 shadow-inner group">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #2dd4bf 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* Abstract Phoenix Shape / Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 600">
        <path d="M100,300 L300,100 L500,200 L700,150" stroke="currentColor" fill="none" strokeWidth="2" />
        <path d="M150,500 L400,450 L650,550" stroke="currentColor" fill="none" strokeWidth="2" />
        <path d="M200,50 L250,550" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>

      {/* Neighborhood Labels */}
      {NEIGHBORHOODS.map((nh) => (
        <div
          key={nh.name}
          className="absolute text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none select-none"
          style={{ top: nh.top, left: nh.left }}
        >
          {nh.name}
        </div>
      ))}

      {/* Animated Pins */}
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: pin.top, left: pin.left }}
        >
          <div className="relative flex items-center justify-center">
            <div 
              className="absolute w-8 h-8 bg-teal-500/20 rounded-full animate-ping"
              style={{ animationDelay: pin.delay }}
            />
            <div className="relative bg-teal-600 p-1 rounded-full shadow-lg border border-white">
              <MapPin className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      ))}

      {/* Overlay Info Card */}
      <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-80 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-teal-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Cleaner" />
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">23 cleaning requests</p>
            <p className="text-xs text-slate-500">in the last hour in Phoenix</p>
          </div>
        </div>
        <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 w-2/3 animate-pulse" />
        </div>
      </div>

      {/* Title Header Overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Cleaning Crews Active Now</h3>
        <p className="text-teal-600 font-medium text-sm">Serving the Greater Phoenix Metropolitan Area</p>
      </div>
    </div>
  );
}
