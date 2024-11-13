import Pusher from "pusher";
import pusherJs from "pusher-js";

export const pusherSever = new Pusher({
  appId: process.env.PUSHER_APP_ID!!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!!,
  secret: process.env.PUSHER_SECRET!!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!!,
  useTLS: true,
});

export const pusherClient = new pusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY!!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!!,
});
