import { prisma } from "@/config";

async function getRoomById(roomId:number){
    return prisma.room.findUnique({
        where:{id:roomId}
    })
}

async function getReservationsByRoomId(roomId:number){
    return prisma.booking.count({
        where:{roomId:roomId}
    })
}

async function createBooking(userId:number,roomId:number) {
    return prisma.booking.create({
        data:{
            userId:userId,
            roomId:roomId
        },
    })
}

async function getBooking(userId:number){
    return prisma.booking.findFirst({
        where:{
            userId:userId
        },
        select:{id:true,Room:true}
    })
}

async function changeBooking(userId:number,roomId:number){
    return prisma.booking.update({
        where:{userId:userId},
        data:{
            roomId:roomId
        }
    })
}

export const bookingsRepository = {
    getRoomById,
    getReservationsByRoomId,
    createBooking,
    getBooking,
    changeBooking,
}