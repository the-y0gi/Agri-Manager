import { NextRequest, NextResponse } from "next/server";
import Job from "@/models/Job";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filter = searchParams.get("filter") || "month"; // week | month | year
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const now = new Date();
    let startDate: Date;

    //TIME FILTER LOGIC
    if (filter === "week") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 6); // last 7 days
    } 
    else if (filter === "year") {
      startDate = new Date(now.getFullYear(), 0, 1); // Jan 1
    } 
    else {
      // default = month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const matchStage = {
      createdAt: { $gte: startDate },
    };

    const statsAgg = await Job.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          received: { $sum: "$paidAmount" },
        },
      },
    ]);

    const total = statsAgg[0]?.total || 0;
    const received = statsAgg[0]?.received || 0;
    const pending = total - received;

    let groupStage: any;
    let sortStage: any;

    if (filter === "year") {
      groupStage = {
        _id: { $month: "$createdAt" },
        amount: { $sum: "$totalAmount" },
      };
      sortStage = { _id: 1 };
    } 
    else if (filter === "month") {
      groupStage = {
        _id: { $dayOfMonth: "$createdAt" },
        amount: { $sum: "$totalAmount" },
      };
      sortStage = { _id: 1 };
    } 
    else {
      // week
      groupStage = {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        amount: { $sum: "$totalAmount" },
      };
      sortStage = { "_id.month": 1, "_id.day": 1 };
    }

    const chartAgg = await Job.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: sortStage },
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const chartData = chartAgg.map((item) => {
      if (filter === "year") {
        return {
          date: monthNames[item._id - 1],
          amount: item.amount,
        };
      }

      if (filter === "month") {
        return {
          date: item._id.toString(),
          amount: item.amount,
        };
      }

      return {
        date: `${item._id.day}/${item._id.month}`,
        amount: item.amount,
      };
    });

    const jobs = await Job.find(matchStage)
      .select("_id farmerName serviceName totalAmount paidAmount status createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Job.countDocuments(matchStage);

    return NextResponse.json({
      stats: { total, received, pending },
      chartData,
      jobs,
      hasMore: totalCount > page * limit,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
