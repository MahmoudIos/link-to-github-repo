import React, { useState, useEffect } from 'react';
import {
	CheckCircle,
	Circle,
	RefreshCw,
	GitBranch,
	Brain,
	Database,
	FileCheck,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface Step {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	duration: number; // in seconds
}

interface AssessmentAnalysisStepperProps {
	isActive: boolean;
	onComplete?: () => void;
}

const analysisSteps: Step[] = [
  {
    id: 'ingesting',
    title: 'Ingesting Repository',
    description: 'Cloning and analyzing repository structure...',
    icon: <GitBranch className="h-5 w-5" />,
    duration: 12,
  },
  {
    id: 'analyzing',
    title: 'Analyzing Code',
    description: 'AI is examining code against assessment criteria...',
    icon: <Brain className="h-5 w-5" />,
    duration: 60,
  },
  {
    id: 'processing',
    title: 'Processing Results',
    description: 'Calculating scores and generating insights...',
    icon: <Database className="h-5 w-5" />,
    duration: 6,
  },
  {
    id: 'finalizing',
    title: 'Finalizing Analysis',
    description: 'Saving results and preparing summary...',
    icon: <FileCheck className="h-5 w-5" />,
    duration: 2,
  },
];

export const AssessmentAnalysisStepper: React.FC<
	AssessmentAnalysisStepperProps
> = ({ isActive, onComplete }) => {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [completedSteps, setCompletedSteps] = useState<string[]>([]);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (!isActive) {
			setCurrentStepIndex(0);
			setCompletedSteps([]);
			setProgress(0);
			return;
		}

		let intervalId: NodeJS.Timeout;
		let stepTimer: NodeJS.Timeout;

		const startNextStep = () => {
			if (currentStepIndex < analysisSteps.length) {
				const currentStep = analysisSteps[currentStepIndex];
				let elapsed = 0;

				intervalId = setInterval(() => {
					elapsed += 0.1;
					const stepProgress = Math.min(
						(elapsed / currentStep.duration) * 100,
						100
					);
					const totalProgress =
						((currentStepIndex + stepProgress / 100) / analysisSteps.length) *
						100;
					setProgress(totalProgress);

					if (elapsed >= currentStep.duration) {
						clearInterval(intervalId);
						setCompletedSteps((prev) => [...prev, currentStep.id]);
						setCurrentStepIndex((prev) => prev + 1);
					}
				}, 100);

				stepTimer = setTimeout(() => {
					if (currentStepIndex === analysisSteps.length - 1) {
						setProgress(100);
						onComplete?.();
					}
				}, currentStep.duration * 1000);
			}
		};

		startNextStep();

		return () => {
			clearInterval(intervalId);
			clearTimeout(stepTimer);
		};
	}, [isActive, currentStepIndex, onComplete]);

	const getStepStatus = (stepId: string, index: number) => {
		if (completedSteps.includes(stepId)) return 'completed';
		if (index === currentStepIndex && isActive) return 'active';
		return 'pending';
	};

	const getStepIcon = (step: Step, status: string) => {
		if (status === 'completed') {
			return <CheckCircle className="h-5 w-5 text-green-600" />;
		}
		if (status === 'active') {
			return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
		}
		return <Circle className="h-5 w-5 text-gray-400" />;
	};

	if (!isActive) return null;

	return (
		<Card className="w-full">
			<CardContent className="pt-6">
				<div className="space-y-6">
					<div className="text-center">
						<h3 className="text-lg font-semibold mb-2">
							Running Assessment Analysis
						</h3>
						<Progress value={progress} className="w-full" />
						<p className="text-sm text-gray-600 mt-2">
							{Math.round(progress)}% Complete
						</p>
					</div>

					<div className="space-y-4">
						{analysisSteps.map((step, index) => {
							const status = getStepStatus(step.id, index);
							return (
								<div
									key={step.id}
									className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
										status === 'active'
											? 'bg-blue-50 border border-blue-200'
											: status === 'completed'
											? 'bg-green-50 border border-green-200'
											: 'bg-gray-50 border border-gray-200'
									}`}
								>
									<div className="flex-shrink-0 mt-1">
										{getStepIcon(step, status)}
									</div>
									<div className="flex-1">
										<h4
											className={`font-medium ${
												status === 'active'
													? 'text-blue-900'
													: status === 'completed'
													? 'text-green-900'
													: 'text-gray-700'
											}`}
										>
											{step.title}
										</h4>
										<p
											className={`text-sm ${
												status === 'active'
													? 'text-blue-700'
													: status === 'completed'
													? 'text-green-700'
													: 'text-gray-500'
											}`}
										>
											{step.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					<div className="text-center text-sm text-gray-600">
						<p>
							This process may take 1-2 minutes depending on repository size
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
