import React from 'react';
import { BookOpen, GraduationCap, Calculator, Activity, Zap, Layers, Scale, PieChart } from 'lucide-react';

export default function FormulasPage() {
  const topics = [
    {
      id: 'normal',
      title: 'Normal Distribution N(μ, σ²)',
      icon: Activity,
      definition: 'A symmetric continuous probability distribution where values cluster bell-shaped around the mean μ.',
      formula: 'f(x) = (1 / σ√(2π)) · exp(- (x - μ)² / 2σ²)',
      meanFormula: 'E(X) = μ',
      varianceFormula: 'Var(X) = σ²',
      example: 'Modeling overall order fulfillment time from restaurant acceptance to customer doorstep arrival under average traffic conditions.'
    },
    {
      id: 'zscore',
      title: 'Standard Normal & Z-Score',
      icon: Calculator,
      definition: 'Standardization formula converting any Normal random variable X ~ N(μ, σ²) into standard normal variate Z ~ N(0, 1).',
      formula: 'Z = (X - μ) / σ',
      meanFormula: 'E(Z) = 0',
      varianceFormula: 'Var(Z) = 1',
      example: 'A delivery takes 50 min when average μ = 42 min and σ = 8 min. Z = (50 - 42) / 8 = 1.00 (1 standard deviation above mean).'
    },
    {
      id: 'ztable',
      title: 'Z-Table Lookup P(Z ≤ z)',
      icon: BookOpen,
      definition: 'A standardized reference table containing cumulative probabilities P(Z ≤ z) for the standard normal distribution.',
      formula: 'P(X ≤ target) = Φ(Z)',
      meanFormula: 'P(Z ≤ 0) = 0.5000',
      varianceFormula: 'P(Z ≤ 1) = 0.8413',
      example: 'For Z = 1.25, looking up standard Z-table gives P(Z ≤ 1.25) = 0.8944 (89.44% on-time delivery probability).'
    },
    {
      id: 'uniform',
      title: 'Uniform Distribution U(a, b)',
      icon: Scale,
      definition: 'A continuous distribution where all outcomes within a bounded interval [a, b] are equally likely.',
      formula: 'f(x) = 1 / (b - a)  for  a ≤ x ≤ b',
      meanFormula: 'E(X) = (a + b) / 2',
      varianceFormula: 'Var(X) = (b - a)² / 12',
      example: 'Couriers arrive at a urban hub strictly between 15 and 45 minutes, with equal likelihood for any specific minute.'
    },
    {
      id: 'exponential',
      title: 'Exponential Distribution Exp(λ)',
      icon: Zap,
      definition: 'A continuous memoryless distribution modeling the waiting time elapsed between random logistics events.',
      formula: 'f(x) = λ · exp(-λx)  for  x ≥ 0 | CDF: 1 - exp(-λx)',
      meanFormula: 'E(X) = 1 / λ',
      varianceFormula: 'Var(X) = 1 / λ²',
      example: 'Modeling dispatch waiting time for driver assignment when incoming order rate is λ = 0.05 orders/min (mean wait = 20 min).'
    },
    {
      id: 'gamma',
      title: 'Gamma Distribution Gamma(α, λ)',
      icon: Layers,
      definition: 'A continuous right-skewed distribution modeling total duration across α sequential Poisson process stages.',
      formula: 'f(x) = (λ^α / Γ(α)) · x^(α-1) · exp(-λx)',
      meanFormula: 'E(X) = α / λ',
      varianceFormula: 'Var(X) = α / λ²',
      example: 'Sequential multi-stage logistics pipeline: kitchen prep + packing + dispatch + driving combined together.'
    },
    {
      id: 'beta',
      title: 'Beta Distribution Beta(α, β)',
      icon: PieChart,
      definition: 'A continuous probability distribution defined on interval [0, 1], modeling proportions and percentage completion.',
      formula: 'f(x) = (x^(α-1) · (1-x)^(β-1)) / B(α, β)',
      meanFormula: 'E(X) = α / (α + β)',
      varianceFormula: 'Var(X) = (αβ) / ((α+β)²(α+β+1))',
      example: 'Modeling driver progress percentage or fuel tank consumption proportion during long haul transit.'
    }
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xs transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold font-manrope text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Module V — Continuous Probability Distributions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
          Learning &amp; Mathematical Formulas
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-3xl leading-relaxed">
          Comprehensive curriculum reference covering formulas, expectations E(X), variances Var(X), and practical delivery logistics examples.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-4 transition-colors duration-200">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base font-poppins text-slate-900 dark:text-slate-100">{t.title}</h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {t.definition}
              </p>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl font-mono text-xs text-center font-bold text-blue-700 dark:text-blue-300">
                {t.formula}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg">
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Mean / Expected</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{t.meanFormula}</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg">
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Variance</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{t.varianceFormula}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Logistics Example:</strong>
                {t.example}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
