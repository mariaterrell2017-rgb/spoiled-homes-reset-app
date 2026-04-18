import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Diamond } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthFormProps {
  trigger?: React.ReactNode
  defaultFlow?: "signIn" | "signUp"
  onSuccess?: () => void
}

export function AuthForm({ trigger, defaultFlow = "signIn", onSuccess }: AuthFormProps) {
  const [flow, setFlow] = useState<"signIn" | "signUp">(defaultFlow)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuthActions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn("password", { 
        email, 
        password, 
        flow, 
        ...(flow === "signUp" ? { name } : {}) 
      })
      toast.success(flow === "signIn" ? "Welcome back!" : "Account created successfully!")
      onSuccess?.()
    } catch (error) {
      const message = String(error)
      if (message.includes("InvalidAccountId") || message.includes("InvalidSecret")) {
        toast.error("Invalid email or password")
      } else if (message.includes("TooManyFailedAttempts")) {
        toast.error("Too many attempts, try again later")
      } else {
        toast.error("Authentication failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Sign In</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-background border-primary/20 shadow-2xl rounded-[2rem] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
        <DialogHeader className="pt-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 mb-4">
            <Diamond className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-serif italic text-center">
            {flow === "signIn" ? "Welcome Back" : "Join The Brand"}
          </DialogTitle>
          <DialogDescription className="text-center font-light">
            {flow === "signIn" 
              ? "Access your luxury cleaning concierge" 
              : "Experience the ultimate in residential care"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 px-2">
          {flow === "signUp" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold ml-1">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-muted/30 rounded-xl border-primary/10"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold ml-1">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-muted/30 rounded-xl border-primary/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold ml-1">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-muted/30 rounded-xl border-primary/10"
            />
          </div>
          <Button type="submit" className="w-full font-bold h-12 rounded-full shadow-lg shadow-primary/20 mt-4" disabled={isLoading}>
            {isLoading ? "Processing..." : flow === "signIn" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <div className="text-center text-sm mt-4">
          <p className="text-muted-foreground">
            {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-primary font-semibold hover:underline"
            >
              {flow === "signIn" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
