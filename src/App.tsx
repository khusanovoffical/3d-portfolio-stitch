/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ExpertiseSection from './components/ExpertiseSection';
import ProjectsSection from './components/ProjectsSection';
import PipelineSection from './components/PipelineSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import {
  CarConfigModal,
  CyberModal,
  FintechModal,
  TechDocsModal,
  ConsultationModal,
} from './components/Modals';

export default function App() {
  const [lang, setLang] = useState<'uz' | 'en'>('uz');
  const [carConfigOpen, setCarConfigOpen] = useState(false);
  const [cyberModalOpen, setCyberModalOpen] = useState(false);
  const [fintechModalOpen, setFintechModalOpen] = useState(false);
  const [techDocsProject, setTechDocsProject] = useState<string | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const toggleLang = () => {
    setLang((prev) => (prev === 'uz' ? 'en' : 'uz'));
  };

  return (
    <div className="bg-[#111319] font-['Geist'] text-[#e2e2ea] antialiased selection:bg-[#38bdf8] selection:text-[#00354a] min-h-screen relative overflow-x-hidden">
      {/* Background Ambient Radial Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.12),rgba(17,19,25,0))]" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_80%_80%,rgba(111,0,190,0.08),transparent_50%)]" />

      {/* Navigation Header */}
      <Navbar
        currentLang={lang}
        onToggleLang={toggleLang}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="w-full relative z-10">
        {/* Hero Section with interactive 3D WebGL Canvas */}
        <HeroSection
          currentLang={lang}
          onOpenConsultation={() => setConsultationOpen(true)}
        />

        {/* Expertise & Philosophy (Bento grid) */}
        <ExpertiseSection currentLang={lang} />

        {/* Selected 3D & Web Projects */}
        <ProjectsSection
          currentLang={lang}
          onOpenCarConfig={() => setCarConfigOpen(true)}
          onOpenCyberDemo={() => setCyberModalOpen(true)}
          onOpenFintechDemo={() => setFintechModalOpen(true)}
          onOpenTechDocs={(projectName) => setTechDocsProject(projectName)}
        />

        {/* Live Interactive Tech Stack Radar & SVG Pipeline Flow */}
        <PipelineSection currentLang={lang} />

        {/* Testimonials & Recognition */}
        <TestimonialsSection currentLang={lang} />

        {/* Call to Action Banner */}
        <ContactSection
          currentLang={lang}
          onOpenConsultation={() => setConsultationOpen(true)}
        />
      </main>

      {/* Cybernetic Footer */}
      <Footer currentLang={lang} />

      {/* Interactive Modals */}
      <CarConfigModal
        isOpen={carConfigOpen}
        onClose={() => setCarConfigOpen(false)}
        currentLang={lang}
      />

      <CyberModal
        isOpen={cyberModalOpen}
        onClose={() => setCyberModalOpen(false)}
        currentLang={lang}
      />

      <FintechModal
        isOpen={fintechModalOpen}
        onClose={() => setFintechModalOpen(false)}
        currentLang={lang}
      />

      <TechDocsModal
        isOpen={!!techDocsProject}
        projectName={techDocsProject}
        onClose={() => setTechDocsProject(null)}
        currentLang={lang}
      />

      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        currentLang={lang}
      />
    </div>
  );
}
