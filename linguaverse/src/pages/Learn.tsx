import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCcw, Mic, Volume2, Check, X, ArrowLeft, Star } from 'lucide-react';

type ModuleTab = 'vocabulary' | 'grammar' | 'speaking' | 'listening';

const mockVocab = [
  { id: 1, word: 'Serendipity', translation: '意外发现美好事物的运气', phonetic: '/ˌserənˈdɪpɪti/', example: 'Finding this café was pure serendipity.' },
  { id: 2, word: 'Ephemeral', translation: '短暂的，转瞬即逝的', phonetic: '/ɪˈfemərəl/', example: 'The beauty of cherry blossoms is ephemeral.' },
  { id: 3, word: 'Resilience', translation: '韧性，恢复力', phonetic: '/rɪˈzɪliəns/', example: 'Her resilience helped her overcome many challenges.' },
  { id: 4, word: 'Eloquent', translation: '雄辩的，有说服力的', phonetic: '/ˈeləkwənt/', example: 'She gave an eloquent speech at the ceremony.' },
  { id: 5, word: 'Ubiquitous', translation: '无处不在的', phonetic: '/juːˈbɪkwɪtəs/', example: 'Smartphones have become ubiquitous in modern life.' },
];

const mockGrammar = [
  {
    id: 1,
    rule: '现在完成时',
    explanation: '表示过去发生的动作对现在造成的影响或结果，或从过去持续到现在的动作。',
    examples: ['I have lived here for 10 years.', 'She has just finished her homework.'],
    exercise: {
      type: 'fill' as const,
      question: 'I ___ (study) English since 2015.',
      answer: 'have studied',
    },
  },
  {
    id: 2,
    rule: '虚拟语气',
    explanation: '表示与事实相反的假设或不太可能发生的情况。',
    examples: ['If I were you, I would accept the offer.', 'If he had studied harder, he would have passed.'],
    exercise: {
      type: 'choice' as const,
      question: 'If I ___ rich, I would travel the world.',
      options: ['am', 'was', 'were', 'be'],
      answer: 'were',
    },
  },
  {
    id: 3,
    rule: '被动语态',
    explanation: '当强调动作的承受者而非执行者时使用被动语态。',
    examples: ['The book was written by her.', 'The project will be completed next month.'],
    exercise: {
      type: 'reorder' as const,
      question: '将以下单词排列成正确的被动语态句子',
      parts: ['was', 'the', 'by', 'discovered', 'scientist', 'the'],
      answer: 'the was discovered by the scientist',
    },
  },
];

const mockSpeaking = [
  { id: 1, sentence: 'Could you please tell me how to get to the nearest station?', phonetic: '/kʊd juː pliːz tel miː haʊ tuː ɡet tuː ðə nɪərɪst ˈsteɪʃən/', translation: '请问最近的车站怎么走？' },
  { id: 2, sentence: 'I would like to make a reservation for two people.', phonetic: '/aɪ wʊd laɪk tuː meɪk ə ˌrezərˈveɪʃən fɔːr tuː ˈpiːpəl/', translation: '我想预订两人位。' },
  { id: 3, sentence: 'The weather is absolutely beautiful today.', phonetic: '/ðə ˈweðər ɪz ˌæbsəˈluːtli ˈbjuːtɪfəl təˈdeɪ/', translation: '今天的天气真是太好了。' },
];

const mockListening = [
  { id: 1, text: 'The meeting has been postponed until next Monday.', translation: '会议已推迟到下周一。', options: ['会议提前到周一', '会议推迟到下周一', '会议取消了', '会议改到周五'], answer: 1 },
  { id: 2, text: 'She recommended trying the new Italian restaurant downtown.', translation: '她推荐尝试市中心的新意大利餐厅。', options: ['她不喜欢意大利菜', '她推荐市中心的新意大利餐厅', '她想去法国餐厅', '她觉得餐厅太远了'], answer: 1 },
  { id: 3, text: 'The deadline for the project has been extended by two weeks.', translation: '项目截止日期延长了两周。', options: ['截止日期缩短了', '项目已经完成', '截止日期延长了两周', '项目被取消了'], answer: 2 },
];

const tabs: { key: ModuleTab; label: string }[] = [
  { key: 'vocabulary', label: '单词' },
  { key: 'grammar', label: '语法' },
  { key: 'speaking', label: '口语' },
  { key: 'listening', label: '听力' },
];

function VocabModule() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const word = mockVocab[currentIndex];

  const goNext = () => {
    setFlipped(false);
    setCurrentIndex((i) => Math.min(i + 1, mockVocab.length - 1));
  };
  const goPrev = () => {
    setFlipped(false);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Flash Card */}
      <div className="perspective-1000 mb-8">
        <div
          onClick={() => setFlipped(!flipped)}
          className={`relative w-full h-80 cursor-pointer preserve-3d transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-lg border border-charcoal/5 flex flex-col items-center justify-center p-8">
            <p className="text-charcoal/40 text-sm mb-2">{word.phonetic}</p>
            <h2 className="font-display text-4xl font-bold text-charcoal mb-4">{word.word}</h2>
            <p className="text-charcoal/40 text-sm">点击翻转查看翻译</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-emerald-600 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-white">
            <h2 className="font-display text-3xl font-bold mb-4">{word.translation}</h2>
            {word.example && (
              <p className="text-white/70 text-sm text-center italic">"{word.example}"</p>
            )}
            <p className="text-white/50 text-sm mt-4">点击翻回正面</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="btn-capsule bg-white text-charcoal px-5 py-2.5 flex items-center gap-2 border border-charcoal/10 hover:bg-charcoal/5 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          上一个
        </button>

        <div className="text-charcoal/40 text-sm">
          {currentIndex + 1} / {mockVocab.length}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === mockVocab.length - 1}
          className="btn-capsule bg-emerald-600 text-white px-5 py-2.5 flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-30"
        >
          下一个
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6">
        {mockVocab.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIndex ? 'bg-emerald-600 scale-125' : i < currentIndex ? 'bg-emerald-600/40' : 'bg-charcoal/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function GrammarModule() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fillAnswer, setFillAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [reorderedParts, setReorderedParts] = useState<string[]>([]);
  const [remainingParts, setRemainingParts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const grammar = mockGrammar[currentIdx];
  const exercise = grammar.exercise;

  const resetExercise = () => {
    setFillAnswer('');
    setSelectedChoice('');
    setSubmitted(false);
    setIsCorrect(false);
    if (exercise.type === 'reorder' && exercise.parts) {
      setReorderedParts([]);
      setRemainingParts([...exercise.parts]);
    }
  };

  const handleNext = () => {
    if (currentIdx < mockGrammar.length - 1) {
      setCurrentIdx(currentIdx + 1);
      resetExercise();
    }
  };

  const handlePartClick = (part: string, fromRemaining: boolean) => {
    if (submitted) return;
    if (fromRemaining) {
      setRemainingParts((p) => p.filter((_, i) => i !== remainingParts.indexOf(part) || (remainingParts.splice(remainingParts.indexOf(part), 1), false)));
      setRemainingParts((prev) => {
        const idx = prev.indexOf(part);
        return prev.filter((_, i) => i !== idx);
      });
      setReorderedParts((p) => [...p, part]);
    } else {
      setReorderedParts((p) => p.filter((_, i) => i !== reorderedParts.indexOf(part) || (reorderedParts.splice(reorderedParts.indexOf(part), 1), false)));
      setReorderedParts((prev) => {
        const idx = prev.indexOf(part);
        return prev.filter((_, i) => i !== idx);
      });
      setRemainingParts((p) => [...p, part]);
    }
  };

  const handleSubmit = () => {
    let correct = false;
    if (exercise.type === 'fill') {
      correct = fillAnswer.trim().toLowerCase() === exercise.answer.toLowerCase();
    } else if (exercise.type === 'choice') {
      correct = selectedChoice === exercise.answer;
    } else if (exercise.type === 'reorder') {
      correct = reorderedParts.join(' ') === exercise.answer;
    }
    setIsCorrect(correct);
    setSubmitted(true);
  };

  // Initialize reorder parts
  useState(() => {
    if (exercise.type === 'reorder' && exercise.parts) {
      setRemainingParts([...exercise.parts]);
    }
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Grammar Rule */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5 mb-6">
        <h3 className="font-display text-xl font-bold text-charcoal mb-2">{grammar.rule}</h3>
        <p className="text-charcoal/60 mb-4">{grammar.explanation}</p>
        <div className="space-y-2">
          {grammar.examples.map((ex, i) => (
            <div key={i} className="pl-4 border-l-2 border-emerald-600 text-charcoal/70 text-sm">
              {ex}
            </div>
          ))}
        </div>
      </div>

      {/* Exercise */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5">
        <h4 className="font-semibold text-charcoal mb-4">练习题</h4>
        <p className="text-charcoal/70 mb-4">{exercise.question}</p>

        {exercise.type === 'fill' && (
          <input
            type="text"
            value={fillAnswer}
            onChange={(e) => setFillAnswer(e.target.value)}
            disabled={submitted}
            placeholder="输入答案..."
            className="w-full px-4 py-3 rounded-xl border border-charcoal/10 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm disabled:bg-charcoal/5"
          />
        )}

        {exercise.type === 'choice' && exercise.options && (
          <div className="grid grid-cols-2 gap-3">
            {exercise.options.map((opt) => (
              <button
                key={opt}
                onClick={() => !submitted && setSelectedChoice(opt)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedChoice === opt
                    ? submitted
                      ? opt === exercise.answer
                        ? 'border-emerald-600 bg-emerald-600/10 text-emerald-600'
                        : 'border-red-400 bg-red-50 text-red-500'
                      : 'border-emerald-600 bg-emerald-600/10 text-emerald-600'
                    : 'border-charcoal/10 text-charcoal/60 hover:border-charcoal/30'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {exercise.type === 'reorder' && (
          <div>
            <div className="min-h-[48px] flex flex-wrap gap-2 p-3 rounded-xl border border-charcoal/10 mb-3 bg-cream">
              {reorderedParts.map((part, i) => (
                <button
                  key={`selected-${i}`}
                  onClick={() => handlePartClick(part, false)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium"
                >
                  {part}
                </button>
              ))}
              {reorderedParts.length === 0 && (
                <span className="text-charcoal/30 text-sm">点击下方单词排列句子...</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {remainingParts.map((part, i) => (
                <button
                  key={`remaining-${i}`}
                  onClick={() => handlePartClick(part, true)}
                  className="px-3 py-1.5 rounded-lg border border-charcoal/10 text-charcoal/60 text-sm hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                >
                  {part}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result feedback */}
        {submitted && (
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
            isCorrect ? 'bg-emerald-600/10 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}>
            {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {isCorrect ? '回答正确！' : `回答错误，正确答案是: ${exercise.answer}`}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="btn-capsule bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-emerald-700"
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentIdx >= mockGrammar.length - 1}
              className="btn-capsule bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-30"
            >
              下一题
            </button>
          )}
          <button
            onClick={resetExercise}
            className="btn-capsule bg-white text-charcoal px-4 py-2.5 text-sm border border-charcoal/10 hover:bg-charcoal/5"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-2 mt-6">
        {mockGrammar.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIdx ? 'bg-emerald-600 scale-125' : i < currentIdx ? 'bg-emerald-600/40' : 'bg-charcoal/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SpeakingModule() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const item = mockSpeaking[currentIdx];

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      const randomScore = Math.floor(Math.random() * 3) + 3;
      setScore(randomScore);
    } else {
      setRecording(true);
      setScore(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-charcoal/5 mb-6">
        <h3 className="font-display text-2xl font-bold text-charcoal mb-2">{item.sentence}</h3>
        <p className="text-charcoal/40 text-sm mb-1">{item.phonetic}</p>
        <p className="text-charcoal/60 text-sm">{item.translation}</p>
      </div>

      {/* Wave Visualization */}
      <div className="flex items-center justify-center gap-1 h-16 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 bg-emerald-600 rounded-full transition-all ${recording ? 'wave-bar' : ''}`}
            style={{ height: recording ? undefined : '8px', minHeight: '8px', maxHeight: '40px' }}
          />
        ))}
      </div>

      {/* Record Button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleRecord}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            recording
              ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30'
          }`}
        >
          <Mic className="w-8 h-8 text-white" />
        </button>
        <span className="text-charcoal/40 text-sm">
          {recording ? '录音中...点击停止' : '点击开始录音'}
        </span>
      </div>

      {/* Score */}
      {score !== null && (
        <div className="mt-8 text-center animate-slide-up">
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-8 h-8 ${s <= score ? 'text-gold-400 fill-gold-400' : 'text-charcoal/10'}`}
              />
            ))}
          </div>
          <p className="text-charcoal/60 text-sm">
            {score >= 4 ? '发音很棒！' : score >= 3 ? '不错，继续加油！' : '多练习几次会更好'}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setScore(null); }}
          disabled={currentIdx === 0}
          className="btn-capsule bg-white text-charcoal px-5 py-2.5 flex items-center gap-2 border border-charcoal/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          上一句
        </button>
        <span className="text-charcoal/40 text-sm">{currentIdx + 1} / {mockSpeaking.length}</span>
        <button
          onClick={() => { setCurrentIdx(Math.min(mockSpeaking.length - 1, currentIdx + 1)); setScore(null); }}
          disabled={currentIdx >= mockSpeaking.length - 1}
          className="btn-capsule bg-emerald-600 text-white px-5 py-2.5 flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-30"
        >
          下一句
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ListeningModule() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const item = mockListening[currentIdx];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < mockListening.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Audio Player */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-charcoal/5 mb-6 text-center">
        <button
          onClick={() => setPlaying(!playing)}
          className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <Volume2 className="w-10 h-10 text-white" />
        </button>
        <p className="text-charcoal/40 text-sm">点击播放音频</p>
        {playing && (
          <div className="flex items-center justify-center gap-1 mt-4 h-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-emerald-600 rounded-full wave-bar"
                style={{ minHeight: '4px', maxHeight: '24px' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {item.options.map((opt, i) => {
          let btnClass = 'border-charcoal/10 text-charcoal/60 hover:border-charcoal/30';
          if (submitted) {
            if (i === item.answer) {
              btnClass = 'border-emerald-600 bg-emerald-600/10 text-emerald-600';
            } else if (i === selected) {
              btnClass = 'border-red-400 bg-red-50 text-red-500';
            }
          } else if (selected === i) {
            btnClass = 'border-emerald-600 bg-emerald-600/10 text-emerald-600';
          }
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all ${btnClass}`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-charcoal/5 text-charcoal/40 text-xs mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="btn-capsule bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-30"
          >
            提交答案
          </button>
        ) : (
          <>
            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
              selected === item.answer ? 'bg-emerald-600/10 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}>
              {selected === item.answer ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {selected === item.answer ? '回答正确！' : `正确答案是: ${String.fromCharCode(65 + item.answer)}`}
            </div>
            <button
              onClick={handleNext}
              disabled={currentIdx >= mockListening.length - 1}
              className="btn-capsule bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-30"
            >
              下一题
            </button>
          </>
        )}
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-2 mt-6">
        {mockListening.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIdx ? 'bg-emerald-600 scale-125' : i < currentIdx ? 'bg-emerald-600/40' : 'bg-charcoal/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Learn() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<ModuleTab>('vocabulary');

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/courses" className="inline-flex items-center gap-1 text-charcoal/40 hover:text-emerald-600 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回课程列表
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
            课程 #{courseId}
          </h1>
        </div>

        {/* Module Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-charcoal/60 border border-charcoal/10 hover:border-emerald-600/30 hover:text-emerald-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Module Content */}
        {activeTab === 'vocabulary' && <VocabModule />}
        {activeTab === 'grammar' && <GrammarModule />}
        {activeTab === 'speaking' && <SpeakingModule />}
        {activeTab === 'listening' && <ListeningModule />}
      </div>
    </div>
  );
}
