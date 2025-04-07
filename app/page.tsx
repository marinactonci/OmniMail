import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  Sparkles,
  Zap,
  Clock,
  Shield,
  BarChart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DockNav } from "@/components/dock";
import { AnimatedShinyTextDemo } from "@/components/animated-shiny-text";
import { AuroraText } from "@/components/magicui/aurora-text";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center flex-col">
      <div className="fixed bottom-5 z-50">
        <DockNav />
      </div>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-start">
                  <AnimatedShinyTextDemo text="Revolutionizing Email Management" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Email Inbox,{" "}
                    <AuroraText>Reimagined with AI</AuroraText>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    OmniMail enhances your email experience with AI-powered text generation,
                    smart autocomplete, and a chatbot that answers questions about your inbox.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="h-12">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-12">
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>14-day free trial</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    width={800}
                    height={600}
                    alt="OmniMail Dashboard"
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full bg-muted/50 py-12 md:py-24 lg:py-32 rounded-xl"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <AnimatedShinyTextDemo text="Key Features" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Smart Features for Smarter Email Management
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  OmniMail combines cutting-edge AI with intuitive design to
                  transform how you handle email.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Prioritization</h3>
                <p className="text-muted-foreground">
                  AI-powered inbox sorting that automatically identifies
                  important emails and urgent tasks.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Response Suggestions</h3>
                <p className="text-muted-foreground">
                  Get intelligent response suggestions that match your tone and
                  style with one-click replies.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Schedule Optimization</h3>
                <p className="text-muted-foreground">
                  Automatically schedule emails to be sent at the optimal time
                  for maximum engagement.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">
                  Spam & Phishing Protection
                </h3>
                <p className="text-muted-foreground">
                  Advanced AI detection of suspicious emails with real-time
                  protection against threats.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Email Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive insights into your email habits, response times,
                  and productivity metrics.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Templates</h3>
                <p className="text-muted-foreground">
                  AI-generated email templates that learn from your writing
                  style and common responses.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <AnimatedShinyTextDemo text="How It Works" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simplify Your Email Workflow
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  OmniMail combines cutting-edge AI with intuitive keyboard shortcuts
                  to transform how you handle email.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2">
              <Image
                src="/placeholder.svg?height=600&width=800"
                width={800}
                height={600}
                alt="OmniMail Interface"
                className="rounded-xl object-cover shadow-xl"
              />
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Connect Your Email</h3>
                    <p className="text-muted-foreground">
                      Securely connect your email accounts with just a few
                      clicks. We support Gmail, Outlook, and more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">
                      AI Learns Your Style
                    </h3>
                    <p className="text-muted-foreground">
                      Our AI analyzes your writing style to provide better text suggestions
                      and more relevant autocomplete options.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">
                      Experience Smart Inbox
                    </h3>
                    <p className="text-muted-foreground">
                      Enjoy an organized inbox with priority sorting, smart
                      suggestions, and automated responses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Save Hours Every Week</h3>
                    <p className="text-muted-foreground">
                      Reclaim your time as OmniMail handles routine emails and
                      helps you respond faster to important ones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full bg-muted/50 py-12 md:py-24 lg:py-32 rounded-xl"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <AnimatedShinyTextDemo text="Pricing" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple, Transparent Pricing
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Choose the plan that's right for you and start transforming
                  your email experience today.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl border bg-background p-6 shadow-sm">
                <div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <p className="text-muted-foreground">
                      Perfect for individuals and small email volumes.
                    </p>
                  </div>
                  <div className="mt-4 flex items-baseline text-3xl font-bold">
                    $9
                    <span className="text-muted-foreground text-sm font-normal">
                      /month
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>1 email account</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Basic AI text generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Standard keyboard shortcuts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>5GB storage</span>
                    </li>
                  </ul>
                </div>
                <Button className="mt-8">Get Started</Button>
              </div>
              <div className="flex flex-col justify-between rounded-xl border bg-background p-6 shadow-xl relative">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
                <div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Professional</h3>
                    <p className="text-muted-foreground">
                      Ideal for professionals with high email volume.
                    </p>
                  </div>
                  <div className="mt-4 flex items-baseline text-3xl font-bold">
                    $19
                    <span className="text-muted-foreground text-sm font-normal">
                      /month
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>3 email accounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Advanced AI text generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Custom keyboard shortcuts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Email chatbot assistant</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>20GB storage</span>
                    </li>
                  </ul>
                </div>
                <Button className="mt-8" variant="default">
                  Get Started
                </Button>
              </div>
              <div className="flex flex-col justify-between rounded-xl border bg-background p-6 shadow-sm">
                <div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Enterprise</h3>
                    <p className="text-muted-foreground">
                      For teams and businesses with advanced needs.
                    </p>
                  </div>
                  <div className="mt-4 flex items-baseline text-3xl font-bold">
                    $49
                    <span className="text-muted-foreground text-sm font-normal">
                      /month
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Unlimited email accounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Premium AI features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Team collaboration tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Advanced chatbot capabilities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>100GB storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>
                <Button className="mt-8" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <AnimatedShinyTextDemo text="Testimonials" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Loved by Professionals Worldwide
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  See what our users are saying about how OmniMail has
                  transformed their email experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col rounded-xl border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    width={50}
                    height={50}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">
                      Marketing Director
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "OmniMail has completely transformed how I handle my inbox. I
                  save at least 5 hours every week and never miss important
                  emails anymore."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex flex-col rounded-xl border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    width={50}
                    height={50}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">
                      Startup Founder
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "As a founder, I was drowning in emails. OmniMail's AI
                  prioritization has been a game-changer for my productivity and
                  response time."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex flex-col rounded-xl border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    width={50}
                    height={50}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">Emily Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">
                      Product Manager
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "The smart templates and response suggestions have made my
                  communication more efficient and professional. I can't imagine
                  going back."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-muted/50 py-12 md:py-24 lg:py-32 rounded-t-xl">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Your Email Experience?
                </h2>
                <p className="mx-auto max-w-[700px] md:text-xl">
                  Join thousands of professionals who have reclaimed their inbox
                  and boosted their productivity.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
