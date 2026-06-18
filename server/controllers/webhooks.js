// import { Webhook } from "svix";
// import User from "../models/User.js";

// export const clerkWebhooks = async (req, res) => {


//     console.log("Webhook Hit");
//     try {
//         if (!process.env.CLERK_WEBHOOK_SECRET) {
//             throw new Error("CLERK_WEBHOOK_SECRET is missing");
//         }

//         console.log(process.env.CLERK_WEBHOOK_SECRET)
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//         await whook.verify(req.body.toString(), {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         });

//         const payload = JSON.parse(req.body.toString());
//         const { data, type } = payload;

//         console.log(`Received Clerk Event: ${type}`);

//         switch (type) {
//             case "user.created": {
//                 const userData = {
//                     _id: data.id,
//                     email: data.email_addresses[0].email_address,
//                     name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//                     image: data.image_url,
//                     resume: ""
//                 };

//                 await User.create(userData);
//                 console.log("User Created");
//                 return res.json({});
//             }

//             case "user.updated": {
//                 const userData = {
//                     email: data.email_addresses[0].email_address,
//                     name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//                     image: data.image_url
//                 };

//                 await User.findByIdAndUpdate(data.id, userData);
//                 console.log("User Updated");
//                 return res.json({});
//             }

//             case "user.deleted": {
//                 await User.findByIdAndDelete(data.id);
//                 console.log("User Deleted");
//                 return res.json({});
//             }

//             default:
//                 return res.json({});
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Webhook Error"
//         });
//     }
// };

// webhooks.js
import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    console.log("Webhook Hit");

    try {
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            throw new Error("CLERK_WEBHOOK_SECRET is missing");
        }

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(req.body, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const payload = req.body;
        const { data, type } = payload;

        console.log(`Received Clerk Event: ${type}`);

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,  // Using Clerk ID as MongoDB _id
                    email: data.email_addresses[0]?.email_address || '',
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || 'User',
                    image: data.image_url || '',
                    resume: ""
                };

                await User.create(userData);
                console.log("✅ User Created in Database");
                return res.json({ success: true });
            }

            case "user.updated": {
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0]?.email_address || '',
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || 'User',
                    image: data.image_url || '',
                });
                console.log("✅ User Updated in Database");
                return res.json({ success: true });
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                console.log("✅ User Deleted from Database");
                return res.json({ success: true });
            }

            default:
                return res.json({ success: true });
        }
    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};