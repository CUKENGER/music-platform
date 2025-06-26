export const PlusBtnIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="35"
      height="35"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="20"
        cy="20"
        r="20"
        fill="currentColor"
      />
      <path
        d="M19.9996 10.1005V29.8995ZM10.1001 20H29.8991Z"
        fill="currentColor"
      />
      <path
        d="M19.9996 10.1005V29.8995M10.1001 20H29.8991"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
