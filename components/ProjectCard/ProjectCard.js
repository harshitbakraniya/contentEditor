import Link from "next/link";
import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <Link href={`/edit/${project._id}`} key={project._id} legacyBehavior>
      <a className="block p-4 border border-gray-200 hover:bg-gray-50">
        <h3 className="font-medium">{project.title || "Untitled Project"}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{project.url}</p>
        <p className="text-xs text-gray-400 mt-2">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </a>
    </Link>
  );
};

export default ProjectCard;
