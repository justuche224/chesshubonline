"use client";

import { NewPasswordSchema } from "@/schemas";
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
import { newPassword } from "@/actions/new-password";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { PasswordResetSuccessfulModal } from "../utils/Modal";
import { NewPasswordValues } from "@/types";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (values: NewPasswordValues) => {
    //console.log(values);
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error ?? "");
        setSuccess(data?.success ?? "");
      });
    });
  };

  return (
    <>
      {resetSuccessful && <PasswordResetSuccessfulModal />}
      <CardWrapper
        headerLabel="Enter a new Password"
        backButtonLable="Back to login"
        backButtonHref="/auth/login"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
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
              <span className="mr-2"> Reset password</span>{" "}
              {isPending && <ClipLoader color="blue" size={20} />}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

export default NewPasswordForm;
