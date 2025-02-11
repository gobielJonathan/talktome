import { Metadata } from "next";
import HomeClient from "./page.client";


export const metadata: Metadata = {
  title: "TalkToMe - Unlimited Meeting Web App | No Time Limits",
  description:
    "TalkToMe is a web application designed to replicate Google Meet without the 1-hour meeting time limit. Enjoy seamless, uninterrupted communication for all your meetings.",
  keywords:
    "talktome, talk to me, video call, video meeting, web app, google meet, no time limit, unlimited meeting",
  robots: "index, follow",

  openGraph: {
    type: "website",
    url: "https://talktome.up.railway.app/",
    title: "TalkToMe - Unlimited Meeting Web App | No Time Limits",
    description:
      "TalkToMe is a web application designed to replicate Google Meet without the 1-hour meeting time limit. Enjoy seamless, uninterrupted communication for all your meetings.",
    siteName: "TalkToMe",
  },

};

export default function Home() {
  return (
    <>
      <HomeClient />
    </>
  );
}
