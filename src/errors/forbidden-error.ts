import { ApplicationError } from "@/protocols";

export function forbiddenError(message:String):ApplicationError{
    return {
        name:"ForbiddenError",
        message:`${message} is Invalid or Unavailable`
    }
}