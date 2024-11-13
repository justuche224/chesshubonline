"use client";

import { ResetSchema } from "@/schemas";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { reset } from "@/actions/reset";
import { useState, useTransition } from "react";
import { ClipLoader } from "react-spinners";
import { PasswordResetModal } from "../utils/Modal";
import * as z from "zod";

type ResetValues = z.infer<typeof ResetSchema>;

const ResetForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ResetValues) => {
    setError("");
    setSuccess("");
    // console.log(values);
    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error ?? "");
        setSuccess(data?.success ?? "");
        setResetLinkSent(true);
      });
    });
  };

  return (
    <>
      {resetLinkSent && <PasswordResetModal />}
      <CardWrapper
        headerLabel="Forgot your password?"
        backButtonLable="Back to login"
        backButtonHref="/auth/login"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button className="w-full" type="submit" disabled={isPending}>
              <span className="mr-2">Send Reset Email</span>{" "}
              {isPending && <ClipLoader color="blue" size={20} />}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

export default ResetForm;
