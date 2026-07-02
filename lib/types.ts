export type UserRole = 'resident' | 'supplier' | 'admin' | 'government';

export type WaterSourceType = 'tanker' | 'borehole' | 'public_point' | 'subsidized_truck';

export type SourceStatus = 'available' | 'busy' | 'offline';

export type OrderStatus = 'requested' | 'accepted' | 'on_the_way' | 'delivered';

export type ReportType = 'no_access' | 'dirty_water' | 'broken_pipe' | 'dry_tap' | 'failed_delivery' | 'overpricing' | 'fake_tanker' | 'unsafe_borehole';

export type ReportSeverity = 'low' | 'medium' | 'high';

export type ReportStatus = 'reported' | 'verified' | 'assigned' | 'resolved' | 'rejected';

export type VoucherStatus = 'active' | 'redeemed' | 'expired';

export type SupplierVerificationStatus = 'pending' | 'verified' | 'suspended';

export type BadgeType = 'first_report' | 'reporter_5' | 'reporter_10' | 'infrastructure_hero' | 'community_leader' | 'water_guardian';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  area?: string;
  points: number;
  trustScore: number;
  badges: BadgeType[];
  reportCount: number;
  verifiedReportCount: number;
  createdAt: string;
  profilePhoto?: string;
  bio?: string;
}

export interface WaterSource {
  id: string;
  name: string;
  type: WaterSourceType;
  area: string;
  distanceKm: number;
  availableLitres: number;
  pricePerLitre: number;
  verified: boolean;
  verificationStatus: SupplierVerificationStatus;
  rating: number;
  reviewCount: number;
  etaMinutes?: number;
  lastQualityCheck: string;
  status: SourceStatus;
  coordinates: { lat: number; lng: number };
  operatorName: string;
  operatorPhone?: string;
  complaintCount: number;
}

export interface WaterOrder {
  id: string;
  residentName: string;
  residentArea: string;
  quantityLitres: number;
  sourceId: string;
  sourceName: string;
  status: OrderStatus;
  price: number;
  subsidyApplied: boolean;
  subsidyAmount: number;
  deliveryFee: number;
  createdAt: string;
  estimatedDeliveryTime: string;
  bulkRequestId?: string;
}

export interface WaterReport {
  id: string;
  reporterId: string;
  type: ReportType;
  area: string;
  description: string;
  severity: ReportSeverity;
  status: ReportStatus;
  createdAt: string;
  coordinates?: { lat: number; lng: number };
  photoUrl?: string;
  aiVerificationStatus?: VerificationStatus;
  aiConfidence?: number;
  governmentTicketId?: string;
  assignedTo?: string;
  resolvedAt?: string;
  resolvedPhotoUrl?: string;
  pointsAwarded: number;
  impactEstimate?: {
    litersWastedPerDay?: number;
    estimatedRepairCost?: number;
    waterLitersRecovered?: number;
  };
}

export interface SubsidyVoucher {
  id: string;
  residentName: string;
  area: string;
  discountPercent: number;
  maxLitres: number;
  status: VoucherStatus;
  createdAt: string;
  expiresAt: string;
}

export interface BulkRequest {
  id: string;
  area: string;
  street?: string;
  targetLitres: number;
  joinedHouseholds: number;
  requestedAt: string;
  estimatedDeliveryDate: string;
  status: OrderStatus;
  estimatedCostPerHousehold: number;
}

export interface AdminDashboardData {
  totalActiveRequests: number;
  totalActiveSources: number;
  verifiedSources: number;
  totalComplaints: number;
  subsidyVouchersIssued: number;
  subsidyVouchersRedeemed: number;
  areasWithHighDemand: string[];
  areasWithLowSupply: string[];
}

export interface ComplaintAnalytics {
  type: ReportType;
  count: number;
  severity: ReportSeverity;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: 'report_submitted' | 'report_verified' | 'report_resolved' | 'false_report' | 'reward_redeemed' | 'bonus_challenge';
  reportId?: string;
  balance: number;
  createdAt: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badge: BadgeType;
  earnedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  verifiedReports: number;
  rank: number;
  badges: BadgeType[];
  area?: string;
}
