"use client";

interface StepHeadingProps {
  title: string;
  subtitle?: string;
}

export function StepHeading({ title, subtitle }: StepHeadingProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-black">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
