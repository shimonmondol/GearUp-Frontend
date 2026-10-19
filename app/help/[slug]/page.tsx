import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Truck, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  ArrowLeft
} from "lucide-react";

const policyData: Record<string, {
  title: string;
  badge: string;
  desc: string;
  icon: any;
  lastUpdated: string;
  sections: { title: string; points: string[] }[];
}> = {
  "delivery-pickup": {
    title: "Delivery & Pickup Policy",
    badge: "Dispatch & Logistics",
    desc: "How GearUp ensures your sports and adventure equipment reaches you safely and on time.",
    icon: Truck,
    lastUpdated: "October 2026",
    sections: [
      {
        title: "1. Hub Pickup (Free of Charge)",
        points: [
          "Collect booked gear from our central dispatch hub between 9:00 AM – 8:00 PM.",
          "Please present your Booking ID and Original National ID card during pickup.",
          "Our technicians will test tent zippers, bike gears, and electronic accessories in front of you."
        ]
      },
      {
        title: "2. Doorstep Dispatch & Return Courier",
        points: [
          "Doorstep delivery is available across metropolitan areas with delivery charges starting at ৳150.",
          "Orders must be confirmed at least 24 hours prior to the expedition departure date.",
          "All equipment is packaged in weather-resistant sanitised duffels to avoid transit wear."
        ]
      },
      {
        title: "3. Delivery Inspection & Sign-off",
        points: [
          "Ensure you check the included inventory checklist before accepting delivery.",
          "Report any pre-existing abrasions or defects within 2 hours of receipt."
        ]
      }
    ]
  },
  "returns-refunds": {
    title: "Returns & Refund Policy",
    badge: "Hassle-Free Returns",
    desc: "Transparent deposit returns, cancellation guidelines, and wear coverage for our renters.",
    icon: RotateCcw,
    lastUpdated: "October 2026",
    sections: [
      {
        title: "1. Security Deposit Settlement",
        points: [
          "Security deposits for high-tier cameras and mountain bikes are refunded within 24 hours after return inspection.",
          "Refunds are credited directly to the original payment channel (bKash / Nagad / SSLCommerz).",
          "Zero deposit deductions for normal outdoor dirt or standard trail dust."
        ]
      },
      {
        title: "2. Booking Cancellation Rules",
        points: [
          "100% full refund if cancelled 24+ hours prior to scheduled rental dispatch.",
          "50% refund if cancelled between 12 to 24 hours before pickup.",
          "No refund applicable for cancellations made within less than 12 hours."
        ]
      },
      {
        title: "3. Delayed Return Extension",
        points: [
          "Need more days on the trail? Request an extension directly via your customer dashboard before rental expiration.",
          "Unannounced delays exceeding 12 hours incur the standard per-day rental fee."
        ]
      }
    ]
  },
  "terms-conditions": {
    title: "Terms & Conditions",
    badge: "Rental Agreement",
    desc: "Guidelines, renter responsibilities, and rental equipment usage agreements at GearUp.",
    icon: FileText,
    lastUpdated: "October 2026",
    sections: [
      {
        title: "1. Renter Eligibility",
        points: [
          "Renters must be at least 18 years of age with an active verification identity.",
          "All rented gear remains the exclusive property of GearUp Equipment Rentals."
        ]
      },
      {
        title: "2. Usage & Fair Care",
        points: [
          "Equipment must only be used for its intended sports/trekking purposes.",
          "Sub-leasing, reselling, or commercially lending rented gear to third parties is strictly prohibited.",
          "Never attempt unauthorized mechanical alterations or self-repairs on specialized gear."
        ]
      },
      {
        title: "3. Loss & Structural Damage",
        points: [
          "Normal wear and cleaning are covered under our complimentary care guarantee.",
          "In the event of total loss or irreversible damage, the renter is responsible for wholesale equipment replacement cost."
        ]
      }
    ]
  },
  "privacy-policy": {
    title: "Privacy & Data Policy",
    badge: "Data Protection",
    desc: "How GearUp securely handles and protects your identity, payments, and account data.",
    icon: ShieldCheck,
    lastUpdated: "October 2026",
    sections: [
      {
        title: "1. Information We Collect",
        points: [
          "Identity verification data (Name, Phone number, and National ID photo for security verification).",
          "Rental duration logs and delivery addresses for fulfillment purposes.",
          "We do not store credit card numbers or PINs; all payments are processed through PCI-DSS secure gateways."
        ]
      },
      {
        title: "2. Data Usage & Confidentiality",
        points: [
          "Your phone number and email are exclusively used for reservation notifications and order updates.",
          "We never sell, rent, or trade customer contact details with third-party advertisers."
        ]
      },
      {
        title: "3. Account Security",
        points: [
          "Passwords and access tokens are hashed and encrypted via industry-standard protocols.",
          "You can request deletion of your account and rental logs at any time from profile settings."
        ]
      }
    ]
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function HelpPolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const current = policyData[slug];

  if (!current) {
    notFound();
  }

  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation & Back Link */}
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#2e5328] dark:hover:text-[#5fa352] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <span>GearUp Legal</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <span className="text-[#2e5328] dark:text-[#5fa352] font-semibold">{current.title}</span>
          </div>
        </div>

        {/* Clean Center-Aligned Policy Card */}
        <main className="bg-zinc-50/50 dark:bg-gray-800/40 border border-zinc-200/80 dark:border-zinc-700 rounded-3xl p-6 sm:p-12 space-y-8 shadow-xs">
          {/* Header */}
          <div className="space-y-3 border-b border-zinc-200/80 dark:border-zinc-700 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2e5328]/10 dark:bg-[#3b663b]/25 border border-[#2e5328]/20 dark:border-[#5fa352]/30">
              <Icon className="w-3.5 h-3.5 text-[#2e5328] dark:text-[#5fa352]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e5328] dark:text-[#5fa352]">
                {current.badge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              {current.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              {current.desc}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {current.lastUpdated}</span>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {current.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {sec.title}
                </h2>
                <div className="space-y-2.5">
                  {sec.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}