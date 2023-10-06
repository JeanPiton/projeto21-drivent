import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { createUser } from "./users-factory";

export async function createBooking(roomId:number){
    const user = await createUser();
    return prisma.booking.create({
        data:{
            roomId:roomId,
            userId:user.id
        }
    })
}