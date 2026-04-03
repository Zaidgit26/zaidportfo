"use client";

import { Suspense, lazy } from "react";

const SplineComponent = lazy(() =>
  import("@splinetool/react-spline").then((mod) => ({
    default: mod.default,
  }))
);

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={<div className="spline-placeholder" />}>
      <SplineComponent scene={scene} className={className} />
    </Suspense>
  );
}
