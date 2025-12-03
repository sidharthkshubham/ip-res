
import { PrismaClient } from "../generated/client.js";
import { getGeoData } from "../utils/geo.js";

const Prisma= new PrismaClient();
export const validateController = async(req, res) => {
    try {
        const ip = req.query.ip;
        
        if (!ip) {
          return res.status(400).json({
            allowed: false,
            message: "IP address is required"
          });
        }
    
        const location = await getGeoData(ip);
        
        // Handle geolocation API failure
        if (!location || location.status === 'fail') {
          return res.status(500).json({
            allowed: false,
            message: "Unable to determine location for this IP"
          });
        }
        
        const region = location.regionName;
        const country = location.country;
    
        console.log("region :", region);
        console.log("country :", country);
    
        const allowedIp = await Prisma.allowedIP.findUnique({
          where: { ip: ip }
        });
        
        if (allowedIp) {
          return res.json({
            allowed: true,
            message: "IP is whitelisted",
            data: allowedIp
          });
        }
    
        const blockedIp = await Prisma.blockedIP.findUnique({
          where: { ip: ip }
        });
        
        if (blockedIp) {
          return res.json({
            allowed: false,
            message: blockedIp.reason || "IP is blocked",
            data: blockedIp
          });
        }
    
        if (region === "Madhya Pradesh") {
          // Use upsert to avoid duplicate key errors
          const savedIP = await prisma.allowedIP.upsert({
            where: { ip: ip },
            update: {},
            create: { ip: ip, label: "Madhya Pradesh User" }
          });
          
          return res.json({
            allowed: true,
            message: "Access allowed. You are from Madhya Pradesh",
            data: savedIP
          });
        } else {
          // Use upsert to avoid duplicate key errors
          const newBlockedIp = await prisma.blockedIP.upsert({
            where: { ip: ip },
            update: { reason: `Access blocked from ${region}, ${country}` },
            create: {
              ip: ip,
              reason: `Access blocked from ${region}, ${country}`
            }
          });
          
          return res.json({
            allowed: false,
            message: `We are currently unavailable in ${region}. Currently we are only active in Madhya Pradesh`,
            data: newBlockedIp
          });
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
          allowed: false,
          message: "Internal server error",
          error: error.message
        });
      }
}