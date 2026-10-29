export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* House outline */}
      <path
        d="M4 14L16 4L28 14V28H20V20H12V28H4V14Z"
        stroke="#142039"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Magnifying glass circle */}
      <circle cx="20" cy="19" r="4.5" fill="#F4F7FF" stroke="#3478F6" strokeWidth="1.8" />
      {/* Magnifying glass handle */}
      <line x1="23.5" y1="22.5" x2="26" y2="25" stroke="#3478F6" strokeWidth="1.8" strokeLinecap="round" />
      {/* Blue roof accent */}
      <path
        d="M10 26V19H14V26"
        stroke="#3478F6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
