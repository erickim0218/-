import React from 'react';
import {
  HeroSection,
  FeaturedCoursesSection,
  ProblemSection,
  RepositioningDefinition,
  MethodologySection,
  ComparisonSection,
  CaseStudiesSection,
  PlannerJProfileSection,
  ReviewsSection,
  FinalConversionSection
} from '../HomeSections';
import { BootcampDetailFlow } from '../BootcampDetailFlow';
import { BootcampReview } from '../../data/bootcampReviews';
import { WinterCampIllustration, WinterSnowfall } from '../WinterCampDecor';

interface HomeViewProps {
  onTabChange: (tab: string, subTab?: 'resources' | 'persuasion' | 'interview') => void;
  onSelectCourse: (courseId: string) => void;
  reviews?: BootcampReview[];
  onAddReview?: (review: BootcampReview) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onTabChange,
  onSelectCourse,
  reviews,
  onAddReview
}) => {
  return (
    <div className="space-y-0 animate-fade-in bg-[#09090B]">
      <HeroSection
        onTabChange={onTabChange}
        onSelectCourse={onSelectCourse}
      />
      <FeaturedCoursesSection
        onTabChange={onTabChange}
      />
      <ProblemSection onTabChange={onTabChange} />
      <RepositioningDefinition />
      <MethodologySection />
      <ComparisonSection />
      <CaseStudiesSection />
      <PlannerJProfileSection />
      <ReviewsSection />

      {/* Main Bottom Section: Full Long-form Bootcamp Storytelling Flow */}
      <div className="py-12 bg-[#09090B] border-t border-[#1F1F24]">
        <div className="winter-camp-theme relative max-w-4xl mx-auto mb-8 overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-r from-white via-sky-50 to-sky-100 px-5 py-8 text-center shadow-[0_24px_70px_rgba(14,116,144,0.16)] sm:px-8 sm:py-10">
          <WinterSnowfall />
          <WinterCampIllustration className="pointer-events-none absolute -bottom-7 -right-4 hidden w-44 opacity-75 sm:block" />
          <div className="relative z-10 space-y-2 sm:pr-28">
          <span className="px-3 py-1 bg-sky-100 border border-sky-200 text-sky-800 text-xs font-black rounded-full uppercase">
            REPOSITIONING WINTER CAMP
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            기획자 J의 리포지셔닝 윈터캠프
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            매주 일요일 진행되는 겨울 3주 집중반의 커리큘럼, 가격 및 환불 보장 정보를 확인하세요.
          </p>
          </div>
        </div>

        <BootcampDetailFlow
          onTabChange={onTabChange}
          reviews={reviews}
          onAddReview={onAddReview}
        />
      </div>

      <FinalConversionSection onTabChange={onTabChange} />
    </div>
  );
};
