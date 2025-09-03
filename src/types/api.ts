// Vendor DTOs
export interface VendorDto {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	productCount: number;
}

export interface CreateVendorDto {
	name: string;
	email: string;
}

export interface UpdateVendorDto {
	name: string;
	email: string;
}

// Product DTOs
export interface ProductDto {
	id: string;
	name: string;
	description: string;
	vendorId: string;
	vendorName: string;
	stage1ApprovedAt?: string;
	stage1ApprovedBy?: string;
	stage1ApprovedByName?: string;
	createdAt: string;
	status: string;
}

export interface CreateProductDto {
	name: string;
	description: string;
	vendorId: string;
}

export interface UpdateProductDto {
	name: string;
	description: string;
}

export interface ApproveProductDto {
	comments?: string;
}

// Assessment DTOs
export interface AssessmentItemDto {
	id: string;
	assessmentId: string;
	departmentId: string;
	departmentName: string;
	role: string;
	category: string;
	evaluationItem: string;
	description: string;
	status: string;
	note?: string;
	createdAt: string;
}

// Assessment Analysis DTOs (Updated to match backend)
export interface AnalyzeAssessmentRequestDto {
	repoUrl: string;
}

export interface AssessmentAnalysisResultDto {
	success: boolean;
	message: string;
	assessmentId: string;
	repositoryInfo?: RepositoryInfoDto;
	analysisSummary?: AnalysisSummaryDto;
	notImplementedCount: number;
	results: AssessmentItemResultDto[];
	notImplementedItems: string[];
}

export interface RepositoryInfoDto {
	summary: string;
	totalFiles: number;
}

export interface AnalysisSummaryDto {
	totalItems: number;
	appliedCount: number;
	partiallyAppliedCount: number;
	notAppliedCount: number;
	appliedPercentage: number;
	partiallyAppliedPercentage: number;
	notAppliedPercentage: number;
	averageScore: number;
	implementationReadiness: string;
}

export interface AssessmentItemResultDto {
	assessmentItemId: string;
	score: number;
	suggestedStatus: string;
	evidence: string;
	comments: string;
	reasoning: string;
	category: string;
}

// Assessment Results DTOs
export interface AssessmentResultsDto {
	assessmentId: string;
	totalItems: number;
	items: AssessmentItemWithResultsDto[];
	statistics: AssessmentStatisticsDto;
}

export interface AssessmentItemWithResultsDto {
	id: string;
	category: string;
	evaluationItem: string;
	description: string;
	role: string;
	status: string;
	note?: string;
	results: AssessmentResultSummaryDto[];
}

export interface AssessmentResultSummaryDto {
	id: string;
	score: number;
	comments?: string;
	userName: string;
	createdAt: string;
}

export interface AssessmentStatisticsDto {
	totalItems: number;
	itemsAnalyzed: number;
	itemsPending: number;
	averageScore: number;
	appliedCount: number;
	partiallyAppliedCount: number;
	notAppliedCount: number;
	implementationReadiness: string;
}

// Not Implemented Items DTOs
export interface NotImplementedItemsDto {
	assessmentId: string;
	scoreThreshold: number;
	totalNotImplemented: number;
	itemsByCategory: Record<string, NotImplementedItemDto[]>;
	summary: CategorySummaryDto[];
}

export interface NotImplementedItemDto {
	id: string;
	category: string;
	evaluationItem: string;
	description: string;
	role: string;
	currentScore: number;
	lastAnalyzed?: string;
	reasoning: string;
}

export interface CategorySummaryDto {
	category: string;
	count: number;
	averageScore: number;
}

// Status Update DTOs
export interface UpdateStatusRequestDto {
	appliedThreshold: number;
	partialThreshold: number;
}

export interface StatusUpdateResultDto {
	assessmentId: string;
	appliedThreshold: number;
	partialThreshold: number;
	totalUpdated: number;
	updates: ItemStatusUpdateDto[];
}

export interface ItemStatusUpdateDto {
	itemId: string;
	evaluationItem: string;
	oldStatus: string;
	newStatus: string;
	score: number;
}

// Department DTOs
export interface DepartmentDto {
	id: string;
	name: string;
	description?: string;
}

// User DTOs
export interface UserDto {
	id: string;
	fullName: string;
	email: string;
	departmentId: string;
	departmentName: string;
	createdAt: string;
}

// API Response wrappers
export interface ApiResponse<T> {
	data: T;
	message?: string;
	success: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	totalCount: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
}

// Error response
export interface ApiError {
	message: string;
	errors?: Record<string, string[]>;
	statusCode: number;
}
