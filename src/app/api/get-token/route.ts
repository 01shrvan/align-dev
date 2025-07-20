import { validateRequest } from "@/auth";

export async function GET(){
    try{
        const {user}=await validateRequest();
    } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}