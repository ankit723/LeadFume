import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "./prisma"
import {faker} from "@faker-js/faker"
import { v4 as uuidv4 } from 'uuid';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function freshSeedEmployees(seedNumber: number){
  const employees = await prisma.employee.findMany()
  if(employees.length > 0){
    await prisma.employee.deleteMany()
  }
  for(let i = 0; i < seedNumber; i++){
    await prisma.employee.create({
      data: {
        id: uuidv4(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profileImage: faker.image.avatar(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.birthdate().toISOString(),
        gender: faker.person.gender(),
        dateOfJoining: faker.date.past().toISOString(),
      }
    })
  }

  console.log(`${seedNumber} employees seeded`)
}