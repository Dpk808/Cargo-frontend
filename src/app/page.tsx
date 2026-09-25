'use client';

import Link from 'next/link';
import Card from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import { useConsignees } from '@/src/hooks/useConsignees';
import { useMawbs } from '@/src/hooks/useMawbs';
import { useShippers } from '@/src/hooks/useShippers';

export default function HomePage() {
	const shippers = useShippers();
	const consignees = useConsignees();
	const mawbs = useMawbs();

	const metrics = [
		{
			label: 'Shippers',
			value: shippers.data?.length ?? 0,
			href: '/shipper',
			color: 'from-blue-500/10 to-blue-600/5',
			icon: '📦',
		},
		{
			label: 'Consignees',
			value: consignees.data?.length ?? 0,
			href: '/consignee',
			color: 'from-purple-500/10 to-purple-600/5',
			icon: '🎯',
		},
		{
			label: 'MAWBs',
			value: mawbs.data?.length ?? 0,
			href: '/mawb',
			color: 'from-emerald-500/10 to-emerald-600/5',
			icon: '✈️',
		},
	];

	return (
		<div className="space-y-8">
			<Card className="relative overflow-hidden bg-gradient-to-br from-[var(--color-ink)] via-[var(--color-ocean)] to-[var(--color-ink)] text-white" title="Cargo Operations Console">
				<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
				<div className="absolute -left-32 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
				<div className="relative space-y-4">
					<p className="max-w-2xl text-base leading-relaxed text-white/90">
						Monitor your logistics entities and maintain comprehensive records from one unified workspace.
					</p>
					<p className="text-sm text-white/70">
						Use the navigation to manage shippers, consignees, and MAWB entries with ease.
					</p>
				</div>
			</Card>

			<div>
				<h2 className="mb-4 text-lg font-bold text-[var(--color-ink)]">Quick Stats</h2>
				<div className="grid gap-5 md:grid-cols-3">
					{metrics.map((metric) => (
						<Link key={metric.label} href={metric.href}>
							<Card className={`h-full bg-gradient-to-br ${metric.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ocean)]">
											{metric.label}
										</p>
										<span className="text-2xl">{metric.icon}</span>
									</div>
									<div className="space-y-1">
										<h3 className="text-4xl font-bold text-[var(--color-ink)]">{metric.value}</h3>
										<p className="text-xs text-[var(--color-ink)]/60">Total records</p>
									</div>
								</div>
							</Card>
						</Link>
					))}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<Card title="Quick Actions" subtitle="Common operations">
					<div className="space-y-2">
						<Link href="/shipper">
							<Button variant="secondary" fullWidth className="justify-start">
								➕ Add Shipper
							</Button>
						</Link>
						<Link href="/consignee">
							<Button variant="secondary" fullWidth className="justify-start">
								➕ Add Consignee
							</Button>
						</Link>
						<Link href="/mawb/add">
							<Button variant="secondary" fullWidth className="justify-start">
								➕ Create MAWB
							</Button>
						</Link>
					</div>
				</Card>

				<Card title="System Info" subtitle="Current status">
					<div className="space-y-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-[var(--color-ink)]/70">Status</span>
							<span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
								<span className="h-2 w-2 rounded-full bg-emerald-600"></span>
								Active
							</span>
						</div>
						<div className="flex items-center justify-between border-t border-[var(--color-mist)] pt-3">
							<span className="text-[var(--color-ink)]/70">Database</span>
							<span className="text-[var(--color-ink)]">Connected</span>
						</div>
					</div>
				</Card>

				<Card title="Help & Support" subtitle="Resources">
					<div className="space-y-2 text-sm">
						<p className="text-[var(--color-ink)]/70">
							Need help? Check the documentation or contact support for assistance.
						</p>
						<Button variant="ghost" fullWidth className="mt-4">
							📚 Documentation
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
