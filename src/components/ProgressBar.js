import React, { useEffect, useState } from 'react'

const ProgressBar = ({ percentage, style, className }) => {

    const [colorProgress, setColorProgress] = useState("stroke-red-700")

    useEffect(() => {
        const setColor = () => {
            if (percentage) {
                if (percentage <= 25) {
                    setColorProgress("stroke-red-700")
                }
                if (percentage > 25 && percentage < 50) {
                    setColorProgress("stroke-rose-500")
                }
                if (percentage >= 50 && percentage < 75) {
                    setColorProgress("stroke-orange-600")
                }
                if (percentage >= 75 && percentage < 99) {
                    setColorProgress("stroke-lime-500")
                }
                if (percentage === 100) {
                    setColorProgress("stroke-green-600")
                }
            }
        }

        setColor()
    }, [percentage])


    return (
        <div className={`${className} w-fit h-fit transition-all my-auto`}>
            <div className="single-chart w-24 mx-auto">
                <svg viewBox="0 0 36 36" className="circular-chart orange">
                    <path className="circle-bg stroke-slate-300"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={`circle ${colorProgress} transition-all`}
                        strokeDasharray={`${Math.round(percentage)}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className={`percentage font-bold ${style} `}>{Math.round(percentage)}%</text>
                </svg>
            </div>
        </div>
    )
}


export default ProgressBar