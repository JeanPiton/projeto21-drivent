import { prisma } from "@/config";

async function getAllHotels(){
    const result = await prisma.hotel.findMany()
    return result
}

export const hotelsRepository = {
    getAllHotels
}