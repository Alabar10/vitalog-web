import React from 'react'
import { InsightBaseProps } from "./insight.types";
const InsightCard = ({ title, icon, children }: InsightBaseProps) => {
  return (
    <article className='rounded-2xl bg-white/10 backdrop-blur-md
        border border-white/20 shadow-lg
        p-5 text-white'>
        <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10'>{icon}</div>
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <div className="text-sm leading-relaxed text-white/90">{children}</div>
    </article>
  )
}

export default InsightCard