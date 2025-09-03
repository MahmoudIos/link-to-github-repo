import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
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
export const useAssessmentAnalysisApi = () => {
	const { apiPublic, apiPrivate } = useApi();

	const analyzeAssessment = async (
		assessmentId: string,
		data: AnalyzeAssessmentRequestDto
	): Promise<AssessmentAnalysisResultDto> => {
		const response = await apiPrivate.post(
			`/api/v1/assessmentanalysis/${assessmentId}/analyze`,
			data
		);
		return response.data;
	};

	const getAssessmentResults = async (
		assessmentId: string
	): Promise<AssessmentResultsDto> => {
		const response = await apiPublic.get(
			`/api/v1/assessmentanalysis/${assessmentId}/results`
		);
		return response.data;
	};

	const getNotImplementedItems = async (
		assessmentId: string,
		scoreThreshold?: number
	): Promise<NotImplementedItemsDto> => {
		const url = `/api/v1/assessmentanalysis/${assessmentId}/not-implemented`;
		const params = scoreThreshold ? `?scoreThreshold=${scoreThreshold}` : '';
		const response = await apiPublic.get(`${url}${params}`);
		return response.data;
	};

	const updateItemStatuses = async (
		assessmentId: string,
		data: UpdateStatusRequestDto
	): Promise<StatusUpdateResultDto> => {
		const response = await apiPrivate.post(
			`/api/v1/assessmentanalysis/${assessmentId}/update-status`,
			data
		);
		return response.data;
	};

	return {
		analyzeAssessment,
		getAssessmentResults,
		getNotImplementedItems,
		updateItemStatuses,
	};
};

// React Query Hooks
export const useAssessmentResults = (assessmentId: string) => {
	const { getAssessmentResults } = useAssessmentAnalysisApi();

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
	const { getNotImplementedItems } = useAssessmentAnalysisApi();

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
	const { analyzeAssessment } = useAssessmentAnalysisApi();

	return useMutation({
		mutationFn: ({
			assessmentId,
			data,
		}: {
			assessmentId: string;
			data: AnalyzeAssessmentRequestDto;
		}) => analyzeAssessment(assessmentId, data),
		onSuccess: (_, { assessmentId }) => {
			// Invalidate all related queries
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.results(assessmentId),
			});
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.notImplemented(assessmentId),
			});
		},
	});
};

export const useUpdateItemStatuses = () => {
	const queryClient = useQueryClient();
	const { updateItemStatuses } = useAssessmentAnalysisApi();

	return useMutation({
		mutationFn: ({
			assessmentId,
			data,
		}: {
			assessmentId: string;
			data: UpdateStatusRequestDto;
		}) => updateItemStatuses(assessmentId, data),
		onSuccess: (_, { assessmentId }) => {
			// Invalidate all related queries
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.results(assessmentId),
			});
			queryClient.invalidateQueries({
				queryKey: assessmentAnalysisKeys.notImplemented(assessmentId),
			});
		},
	});
};
