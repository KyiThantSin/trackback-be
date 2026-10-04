export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ClaimRole = 'mine' | 'toReview';
export type ReviewDecision = 'approve' | 'reject';

export interface SubmitClaimRequest {
  justification: string;
  itemDetails: string;
  proofPhotoUrl?: string;
}

export interface ReviewClaimRequest {
  decision: ReviewDecision;
}

export interface ClaimListQuery {
  role: ClaimRole;
  status?: ClaimStatus;
  page: number;
  limit: number;
}

export interface ClaimResponse {
  id: string;
  status: ClaimStatus;
  justification: string;
  itemDetails: string;
  proofPhotoUrl: string | null;
  foundItemPostId: string;
  claimantUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimDetailResponse {
  id: string;
  status: ClaimStatus;
  claimant: { id: string };
  claim: {
    justification: string;
    itemDetails: string;
    proofPhotoUrl: string | null;
  };
  foundItem: {
    id: string;
    title: string;
    category: string;
    description: string;
    foundLocation: string;
    foundDate: string;
    photoUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClaimsListResponse {
  items: ClaimResponse[];
  page: number;
  limit: number;
  total: number;
}