"use client";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardWrapper from "./CardWrapper";
import { newVerification } from "@/actions/new-verification";
import FormError from "../form-error";
import FormSuccess from "../form-success";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error ?? null);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div>
      <CardWrapper
        headerLabel="Confirming your email"
        backButtonHref="/auth/login"
        backButtonLable="Back to login"
      >
        <div className="flex items-center w-full justify-center">
          {!success && !error && <BeatLoader color="blue" />}
          <FormSuccess message={success} />
          <FormError message={error} />
        </div>
      </CardWrapper>
    </div>
  );
};
