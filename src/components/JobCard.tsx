import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface JobCardProps {
  /** Name of the farmer for this job */
  farmerName: string;
  /** Type of service provided */
  serviceName: string;
  /** Current status of the job */
  status: string;
  /** Total amount billed for the service */
  totalAmount: number;
  /** Amount already paid by the farmer */
  paidAmount: number;
  /** Date of the service in string format */
  date: string;
}

export default function JobCard({
  farmerName,
  serviceName,
  status,
  totalAmount,
  paidAmount,
  date,
}: JobCardProps) {
  // Calculate pending amount
  const pending = totalAmount - paidAmount;
  const isCompleted = status === "completed";

  // Dynamic styling based on job status
  const statusColor = isCompleted ? "bg-emerald-500" : "bg-amber-500";
  const statusBg = isCompleted
    ? "bg-emerald-50 text-emerald-700"
    : "bg-amber-50 text-amber-700";

  /**
   * Determine balance display content based on payment status
   * - NILL: No bill generated yet (totalAmount = 0)
   * - All Clear: Full payment received (pending ≤ 0)
   * - Pending Amount: Payment still due (pending > 0)
   */
  let balanceContent;

  if (totalAmount === 0) {
    // Case 1: Job just started or bill not yet generated
    balanceContent = (
      <span className="text-sm font-bold text-gray-400">NILL</span>
    );
  } else if (pending <= 0) {
    // Case 2: Full payment received
    balanceContent = (
      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
        <CheckCircle2 size={12} /> All Clear
      </span>
    );
  } else {
    // Case 3: Payment pending
    balanceContent = (
      <span className="text-sm font-bold text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> ₹{pending.toLocaleString()}
      </span>
    );
  }

  return (
    <div className="relative bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 mb-3 active:scale-[0.98] transition-all overflow-hidden">
      {/* Status Indicator Strip (Left Border) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`} />

      <div className="pl-3">
        {/* Top Section: Farmer Info and Status */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            {/* Farmer Name */}
            <h3 className="text-base font-bold text-gray-900 leading-none mb-1.5">
              {farmerName}
            </h3>

            {/* Service Metadata */}
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 uppercase tracking-wide">
                {serviceName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Status Badge with Icon */}
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${statusBg}`}
          >
            {isCompleted ? <CheckCircle2 size={10} /> : <Clock size={10} />}
            {isCompleted ? "Paid" : "On"}
          </div>
        </div>

        {/* Bottom Section: Payment Information */}
        <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-end">
          {/* Total Bill Amount */}
          <div className="flex flex-col leading-none">
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">
              Total Bill
            </span>
            <span className="text-sm font-bold text-gray-700">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          {/* Balance Display (Dynamic) */}
          <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">
              Balance
            </span>
            {balanceContent}
          </div>
        </div>
      </div>
    </div>
  );
}
