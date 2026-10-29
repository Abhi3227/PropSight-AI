interface SectionHeadingProps {
  pill?: string
  heading: string
  highlight?: string
  subtext?: string
  center?: boolean
}

export default function SectionHeading({
  pill,
  heading,
  highlight,
  subtext,
  center = true,
}: SectionHeadingProps) {
  // Replace highlight text within heading with styled span
  const renderHeading = () => {
    if (!highlight) return heading
    const parts = heading.split(highlight)
    return (
      <>
        {parts[0]}
        <span className="text-[#3478F6]">{highlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <div className={`${center ? 'text-center' : ''} mb-12`}>
      {pill && (
        <div
          className={`inline-flex items-center gap-2 bg-[#F4F7FF] border border-[#E5EBF7] text-[#3478F6] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5`}
        >
          {pill}
        </div>
      )}
      <h2 className="text-3xl sm:text-[40px] font-bold text-[#142039] leading-tight mb-4">
        {renderHeading()}
      </h2>
      {subtext && (
        <p className="text-[#5D79C7] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  )
}
