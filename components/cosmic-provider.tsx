"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type CosmicContextType = {
    warpSpeed: boolean
    triggerWarp: () => void
}

const CosmicContext = createContext<CosmicContextType>({
    warpSpeed: false,
    triggerWarp: () => { }
})

export const useCosmic = () => useContext(CosmicContext)

export const CosmicProvider = ({ children }: { children: ReactNode }) => {
    const [warpSpeed, setWarpSpeed] = useState(false)

    const triggerWarp = () => {
        setWarpSpeed(true)
        setTimeout(() => {
            setWarpSpeed(false)
        }, 1500) // Warp duration
    }

    return (
        <CosmicContext.Provider value={{ warpSpeed, triggerWarp }}>
            {children}
        </CosmicContext.Provider>
    )
}
