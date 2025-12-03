import { PrismaClient } from "../generated/client.js";

const prisma=new PrismaClient();
export const banipcontroller= async (req,res)=>{
    const ip =req.query.ip;
    const checkblocked= await prisma.blockedIP.findUnique({
        where:{ip:ip}
    });
    const checkip=await prisma.allowedIP.findUnique({
        where:{ip:ip}
    });
    if(checkip){
        await prisma.allowedIP.delete({
            where:{ip:ip}
        });
    }
    if(checkblocked){
        return res.json({
            banned:true,
            message:"IP is already banned",
            data:checkblocked
        });
    }
    const reason=req.body.reason || "ip banned by admin";
    const newBlockedIp= await prisma.blockedIP.create({
        data:{
            ip:ip,
            reason:reason
        }
    });
    return res.json({
        banned:true,
        message:"IP has been banned successfully",
        data:newBlockedIp
    });
}

export const unbanipcontroller= async (req,res)=>{
    const ip =req.query.ip;
    const checkblocked= await prisma.blockedIP.findUnique({
        where:{ip:ip}
    });
    if(!checkblocked){
        return res.json({
            banned:false,
            message:"IP is not banned",
        });
    }
    await prisma.blockedIP.delete({
        where:{ip:ip}
    });
    return res.json({
        banned:false,
        message:"IP has been unbanned successfully",
    });
}