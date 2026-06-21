interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <span className={`inline-flex select-none items-center whitespace-nowrap font-semibold leading-none tracking-[0.2em] ${className}`}>
      <span className="sr-only">Vale</span>
      <span aria-hidden="true">V Λ L E</span>
    </span>
  );
}
