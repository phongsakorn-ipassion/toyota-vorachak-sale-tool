import { GRADE_FEATURE_CLASSES } from '../../lib/constants'

const fmt = (n) => n.toLocaleString('th-TH')

export default function SubModelSelector({ subModels, selectedGrade, onSelectGrade }) {
  if (!subModels || subModels.length === 0) return null

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
      <div className="flex gap-3 snap-x snap-mandatory" style={{ minWidth: 'min-content' }}>
        {subModels.map((grade) => {
          const isSelected = selectedGrade === grade.id
          const fc = GRADE_FEATURE_CLASSES[grade.featureClass] || GRADE_FEATURE_CLASSES.standard
          const specSummary = [
            grade.specDiffs?.wheels,
            grade.specDiffs?.seats,
            grade.specDiffs?.display,
          ]
            .filter(Boolean)
            .join(' · ')

          return (
            <button
              key={grade.id}
              onClick={() => onSelectGrade(grade.id)}
              className={`
                snap-start flex-shrink-0 w-[200px] rounded-xl border-2 p-4 text-left transition-all relative
                ${isSelected
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* Check icon */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Grade name */}
              <p className="font-bold text-gray-900 text-sm pr-6">{grade.name}</p>

              {/* Price */}
              <p className="text-green-600 font-bold text-lg mt-1">
                ฿{fmt(grade.price)}
              </p>

              {/* Feature badge */}
              <span
                className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: fc.bg, color: fc.color }}
              >
                {grade.keyFeature}
              </span>

              {/* Spec summary */}
              {specSummary && (
                <p className="text-[11px] text-gray-500 mt-2 leading-tight line-clamp-2">
                  {specSummary}
                </p>
              )}

              {/* Stock info */}
              {grade.stock && (
                <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {grade.stock}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
