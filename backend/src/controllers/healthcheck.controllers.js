import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import os from "os";

const healthCheck = asyncHandler(async (req, res) => {

  const now = new Date();
  const formattedTime = now.toISOString();

  // uptime
  const uptimeSeconds = process.uptime();

  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const uptime = `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

  // memory usage
  const totalMem = process.memoryUsage().heapTotal;
  const usedMem = process.memoryUsage().heapUsed;
  const usedPercent = ((usedMem / totalMem) * 100).toFixed(2);

  res.status(200).json(
    new ApiResponse(200, {
      message: "Server is running",
      timestamp: formattedTime,
      uptime: uptime,
      status: {
        memory_used_percent: `${usedPercent}%`,
      },
    })
  );

});

export { healthCheck };