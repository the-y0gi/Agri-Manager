import { CheckCircle2, Clock, AlertCircle, CheckSquare } from "lucide-react";

interface JobCardProps {
  farmerName: string;
  serviceName: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  date: string;
  labels: {
    on: string;
    paid: string;
    done: string;
    nill: string;
    allClear: string;
    totalBill: string;
    balance: string;
  };
}

export default function JobCard({
  farmerName,
  serviceName,
  status,
  totalAmount,
  paidAmount,
  date,
  labels,
}: JobCardProps) {
  // Calculations
  const roundedTotal = Math.round(totalAmount || 0);
  const roundedPaid = Math.round(paidAmount || 0);
  const pending = roundedTotal - roundedPaid;
  const isCompleted = status === "completed";
  const isAllClear = pending <= 0;

  // Vertical Strip Logic
  let statusBorderColor = "";
  if (!isCompleted) {
    statusBorderColor = "bg-amber-500"; // Ongoing -> Orange
  } else if (!isAllClear) {
    statusBorderColor = "bg-red-500"; // Completed but Pending -> Red
  } else {
    statusBorderColor = "bg-emerald-500"; // All Clear -> Green
  }

  let badgeText = "";
  let badgeStyle = "";
  let BadgeIcon = Clock;

  if (!isCompleted) {
    // Case A: Working
    badgeText = labels.on;
    badgeStyle = "bg-amber-50 text-amber-700";
    BadgeIcon = Clock;
  } else if (isAllClear) {
    // Case B: Completed & Money Received
    badgeText = labels.paid;
    badgeStyle = "bg-emerald-50 text-emerald-700";
    BadgeIcon = CheckCircle2;
  } else {
    // Case C: Completed but Money Pending
    badgeText = labels.done;
    badgeStyle = "bg-gray-100 text-gray-600";
    BadgeIcon = CheckSquare;
  }

  // Balance Content Logic
  let balanceContent;
  if (roundedTotal === 0) {
    balanceContent = (
      <span className="text-sm font-bold text-gray-400">{labels.nill}</span>
    );
  } else if (isAllClear) {
    balanceContent = (
      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
        <CheckCircle2 size={12} /> {labels.allClear}
      </span>
    );
  } else {
    balanceContent = (
      <span className="text-sm font-bold text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> ₹{pending.toLocaleString()}
      </span>
    );
  }

  return (
    <div className="relative bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 mb-3 active:scale-[0.98] transition-all overflow-hidden">
      {/* Side Strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${statusBorderColor}`}
      />

      <div className="pl-3">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-gray-900 leading-none mb-1.5 truncate max-w-[180px]">
              {farmerName}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 uppercase tracking-wide truncate max-w-[120px]">
                {serviceName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">{date}</span>
            </div>
          </div>

          {/* Badge (Updated) */}
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${badgeStyle}`}
          >
            <BadgeIcon size={10} />
            {badgeText}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-end">
          <div className="flex flex-col leading-none">
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">
              {labels.totalBill}
            </span>
            <span className="text-sm font-bold text-gray-700">
              ₹{roundedTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">
              {labels.balance}
            </span>
            {balanceContent}
          </div>
        </div>
      </div>
    </div>
  );
}
