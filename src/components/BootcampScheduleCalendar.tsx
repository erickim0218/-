import React from 'react';
import { ArrowRight, BookOpen, ClipboardCheck, MessageCircle, Users } from 'lucide-react';

const FLOW = [
  { label: '강의', icon: BookOpen },
  { label: '과제 적용', icon: ClipboardCheck },
  { label: '1:1 컨설팅', icon: Users },
  { label: '피드백', icon: MessageCircle }
] as const;

export const BootcampScheduleCalendar: React.FC = () => {
  return (
    <section id="bootcamp-schedule" className="scroll-mt-28 border-b border-zinc-200 bg-white px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center [word-break:keep-all]">
          <p className="text-sm font-black text-amber-700">프로그램 운영 구조</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
            강의로 배우고, 과제로 적용하고,<br />1:1로 완성합니다.
          </h2>
        </div>

        <ol className="mt-10 grid gap-3 sm:grid-cols-4">
          {FLOW.map(({ label, icon: Icon }, index) => (
            <li key={label} className="relative flex min-h-28 items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:flex-col sm:justify-center sm:text-center">
              <Icon className="h-6 w-6 text-amber-700" aria-hidden="true" />
              <div>
                <p className="text-xs font-black text-zinc-400">0{index + 1}</p>
                <p className="mt-1 font-black">{label}</p>
              </div>
              {index < FLOW.length - 1 && <ArrowRight className="absolute -bottom-5 left-1/2 h-4 w-4 -translate-x-1/2 rotate-90 text-zinc-400 sm:-right-5 sm:bottom-auto sm:left-auto sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:rotate-0" aria-hidden="true" />}
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 max-w-3xl border-t border-zinc-200 pt-7 text-left text-base leading-8 text-zinc-600 sm:text-center">
          <p>매주 배운 전략을 자신의 경험과 실제 지원 기업에 적용합니다.</p>
          <p className="mt-2">정해진 답을 받는 과정이 아니라, 스스로 지원 전략을 설계할 수 있도록 만드는 과정입니다.</p>
        </div>
      </div>
    </section>
  );
};
