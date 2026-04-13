import Image from "next/image";

const ALL_LOGOS = [
  { src: "/images/napit-logo-2017%201.svg", alt: "NAPIT", width: 90, height: 44 },
  { src: "/images/1200px-Gas_Safe_Register.svg", alt: "Gas Safe", width: 72, height: 44 },
  { src: "/images/OFTEC-Logo-2-1%201.svg", alt: "OFTEC Registered Heating Business", width: 96, height: 44 },
  { src: "/images/F-Gas-Training-1%201.svg", alt: "FGAS Certification", width: 88, height: 44 },
  { src: "/images/safeContractor-approved%201.svg", alt: "SafeContractor Approved", width: 72, height: 44 },
];

interface CredibilityLogosProps {
  variant?: "eicr" | "boiler";
}

export function CredibilityLogos({ variant: _variant = "eicr" }: CredibilityLogosProps) {
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-4 px-[10px]">
      {ALL_LOGOS.map((logo) => (
        <Image
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className="object-contain h-auto w-auto max-w-[16%] sm:max-w-none sm:max-h-11"
          unoptimized
        />
      ))}
    </div>
  );
}
