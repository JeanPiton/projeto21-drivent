import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel(){
    return await prisma.hotel.create({
        data:{
            name:faker.company.companyName(),
            image:faker.image.business()
        }
    })
}

export async function createRooms(hotel:number){
    return await prisma.room.create({
        data:{
            name:faker.animal.bird(),
            capacity:faker.datatype.number(),
            hotelId:hotel
        }
    })
}