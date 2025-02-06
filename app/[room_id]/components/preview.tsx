"use client";

import { useState } from "react";
import ReactPlayer from "react-player";
import { Mic, MicOff, Camera, CameraOff, CircleAlert } from "lucide-react";
import { useStream } from "@/context/stream";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import getAspectRatioStyle from "@/lib/get-aspect-ration-style";
import {
  CONFIG_AUDIO_ENABLED,
  CONFIG_NAME,
  CONFIG_VIDEO_ENABLED,
} from "@/models/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import PromptAccess from "./prompt-access";
import { getMutedValue, getVideoValue } from "@/models/preview";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "name must be required")
    .max(50, "name must be less than 50 characters"),
});

function JoinForm(props: { onSuccess: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: typeof window === 'undefined' ? '' : localStorage.getItem(CONFIG_NAME) || "",
    },
  });

  const onJoin = (values: z.infer<typeof formSchema>) => {
    localStorage.setItem(CONFIG_NAME, values.name);
    props.onSuccess();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onJoin)}
        className="flex flex-col space-y-3 mt-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Join</Button>
      </form>
    </Form>
  );
}
export default function Preview(props: { onNextStep: () => void }) {
  const [muted, setMuted] = useState(getMutedValue());
  const [videoEnable, setVideoEnable] = useState(getVideoValue());

  const { stream, hasAccessAudio, hasAccessVideo } = useStream();

  const toggleAudio = () => {
    if(hasAccessAudio)
    setMuted((prev) => {
      localStorage.setItem(CONFIG_AUDIO_ENABLED, String(!prev));
      return !prev;
    });
  };

  const toggleVideo = () => {
    if(hasAccessVideo)
    setVideoEnable((prev) => {
      localStorage.setItem(CONFIG_VIDEO_ENABLED, String(!prev));
      return !prev;
    });
  };

  const hasFullAccess = hasAccessAudio && hasAccessVideo;

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-4">
        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          talktome
        </h2>
      </header>
      <div className="grid grid-cols-12 px-16 h-full place-items-center">
        <div className="col-span-12 lg:col-span-8 w-full">
          <div
            style={{
              position: "relative",
              paddingTop: getAspectRatioStyle(16, 9),
              backgroundColor: "black",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {stream && (
              <ReactPlayer
                width="100%"
                height="100%"
                playsinline
                playing
                muted
                url={stream} // Replace with your video stream URL
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: videoEnable ? "block" : "none", // Hide video when disabled
                }}
              />
            )}
            {hasFullAccess && !stream && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Camera is starting
              </div>
            )}
            {!videoEnable && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Camera is off
              </div>
            )}

            {(!hasAccessVideo || (!hasAccessAudio && !hasAccessVideo)) && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: "20px",
                }}
                className="z-10"
              >
                <PromptAccess />
              </div>
            )}

            <div className="absolute bottom-4 w-full inline-flex justify-center gap-x-3">
              <button
                className={clsx(
                  "rounded-full border border-[white] p-2 relative",
                  {
                    "bg-red-500": muted,
                    'hover:bg-[rgba(0,0,0,.4)]': !muted
                  }
                )}
                onClick={toggleAudio}
              >
                {!hasAccessAudio && (
                  <div className="absolute -top-1 -right-0">
                    <CircleAlert
                      size={16}
                      fill="orange"
                      strokeWidth={"1.25px"}
                    />
                  </div>
                )}
                {muted ? <MicOff color="white" /> : <Mic color="white" />}
              </button>
              <button
                className={clsx(
                  "rounded-full border border-[white] p-2 relative",
                  {
                    "bg-red-500": !videoEnable || !hasAccessVideo,
                    'hover:bg-[rgba(0,0,0,.4)]': videoEnable && hasAccessVideo
                  }
                )}
                onClick={toggleVideo}
              >
                {!hasAccessVideo && (
                  <div className="absolute -top-1 -right-0">
                    <CircleAlert
                      size={16}
                      fill="orange"
                      strokeWidth={"1.25px"}
                    />
                  </div>
                )}
                {videoEnable && hasAccessVideo ? (
                  <Camera color="white" />
                ) : (
                  <CameraOff color="white" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 w-full px-14">
          <h4 className="text-2xl font-semibold tracking-tigh text-center">
            Ready to join?
          </h4>
          <JoinForm onSuccess={props.onNextStep} />
        </div>
      </div>
    </div>
  );
}
