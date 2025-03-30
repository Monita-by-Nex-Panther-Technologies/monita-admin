"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { AssignTicketDialog } from "../components/assign-ticket-dialog";
import { RichTextEditor } from "../components/rich-text-editor";

// Client component receives id as a prop instead of params
interface TicketDetailsClientProps {
  id: string;
}

export default function TicketDetailsClient({ id }: TicketDetailsClientProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState<boolean>(false);
  const [responseText, setResponseText] = useState<string>("");
  const router = useRouter();

  // Mock ticket data
  const ticket = {
    id: id,
    name: "Ade Johnson",
    email: "Adebayo10@gmail.com",
    status: "Open",
    dateCreated: "Jan 02, 2024 4:30pm",
    description:
      "Hello Support Team, I've been trying to transfer funds from my virtual account to my bank, but the transaction keeps failing. I received a 'Transaction Declined' message, but my balance remains unchanged. I need urgent assistance as this is affecting my business. Please let me know what I should do next. Thank you.",
    documents: [{ name: "Transaction-Receipt.pdf", url: "#" }],
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleGoBack = () => {
    router.push("/dashboard/supportTickets");
  };

  const handleFileUpload = () => {
    // This would be implemented with a file input in a real application
    alert("File upload functionality would be implemented here");
  };

  const handleSendResponse = () => {
    if (responseText.trim()) {
      alert("Response sent: " + responseText);
      setResponseText("");
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background p-3 sm:p-4 rounded-[8px] gap-3 sm:gap-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold">{ticket.name}</h1>
        </div>
        <div className="flex flex-row gap-x-2 sm:gap-x-4 w-full sm:w-auto">
          <button
            className="justify-center items-center bg-white border border-red-500 text-red-500 font-medium px-3 py-1.5 sm:px-4 sm:py-2 w-full sm:w-[132px] rounded-[12px] text-sm sm:text-base"
            onClick={() => router.push("/")}
          >
            Close
          </button>
          <button
            className="justify-center bg-green-500 items-center text-white font-medium px-3 py-1.5 sm:px-4 sm:py-2 w-full sm:w-[132px] rounded-[12px] text-sm sm:text-base"
            onClick={() => setAssignDialogOpen(true)}
          >
            Assign
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg mt-4 sm:mt-6 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Customer Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm mb-1">Name</p>
            <p className="font-medium text-sm sm:text-base">{ticket.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm mb-1">
              Email Address
            </p>
            <p className="font-medium text-sm sm:text-base break-all">
              {ticket.email}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm mb-1">Ticket ID</p>
            <div className="flex items-center gap-1">
              <p className="font-medium text-sm sm:text-base">{ticket.id}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(ticket.id)}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm mb-1">
              Ticket Status
            </p>
            <span className="px-2 sm:px-4 py-1 rounded-md bg-[#E6F7EF] text-[#00A85A] text-xs sm:text-sm">
              {ticket.status}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm mb-1">
              Date Created
            </p>
            <p className="font-medium text-sm sm:text-base">
              {ticket.dateCreated}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Description */}
      <div className="bg-white rounded-lg mt-4 sm:mt-6 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Issue Description
        </h2>
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <p className="text-gray-700 text-sm sm:text-base">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg mt-4 sm:mt-6 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Documents
        </h2>
        <div className="overflow-x-auto">
          {ticket.documents.map((doc, index) => (
            <a
              key={index}
              href={doc.url}
              className="text-yellow-500 hover:underline flex items-center gap-2 text-sm sm:text-base"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-5 sm:h-5"
              >
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="#DDFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="#DDFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 13H8"
                  stroke="#DDFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 17H8"
                  stroke="#DDFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 9H9H8"
                  stroke="#DDFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="truncate">{doc.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Response */}
      <div className="bg-white rounded-lg mt-4 sm:mt-6 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Response
        </h2>
        <RichTextEditor
          value={responseText}
          onChange={setResponseText}
          placeholder="Type message here"
        />
      </div>

      {/* Upload Photo */}
      <div className="bg-white rounded-lg mt-4 sm:mt-6 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Upload photo (optional)
        </h2>
        <div className="border border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-gray-500 text-xs sm:text-sm">
          <p>
            You can upload jpg, png file or pdf file only, make sure your file
            size does not exceed 3mb.
            <span
              className="text-yellow-500 cursor-pointer"
              onClick={handleFileUpload}
            >
              {" "}
              Click here to upload
            </span>
          </p>
        </div>
      </div>

      {/* Send Button */}
      <div className="mt-4 sm:mt-6 mb-6 sm:mb-10">
        <Button
          className="bg-[#F8FFB8] hover:bg-[#F8FFB8]/90 text-black font-medium py-1.5 sm:py-2 px-6 sm:px-8 rounded-full text-sm sm:text-base w-full sm:w-auto"
          onClick={handleSendResponse}
        >
          Send
        </Button>
      </div>

      <AssignTicketDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </div>
  );
}
