"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import generateMeetingCode from "@/utils/generate-meeting-code";
import { useEffect } from "react";
import { send } from "@/lib/tracker";

export default function HomeClient() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    send({ event: "page_view", page: "home" });
  }, []);

  const onJoin = (data: { code: string }) => {
    router.push("/" + data.code);
    send({
      event: "button_click",
      text: "join",
      page: "home",
      room_id: data.code,
    });
  };

  const startInstantMeeting = () => {
    const roomId = generateMeetingCode();
    send({
      event: "button_click",
      text: "start instant meeting",
      page: "home",
      room_id: roomId,
    });

    router.push("/" + roomId);
  };

  return (
    <>
      <div className="pt-10 lg:pt-[10rem] px-10 lg:px-20">
        <div className="flex">
          <div className="basis-full lg:basis-1/2">
            <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
              Video calls and meetings for everyone
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-2xl text-muted-foreground">
              Connect, collaborate and celebrate from anywhere with talktome
            </p>
            <div className="mt-8 flex flex-wrap items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Plus />
                    New Meeting
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel onClick={startInstantMeeting}>
                    <button className="w-full text-left">
                      Start instant meeting
                    </button>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onJoin)}
                  className="inline-flex items-center space-x-2"
                >
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter a code" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="ghost">
                    Join
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
