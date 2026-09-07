import React from 'react';
import { MemberTier } from '../../types';
import { BootcampDetailFlow } from '../BootcampDetailFlow';
import { BootcampReview } from '../../data/bootcampReviews';

interface BootcampViewProps {
  currentTier: MemberTier;
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
  onApplicationSubmitted?: () => void;
  onChangeTier?: (tier: MemberTier) => void;
  reviews?: BootcampReview[];
  onAddReview?: (review: BootcampReview) => void;
}

export const BootcampView: React.FC<BootcampViewProps> = ({
  onTabChange,
  onApplicationSubmitted,
  reviews,
  onAddReview
}) => {
  return (
    <div className="bg-[#09090B] min-h-screen pt-0 pb-6 animate-fade-in">
      <BootcampDetailFlow
        onTabChange={onTabChange}
        onApplicationSubmitted={onApplicationSubmitted}
        reviews={reviews}
        onAddReview={onAddReview}
      />
    </div>
  );
};
