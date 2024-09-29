import { connectToDB } from "@utils/database"
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import Prompt from "@models/prompt";

export const GET = async (request) => {
    try {
        await connectToDB();

        const prompts = await Prompt.find({}).populate('creator');

        const path = request.nextUrl.searchParams.get("path") || "/";

        revalidatePath(path);

        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
}