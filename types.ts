
export type ReportType = 'type1' | 'type2' | 'type3' | 'type4';

export interface SubCategory {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

export interface ReportCategory {
  name: string;
  description: string;
  subCats: SubCategory[];
}

export interface ReportData {
  title: string;
  description: string;
  image1: string | null;
  image2: string | null;
  date: string;
  person1Name: string;
  person1Title: string;
  person1Quote: string;
  person2Name: string;
  person2Title: string;
  person2Quote: string;
  authorName: string;
  subText: string;
  source: string;
  // Election result specific fields
  party1Seats: string;
  party1MarkerName: string;
  party2Seats: string;
  party2MarkerName: string;
  // Result 2 specific fields
  candidateName1: string;
  candidateName2: string;
  candidateImage1: string | null;
  candidateImage2: string | null;
}

export interface AICheckResult {
  isVerified: boolean;
  explanation: string;
  sources: { title: string; url: string }[];
  suggestedTitle: string;
  suggestedDescription: string;
}
