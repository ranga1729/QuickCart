import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async({event}) => {
    const user = event.data;
    console.log("event.data: " + user);
    const userData = {
      _id : user.id,
      email : user.email_addresses?.[0]?.email_address ?? "",
      name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      imageUrl: user.image_url ?? ""
    }
    await connectDB();
    await User.create(userData);
  }
)

// Inngest dunction to update user data in database
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async({event}) => {
    const user = event.data;
    console.log("event.data: " + user);
    const userData = {
      _id : user.id,
      email : user.email_addresses?.[0]?.email_address ?? "",
      name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      imageUrl: user.image_url ?? ""
    }
    await connectDB();
    await User.findByIdAndUpdate(user.id, userData);
  }
)

// Inngest dunction to update user data in database
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async({event}) => {
    const user = event.data;
    console.log("event.data: " + user);
    await connectDB();
    await User.findByIdAndDelete(user.id);
  }
)