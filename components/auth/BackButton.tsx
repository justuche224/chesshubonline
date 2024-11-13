"use client";

import { Button } from "../ui/button";
import Link from "next/link";

type BackButtonProps = {
  href: string;
  label: string;
};

const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
