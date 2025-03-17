import UserDetailsPage from "./user-details-client"

// This is a server component that receives the params from Next.js
export default function Page({ params }: { params: { id: string } }) {
    // Pass the params to the client component
    return <UserDetailsPage id={params.id} />
}

