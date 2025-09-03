import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';
import { endpoints } from '@/api/endpoints';
import { handleApiError, handleApiSuccess } from '@/utils/toastHandler';
import type { ApiResponseDto } from '@/types/apiResponse';
import type {
	AnalyzeAssessmentRequestDto,
	AssessmentAnalysisResultDto,
	AssessmentResultsDto,
	NotImplementedItemsDto,
	UpdateStatusRequestDto,
	StatusUpdateResultDto,
} from '@/types/api';

// Query Keys
export const assessmentAnalysisKeys = {
	all: ['assessment-analysis'] as const,
	results: (assessmentId: string) =>
		[...assessmentAnalysisKeys.all, 'results', assessmentId] as const,
	notImplemented: (assessmentId: string, threshold?: number) =>
		[
			...assessmentAnalysisKeys.all,
			'not-implemented',
			assessmentId,
			{ threshold },
		] as const,
};

// API Functions
const analyzeAssessment = async (
	assessmentId: string,
	data: AnalyzeAssessmentRequestDto
): Promise<AssessmentAnalysisResultDto> => {
	const response = await api.post<ApiResponseDto<AssessmentAnalysisResultDto>>(
		endpoints.assessmentAnalysis.analyze(assessmentId),
		data
	);
	
	if (!response.data.success) {
		throw new Error(response.data.errors.join(", ") || "Failed to analyze assessment");
	}
	
	if (!response.data.data) {
		throw new Error("No analysis data returned");
	}
	
	return response.data.data;
};

const getAssessmentResults = async (
	assessmentId: string
): Promise<AssessmentResultsDto> => {
	const response = await api.get<ApiResponseDto<AssessmentResultsDto>>(
		endpoints.assessmentAnalysis.results(assessmentId)
	);
	
	if (!response.data.success) {
		throw new Error(response.data.errors.join(", ") || "Failed to get assessment results");
	}
	
	if (!response.data.data) {
		throw new Error("No results data returned");
	}
	
	return response.data.data;
};

const getNotImplementedItems = async (
	assessmentId: string,
	scoreThreshold?: number
): Promise<NotImplementedItemsDto> => {
	const url = endpoints.assessmentAnalysis.notImplemented(assessmentId);
	const params = scoreThreshold ? `?scoreThreshold=${scoreThreshold}` : '';
	const response = await api.get<ApiResponseDto<NotImplementedItemsDto>>(`${url}${params}`);
	
	if (!response.data.success) {
		throw new Error(response.data.errors.join(", ") || "Failed to get not implemented items");
	}
	
	if (!response.data.data) {
		throw new Error("No not implemented items data returned");
	}
	
	return response.data.data;
};

const updateItemStatuses = async (
	assessmentId: string,
	data: UpdateStatusRequestDto
): Promise<StatusUpdateResultDto> => {
	const response = await api.post<ApiResponseDto<StatusUpdateResultDto>>(
		endpoints.assessmentAnalysis.updateStatus(assessmentId),
		data
	);
	
	if (!response.data.success) {
		throw new Error(response.data.errors.join(", ") || "Failed to update item statuses");
	}
	
	if (!response.data.data) {
		throw new Error("No status update data returned");
	}
	
	return response.data.data;
};

// React Query Hooks
export const useAssessmentResults = (assessmentId: string) => {
	return useQuery({
		queryKey: assessmentAnalysisKeys.results(assessmentId),
		queryFn: () => getAssessmentResults(assessmentId),
		enabled: !!assessmentId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useNotImplementedItems = (
	assessmentId: string,
	scoreThreshold?: number
) => {
	return useQuery({
		queryKey: assessmentAnalysisKeys.notImplemented(
			assessmentId,
			scoreThreshold
		),
		queryFn: () => getNotImplementedItems(assessmentId, scoreThreshold),
		enabled: !!assessmentId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useAnalyzeAssessment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			assessmentId,
			data,
		}: {
			assessmentId: string;
			data: AnalyzeAssessmentRequestDto;
		}) => analyzeAssessment(assessmentId, data),
		onSuccess: (_, { assessmentId }) => {
			handleApiSuccess("Assessment analyzed successfully!");
			// Invalidate all related queries
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.results(assessmentId),
			});
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.notImplemented(assessmentId),
			});
		},
		onError: handleApiError,
	});
};

export const useUpdateItemStatuses = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			assessmentId,
			data,
		}: {
			assessmentId: string;
			data: UpdateStatusRequestDto;
		}) => updateItemStatuses(assessmentId, data),
		onSuccess: (_, { assessmentId }) => {
			handleApiSuccess("Item statuses updated successfully!");
			// Invalidate all related queries
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.results(assessmentId),
			});
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.notImplemented(assessmentId),
			});
		},
		onError: handleApiError,
	});
};
