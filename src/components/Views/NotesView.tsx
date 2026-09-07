import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, Sparkles, Tag, Search } from 'lucide-react';
import { POSITIONING_NOTES } from '../../data/mockData';
import { PositioningNote } from '../../types';

interface NotesViewProps {
  onOpenDiagnosis: () => void;
  onTabChange: (tab: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onOpenDiagnosis, onTabChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [activeNote, setActiveNote] = useState<PositioningNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    '전체',
    '공고 포지셔닝',
    '자소서 리포지셔닝',
    '면접 세일즈',
    '직무 전환',
    '합격 사례',
    '취준 팩트체크',
    '기획자 J의 관점'
  ];

  const filteredNotes = POSITIONING_NOTES.filter((note) => {
    const matchesCat = selectedCategory === '전체' || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 bg-[#171717] text-white min-h-screen space-y-10 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-bold rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            POSITIONING MEDIA
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">포지셔닝 노트</h1>
          <p className="text-sm text-zinc-400">
            쓰레드와 인스타그램에 연재되는 기획자 J의 취업 관점, 공고 번역 프레임, 실전 리포지셔닝 사례 아카이브
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-[#262626] pb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#FFD600] text-[#171717]'
                    : 'bg-[#222223] text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="노트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#222223] border border-[#333335] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FFD600]"
            />
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className="p-6 bg-[#222223] border border-[#333335] hover:border-[#FFD600] rounded-2xl transition cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#FFD600] bg-[#FFD600]/10 px-2.5 py-0.5 rounded">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {note.readTime}</span>
                    <span>{note.date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#FFD600] transition leading-snug">
                  {note.title}
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                  {note.summary}
                </p>

                {note.beforeExample && (
                  <div className="p-3 bg-[#171717] rounded-xl border border-[#2D2D2E] text-xs space-y-1">
                    <p className="text-red-400 text-[11px] font-bold">기존 생각:</p>
                    <p className="text-zinc-400 truncate">{note.beforeExample}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#FFD600] pt-2 border-t border-[#2A2A2C]">
                <span>노트 전문 읽기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Article Reading Modal */}
        {activeNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-3xl bg-[#171717] text-white border border-[#2D2D2E] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#121212]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FFD600] bg-[#FFD600]/10 px-2.5 py-1 rounded">
                    {activeNote.category}
                  </span>
                  <span className="text-xs text-zinc-400">{activeNote.date}</span>
                </div>
                <button
                  onClick={() => setActiveNote(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <h2 className="text-2xl font-black text-white leading-snug">
                  {activeNote.title}
                </h2>

                {activeNote.beforeExample && activeNote.afterExample && (
                  <div className="p-4 bg-[#222223] border border-[#FFD600]/30 rounded-xl space-y-3 text-xs">
                    <div className="p-2.5 bg-[#171717] rounded-lg text-red-300 border border-red-500/20">
                      <strong className="text-red-400 font-bold block mb-1">[Before] 흔한 기존 인식:</strong>
                      {activeNote.beforeExample}
                    </div>
                    <div className="p-2.5 bg-[#21211D] rounded-lg text-[#FFF3B0] border border-[#FFD600]/40 font-medium">
                      <strong className="text-[#FFD600] font-bold block mb-1">[Repositioned] 기획자 J의 전환:</strong>
                      {activeNote.afterExample}
                    </div>
                  </div>
                )}

                <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-normal">
                  {activeNote.contentParagraphs.map((paragraph, idx) => (
                    <p key={idx} className="p-1">{paragraph}</p>
                  ))}
                </div>

                {/* Conversion Action Footer inside Article */}
                <div className="p-6 bg-[#222223] border border-[#FFD600]/40 rounded-2xl text-center space-y-3 pt-4">
                  <Sparkles className="w-6 h-6 text-[#FFD600] mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    이 노트를 내 경험에 적용하고 싶다면?
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    글을 읽는 것만으로는 부족합니다. 실제 나에게 맞춤화된 포지션을 완성해보세요.
                  </p>
                  <button
                    onClick={() => {
                      setActiveNote(null);
                      onTabChange('classes');
                    }}
                    className="px-6 py-3 bg-[#FFD600] text-[#171717] font-bold text-xs rounded-xl hover:bg-[#ffe033] transition"
                  >
                    {activeNote.ctaText}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
