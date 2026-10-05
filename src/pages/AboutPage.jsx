import React from 'react';
import { Info, Target, CheckCircle2, GraduationCap, Activity, Layers, Scale } from 'lucide-react';
import FormulaCard from '../components/FormulaCard';

export default function AboutPage() {
  const normalExpressions = [
    "X \\sim N(\\mu, \\sigma^2)",
    "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
    "Z = \\frac{X-\\mu}{\\sigma}",
    "E(X) = \\mu",
    "\\text{Var}(X) = \\sigma^2"
  ];

  const gammaExpressions = [
    "X \\sim \\text{Gamma}(\\alpha, \\lambda)",
    "f(x) = \\frac{\\lambda^\\alpha}{\\Gamma(\\alpha)} x^{\\alpha-1}e^{-\\lambda x}",
    "E(X) = \\frac{\\alpha}{\\lambda}",
    "\\text{Var}(X) = \\frac{\\alpha}{\\lambda^2}"
  ];

  const uniformExpressions = [
    "X \\sim U(a,b)",
    "f(x) = \\frac{1}{b-a}, \\quad a \\le x \\le b",
    "E(X) = \\frac{a+b}{2}",
    "\\text{Var}(X) = \\frac{(b-a)^2}{12}"
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xs transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold font-manrope text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Academic Project Documentation &amp; Curriculum Reference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
          About Probability Predictor
        </h1>
        <p className="text-sm font-semibold font-inter text-slate-700 dark:text-slate-300 mt-1">
          Unified Data Analysis
        </p>
        <blockquote className="text-xs sm:text-sm font-inter text-blue-900 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-950/60 border-l-4 border-blue-600 dark:border-blue-400 p-4 rounded-r-xl mt-4 leading-relaxed font-semibold">
          “Probability Predictor is a unified data-analysis application that uses continuous probability distributions to estimate probabilities from real-world numerical datasets.”
        </blockquote>
      </div>

      {/* Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-3 transition-colors duration-200">
          <h3 className="font-semibold font-poppins text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Problem Statement</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Real-world numerical variables (such as student marks, delivery transit times, product prices, employee salaries, or hospital waiting times) fluctuate due to underlying stochastic variance. Simple deterministic averages fail to capture risk or probability boundaries.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            This application inspects uploaded numerical dataset variables and fits continuous probability distribution functions to compute exact cumulative probabilities P(X ≤ target), tail probabilities P(X &gt; target), and interval probabilities.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-3 transition-colors duration-200">
          <h3 className="font-semibold font-poppins text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Academic Objectives</span>
          </h3>
          <ul className="text-xs text-slate-700 dark:text-slate-300 font-medium space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>Apply continuous probability distribution theory (Normal, Gamma, Uniform) to arbitrary numerical datasets.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>Estimate distribution parameters dynamically from empirical data (Method of Moments for Gamma, Sample Mean &amp; Variance for Normal).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>Compute probability density functions (PDF) and cumulative distribution functions (CDF).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>Simulate continuous trial runs using stochastic Monte Carlo algorithms.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Academic Topic Banner */}
      <div className="p-5 bg-blue-600 dark:bg-blue-700 text-white rounded-xl flex items-center justify-between gap-4 shadow-2xs font-inter">
        <div>
          <span className="text-xs font-semibold font-manrope uppercase text-blue-100">Academic Curriculum Reference</span>
          <h3 className="text-lg font-bold font-poppins mt-0.5 text-white">Module V — Continuous Probability Distributions</h3>
        </div>
        <div className="px-3.5 py-1.5 bg-white text-blue-700 font-manrope rounded-lg text-xs font-bold shadow-2xs shrink-0">
          Curriculum Topic
        </div>
      </div>

      {/* Continuous Probability Distributions Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-4 transition-colors duration-200">
        <h3 className="font-semibold font-poppins text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Continuous Probability Distributions Used
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold font-poppins text-sm">
              <Activity className="w-4 h-4" />
              <span>Normal Distribution</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Symmetric bell-shaped distribution centered at sample mean μ with variance σ².
            </p>
            <div className="pt-2 text-[11px] text-slate-700 dark:text-slate-300">
              <strong className="text-blue-700 dark:text-blue-400 font-semibold block font-manrope">When useful:</strong>
              Suitable for symmetric continuous measurements like student exam marks, human heights, product weights, and standard transit times.
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold font-poppins text-sm">
              <Layers className="w-4 h-4" />
              <span>Gamma Distribution</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Flexible right-skewed continuous distribution parametrized by shape α and rate λ.
            </p>
            <div className="pt-2 text-[11px] text-slate-700 dark:text-slate-300">
              <strong className="text-blue-700 dark:text-blue-400 font-semibold block font-manrope">When useful:</strong>
              Useful for positive continuous data, hospital waiting times, customer queue delays, service durations, and lifespan measurements.
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold font-poppins text-sm">
              <Scale className="w-4 h-4" />
              <span>Uniform Distribution</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Continuous distribution where all outcomes inside a bounded interval [a, b] are equally likely.
            </p>
            <div className="pt-2 text-[11px] text-slate-700 dark:text-slate-300">
              <strong className="text-blue-700 dark:text-blue-400 font-semibold block font-manrope">When useful:</strong>
              Useful when values within a defined interval are assumed equally likely, such as bus arrival windows and random number generation.
            </div>
          </div>
        </div>
      </div>

      {/* KaTeX Rendered Formula Cards (3-Column Desktop Grid) */}
      <div className="space-y-4">
        <h3 className="font-semibold font-poppins text-base text-slate-900 dark:text-slate-100">
          Continuous Probability Distribution Formulas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <FormulaCard
            title="Normal Distribution"
            expressions={normalExpressions}
          />
          <FormulaCard
            title="Gamma Distribution"
            expressions={gammaExpressions}
          />
          <FormulaCard
            title="Uniform Distribution"
            expressions={uniformExpressions}
          />
        </div>
      </div>
    </div>
  );
}
