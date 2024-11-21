import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewConversationButton = () => {
    return (
        <Link
            href="/inbox/new"
            className="fixed bottom-6 right-6 z-50"
            title="Start a New Conversation"
        >
            <Button
                size="icon"
                className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
            >
                <Plus className="w-8 h-8" />
            </Button>
        </Link>
    );
};

export default NewConversationButton;
