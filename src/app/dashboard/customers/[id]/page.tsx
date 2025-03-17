import UserDetailsClient from "./user-details-client"

// Make the page component async to handle the Promise-based params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Await the params to get the actual values
    const resolvedParams = await params

    // Pass the id to the client component
    return <UserDetailsClient id={resolvedParams.id} />
}
