export interface Project {
  id: string;
  frame: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  role: string;
  year: string;
  accent?: string;
  link?: string;
}

export const projects: Project[] = [
  {
    id: "gpu-vision",
    frame: "01",
    title: "GPU-Accelerated Vision System",
    tagline:
      "Live camera processing running entirely on GPU — zero CPU bottleneck.",
    description:
      "Built a real-time video inference pipeline that streams live camera feeds and runs ML inference exclusively on GPU memory. Eliminated CPU transfer overhead by keeping the entire data path on-device, achieving sustained high-throughput performance on production hardware.",
    stack: ["Python", "CUDA", "OpenCV", "PyTorch", "GStreamer"],
    role: "Sole Engineer",
    year: "2024",
  },
  {
    id: "yolo-detection",
    frame: "02",
    title: "Material & Damage Detection Model",
    tagline:
      "Custom-trained detection model identifying defects with production accuracy.",
    description:
      "Designed and trained a YOLO-based object detection model for dual-task inference: material classification and damage/tear detection within a single forward pass. Handled data labeling, augmentation strategy, training pipeline, and deployment to production inference server.",
    stack: ["Python", "YOLOv8", "Roboflow", "Flask", "NumPy"],
    role: "Sole Engineer",
    year: "2024",
  },
  {
    id: "fullstack-platform",
    frame: "03",
    title: "Full-Stack Product Platform",
    tagline:
      "End-to-end application architecture — from API design to production UI.",
    description:
      "Architected and delivered the company's primary product interface solo — REST API design with Flask, React/Next.js frontend with Material UI, and deployment pipeline. Sole contributor across backend, frontend, and infrastructure decisions.",
    stack: ["Next.js", "React", "Flask", "Python", "PostgreSQL", "MUI"],
    role: "Sole Engineer",
    year: "2024–2025",
  },
  {
    id: "ml-pipeline",
    frame: "04",
    title: "Python ML Architecture",
    tagline:
      "Modular inference pipeline built for extensibility and production reliability.",
    description:
      "Designed a modular Python architecture separating data ingestion, preprocessing, model inference, and output routing into discrete, testable components. Enables swapping model backends without altering application logic.",
    stack: ["Python", "FastAPI", "Docker", "PyTorch", "Redis"],
    role: "Sole Engineer",
    year: "2024",
  },
];
