import TicketDetailsClient from "./ticket-details-client"

// Server component that handles the Promise-based params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Await the params to get the actual values
    const resolvedParams = await params

    // Pass the id to the client component
    return <TicketDetailsClient id={resolvedParams.id} />
}

