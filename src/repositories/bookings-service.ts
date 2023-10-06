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

export const bookingsRepository = {
    getRoomById,
    getReservationsByRoomId,
    createBooking,
}