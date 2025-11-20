"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectDetail } from "../components/pjDetail";
import projectData from "../lib/data/project.json";
import { useEffect, useState } from "react";

export default function PjDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (projectId) {
      const foundProject = projectData.find((p) => p.id === projectId);
      setProject(foundProject);
    }
  }, [projectId]);

  const closeModal = () => {
    router.back();
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  return <ProjectDetail project={project} closeModal={closeModal} />;
}
