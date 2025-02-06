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

export default function Home() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      code: "",
    },
  });

  const onJoin = (data: { code: string }) => {
    router.push("/" + data.code);
    
  };

  const startInstantMeeting = () => {
    router.push("/" + generateMeetingCode());
  };

  return (
    <div className="pt-10 lg:pt-[10rem] px-10 md:px-20">
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-6">
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
            Video calls and meetings for everyone
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-2xl text-muted-foreground">
            Connect, collaborate and celebrate from anywhere with talktome
          </p>
          <div className="mt-8 inline-flex flex-col md:flex-row space-y-4 md:space-y-0 items-center md:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Plus />
                  New Meeting
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel onClick={startInstantMeeting}>
                  <button >
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
        <div className="col-span-6"></div>
      </div>
    </div>
  );
}
