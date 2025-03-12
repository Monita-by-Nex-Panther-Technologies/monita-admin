export interface KycApplication {
  id: string;
  username: string;
  kycLevel: string;
  meansOfId: string;
  kycStatus: "Approved" | "Pending" | "Rejected";
  approvedDate: string;
}

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Generate dummy KYC applications
export const kycApplications: KycApplication[] = [
  {
    id: generateId(),
    username: "Adebayo10",
    kycLevel: "Tier 1",
    meansOfId: "NMC",
    kycStatus: "Approved",
    approvedDate: "Jan 02, 2024 4:30pm",
  },
  {
    id: generateId(),
    username: "Adebayo10",
    kycLevel: "Tier 1",
    meansOfId: "NMC",
    kycStatus: "Approved",
    approvedDate: "Jan 02, 2024 4:30pm",
  },
  {
    id: generateId(),
    username: "Adebayo10",
    kycLevel: "Tier 1",
    meansOfId: "NMC",
    kycStatus: "Approved",
    approvedDate: "Jan 02, 2024 4:30pm",
  },
  {
    id: generateId(),
    username: "Adebayo10",
    kycLevel: "Tier 1",
    meansOfId: "NMC",
    kycStatus: "Approved",
    approvedDate: "Jan 02, 2024 4:30pm",
  },
  {
    id: generateId(),
    username: "Adebayo10",
    kycLevel: "Tier 1",
    meansOfId: "NMC",
    kycStatus: "Approved",
    approvedDate: "Jan 02",
  },
];
