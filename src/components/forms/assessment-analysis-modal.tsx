import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
	AlertCircle,
	CheckCircle,
	GitBranch,
	Activity,
	TrendingUp,
	TrendingDown,
	FileText,
	Settings,
	RefreshCw,
} from 'lucide-react';
import {
	useAnalyzeAssessment,
	useAssessmentResults,
	useNotImplementedItems,
	useUpdateItemStatuses,
} from '@/services/assessmentAnalysisApi';
import { useToast } from '@/hooks/use-toast';
import { AssessmentAnalysisStepper } from '@/components/ui/assessment-analysis-stepper';
import type {
	AnalyzeAssessmentRequestDto,
	UpdateStatusRequestDto,
	AssessmentAnalysisResultDto,
} from '@/types/api';

interface AssessmentAnalysisModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: string;
	productName: string;
	defaultAssessmentId?: string;
}

export const AssessmentAnalysisModal = ({
	isOpen,
	onClose,
	productId,
	productName,
	defaultAssessmentId,
}: AssessmentAnalysisModalProps) => {
	const [repoUrl, setRepoUrl] = useState('');
	const [assessmentId, setAssessmentId] = useState(
		defaultAssessmentId || '44444444-4444-4444-4444-444444444444'
	);
	const [appliedThreshold, setAppliedThreshold] = useState(75);
	const [partialThreshold, setPartialThreshold] = useState(40);
	const [scoreThreshold, setScoreThreshold] = useState(40);
	const [analysisResult, setAnalysisResult] =
		useState<AssessmentAnalysisResultDto | null>(null);

	// Hooks
	const { toast } = useToast();

	// API hooks
	const analyzeAssessmentMutation = useAnalyzeAssessment();
	const updateStatusMutation = useUpdateItemStatuses();
	const { data: assessmentResults, refetch: refetchResults } =
		useAssessmentResults(assessmentId);
	const { data: notImplementedItems, refetch: refetchNotImplemented } =
		useNotImplementedItems(assessmentId, scoreThreshold);

	const handleAnalyze = async () => {
		if (!repoUrl || !assessmentId) return;

		try {
			const result = await analyzeAssessmentMutation.mutateAsync({
				assessmentId: '44444444-4444-4444-4444-444444444444',
				data: { repoUrl },
			});
			setAnalysisResult(result);
			// Refetch related data
			refetchResults();
			refetchNotImplemented();

			// Show success toast
			toast({
				title: 'Analysis Completed',
				description: result.success
					? `Assessment analysis completed successfully. ${
							result.analysisSummary?.totalItems || 0
					  } items analyzed.`
					: result.message,
				variant: result.success ? 'default' : 'destructive',
			});
		} catch (error) {
			console.error('Analysis failed:', error);
			toast({
				title: 'Analysis Failed',
				description:
					'Failed to complete assessment analysis. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleUpdateStatuses = async () => {
		if (!assessmentId) return;

		try {
			const result = await updateStatusMutation.mutateAsync({
				assessmentId,
				data: {
					appliedThreshold,
					partialThreshold,
				},
			});
			// Refetch data to show updated statuses
			refetchResults();
			refetchNotImplemented();

			// Show success toast
			toast({
				title: 'Statuses Updated',
				description: `Successfully updated ${result.totalUpdated} item statuses based on analysis scores.`,
			});
		} catch (error) {
			console.error('Status update failed:', error);
			toast({
				title: 'Update Failed',
				description: 'Failed to update item statuses. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'applied':
				return 'bg-green-100 text-green-800';
			case 'partially applied':
				return 'bg-yellow-100 text-yellow-800';
			case 'not applied':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 75) return 'text-green-600';
		if (score >= 40) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Assessment Analysis - {productName}
					</DialogTitle>
					<DialogDescription>
						Run AI-powered analysis on your repository to evaluate assessment
						criteria and get implementation insights.
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="analyze" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="analyze">Analyze</TabsTrigger>
						<TabsTrigger value="results">Results</TabsTrigger>
						<TabsTrigger value="not-implemented">Not Implemented</TabsTrigger>
						{/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
					</TabsList>

					<TabsContent value="analyze" className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* <div className="space-y-2">
								<Label htmlFor="assessmentId">Assessment ID</Label>
								<Input
									id="assessmentId"
									placeholder="Enter assessment ID to analyze"
									value={assessmentId}
									onChange={(e) => setAssessmentId(e.target.value)}
								/>
							</div> */}
							<div className="space-y-2">
								<Label htmlFor="repoUrl">Repository URL</Label>
								<Input
									id="repoUrl"
									placeholder="https://github.com/username/repository"
									value={repoUrl}
									onChange={(e) => setRepoUrl(e.target.value)}
								/>
							</div>
						</div>

						<Button
							onClick={handleAnalyze}
							disabled={
								!repoUrl || !assessmentId || analyzeAssessmentMutation.isPending
							}
							className="w-full"
						>
							{analyzeAssessmentMutation.isPending ? (
								<>
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									Analysis in Progress...
								</>
							) : (
								<>
									<GitBranch className="mr-2 h-4 w-4" />
									Run Assessment Analysis
								</>
							)}
						</Button>

						{/* Assessment Analysis Stepper */}
						<AssessmentAnalysisStepper
							isActive={analyzeAssessmentMutation.isPending}
							onComplete={() => {
								// Optional: Add any additional completion logic here
							}}
						/>

						{analysisResult && (
							<Alert
								className={
									analysisResult.success ? 'border-green-200' : 'border-red-200'
								}
							>
								{analysisResult.success ? (
									<CheckCircle className="h-4 w-4 text-green-600" />
								) : (
									<AlertCircle className="h-4 w-4 text-red-600" />
								)}
								<AlertTitle>
									Analysis {analysisResult.success ? 'Completed' : 'Failed'}
								</AlertTitle>
								<AlertDescription>{analysisResult.message}</AlertDescription>
							</Alert>
						)}

						{analysisResult?.success && analysisResult.analysisSummary && (
							<Card>
								<CardHeader>
									<CardTitle>Analysis Summary</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">
												{analysisResult.analysisSummary.appliedCount}
											</div>
											<div className="text-sm text-gray-600">Applied</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-yellow-600">
												{analysisResult.analysisSummary.partiallyAppliedCount}
											</div>
											<div className="text-sm text-gray-600">
												Partially Applied
											</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-red-600">
												{analysisResult.analysisSummary.notAppliedCount}
											</div>
											<div className="text-sm text-gray-600">Not Applied</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">
												{Math.round(
													analysisResult.analysisSummary.averageScore
												)}
												%
											</div>
											<div className="text-sm text-gray-600">Average Score</div>
										</div>
									</div>
									<Progress
										value={analysisResult.analysisSummary.appliedPercentage}
										className="w-full"
									/>
									<div className="text-center text-sm font-medium">
										Implementation Readiness:{' '}
										{analysisResult.analysisSummary.implementationReadiness}
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					<TabsContent value="results" className="space-y-4">
						{assessmentResults ? (
							<>
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">Assessment Results</h3>
									<Badge variant="outline">
										{assessmentResults.totalItems} Total Items
									</Badge>
								</div>

								{assessmentResults.statistics && (
									<Card>
										<CardHeader>
											<CardTitle>Statistics</CardTitle>
										</CardHeader>
										<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div className="text-center">
												<div className="text-xl font-bold">
													{assessmentResults.statistics.averageScore.toFixed(1)}
													%
												</div>
												<div className="text-sm text-gray-600">
													Average Score
												</div>
											</div>
											<div className="text-center">
												<div className="text-xl font-bold text-green-600">
													{assessmentResults.statistics.appliedCount}
												</div>
												<div className="text-sm text-gray-600">Applied</div>
											</div>
											<div className="text-center">
												<div className="text-xl font-bold text-yellow-600">
													{assessmentResults.statistics.partiallyAppliedCount}
												</div>
												<div className="text-sm text-gray-600">Partial</div>
											</div>
											<div className="text-center">
												<div className="text-xl font-bold text-red-600">
													{assessmentResults.statistics.notAppliedCount}
												</div>
												<div className="text-sm text-gray-600">Not Applied</div>
											</div>
										</CardContent>
									</Card>
								)}

								<div className="space-y-3">
									{assessmentResults.items.map((item) => (
										<Card key={item.id}>
											<CardContent className="pt-4">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<Badge variant="outline">{item.category}</Badge>
															<Badge className={getStatusColor(item.status)}>
																{item.status}
															</Badge>
														</div>
														<h4 className="font-medium mb-1">
															{item.evaluationItem}
														</h4>
														<p className="text-sm text-gray-600 mb-2">
															{item.description}
														</p>
														{item.note && (
															<p className="text-xs text-gray-500">
																{item.note}
															</p>
														)}
													</div>
												</div>
												{item.results.length > 0 && (
													<>
														<Separator className="my-3" />
														<div className="space-y-2">
															<h5 className="text-sm font-medium">
																Analysis Results:
															</h5>
															{item.results.map((result) => (
																<div
																	key={result.id}
																	className="flex items-center justify-between text-sm"
																>
																	<span>{result.userName}</span>
																	<div className="flex items-center gap-2">
																		<span
																			className={`font-medium ${getScoreColor(
																				result.score
																			)}`}
																		>
																			{result.score}%
																		</span>
																		<span className="text-gray-500">
																			{new Date(
																				result.createdAt
																			).toLocaleDateString()}
																		</span>
																	</div>
																</div>
															))}
														</div>
													</>
												)}
											</CardContent>
										</Card>
									))}
								</div>
							</>
						) : (
							<div className="text-center py-8 text-gray-500">
								No assessment results available. Run an analysis first.
							</div>
						)}
					</TabsContent>

					<TabsContent value="not-implemented" className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Not Implemented Items</h3>
							{/* <div className="flex items-center gap-2">
								<Label htmlFor="scoreThreshold">Score Threshold:</Label>
								<Input
									id="scoreThreshold"
									type="number"
									value={scoreThreshold}
									onChange={(e) => setScoreThreshold(Number(e.target.value))}
									className="w-20"
									min="0"
									max="100"
								/>
							</div> */}
						</div>

						{notImplementedItems ? (
							<>
								<Card>
									<CardHeader>
										<CardTitle>Summary</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="text-center">
												<div className="text-2xl font-bold text-red-600">
													{notImplementedItems.totalNotImplemented}
												</div>
												<div className="text-sm text-gray-600">
													Not Implemented
												</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold">
													{notImplementedItems.summary.length}
												</div>
												<div className="text-sm text-gray-600">Categories</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold">
													{scoreThreshold}%
												</div>
												<div className="text-sm text-gray-600">Threshold</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{notImplementedItems.summary.map((category) => (
									<Card key={category.category}>
										<CardHeader>
											<CardTitle className="flex items-center justify-between">
												{category.category}
												<Badge variant="destructive">
													{category.count} items
												</Badge>
											</CardTitle>
											<CardDescription>
												Average Score: {category.averageScore.toFixed(1)}%
											</CardDescription>
										</CardHeader>
										<CardContent>
											{notImplementedItems.itemsByCategory[
												category.category
											]?.map((item) => (
												<div
													key={item.id}
													className="border-l-4 border-red-200 pl-4 py-2"
												>
													<h5 className="font-medium">{item.evaluationItem}</h5>
													<p className="text-sm text-gray-600 mb-1">
														{item.description}
													</p>
													<div className="flex items-center gap-2 text-xs text-gray-500">
														<span>Score: {item.currentScore}%</span>
														{item.lastAnalyzed && (
															<span>
																Last analyzed:{' '}
																{new Date(
																	item.lastAnalyzed
																).toLocaleDateString()}
															</span>
														)}
													</div>
													{item.reasoning && (
														<p className="text-xs text-gray-600 mt-1 italic">
															{item.reasoning}
														</p>
													)}
												</div>
											))}
										</CardContent>
									</Card>
								))}
							</>
						) : (
							<div className="text-center py-8 text-gray-500">
								No data available. Run an analysis first.
							</div>
						)}
					</TabsContent>

					{/* <TabsContent value="settings" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Settings className="h-5 w-5" />
									Status Update Thresholds
								</CardTitle>
								<CardDescription>
									Configure score thresholds for automatic status updates based
									on analysis results.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="appliedThreshold">
											Applied Threshold (%)
										</Label>
										<Input
											id="appliedThreshold"
											type="number"
											value={appliedThreshold}
											onChange={(e) =>
												setAppliedThreshold(Number(e.target.value))
											}
											min="0"
											max="100"
										/>
										<p className="text-xs text-gray-500">
											Items scoring above this will be marked as "Applied"
										</p>
									</div>
									<div className="space-y-2">
										<Label htmlFor="partialThreshold">
											Partial Threshold (%)
										</Label>
										<Input
											id="partialThreshold"
											type="number"
											value={partialThreshold}
											onChange={(e) =>
												setPartialThreshold(Number(e.target.value))
											}
											min="0"
											max="100"
										/>
										<p className="text-xs text-gray-500">
											Items scoring above this will be marked as "Partially
											Applied"
										</p>
									</div>
								</div>

								<Button
									onClick={handleUpdateStatuses}
									disabled={!assessmentId || updateStatusMutation.isPending}
									className="w-full"
								>
									{updateStatusMutation.isPending ? (
										<>
											<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
											Updating Statuses...
										</>
									) : (
										<>
											<TrendingUp className="mr-2 h-4 w-4" />
											Update Item Statuses
										</>
									)}
								</Button>
							</CardContent>
						</Card>
					</TabsContent> */}
				</Tabs>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
