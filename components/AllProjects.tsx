"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BatteryFull,
  ExternalLink,
  Signal,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { ProjectScreen, projects } from "@/components/Projects";

export default function AllProjects() {
  return (
    <main className="all-projects" id="home">
      <div className="all-projects__inner">
        <header className="all-projects__top">
          <Link className="all-projects__brand" href="/#home" dir="ltr">
            FAME<span>X</span>
          </Link>
          <Link className="all-projects__back" href="/#projects">
            <ArrowLeft size={16} aria-hidden="true" />
            رجوع للموقع
          </Link>
        </header>

        <section className="all-projects__intro" aria-labelledby="all-projects-title">
          <p className="all-projects__eyebrow">FAMEX // PORTFOLIO</p>
          <h1 id="all-projects-title">
            مشاريعنا <span>على حقيقتها.</span>
          </h1>
          <p>
            كل مشروع له فكرته وتجربته. اختار مشروعًا لمعاينة تصميمه، أو افتح
            الموقع مباشرةً لو أضفت رابطه.
          </p>
          <div className="all-projects__status">
            <span aria-hidden="true" />
            <span>{String(projects.length).padStart(2, "0")} مشاريع في المعرض</span>
          </div>
        </section>

        <section className="all-projects__grid" aria-label="معرض المشاريع">
          {projects.map((project, index) => {
            const ProjectIcon = project.Icon;

            return (
              <article
                className="all-projects__card"
                key={project.id}
                style={{ "--project-index": index } as CSSProperties}
              >
                <div className="all-projects__preview">
                  <div
                    className="projects__phone all-projects__phone"
                    data-project={project.id}
                    aria-label={`معاينة ${project.title}`}
                  >
                    <div className="projects__phone-bezel">
                      <div className="projects__phone-camera" />
                      <div className="projects__phone-screen">
                        <div className="projects__status-bar">
                          <span>9:41</span>
                          <span className="projects__status-icons" aria-label="إشارة وواي فاي وبطارية ممتلئة">
                            <Signal size={11} strokeWidth={2.4} />
                            <Wifi size={12} strokeWidth={2.4} />
                            <BatteryFull size={14} strokeWidth={2.2} />
                          </span>
                        </div>
                        <ProjectScreen project={project} />
                        <div className="projects__phone-nav" />
                      </div>
                    </div>
                  </div>
                  <span className="all-projects__index" dir="ltr">
                    PROJECT / {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="all-projects__details">
                  <div className="all-projects__category">
                    <ProjectIcon size={15} strokeWidth={1.7} aria-hidden="true" />
                    {project.label}
                  </div>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  {project.url ? (
                    <a
                      className="all-projects__visit"
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      زيارة المشروع <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="all-projects__concept">
                      <span aria-hidden="true" />
                      نموذج تصميم
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
