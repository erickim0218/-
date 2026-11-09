import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock3, Snowflake } from 'lucide-react';
import { WinterCampIllustration, WinterSnowfall } from './WinterCampDecor';

const weeklySchedule = [
  {
    week: '1주차',
    date: '11월 22일 일요일',
    title: '방향 설정과 REAL NEEDS 분석',
    detail: '지원 방향을 확정하고 기업이 실제로 원하는 기준을 찾습니다.'
  },
  {
    week: '2주차',
    date: '11월 29일 일요일',
    title: '경험 리포지셔닝과 서류 완성',
    detail: '경험을 기업의 언어로 바꾸고 이력서·자기설득서에 적용합니다.'
  },
  {
    week: '3주차',
    date: '12월 6일 일요일',
    title: '면접 전략과 최종 점검',
    detail: '서류와 면접의 메시지를 하나로 연결하고 실전 대응 전략을 완성합니다.'
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
  '2026-12-06': { label: '3주차 강의 · 종료', tone: 'class' }
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
                    const isSunday = index % 7 === 0;

                    return (
                      <div
                        key={`${month}-${index}`}
                        className="min-h-[62px] min-w-0 bg-white p-1.5 sm:min-h-[76px] sm:p-2"
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

          <div className="grid gap-3 p-4 sm:p-6">
            {weeklySchedule.map((item, index) => (
              <article key={item.week} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[110px_1fr] sm:items-center">
                <div>
                  <span className="text-xs font-black text-sky-300">{item.week}</span>
                  <p className="mt-1 text-sm font-black text-white">{item.date}</p>
                </div>
                <div className="border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <h3 className="flex items-center gap-2 text-sm font-black text-white sm:text-base">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-400" />
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">{item.detail}</p>
                  {index < weeklySchedule.length - 1 ? (
                    <p className="mt-3 text-[11px] font-bold text-slate-500">
                      다음 일요일 전까지 과제 수행 · 1:1 피드백 진행
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['11/23~11/28', '1주차 과제·피드백'],
            ['11/30~12/5', '2주차 과제·피드백'],
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
