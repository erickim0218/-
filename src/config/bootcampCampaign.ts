export const BOOTCAMP_PUBLIC_NAME = '리포지셔닝 윈터캠프';
export const BOOTCAMP_COHORT_KEY = '윈터캠프';
export const BOOTCAMP_ANALYTICS_COHORT = 10;
export const BOOTCAMP_CAPACITY = 5;

export const BOOTCAMP_RECRUITMENT_START = new Date('2026-11-13T00:00:00+09:00').getTime();
export const BOOTCAMP_DEADLINE = new Date('2026-11-20T21:00:00+09:00').getTime();

export const BOOTCAMP_RECRUITMENT_LABEL = '11월 13일(금) 모집 시작';
export const BOOTCAMP_DEADLINE_LABEL = '11월 20일(금) 오후 9시 마감';
export const BOOTCAMP_START_LABEL = '11월 22일(일) 시작';

export const isBootcampRecruitmentStarted = (now = Date.now()) =>
  now >= BOOTCAMP_RECRUITMENT_START;

export const isBootcampRecruitmentExpired = (now = Date.now()) =>
  now >= BOOTCAMP_DEADLINE;

export const isBootcampRecruitmentPeriod = (now = Date.now()) =>
  now >= BOOTCAMP_RECRUITMENT_START && now < BOOTCAMP_DEADLINE;
