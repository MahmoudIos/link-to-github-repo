import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
	{ name: 'Netways', rating: 96, shortName: 'NET', color: '#3B82F6' },
	{ name: 'GP Solutions', rating: 90, shortName: 'GPS', color: '#F59E0B' },
	{ name: 'XEBIA', rating: 84, shortName: 'XEB', color: '#8B5CF6' },
	{ name: 'Web Experts', rating: 92, shortName: 'WEB', color: '#10B981' },
	{ name: 'Mobile Dev Co', rating: 86, shortName: 'MDC', color: '#06B6D4' },
];

// Custom tooltip component
const CustomTooltip = ({
	active,
	payload,
}: {
	active?: boolean;
	payload?: Array<{ payload: { name: string; rating: number; color: string } }>;
}) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/60">
				<div className="flex items-center gap-3 mb-2">
					<div
						className="w-3 h-3 rounded-full shadow-sm"
						style={{ backgroundColor: data.color }}
					/>
					<p className="font-semibold text-gray-900">{data.name}</p>
				</div>
				<p className="text-gray-600">
					Rating:{' '}
					<span className="font-semibold text-primary">{data.rating}%</span>
				</p>
			</div>
		);
	}
	return null;
};

// Custom grid component
const CustomGrid = (props: React.ComponentProps<typeof CartesianGrid>) => (
	<CartesianGrid
		{...props}
		strokeDasharray="2 4"
		stroke="rgba(156, 163, 175, 0.2)"
		horizontal={true}
		vertical={false}
	/>
);

export const VendorRatingsChart = () => {
	const averageRating = Math.round(
		data.reduce((sum, item) => sum + item.rating, 0) / data.length
	);
	const topPerformer = data.reduce((prev, current) =>
		prev.rating > current.rating ? prev : current
	);

	return (
		<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
			<CardHeader className="pb-6">
				<CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
					Average Vendor Ratings
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6 pt-0">
				<div className="relative">
					<ResponsiveContainer width="100%" height={350}>
						<BarChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
							barCategoryGap="25%"
						>
							<defs>
								<linearGradient
									id="ratingGradient"
									x1="0%"
									y1="0%"
									x2="0%"
									y2="100%"
								>
									<stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
									<stop offset="50%" stopColor="#3B82F6" stopOpacity={0.8} />
									<stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
								</linearGradient>
							</defs>
							<CustomGrid />
							<XAxis
								dataKey="shortName"
								axisLine={false}
								tickLine={false}
								tick={{
									fontSize: 12,
									fontWeight: 500,
									fill: '#6B7280',
								}}
								height={60}
							/>
							<YAxis
								domain={[75, 100]}
								axisLine={false}
								tickLine={false}
								tick={{
									fontSize: 12,
									fontWeight: 500,
									fill: '#6B7280',
								}}
								tickFormatter={(value) => `${value}%`}
							/>
							<Tooltip
								content={<CustomTooltip />}
								cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
							/>
							<Bar
								dataKey="rating"
								fill="url(#ratingGradient)"
								radius={[8, 8, 0, 0]}
								stroke="rgba(255,255,255,0.3)"
								strokeWidth={1}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Summary Statistics */}
				<div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200/60">
					<div className="text-center">
						<div className="text-2xl font-semibold text-gray-900 mb-1">
							{averageRating}%
						</div>
						<div className="text-sm text-gray-600 font-medium">
							Average Rating
						</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-semibold text-gray-900 mb-1">
							{topPerformer.rating}%
						</div>
						<div className="text-sm text-gray-600 font-medium">
							Top Performer
						</div>
					</div>
				</div>

				{/* Rating Insights */}
				<div className="mt-6 p-4 bg-blue-50/80 rounded-xl backdrop-blur-sm">
					<div className="flex items-center gap-3">
						<div className="w-2 h-2 bg-primary rounded-full"></div>
						<p className="text-sm text-gray-700">
							<span className="font-semibold">{topPerformer.name}</span> leads
							with {topPerformer.rating}% rating
						</p>
					</div>
				</div>

				{/* Vendor Ratings List with Colors */}
				{/* <div className="mt-8 pt-6 border-t border-gray-200/60">
					<h4 className="text-sm font-semibold text-gray-900 mb-4">
						Vendor Ratings
					</h4>
					<div className="space-y-3">
						{data
							.sort((a, b) => b.rating - a.rating)
							.map((vendor, index) => (
								<div
									key={vendor.name}
									className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl"
								>
									<div className="flex items-center gap-3">
										<div
											className="w-4 h-4 rounded-full shadow-sm border border-white"
											style={{ backgroundColor: vendor.color }}
										/>
										<span className="font-medium text-gray-900">
											{vendor.name}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="text-right">
											<div className="text-sm font-semibold text-gray-900">
												{vendor.rating}%
											</div>
											<div className="text-xs text-gray-500">Rating</div>
										</div>
									</div>
								</div>
							))}
					</div>
				</div> */}
			</CardContent>
		</Card>
	);
};
