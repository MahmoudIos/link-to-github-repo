import React from 'react';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
	{ name: 'Netways', value: 35, projects: 12, color: '#3B82F6' },
	{ name: 'XEBIA', value: 25, projects: 8, color: '#8B5CF6' },
	{ name: 'Cloud Masters', value: 20, projects: 6, color: '#06B6D4' },
	{ name: 'Web Experts', value: 15, projects: 5, color: '#10B981' },
	{ name: 'GP Solutions', value: 5, projects: 2, color: '#F59E0B' },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

// Custom tooltip component
const CustomTooltip = ({
	active,
	payload,
}: {
	active?: boolean;
	payload?: Array<{
		payload: { name: string; value: number; projects: number };
	}>;
}) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/60">
				<p className="font-semibold text-gray-900 mb-2">{data.name}</p>
				<p className="text-gray-600">
					<span className="font-medium">{data.projects}</span> projects
				</p>
				<p className="text-gray-600">
					<span className="font-medium">{data.value}%</span> of total
				</p>
			</div>
		);
	}
	return null;
};

// Custom legend component
const CustomLegend = () => {
	return (
		<div className="flex flex-wrap gap-4 justify-center mt-6">
			{data.map((entry, index) => (
				<div key={index} className="flex items-center gap-2">
					<div
						className="w-3 h-3 rounded-full shadow-sm"
						style={{ backgroundColor: COLORS[index] }}
					/>
					<span className="text-sm font-medium text-gray-700">
						{entry.name}
					</span>
				</div>
			))}
		</div>
	);
};

export const VendorDistributionChart = () => {
	return (
		<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
			<CardHeader className="pb-6">
				<CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
					Products Distribution by Vendor
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6 pt-0">
				<div className="relative">
					<ResponsiveContainer width="100%" height={350}>
						<PieChart>
							<defs>
								{COLORS.map((color, index) => (
									<linearGradient
										key={index}
										id={`gradient-${index}`}
										x1="0%"
										y1="0%"
										x2="100%"
										y2="100%"
									>
										<stop offset="0%" stopColor={color} stopOpacity={1} />
										<stop offset="100%" stopColor={color} stopOpacity={0.8} />
									</linearGradient>
								))}
							</defs>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, percent }) => {
									const percentage = Number((percent * 100).toFixed(0));
									return percentage > 8 ? `${percentage}%` : '';
								}}
								outerRadius={100}
								innerRadius={40}
								fill="#8884d8"
								dataKey="value"
								stroke="rgba(255,255,255,0.8)"
								strokeWidth={2}
							>
								{data.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={`url(#gradient-${index})`}
									/>
								))}
							</Pie>
							<Tooltip content={<CustomTooltip />} />
							<Legend content={<CustomLegend />} />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Summary Statistics */}
				<div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200/60">
					<div className="text-center">
						<div className="text-2xl font-semibold text-gray-900 mb-1">
							{data.reduce((sum, item) => sum + item.projects, 0)}
						</div>
						<div className="text-sm text-gray-600 font-medium">
							Total Products
						</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-semibold text-gray-900 mb-1">
							{data.length}
						</div>
						<div className="text-sm text-gray-600 font-medium">
							Active Vendors
						</div>
					</div>
				</div>

				{/* Vendor Color Legend */}
				{/* <div className="mt-8 pt-6 border-t border-gray-200/60">
					<h4 className="text-sm font-semibold text-gray-900 mb-4">
						Vendor Distribution
					</h4>
					<div className="space-y-3">
						{data.map((vendor, index) => (
							<div
								key={vendor.name}
								className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl"
							>
								<div className="flex items-center gap-3">
									<div
										className="w-4 h-4 rounded-full shadow-sm border border-white"
										style={{ backgroundColor: COLORS[index] }}
									/>
									<span className="font-medium text-gray-900">
										{vendor.name}
									</span>
								</div>
								<div className="flex items-center gap-4 text-sm text-gray-600">
									<span>{vendor.projects} products</span>
									<span className="font-semibold">{vendor.value}%</span>
								</div>
							</div>
						))}
					</div>
				</div> */}
			</CardContent>
		</Card>
	);
};
