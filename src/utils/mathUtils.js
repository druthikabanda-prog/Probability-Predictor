/**
 * Continuous Probability Distribution Mathematics & Parameter Estimation
 * Module V: Continuous Probability Distributions (Normal, Gamma, Uniform)
 */

// Error function approximation (Abramowitz & Stegun 7.1.26, max error: 1.5e-7)
export function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);

  return sign * y;
}

// Standard Normal CDF: P(Z <= z)
export function standardNormalCDF(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Standard Normal PDF: f(z)
export function standardNormalPDF(z) {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
}

// Calculate Z-Score
export function calculateZScore(x, mean, stdDev) {
  if (stdDev <= 0) return 0;
  return (x - mean) / stdDev;
}

// Normal Distribution PDF
export function normalPDF(x, mean, stdDev) {
  if (stdDev <= 0) return 0;
  const z = (x - mean) / stdDev;
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

// Normal Distribution CDF: P(X <= x)
export function normalCDF(x, mean, stdDev) {
  if (stdDev <= 0) return x >= mean ? 1 : 0;
  const z = calculateZScore(x, mean, stdDev);
  return standardNormalCDF(z);
}

// Uniform Distribution PDF: f(x) = 1 / (b - a)
export function uniformPDF(x, a, b) {
  if (b <= a || x < a || x > b) return 0;
  return 1 / (b - a);
}

// Uniform Distribution CDF: P(X <= x)
export function uniformCDF(x, a, b) {
  if (b <= a) return 0;
  if (x < a) return 0;
  if (x > b) return 1;
  return (x - a) / (b - a);
}

// Log Gamma Function (Lanczos Approximation)
export function logGamma(x) {
  if (x <= 0) return 0;
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  let y = x;
  let tmp = x + 7.5;
  tmp = (x + 0.5) * Math.log(tmp) - tmp;
  let ser = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) {
    ser += p[i] / (y + 1 + i);
  }
  return tmp + Math.log(Math.PI * 2 * ser / y);
}

export function gammaFunc(x) {
  return Math.exp(logGamma(x));
}

// Regularized Lower Incomplete Gamma P(a, x)
export function regularizedGammaP(a, x) {
  if (x <= 0) return 0;
  if (a <= 0) return 0;

  let sum = 1 / a;
  let value = 1 / a;
  for (let n = 1; n < 100; n++) {
    value *= x / (a + n);
    sum += value;
    if (value < 1e-12 * sum) break;
  }
  const result = Math.exp(-x + a * Math.log(x) - logGamma(a)) * sum;
  return Math.min(1, Math.max(0, result));
}

// Gamma Distribution PDF (shape alpha, rate lambda)
export function gammaPDF(x, alpha, lambda) {
  if (x <= 0 || alpha <= 0 || lambda <= 0) return 0;
  const logPdf = alpha * Math.log(lambda) + (alpha - 1) * Math.log(x) - lambda * x - logGamma(alpha);
  return Math.exp(logPdf);
}

// Gamma Distribution CDF: P(X <= x)
export function gammaCDF(x, alpha, lambda) {
  if (x <= 0 || alpha <= 0 || lambda <= 0) return 0;
  return regularizedGammaP(alpha, lambda * x);
}

// Estimate Gamma parameters from mean and variance using Method of Moments
export function estimateGammaParams(mean, variance) {
  const m = Math.max(0.001, Number(mean) || 1);
  const v = Math.max(0.001, Number(variance) || 1);
  const alpha = Math.max(0.1, (m * m) / v);
  const lambda = Math.max(0.0001, m / v);
  return {
    alpha: Number(alpha.toFixed(4)),
    lambda: Number(lambda.toFixed(4))
  };
}

// --- MONTE CARLO SIMULATION RANDOM GENERATORS ---

export function randomStandardNormal() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function randomNormal(mean, stdDev) {
  return mean + randomStandardNormal() * stdDev;
}

export function randomUniform(a, b) {
  return a + Math.random() * (b - a);
}

export function randomGamma(alpha, lambda) {
  if (alpha <= 0 || lambda <= 0) return 0;

  if (alpha < 1) {
    const u = Math.random();
    return randomGamma(1 + alpha, lambda) * Math.pow(u, 1 / alpha);
  }

  const d = alpha - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const z = randomStandardNormal();
    const v = 1 + c * z;
    if (v <= 0) continue;
    const v3 = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * z * z * z * z) {
      return (d * v3) / lambda;
    }
    if (Math.log(u) < 0.5 * z * z + d * (1 - v3 + Math.log(v3))) {
      return (d * v3) / lambda;
    }
  }
}

// --- DESCRIPTIVE STATISTICS UTILITIES ---

export function calculateStats(numbers) {
  if (!numbers || numbers.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, variance: 0, min: 0, max: 0, range: 0, count: 0 };
  }

  const validNumbers = numbers
    .map(n => Number(n))
    .filter(n => typeof n === 'number' && !isNaN(n));

  if (validNumbers.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, variance: 0, min: 0, max: 0, range: 0, count: 0 };
  }

  const count = validNumbers.length;
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;

  const sorted = [...validNumbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  let median = 0;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  const variance = validNumbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (count > 1 ? count - 1 : 1);
  const stdDev = Math.sqrt(variance);

  return {
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    range: Number(range.toFixed(2)),
    count
  };
}

export function detectNumericalColumns(rows) {
  if (!rows || rows.length === 0) return [];
  const firstRow = rows[0];
  const numericalCols = [];

  Object.keys(firstRow).forEach(key => {
    let numericCount = 0;
    let sampleSize = Math.min(rows.length, 50);

    for (let i = 0; i < sampleSize; i++) {
      const val = rows[i]?.[key];
      if (val !== null && val !== undefined && val !== '' && !isNaN(Number(val))) {
        numericCount++;
      }
    }

    if (numericCount / sampleSize >= 0.7) {
      numericalCols.push(key);
    }
  });

  return numericalCols;
}

export function extractColumnValues(rows, columnName) {
  if (!rows || !columnName) return [];
  return rows
    .map(row => Number(row[columnName]))
    .filter(val => typeof val === 'number' && !isNaN(val));
}

export function inferDatasetContext(datasetName = '', columnNames = []) {
  const allColsLower = (columnNames || []).map(c => String(c).toLowerCase()).join(' ');
  const nameLower = (datasetName || '').toLowerCase();
  const scan = `${nameLower} ${allColsLower}`;

  if (/student|mark|score|attendance|cgpa|grade|gpa|study|exam|homework/i.test(scan)) {
    return {
      title: 'Student Performance Analysis',
      badge: 'Student / Academic Data',
      category: 'student'
    };
  }

  if (/delivery|transit|distance|order|shipment|logistics|courier|dispatch|fleet|prep_time/i.test(scan)) {
    return {
      title: 'Delivery Data Analysis',
      badge: 'Logistics / Delivery Data',
      category: 'delivery'
    };
  }

  if (/product|price|weight|quantity|sku|item|e-commerce|catalog|retail|cost/i.test(scan)) {
    return {
      title: 'Product Data Analysis',
      badge: 'Retail / Product Data',
      category: 'product'
    };
  }

  if (/patient|hospital|waiting|wait|treatment|healthcare|doctor|pulse|blood|nurse|age/i.test(scan)) {
    return {
      title: 'Healthcare Data Analysis',
      badge: 'Medical / Healthcare Data',
      category: 'healthcare'
    };
  }

  if (/employee|salary|wage|experience|working_hours|working|tenure|stipend|payroll|hr/i.test(scan)) {
    return {
      title: 'Employee Data Analysis',
      badge: 'Workforce / HR Data',
      category: 'employee'
    };
  }

  if (/sales|revenue|profit|unit|transaction|customer|order_value/i.test(scan)) {
    return {
      title: 'Sales Data Analysis',
      badge: 'Commercial / Sales Data',
      category: 'sales'
    };
  }

  if (/temp|temperature|rainfall|humidity|wind|weather|rain/i.test(scan)) {
    return {
      title: 'Weather Data Analysis',
      badge: 'Meteorological Data',
      category: 'weather'
    };
  }

  return {
    title: 'General Numerical Data Analysis',
    badge: 'General Numerical Data',
    category: 'general'
  };
}

