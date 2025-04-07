"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

function Footer() {
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

  return (
    <footer className="w-full flex justify-center border-t bg-background py-6 md:py-12">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">OmniMail</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-xs hover:underline underline-offset-4"
            onClick={(e) => handleSmoothScroll(e, "#features")}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-xs hover:underline underline-offset-4"
            onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-xs hover:underline underline-offset-4"
            onClick={(e) => handleSmoothScroll(e, "#pricing")}
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-xs hover:underline underline-offset-4"
            onClick={(e) => handleSmoothScroll(e, "#testimonials")}
          >
            Testimonials
          </Link>
          <Link
            href="#top"
            className="text-xs hover:underline underline-offset-4"
            onClick={(e) => handleSmoothScroll(e, "#top")}
          >
            Back to Top
          </Link>
        </nav>
        <div className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} OmniMail. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
