"use client";

import { CreditCard, Layers, MessageSquareQuote, Workflow, ArrowUp } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/magicui/dock";

export type IconProps = React.HTMLAttributes<SVGElement>;

const DATA = {
  navbar: [
    { href: "#features", icon: Layers, label: "Features" },
    { href: "#how-it-works", icon: Workflow, label: "How it works" },
    { href: "#pricing", icon: CreditCard, label: "Pricing" },
    { href: "#testimonials", icon: MessageSquareQuote, label: "Testimonials" },
    { href: "#top", icon: ArrowUp, label: "Back to Top" },
  ],
};

export function DockNav() {
  const [isVisible, setIsVisible] = useState(true);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || !dockRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide dock when footer is in view
        setIsVisible(!entry.isIntersecting);
      },
      {
        rootMargin: '100px 0px 0px 0px', // Adjust this value as needed
        threshold: 0
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Add smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (href === "#top") {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', '#');
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update URL without page jump
      window.history.pushState(null, '', href);
    }
  };

  if (!isVisible) return null;

  return (
    <TooltipProvider>
      <Dock direction="middle" ref={dockRef}>
        {DATA.navbar.map((item) => (
          <DockIcon key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
      </Dock>
    </TooltipProvider>
  );
}
