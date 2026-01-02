"use client";

interface VortexIconProps {
  className?: string;
  size?: number;
}

export function VortexIcon({ className = "", size = 24 }: VortexIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Modern vortex/spiral icon - clean and minimal like Apple design */}
      <path
        d="M12 2C13.5 2 15 2.5 16 3.5C17 4.5 17.5 6 17.5 7.5C17.5 9 17 10.5 16 11.5C15 12.5 13.5 13 12 13C10.5 13 9 12.5 8 11.5C7 10.5 6.5 9 6.5 7.5C6.5 6 7 4.5 8 3.5C9 2.5 10.5 2 12 2Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M12 5C12.8 5 13.5 5.3 14 5.8C14.5 6.3 14.8 7 14.8 7.8C14.8 8.6 14.5 9.3 14 9.8C13.5 10.3 12.8 10.6 12 10.6C11.2 10.6 10.5 10.3 10 9.8C9.5 9.3 9.2 8.6 9.2 7.8C9.2 7 9.5 6.3 10 5.8C10.5 5.3 11.2 5 12 5Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M12 14C13.5 14 15 14.5 16 15.5C17 16.5 17.5 18 17.5 19.5C17.5 21 17 22.5 16 22.5C15 22.5 13.5 22 12 22C10.5 22 9 22.5 8 22.5C7 22.5 6.5 21 6.5 19.5C6.5 18 7 16.5 8 15.5C9 14.5 10.5 14 12 14Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
    </svg>
  );
}

