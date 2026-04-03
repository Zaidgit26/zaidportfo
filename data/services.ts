export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: string[];
}

export const services: Service[] = [
  {
    id: "web",
    number: "01",
    title: "Web Applications",
    description:
      "Full-stack web products built for performance and scale. From landing pages to complex dashboards.",
    capabilities: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
    ],
  },
  {
    id: "ml",
    number: "02",
    title: "ML & AI Integration",
    description:
      "Machine learning models trained, deployed, and connected to your product. Computer vision, inference pipelines, AI-powered features.",
    capabilities: [
      "Python",
      "PyTorch",
      "YOLOv8",
      "OpenCV",
      "FastAPI",
      "Model deployment",
    ],
  },
  {
    id: "backend",
    number: "03",
    title: "Backend & APIs",
    description:
      "Clean, documented APIs that power your frontend and third-party integrations. Designed to scale.",
    capabilities: [
      "Python",
      "Flask",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
  },
  {
    id: "mobile",
    number: "04",
    title: "Mobile Apps",
    description:
      "Cross-platform mobile apps that feel native. iOS and Android from a single codebase.",
    capabilities: ["React Native", "Expo", "TypeScript", "REST integration"],
  },
  {
    id: "frontend",
    number: "05",
    title: "UI / UX & Frontend",
    description:
      "Interfaces that are sharp, fast, and built to convert. Figma to production without loss of fidelity.",
    capabilities: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Figma",
      "MUI",
    ],
  },
];
