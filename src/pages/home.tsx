import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion"
import { 
  Sparkles, 
  Home, 
  Building2, 
  MapPin, 
  Star, 
  ShieldCheck,
  Clock,
  Menu,
  X,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Users,
  Briefcase,
  LogOut,
  CalendarDays,
  Trash2,
  Quote,
  ArrowRight,
  Diamond,
  CheckCircle,
  Lock,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { AuthForm } from "@/components/auth-form"
import { getGuestId } from "@/lib/guest"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// --- Helper Components ---

const AnimatedNumber = ({ value }: { value: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/[^0-9]/g, ""))

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return (
    <span ref={ref} className="font-serif">
      {count.toLocaleString()}{value.includes("+") ? "+" : ""}
    </span>
  )
}

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useConvexAuth()
  const { signOut } = useAuthActions()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
      isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-accent/10 shadow-lg py-3" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_20px_rgba(191,155,48,0.3)] shimmer group-hover:rotate-12 transition-transform duration-500">
            <Diamond className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl tracking-tight uppercase font-medium">The Spoiled Brand</span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {["Services", "Live Demand", "Book Now"].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`} 
              className="text-xs uppercase tracking-widest font-semibold hover:text-primary transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
          {isAuthenticated && (
            <a href="#my-bookings" className="text-xs uppercase tracking-widest font-semibold hover:text-primary transition-colors relative group">
              My Bookings
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          )}
          
          <div className="flex items-center gap-6 border-l border-primary/20 pl-6">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/20 p-0 overflow-hidden">
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <a href="#my-bookings" className="cursor-pointer flex items-center py-2">
                      <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                      <span>My Bookings</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive py-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthForm trigger={<button className="text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors">Sign In</button>} />
            )}
            <Button asChild variant="default" size="sm" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
              <a href="#booking">Book Now</a>
            </Button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/10 p-8 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            {["Services", "Live Demand", "Book Now"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-lg font-serif tracking-wide border-b border-primary/5 pb-2"
              >
                {item}
              </a>
            ))}
            {isAuthenticated && (
              <a href="#my-bookings" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif tracking-wide border-b border-primary/5 pb-2">
                My Bookings
              </a>
            )}
            <div className="flex flex-col gap-4 pt-4">
              {!isAuthenticated ? (
                <AuthForm trigger={<Button variant="outline" className="w-full rounded-full border-primary/20">Sign In</Button>} />
              ) : (
                <Button variant="outline" className="w-full rounded-full border-primary/20" onClick={() => signOut()}>Log Out</Button>
              )}
              <Button asChild className="w-full rounded-full bg-primary text-primary-foreground">
                <a href="#booking" onClick={() => setIsMobileMenuOpen(false)}>Book Now</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const PhoenixMap = ({ liveCount }: { liveCount: number }) => {
  const [pings, setPings] = useState([
    { id: 1, x: 30, y: 40, type: "progress", label: "Concierge Cleaning" },
    { id: 2, x: 60, y: 25, type: "requested", label: "VIP Request" },
    { id: 3, x: 45, y: 70, type: "progress", label: "Estate Maintenance" },
    { id: 4, x: 75, y: 55, type: "requested", label: "New Booking" },
    { id: 5, x: 20, y: 65, type: "progress", label: "Penthouse Turnover" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const newPing = {
        id: Date.now(),
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        type: Math.random() > 0.5 ? "progress" : "requested",
        label: Math.random() > 0.5 ? "VIP Cleaning" : "Elite Request"
      }
      setPings(prev => [...prev.slice(-6), newPing])
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-accent/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* Abstract Map Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600">
        <path d="M0,200 L1000,400 M300,0 L700,600 M0,500 L1000,100" stroke="var(--accent)" strokeWidth="0.5" fill="none" />
        <circle cx="500" cy="300" r="200" stroke="var(--accent)" strokeWidth="0.5" fill="none" />
      </svg>

      <div className="absolute top-8 left-8 z-10">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-primary/30 rounded-full flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">🔴 LIVE: {liveCount} active cleans right now</span>
        </div>
      </div>

      <AnimatePresence>
        {pings.map((ping) => (
          <motion.div
            key={ping.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative flex items-center justify-center">
              <motion.span 
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inline-flex h-16 w-16 rounded-full bg-primary/30" 
              />
              <div className="relative bg-black border border-primary/50 p-2.5 rounded-full shadow-[0_0_15px_rgba(191,155,48,0.4)]">
                {ping.type === "progress" ? <Sparkles className="w-4 h-4 text-primary" /> : <Diamond className="w-4 h-4 text-primary" />}
              </div>
              
              <div className="absolute top-full mt-3 whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] font-bold text-primary border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                {ping.label}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="absolute bottom-8 right-8 text-right space-y-1">
        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em]">Operational Zone</p>
        <p className="text-2xl font-serif text-white italic">Greater Phoenix Valley</p>
        <p className="text-[10px] text-primary/40 uppercase tracking-widest">Scottsdale • Biltmore</p>
      </div>
    </div>
  )
}

const MyBookings = () => {
  const bookings = useQuery(api.bookings.listByUser)
  const cancelBooking = useMutation(api.bookings.cancel)

  const handleCancel = async (id: any) => {
    try {
      await cancelBooking({ id })
      toast.success("Booking cancelled")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking")
    }
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-20 text-center border-dashed border-2 border-primary/20 bg-primary/5 rounded-[2rem]">
        <CalendarDays className="w-16 h-16 mx-auto text-primary/40 mb-6" />
        <h3 className="text-3xl font-serif mb-3 italic">No reservations found</h3>
        <p className="text-muted-foreground mb-10 font-light">Your luxury cleaning journey begins with a single reservation.</p>
        <Button asChild className="rounded-full bg-primary text-primary-foreground px-10 h-14 text-lg">
          <a href="#booking">Book Your First Clean</a>
        </Button>
      </Card>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {bookings.map((booking) => (
        <motion.div
          key={booking._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border border-primary/10 shadow-xl bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all rounded-[1.5rem] group">
            <CardHeader className="pb-4 border-b border-primary/5">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-3 uppercase text-[10px] tracking-widest border-primary/30 text-primary">
                    {booking.status}
                  </Badge>
                  <CardTitle className="text-2xl font-serif italic capitalize">{booking.serviceType} Suite</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-lg font-serif text-primary">{new Date(booking.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{booking.timeSlot}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {booking.rooms.map((room, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/5">
                      {room}
                    </span>
                  ))}
                </div>
                {booking.notes && (
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-4 h-4 text-primary/20" />
                    <p className="text-sm text-muted-foreground bg-primary/5 p-4 rounded-xl italic pl-6 border-l-2 border-primary/30">
                      {booking.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-primary/5 flex justify-between items-center bg-primary/[0.02]">
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Frequency: {booking.frequency}</p>
              {booking.status !== "cancelled" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/5 rounded-full text-xs uppercase tracking-widest font-bold"
                  onClick={() => handleCancel(booking._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel Reservation
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

const BookingFlow = () => {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [serviceType, setServiceType] = useState<string>("home")
  const [timeSlot, setTimeSlot] = useState("Morning (8am - 12pm)")
  const [frequency, setFrequency] = useState("One-time")
  const [notes, setNotes] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  
  const { isAuthenticated } = useConvexAuth()
  const createBooking = useMutation(api.bookings.create)

  const serviceTypes = [
    { id: "home", label: "Residential Estate", icon: Home, description: "Bespoke home maintenance" },
    { id: "airbnb", label: "Luxury Rental", icon: Sparkles, description: "Concierge-level turnovers" },
    { id: "office", label: "Executive Suite", icon: Building2, description: "Premium commercial care" },
  ]
  
  const rooms = [
    { id: "living", label: "Grand Living", icon: Home },
    { id: "kitchen", label: "Gourmet Kitchen", icon: Sparkles },
    { id: "bedrooms", label: "Master Suites", icon: Building2 },
    { id: "bathrooms", label: "Spa Bathrooms", icon: Sparkles },
    { id: "office", label: "Private Study", icon: Briefcase },
  ]

  const handleToggleRoom = (id: string) => {
    setSelectedRooms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleBook = async () => {
    try {
      if (!date) {
        toast.error("Please select a date")
        return
      }
      
      if (selectedRooms.length === 0) {
        toast.error("Please select at least one space")
        return
      }

      if (!isAuthenticated && (!guestName || !guestEmail || !guestPhone)) {
        toast.error("Please provide your contact details")
        return
      }

      await createBooking({
        serviceType,
        rooms: selectedRooms,
        date: date.toISOString(),
        timeSlot,
        frequency,
        notes,
        ...(isAuthenticated ? {} : { guestName, guestEmail, guestPhone })
      })

      toast.success("You're in!", {
        description: "Our team will call you within 2 hours to confirm everything."
      })
      
      setStep(1)
      setSelectedRooms([])
      setNotes("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed")
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)] border-none rounded-[3rem]">
      <div className="grid lg:grid-cols-10 min-h-[700px]">
        {/* Left Panel */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[oklch(0.45_0.15_250/0.3)] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">Reservation</Badge>
            <h3 className="text-5xl font-serif mb-6 italic leading-tight">Begin Your <br />Transformation.</h3>
            <p className="text-white/60 text-lg font-light leading-relaxed mb-10">
              Select your requirements and preferred schedule. We curate every detail to meet the Spoiled standard.
            </p>
            
            <div className="space-y-8">
              {[
                { icon: ShieldCheck, title: "Discrete & Professional", desc: "Background-checked elite teams" },
                { icon: Diamond, title: "Premium Materials", desc: "Eco-luxury cleaning solutions" },
                { icon: Star, title: "White-Glove Service", desc: "100% Satisfaction commitment" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl italic">{item.title}</h4>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10 mt-12 flex items-center justify-between">
            <div>
              <div className="flex -space-x-3 mb-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-primary/20 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="client" className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">+2.4k</div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Trusted by Phoenix Elites</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Flow */}
        <div className="lg:col-span-6 p-12 bg-background flex flex-col">
          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent/20 -translate-y-1/2 z-0" />
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                  step >= s ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(191,155,48,0.4)]" : "bg-muted text-muted-foreground border border-accent/10",
                  step === s && "animate-pulse ring-4 ring-primary/20"
                )}
              >
                {s}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h4 className="text-3xl font-serif italic">What Needs Our Attention?</h4>
                    <p className="text-muted-foreground text-sm font-light">Choose the environment that requires our attention.</p>
                  </div>
                  <div className="grid gap-4">
                    {serviceTypes.map((type) => (
                      <div 
                        key={type.id}
                        onClick={() => setServiceType(type.id)}
                        className={cn(
                          "flex items-center space-x-6 p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer group",
                          serviceType === type.id 
                            ? "border-primary bg-primary/5 shadow-inner" 
                            : "border-primary/5 hover:border-primary/30 bg-muted/30"
                        )}
                      >
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                          serviceType === type.id ? "bg-primary text-primary-foreground rotate-6" : "bg-background text-muted-foreground group-hover:rotate-3"
                        )}>
                          <type.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xl font-serif italic">{type.label}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full h-16 text-lg rounded-full group bg-primary text-primary-foreground shadow-xl shadow-primary/20 mt-8" onClick={() => setStep(2)}>
                    Continue to Spaces
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h4 className="text-3xl font-serif italic">Which Rooms Need the Most Love?</h4>
                    <p className="text-muted-foreground text-sm font-light">Select the specific areas that require meticulous care.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {rooms.map((room) => (
                      <div 
                        key={room.id}
                        onClick={() => handleToggleRoom(room.id)}
                        className={cn(
                          "flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all cursor-pointer",
                          selectedRooms.includes(room.id) 
                            ? "border-primary bg-primary/5 shadow-inner" 
                            : "border-primary/5 hover:border-primary/30 bg-muted/30"
                        )}
                      >
                        <Checkbox 
                          id={room.id} 
                          checked={selectedRooms.includes(room.id)}
                          onCheckedChange={() => handleToggleRoom(room.id)}
                          className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <div className="flex-1">
                          <Label htmlFor={room.id} className="cursor-pointer font-serif italic text-lg">{room.label}</Label>
                        </div>
                        <room.icon className={cn("w-5 h-5 transition-colors", selectedRooms.includes(room.id) ? "text-primary" : "text-muted-foreground/30")} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-8">
                    <Button variant="outline" className="h-16 flex-1 rounded-full border-primary/20" onClick={() => setStep(1)}>Back</Button>
                    <Button className="h-16 flex-[2] text-lg rounded-full group bg-primary text-primary-foreground shadow-xl shadow-primary/20" onClick={() => setStep(3)}>
                      Continue to Schedule
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h4 className="text-3xl font-serif italic">When Works Best for You?</h4>
                    <p className="text-muted-foreground text-sm font-light">Choose your preferred timing and provide contact details.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                      <div className="p-4 bg-muted/30 rounded-3xl border border-primary/10">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md mx-auto"
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-primary">Preferred Time Window</Label>
                          <select 
                            className="flex h-12 w-full rounded-xl border border-primary/20 bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                          >
                            <option>Morning (8am - 12pm)</option>
                            <option>Afternoon (12pm - 4pm)</option>
                            <option>Evening (4pm - 8pm)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-primary">Service Frequency</Label>
                          <select 
                            className="flex h-12 w-full rounded-xl border border-primary/20 bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                          >
                            <option>One-time Experience</option>
                            <option>Weekly Maintenance (Save 20%)</option>
                            <option>Bi-weekly Care (Save 15%)</option>
                            <option>Monthly Refresh (Save 10%)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="space-y-6 pt-8 border-t border-primary/10">
                      <p className="text-xl font-serif italic">Contact Information</p>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name</Label>
                          <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="E.g. Julian Vanderbilt" className="h-12 rounded-xl border-primary/20 bg-muted/20" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email Address</Label>
                          <Input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="name@domain.com" type="email" className="h-12 rounded-xl border-primary/20 bg-muted/20" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone Number</Label>
                          <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="(602) 555-0000" className="h-12 rounded-xl border-primary/20 bg-muted/20" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Special Requirements</Label>
                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Entry codes, pet care, specific focus areas..." className="h-12 rounded-xl border-primary/20 bg-muted/20" />
                  </div>

                  <div className="flex flex-col gap-4 pt-8">
                    <p className="text-center text-xs font-bold text-primary animate-pulse">🔥 High demand this week — confirm now to lock in your preferred time</p>
                    <div className="flex flex-col gap-4">
                      <p className="text-center text-[10px] uppercase tracking-widest font-bold text-primary/60 flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" /> Your time slot is held for 10 minutes
                      </p>
                      <div className="flex gap-4">
                        <Button variant="outline" className="h-16 flex-1 rounded-full border-primary/20" onClick={() => setStep(2)}>Back</Button>
                        <Button className="h-16 flex-[2] text-lg rounded-full group bg-primary text-primary-foreground shadow-xl shadow-primary/20" onClick={handleBook}>
                          Complete Reservation
                          <Sparkles className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4">
                      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        ✓ No payment required now • ✓ Free cancellation • ✓ Confirmation call within 2 hours
                      </p>
                      <div className="flex justify-center items-center gap-6 opacity-40">
                        {[
                          { icon: ShieldCheck, label: "Licensed" },
                          { icon: Lock, label: "Insured" },
                          { icon: Award, label: "BBB A+" },
                          { icon: CheckCircle, label: "Background Checked" }
                        ].map((badge, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <badge.icon className="w-4 h-4" />
                            <span className="text-[8px] uppercase tracking-tighter font-bold">{badge.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  )
}

const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = "touches" in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX
    const pos = ((x - rect.left) / rect.width) * 100
    setSliderPos(Math.max(0, Math.min(100, pos)))
  }

  const imageUrl = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1400"

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden cursor-ew-resize select-none border border-primary/20 shadow-2xl group"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Before Image (Background - Dirty) */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={imageUrl} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.3) brightness(0.7) contrast(1.1) sepia(0.4)" }}
        />
        {/* Dust/Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        
        <div className="absolute bottom-8 left-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 z-10">
          <span className="text-white font-serif italic text-sm md:text-lg">Before The Spoiled Brand</span>
        </div>
      </div>

      {/* After Image (Clipped Foreground - Clean) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
      >
        <img 
          src={imageUrl} 
          alt="After" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-8 right-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 z-10">
          <span className="text-white font-serif italic text-sm md:text-lg">After The Spoiled Brand</span>
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 w-1 bg-primary cursor-ew-resize flex items-center justify-center z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(191,155,48,0.8)] border-4 border-black/20 transition-transform group-hover:scale-110">
          <Diamond className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
        </div>
      </div>
    </div>
  )
}

const FAQSection = () => {
  const faqs = [
    {
      q: "What makes The Spoiled Brand different from other cleaning services?",
      a: "Unlike traditional cleaning companies, we operate as a luxury concierge. This means obsessive attention to detail, premium eco-luxury products, and a dedicated team that learns the specific soul of your home. We don't just clean; we restore your sanctuary to its intended state of perfection."
    },
    {
      q: "Are your teams background-checked and insured?",
      a: "Every member of our elite team undergoes a rigorous multi-state background check and professional certification. We are fully licensed, bonded, and insured, providing you with absolute peace of mind while we care for your most private spaces."
    },
    {
      q: "How do I schedule a recurring cleaning?",
      a: "Scheduling recurring care is simple through our digital concierge. After your first experience, you can select weekly, bi-weekly, or monthly intervals. Recurring clients receive priority scheduling and exclusive 'Inner Circle' pricing."
    },
    {
      q: "What areas in Phoenix do you serve?",
      a: "We serve the entire Greater Phoenix Valley, with a primary focus on Scottsdale, Biltmore, Arcadia, and North Phoenix. If you're unsure if we reach your estate, contact our concierge team."
    },
    {
      q: "Can I customize my cleaning package?",
      a: "Absolutely. We understand that every home has unique requirements. From organizing your master closet to specialized care for delicate surfaces like marble or hardwood, we can tailor our service to your exact standards."
    },
    {
      q: "What's your cancellation policy?",
      a: "We value your time and ours. We request a 48-hour notice for any cancellations or rescheduling to allow our teams to adjust their routes. Cancellations within 24 hours may incur a standard reservation fee."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto bg-[oklch(0.45_0.15_250/0.05)] p-12 md:p-20 rounded-[3rem] border border-accent/10">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b border-accent/10 px-4">
            <AccordionTrigger className="text-xl md:text-2xl font-serif italic hover:no-underline text-left py-6">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-lg font-light text-muted-foreground leading-relaxed pb-6">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 47 * 60 + 13)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const format = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="flex gap-4 items-center">
      {[format(hours), format(minutes), format(seconds)].map((unit, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="bg-black/40 border border-primary/30 w-16 h-20 rounded-xl flex items-center justify-center">
            <span className="text-4xl font-serif text-primary">{unit}</span>
          </div>
          {i < 2 && <span className="text-4xl font-serif text-primary/50">:</span>}
        </div>
      ))}
    </div>
  )
}

// --- Main Page ---

export function HomePage() {
  const { isAuthenticated } = useConvexAuth()
  const listProducts = useAction(api.pay.listProducts)
  const createCheckout = useAction(api.pay.createCheckout)
  const guestCheckout = useAction(api.pay.guestCheckout)
  const subscribe = useMutation(api.emailSignups.subscribe)
  
  const [products, setProducts] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [liveCount, setLiveCount] = useState(14)

  // Funnel States
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [isStickyDismissed, setIsStickyDismissed] = useState(false)
  const [proofIndex, setProofIndex] = useState(0)
  const [showProof, setShowProof] = useState(false)
  const [isProofDismissed, setIsProofDismissed] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false)

  const socialProofs = [
    "Sarah M. in Scottsdale just booked a Deep Clean — 3 min ago",
    "Marcus T. in Tempe scheduled a Weekly Service — 7 min ago",
    "Jennifer K. booked 3 Airbnb Turnovers — 12 min ago",
    "David R. in Gilbert just claimed the first-time offer — 18 min ago",
    "Amanda L. in Chandler upgraded to Weekly — 24 min ago",
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600 && !isStickyDismissed) {
        setShowStickyBar(true)
      } else {
        setShowStickyBar(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isStickyDismissed])

  useEffect(() => {
    if (isProofDismissed) return

    const interval = setInterval(() => {
      setShowProof(true)
      setTimeout(() => setShowProof(false), 5000)
      setProofIndex((prev) => (prev + 1) % socialProofs.length)
    }, 15000)

    // Initial delay
    const initialDelay = setTimeout(() => {
      setShowProof(true)
      setTimeout(() => setShowProof(false), 5000)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(initialDelay)
    }
  }, [isProofDismissed, socialProofs.length])

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent && window.innerWidth > 768) {
        setShowExitIntent(true)
        setHasShownExitIntent(true)
      }
    }
    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasShownExitIntent])

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await listProducts() as any
        if (result.data) {
          setProducts(result.data)
        } else if (Array.isArray(result)) {
          setProducts(result)
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      }
    }
    fetchProducts()
  }, [listProducts])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(11, Math.min(18, prev + change))
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleCheckout = async (slug: string) => {
    try {
      const product = products.find(p => p.product.slug === slug)
      if (!product || !product.prices[0]) {
        toast.error("Product not found")
        return
      }

      const priceId = product.prices[0].priceId
      let result: any

      if (isAuthenticated) {
        result = await createCheckout({ priceId, productSlug: slug, successUrl: window.location.origin })
      } else {
        result = await guestCheckout({ 
          priceId, 
          productSlug: slug, 
          customerId: getGuestId(),
          successUrl: window.location.origin 
        })
      }

      const purchaseUrl = result?.data?.purchaseUrl || result?.purchaseUrl

      if (purchaseUrl) {
        window.open(purchaseUrl, "_blank", "noopener,noreferrer")
      } else {
        toast.error("Failed to create checkout session")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed")
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    try {
      await subscribe({ email })
      toast.success("Welcome to the Inner Circle", {
        description: "Your exclusive 20% discount has been sent to your inbox."
      })
      setEmail("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription failed")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 bg-background overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1600607687940-4e7a6a357d19?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background" />
          
          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </motion.div>

        {/* Floating Gold & Sea Blue Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute w-1.5 h-1.5 rounded-full blur-[1px] opacity-40",
                i % 2 === 0 ? "bg-primary" : "bg-accent"
              )}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%" 
              }}
              animate={{ 
                y: ["-10%", "110%"],
                x: ["0%", (Math.random() - 0.5) * 20 + "%"]
              }}
              transition={{ 
                duration: 15 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="inline-flex flex-col gap-4 mb-4">
              <div className="inline-flex items-center gap-3 bg-[oklch(0.45_0.15_250/0.15)] backdrop-blur-md px-6 py-2 rounded-full border border-white/10 mx-auto">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Phoenix's Premier Concierge Cleaning</span>
              </div>
              <p className="text-primary font-bold text-sm tracking-widest uppercase animate-bounce">
                ⚡ Only 12 spots available this month — Phoenix demand is at an all-time high
              </p>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-serif text-white italic leading-[0.9] tracking-tighter">
              <motion.span
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="block"
              >
                What If You Never
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.8 }}
                className="block text-gold-gradient"
              >
                Had to Clean Again?
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-white/80 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-12"
            >
              You work too hard to come home to dust. You host too often to stress about stains. Let Phoenix's most trusted cleaning concierge handle every detail.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform duration-500 shadow-[0_20px_50px_rgba(191,155,48,0.3)] group" asChild>
                <a href="#booking">
                  Claim Your Free Estimate
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="mt-8 flex justify-center"
            >
              <a href="https://www.instagram.com/spoiledhomescleaningservicellc/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors text-sm">
                <Instagram className="w-4 h-4" /> @spoiledhomescleaningservicellc
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Glass Stats */}
        <div className="absolute bottom-12 left-0 w-full hidden lg:block">
          <div className="container mx-auto px-6 flex justify-between items-end">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] max-w-xs"
            >
              <p className="text-primary font-serif text-4xl mb-2 italic">4.9/5</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Client Satisfaction across the Valley</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] max-w-xs text-right"
            >
              <p className="text-primary font-serif text-4xl mb-2 italic">5,000+</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Masterpiece Cleans Completed</p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="mouse-scroll-icon" />
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* Before/After Slider Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] px-4 py-1">Interactive Reveal</Badge>
              <h2 className="text-5xl md:text-7xl font-serif italic">Drag to Reveal the Difference</h2>
              <p className="text-muted-foreground text-lg font-light max-w-xl">
                Experience the precision of our elite teams. Move the slider to see how we transform cluttered spaces into serene sanctuaries.
              </p>
            </div>
            <BeforeAfterSlider />
          </div>
        </div>
      </section>

      {/* Urgency Banner */}
      <section className="bg-[#0a1628] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
              <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.2em]">Limited Time Offer</Badge>
              <h3 className="text-3xl md:text-4xl font-serif text-white italic">
                ⏰ This Week Only: First-Time Clients Get a <br />
                <span className="text-primary">Free Deep Clean Add-On (Value: $75)</span>
              </h3>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <CountdownTimer />
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground px-12 h-14 font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                <a href="#book-now">Claim This Offer</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Animated Divider */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-32 origin-center"
          />

          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] px-4 py-1">Our Expertise</Badge>
              <h2 className="text-5xl md:text-7xl font-serif italic leading-tight">Curated Care for <br />Distinguished Spaces.</h2>
            </div>
            <p className="text-muted-foreground text-lg font-light max-w-md leading-relaxed">
              Every space has a soul. We treat your environment with the reverence it deserves, using artisanal techniques and premium products.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-32">
            {[
              {
                slug: "home-cleaning",
                title: "Your Sanctuary, Restored",
                description: "Imagine walking through your front door and breathing in... nothing. No dust, no stress, just the quiet luxury of a perfectly maintained home. That's the Spoiled standard.",
                icon: Home,
                price: "$120",
                img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                num: "01"
              },
              {
                slug: "airbnb-cleaning",
                title: "5-Star Reviews Start Here",
                description: "Your guests notice everything. Streaky mirrors, dusty baseboards, that one hair in the shower. We eliminate every trace so your reviews write themselves.",
                icon: Sparkles,
                price: "$150",
                img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
                num: "02",
                popular: true
              },
              {
                slug: "office-cleaning",
                title: "First Impressions, Perfected",
                description: "Your office speaks before you do. A pristine workspace tells clients you care about details. We make sure every surface reflects your standards.",
                icon: Building2,
                price: "Custom",
                img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
                num: "03"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 group-hover:translate-x-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {service.popular && (
                    <div className="absolute top-8 right-8 z-10">
                      <Badge className="bg-primary text-primary-foreground font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">Most Popular</Badge>
                    </div>
                  )}

                  <div className="absolute top-8 left-8">
                    <span className="text-6xl font-serif text-[oklch(0.45_0.15_250/0.25)] italic">{service.num}</span>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="w-12 h-12 bg-primary/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white mb-4">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-serif text-white italic mb-2">{service.title}</h3>
                    <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-2">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Premier Rate</p>
                    <p className="text-xl font-serif italic text-primary">Starting at {service.price}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="rounded-full w-14 h-14 border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-500 group/btn"
                    onClick={() => handleCheckout(service.slug)}
                  >
                    <ArrowRight className="w-6 h-6 group-hover/btn:scale-110 group-hover/btn:rotate-[-45deg] transition-transform duration-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Bar */}
          <div className="w-full bg-[oklch(0.45_0.15_250/0.03)] rounded-[2rem] p-8 md:p-12 flex flex-wrap justify-center items-center gap-8 md:gap-16 border border-accent/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            {["Licensed", "Bonded", "Insured", "BBB A+ Rated", "5,000+ Cleans"].map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-Page CTA Break */}
      <section className="py-24 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Still Thinking About It?</h2>
            <p className="text-muted-foreground text-xl font-light mb-12">
              Most clients say they wish they'd called us sooner. Here's what you get when you book today:
            </p>
            
            <div className="grid md:grid-cols-3 gap-12 mb-16">
              {[
                { icon: ShieldCheck, title: "Free walkthrough & custom quote", desc: "No pressure, just expertise." },
                { icon: Clock, title: "Same-week availability", desc: "We make room for our new clients." },
                { icon: Star, title: "100% satisfaction or we re-clean free", desc: "Our standard is absolute." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-serif italic">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <Button asChild size="lg" className="h-20 px-12 text-xl rounded-full bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(191,155,48,0.3)] hover:scale-105 transition-transform duration-500">
                <a href="#book-now">Get Your Free Quote in 60 Seconds</a>
              </Button>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                No credit card required • Cancel anytime • 4.9★ rated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="live-demand" className="py-32 bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.3em] px-4 py-1">Real-Time Activity</Badge>
                <h2 className="text-5xl md:text-7xl font-serif italic leading-tight">Right Now, {liveCount} Homes Are Being Spoiled Across Phoenix</h2>
                <p className="text-white/40 text-xl font-light leading-relaxed">
                  Our teams are fully booked most weeks. Reserve your slot before your neighbor does.
                </p>
              </div>
              
              <div className="grid gap-10">
                {[
                  { icon: Clock, title: "15-Min Response", desc: "Our concierge team is always on standby for your requests." },
                  { icon: Users, title: "Local Specialists", desc: "Teams dedicated to specific neighborhoods for absolute punctuality." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-serif italic">{item.title}</h4>
                      <p className="text-white/40 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" asChild className="h-16 px-12 rounded-full bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(191,155,48,0.2)]">
                <a href="#booking">Join the Elite Schedule</a>
              </Button>
            </div>
            
            <div className="flex-1 w-full lg:w-auto">
              <PhoenixMap liveCount={liveCount} />
            </div>
          </div>
        </div>
      </section>

      {/* My Bookings Section */}
      {isAuthenticated && (
        <section id="my-bookings" className="py-32 bg-background">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-24 space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] px-4 py-1">Your Portfolio</Badge>
              <h2 className="text-5xl md:text-7xl font-serif italic">Your Reservations</h2>
              <div className="w-24 h-[1px] bg-primary/30" />
            </div>
            <MyBookings />
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section id="book-now" className="py-32 bg-primary/5 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] px-4 py-1">Reservation</Badge>
            <h2 className="text-5xl md:text-7xl font-serif italic">Secure Your Experience</h2>
            <p className="text-muted-foreground text-lg font-light max-w-xl">
              Complete your reservation in moments. Our concierge will handle every detail from there.
            </p>
          </div>
          <BookingFlow />
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Infinite Marquee Strip */}
        <div className="bg-[oklch(0.15_0.08_250)] border-y border-accent/20 py-4 overflow-hidden mb-32">
          <div className="marquee-track">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <span className="text-primary font-bold text-xs uppercase tracking-[0.5em] whitespace-nowrap">Phoenix's Most Trusted</span>
                <Diamond className="w-3 h-3 text-accent/40" />
                <span className="text-primary font-bold text-xs uppercase tracking-[0.5em] whitespace-nowrap">4.9 Stars</span>
                <Diamond className="w-3 h-3 text-accent/40" />
                <span className="text-primary font-bold text-xs uppercase tracking-[0.5em] whitespace-nowrap">2,400+ Families</span>
                <Diamond className="w-3 h-3 text-accent/40" />
                <span className="text-primary font-bold text-xs uppercase tracking-[0.5em] whitespace-nowrap">White-Glove Service</span>
                <Diamond className="w-3 h-3 text-accent/40" />
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-32 border-y border-primary/10 py-16">
            {[
              { label: "Years of Making Phoenix Homes Unrecognizable", value: "5+" },
              { label: "Families Who Refuse to Go Back", value: "2,400+" },
              { label: "Background-Checked Cleaning Artists", value: "150+" },
              { label: "Cities Across the Valley", value: "15+" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-3">
                <p className="text-5xl md:text-7xl font-serif text-primary italic">
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] max-w-[150px] mx-auto">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-24">
            <div className="flex flex-col items-center text-center space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] px-4 py-1">Testimonials</Badge>
              <h3 className="text-5xl md:text-7xl font-serif italic">Voices of Excellence</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  quote: "I cancelled my other cleaning service after ONE visit from The Spoiled Brand. The difference was embarrassing — I didn't realize how much my old service was missing.",
                  author: "Sarah M.",
                  role: "Scottsdale Superhost (47 five-star reviews)"
                },
                {
                  quote: "My wife literally cried when she came home after their first deep clean. We'd been living with 'clean enough' for years. Now we're spoiled — and we're never going back.",
                  author: "Marcus T.",
                  role: "Phoenix Resident"
                },
                {
                  quote: "I run three Airbnbs. Since switching to The Spoiled Brand, my average review went from 4.6 to 4.9 stars. They pay for themselves.",
                  author: "Jennifer K.",
                  role: "Tempe Property Manager"
                }
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  whileHover={{ y: -8 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-primary/[0.03] border border-primary/5 shadow-xl p-12 rounded-[3.5rem] relative group hover:bg-primary/[0.06] hover:shadow-2xl transition-all duration-500 min-h-[450px] flex flex-col justify-between">
                    <Quote className="absolute top-10 right-10 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
                    <div className="space-y-8 relative z-10">
                      <div className="flex gap-1 text-primary">
                        {[1,2,3,4,5].map(j => <Star key={j} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-2xl font-serif italic text-foreground/80 leading-relaxed">"{t.quote}"</p>
                    </div>
                    <div className="pt-8 border-t border-primary/10 flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-serif text-2xl italic text-primary border border-primary/30">
                        {t.author[0]}
                      </div>
                      <div>
                        <p className="font-serif text-xl italic">{t.author}</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Closing Argument Strip */}
            <div className="mt-48 text-center space-y-12 py-24 border-t border-primary/10">
              <div className="flex justify-center gap-2 text-primary mb-8">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-8 h-8 fill-current" />)}
              </div>
              <h4 className="text-4xl md:text-6xl font-serif italic max-w-4xl mx-auto leading-tight">
                "Join 2,400+ families who made the switch. Your home deserves the Spoiled standard."
              </h4>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                <Button asChild size="lg" className="h-16 px-12 text-lg rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  <a href="#book-now">Book Your First Clean</a>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 text-lg rounded-full border-primary/20 hover:bg-primary/5 hover:scale-105 transition-transform" asChild>
                  <a href="tel:6024564157">
                    <Phone className="mr-2 w-5 h-5" /> Call Us: (602) 456-4157
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-6 mb-24">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] px-4 py-1">Common Inquiries</Badge>
            <h2 className="text-5xl md:text-7xl font-serif italic">Your Questions, Answered</h2>
          </div>
          <FAQSection />
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-32 bg-[#0a0a0a] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--accent) 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[oklch(0.45_0.15_250/0.12)] rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.3em] px-4 py-1">The Inner Circle</Badge>
            <h2 className="text-6xl md:text-8xl font-serif italic leading-tight">Your First Clean is <br /><span className="text-gold-gradient">20% Off. No Catch.</span></h2>
            <p className="text-white/40 text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Join 2,400+ Phoenix homeowners who get exclusive cleaning tips, seasonal deep-clean reminders, and members-only pricing. Your inbox will thank you.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={handleSubscribe}>
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="h-16 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-full px-8 text-lg focus:ring-primary/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="default" size="lg" className="h-16 rounded-full px-12 bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform duration-500 shadow-xl shadow-primary/20" disabled={isSubscribing}>
                {isSubscribing ? "Processing..." : "Send Me the Discount"}
              </Button>
            </form>
            <div className="space-y-4">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">📩 Check your inbox — your 20% code arrives instantly</p>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Privacy is Paramount. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-primary/10 pt-32 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Diamond className="w-5 h-5" />
                </div>
                <span className="font-serif text-2xl tracking-tight uppercase font-medium">The Spoiled Brand</span>
              </div>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                The valley's most distinguished cleaning concierge. Redefining the standards of residential excellence since 2021.
              </p>
              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Licensed • Bonded • Insured • BBB A+ Rated</p>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                    <a href="https://www.instagram.com/spoiledhomescleaningservicellc/" target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 border border-primary/10 hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all duration-500">
                        <Instagram className="w-5 h-5" />
                      </Button>
                    </a>
                    {[Facebook, Mail].map((Icon, i) => (
                      <Button key={i} variant="ghost" size="icon" className="rounded-full w-12 h-12 border border-primary/10 hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all duration-500">
                        <Icon className="w-5 h-5" />
                      </Button>
                    ))}
                  </div>
                  <a href="https://www.instagram.com/spoiledhomescleaningservicellc/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium">
                    @spoiledhomescleaningservicellc
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-10">The Experience</h4>
              <ul className="space-y-5 text-lg font-serif italic">
                {["Services", "Booking", "Service Area", "Gift Cards", "Careers"].map(item => (
                  <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-10">Concierge</h4>
              <ul className="space-y-5 text-muted-foreground font-light">
                <li className="flex items-center gap-4"><Phone className="w-4 h-4 text-primary" /> (602) 456-4157</li>
                <li className="flex items-center gap-4"><Mail className="w-4 h-4 text-primary" /> info@spoiledcleaningservice.com</li>
                <li className="flex items-center gap-4"><MapPin className="w-4 h-4 text-primary" /> Phoenix, Arizona</li>
                <li className="flex items-center gap-4"><Clock className="w-4 h-4 text-primary" /> Mon-Sat: 8am - 8pm</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-10">Operational Valley</h4>
              <div className="flex flex-wrap gap-3">
                {["Phoenix", "Scottsdale", "Tempe", "Gilbert", "Mesa", "Chandler", "Glendale"].map(city => (
                  <span key={city} className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-primary/10 rounded-full text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-default">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="mt-12 flex flex-col md:row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
            <p>© 2026 THE SPOILED BRAND. PROUDLY SERVING PHOENIX SINCE 2021.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Engagement</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTA Bar */}
      <AnimatePresence>
        {showStickyBar && !isStickyDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-primary/20 p-4 md:p-6"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsStickyDismissed(true)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <p className="text-primary font-bold text-sm tracking-widest uppercase animate-pulse">
                  🔥 Limited spots this week — Scottsdale & Biltmore filling fast
                </p>
              </div>
              <Button asChild size="lg" className="w-full md:w-auto rounded-full bg-primary text-primary-foreground font-bold px-8 shadow-lg shadow-primary/20">
                <a href="#book-now">Book Now — Free Estimate</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Proof Popup */}
      <AnimatePresence>
        {showProof && !isProofDismissed && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className={cn(
              "fixed left-6 z-50 bg-white shadow-2xl border border-primary/10 rounded-2xl p-4 max-w-[300px] transition-all duration-500",
              showStickyBar && !isStickyDismissed ? "bottom-28" : "bottom-6"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1 pr-6">
                <p className="text-xs font-medium text-foreground leading-snug">
                  {socialProofs[proofIndex]}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">Verified Booking</span>
                </div>
              </div>
              <button 
                onClick={() => setIsProofDismissed(true)}
                className="absolute top-2 right-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit-Intent Overlay */}
      <Dialog open={showExitIntent} onOpenChange={setShowExitIntent}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-primary/20 bg-background overflow-hidden p-0">
          <div className="relative p-12 space-y-8 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] -z-10" />
            
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.2em]">One-Time Offer</Badge>
              <h2 className="text-4xl font-serif italic leading-tight">Wait — Don't Leave Without Your 20% Off</h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                Join 2,400+ Phoenix homeowners who switched to The Spoiled Brand. Your first clean is on us (almost).
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubscribe(e); setShowExitIntent(false); }}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-14 rounded-full border-primary/20 bg-muted/30 px-6"
                required
              />
              <Button type="submit" className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20">
                Send My Discount
              </Button>
            </form>

            <div className="pt-4">
              <a 
                href="#book-now" 
                onClick={() => setShowExitIntent(false)}
                className="text-sm text-primary hover:underline font-medium"
              >
                Or book directly →
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
