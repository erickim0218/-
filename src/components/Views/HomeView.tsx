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
        <div className="max-w-4xl mx-auto px-4 text-center mb-8 space-y-2">
          <span className="px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-black rounded-full uppercase">
            FLAGSHIP BOOTCAMP
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            AI를 이기는 리포지셔닝 부트캠프
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            AI가 대신 만들 수 없는 당신만의 선택 이유를 3주 동안 함께 설계합니다.
          </p>
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
