"use client";

import { ReactNode } from "react";
import { Card, CardHeader, CardFooter, CardContent } from "../ui/card";
import BackButton from "./BackButton";
import { Header } from "./Header";

type CardWrapperProps = {
  children: ReactNode;
  headerLabel: string;
  backButtonLable: string;
  backButtonHref: string;
  showSocial?: boolean;
};

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLable,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] md:w-[500px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLable}></BackButton>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
