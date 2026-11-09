import React from 'react';
import { ArrowDown, BriefcaseBusiness, Calendar as CalendarIcon, Clock3, FileText, MessageSquareText, Snowflake } from 'lucide-react';
import { WinterCampIllustration, WinterSnowfall } from './WinterCampDecor';

const weeklySchedule = [
  {
    week: '1주차',
    date: '11월 22일 일요일',
    title: '취업 및 자소서 리포지셔닝',
    topics: ['자기설득서의 이해와 적용'],
    message: ['당신이 알고 있던 취업 공식은 잘못되었습니다.', '내가 상대 기업에 왜 필요한가를 설득하는 설계법']
  },
  {
    week: '2주차',
    date: '11월 29일 일요일',
    title: '면접 리포지셔닝',
    topics: ['완벽통제면접의 이해와 적용 특강'],
    message: ['면접, 통제할 것인가 통제당할 것인가.', '철저하게 내가 주도권을 갖는 면접 방법론']
  },
  {
    week: '3주차',
    date: '12월 6일 일요일',
    title: '이직 리포지셔닝',
    topics: ['취업 STP 전략 특강', 'REAL NEEDS 이력서 특강', '완벽설득포트폴리오 특강'],
    message: ['이력서와 포트폴리오는 모두 설득의 도구입니다.', '가장 날카롭게 설득하는 무기를 만들어드립니다.']
  }
];

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

type CalendarEvent = {
  label: string;
  tone: 'recruit' | 'deadline' | 'class';
};

const calendarEvents: Record<string, CalendarEvent> = {
  '2026-11-13': { label: '모집 시작', tone: 'recruit' },
  '2026-11-20': { label: '오후 9시 마감', tone: 'deadline' },
  '2026-11-22': { label: '1주차 강의', tone: 'class' },
  '2026-11-29': { label: '2주차 강의', tone: 'class' },
  '2026-12-06': { label: '3주차 강의', tone: 'class' }
};

const taskPeriods = [
  { start: '2026-11-23', end: '2026-11-28', label: '1주차 과제 수행 기간' },
  { start: '2026-11-30', end: '2026-12-05', label: '2주차 과제 수행 기간' },
  { start: '2026-12-07', end: '2026-12-12', label: '3주차 과제 수행 기간' }
];

const getTaskPeriod = (dateKey: string) => {
  const period = taskPeriods.find(({ start, end }) => dateKey >= start && dateKey <= end);
  if (!period) return null;

  return {
    ...period,
    position: dateKey === period.start ? 'start' : dateKey === period.end ? 'end' : 'middle',
    showLabel: dateKey === period.start || dateKey === '2026-12-01'
  };
};

const calendarMonths = [
  { year: 2026, month: 11, days: 30, firstDay: 0 },
  { year: 2026, month: 12, days: 31, firstDay: 2 }
];

const eventToneClass: Record<CalendarEvent['tone'], string> = {
  recruit: 'border-sky-300 bg-sky-100 text-sky-900',
  deadline: 'border-slate-800 bg-slate-900 text-white',
  class: 'border-sky-500 bg-sky-500 text-white shadow-sm shadow-sky-200'
};

const weekIcons = [FileText, MessageSquareText, BriefcaseBusiness];

export const BootcampScheduleCalendar: React.FC = () => {
  return (
    <section id="bootcamp-schedule" className="winter-camp-theme scroll-mt-10 border-b border-sky-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#EFF9FE_100%)] p-6 text-zinc-900 sm:p-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-sky-800 shadow-sm">
            <Snowflake className="h-3.5 w-3.5" />
            <span>2026 REPOSITIONING WINTER CAMP</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            겨울 3주 <span className="text-sky-700">집중 일정</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-zinc-600 sm:text-sm">
            <strong className="text-zinc-950">11월 13일(금) 모집 시작 · 11월 20일(금) 오후 9시 마감</strong><br />
            모든 라이브 강의와 주차별 핵심 일정은 <strong className="text-sky-700">일요일</strong>에 진행됩니다.
          </p>
          <p className="mx-auto max-w-2xl text-sm font-bold leading-relaxed text-slate-800 sm:text-base">
            리포지셔닝 윈터캠프와 함께하는 3주,<br />
            이 세상 어디에도 없는 최적의 취업 전략으로<br />
            <strong className="text-sky-700">온전히 결과만 거둬가세요.</strong>
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2" aria-label="2026 리포지셔닝 윈터캠프 일정 달력">
          {calendarMonths.map(({ year, month, days, firstDay }) => {
            const cells = Array.from({ length: firstDay + days }, (_, index) =>
              index < firstDay ? null : index - firstDay + 1
            );
            while (cells.length % 7 !== 0) cells.push(null);

            return (
              <article key={`${year}-${month}`} className="overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-[0_16px_45px_rgba(14,116,144,0.10)]">
                <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-sky-700">WINTER CAMP</p>
                    <h3 className="mt-0.5 text-lg font-black text-slate-950">{year}년 {month}월</h3>
                  </div>
                  <Snowflake className="h-5 w-5 text-sky-500" />
                </div>

                <div className="grid grid-cols-7 bg-[#102331] text-center text-[10px] font-black text-white sm:text-xs">
                  {weekdays.map((weekday, index) => (
                    <div key={weekday} className={`py-2.5 ${index === 0 ? 'text-rose-300' : ''}`}>
                      {weekday}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 bg-sky-100/70 p-px">
                  {cells.map((day, index) => {
                    const key = day ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                    const event = key ? calendarEvents[key] : undefined;
                    const trailingTaskKey = !day && month === 11 && index >= 30 && index <= 34
                      ? `2026-12-${String(index - 29).padStart(2, '0')}`
                      : '';
                    const task = getTaskPeriod(key || trailingTaskKey);
                    const isTaskVisualStart = task?.position === 'start' || (month === 12 && key === '2026-12-01');
                    const showTaskLabel = Boolean(task?.showLabel && !trailingTaskKey);
                    const isSunday = index % 7 === 0;

                    return (
                      <div
                        key={`${month}-${index}`}
                        className={`relative min-h-[72px] min-w-0 bg-white p-1.5 sm:min-h-[86px] sm:p-2 ${showTaskLabel ? 'z-20' : task ? 'z-10' : ''}`}
                      >
                        {day ? (
                          <>
                            <span className={`block text-[11px] font-bold sm:text-xs ${isSunday ? 'text-rose-600' : 'text-slate-600'}`}>
                              {day}
                            </span>
                            {event ? (
                              <span className={`mt-1 block break-keep rounded-md border px-1 py-1 text-center text-[8px] font-black leading-tight sm:text-[10px] ${eventToneClass[event.tone]}`}>
                                {event.label}
                              </span>
                            ) : null}
                          </>
                        ) : task ? (
                          <span
                            aria-hidden="true"
                            className="block text-[11px] font-bold opacity-0 sm:text-xs"
                          >
                            0
                          </span>
                        ) : null}
                        {task ? (
                          <div
                            className={`relative mt-1 h-6 -mx-1.5 bg-sky-200 sm:-mx-2 ${
                              isTaskVisualStart ? 'rounded-l-lg' : ''
                            } ${task.position === 'end' ? 'rounded-r-lg' : ''}`}
                            aria-label={task.label}
                          >
                            {showTaskLabel ? (
                              <span className="absolute left-2 top-1/2 z-30 -translate-y-1/2 whitespace-nowrap text-[8px] font-black text-sky-900 sm:text-[10px]">
                                {task.label}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-[#102331] bg-[#0F1720] shadow-2xl">
          <div className="relative flex flex-col gap-3 overflow-hidden border-b border-sky-100/10 bg-gradient-to-r from-[#0F1720] to-[#123047] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <WinterSnowfall className="opacity-70" />
            <WinterCampIllustration className="pointer-events-none absolute -bottom-10 right-24 hidden w-44 opacity-50 md:block" />
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400 text-sky-950 shadow-lg shadow-sky-950/10">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-black text-white">리포지셔닝 윈터캠프</p>
                <p className="text-xs font-bold text-slate-400">11월 22일 시작 · 매주 일요일 · 총 3주</p>
              </div>
            </div>
            <span className="relative z-10 inline-flex items-center gap-1.5 self-start rounded-full border border-sky-300/40 bg-sky-200/10 px-3 py-1.5 text-xs font-black text-sky-200 sm:self-auto">
              <Clock3 className="h-3.5 w-3.5" /> 일요일 집중반
            </span>
          </div>

          <div className="relative grid gap-5 p-4 sm:p-6">
            <div className="pointer-events-none absolute bottom-12 left-[2.1rem] top-12 w-px bg-sky-300/20 sm:left-[4.6rem]" />
            {weeklySchedule.map((item, index) => {
              const WeekIcon = weekIcons[index];

              return (
                <React.Fragment key={item.week}>
                  <article className="relative overflow-hidden rounded-3xl border border-sky-300/20 bg-[#131E29] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                    <span className="pointer-events-none absolute -right-1 -top-7 select-none text-[7rem] font-black leading-none text-white/[0.035] sm:text-[9rem]">
                      0{index + 1}
                    </span>

                    <div className="grid sm:grid-cols-[150px_1fr]">
                      <div className="relative z-10 flex items-center gap-3 border-b border-sky-300/15 bg-sky-300/[0.07] p-5 sm:flex-col sm:items-start sm:justify-between sm:border-b-0 sm:border-r sm:p-6">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400 text-sky-950 shadow-lg shadow-sky-950/20">
                          <WeekIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black tracking-[0.16em] text-sky-300">WEEK 0{index + 1}</span>
                          <p className="mt-1 text-base font-black text-white">{item.week}</p>
                          <p className="mt-1 text-xs font-bold text-slate-400">{item.date}</p>
                        </div>
                      </div>

                      <div className="relative z-10 p-5 sm:p-7">
                        <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                          {item.title}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.topics.map((topic) => (
                            <span key={topic} className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1.5 text-[11px] font-black text-sky-200 sm:text-xs">
                              {topic}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 border-l-2 border-sky-400 pl-4">
                          {item.message.map((line, messageIndex) => (
                            <p key={line} className={`${messageIndex === 0 ? 'text-sm text-white sm:text-base' : 'mt-1 text-xs text-slate-300 sm:text-sm'} font-black leading-relaxed`}>
                              {line}
                            </p>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-3">
                          <p className="text-[11px] font-black text-sky-100 sm:text-xs">
                            강의 후 1:1 밀착 리포지셔닝 컨설팅
                          </p>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-300 text-sky-950">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>

                  {index < weeklySchedule.length - 1 ? (
                    <div className="relative z-20 -my-2 flex justify-center" aria-hidden="true">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-sky-300/30 bg-[#0F1720] text-sky-300">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['11/23~11/28', '1주차 과제·피드백'],
            ['11/30~12/5', '2주차 과제·피드백'],
            ['12/7~12/12', '3주차 과제·피드백'],
            ['캠프 기간 전체', '상시 카카오톡 밀착 피드백']
          ].map(([date, label]) => (
            <div key={label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
              <p className="text-xs font-black text-sky-700">{date}</p>
              <p className="mt-1 text-xs font-bold text-zinc-700">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
