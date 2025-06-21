import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';
import { DailyExercise, EmotionChangeEntry } from '../types';
import { MAX_EMOTION_CHANGES, MAX_GOOD_EVENTS, MAX_GRATITUDES, MOOD_OPTIONS } from '../constants';
import { generateGeminiText } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Zap, Star, Gift, Check, Send, Lightbulb, Smile, Meh, Frown } from 'lucide-react';

const DailyExerciseScreen: React.FC = () => {
  const { userProfile, addExercise, updateExercise, getExerciseByDate, isLoadingAi: contextIsLoadingAi, sendAiChatMessage: contextSendAiChatMessage } = useAppContext();
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  
  const [currentExercise, setCurrentExercise] = useState<DailyExercise>(() => {
    const existing = getExerciseByDate(today);
    if (existing) return existing;
    return {
      id: today,
      date: today,
      emotionChanges: [],
      goodEvents: Array(MAX_GOOD_EVENTS).fill(''),
      morningGratitude: {
        affirmedYesterdayChanges: false,
        reviewedYesterdayEvents: [],
        newGratitudes: Array(MAX_GRATITUDES).fill(''),
      },
      completed: false,
      moodAtStart: undefined,
    };
  });

  const [emotionChangeDesc, setEmotionChangeDesc] = useState('');
  const [showMoodScanner, setShowMoodScanner] = useState(!currentExercise.moodAtStart && !currentExercise.completed);
  const [moodSuggestion, setMoodSuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isLoadingCompletion, setIsLoadingCompletion] = useState(false);
  const [gratitudeInspiration, setGratitudeInspiration] = useState<string[]>([]);
  const [isLoadingInspiration, setIsLoadingInspiration] = useState(false);

  // Load yesterday's good events for today's gratitude review
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayExercise = getExerciseByDate(yesterdayStr);
    if (yesterdayExercise && yesterdayExercise.completed) {
      setCurrentExercise(prev => ({
        ...prev,
        morningGratitude: {
          ...prev.morningGratitude,
          reviewedYesterdayEvents: yesterdayExercise.goodEvents.filter(Boolean),
        }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]); // Removed getExerciseByDate as it's stable from context if context itself is stable

  const handleMoodSelect = async (mood: string) => {
    setCurrentExercise(prev => ({ ...prev, moodAtStart: mood }));
    setShowMoodScanner(false);
    setIsLoadingSuggestion(true);
    const prompt = `کاربر (${userProfile.name}) احساس ${MOOD_OPTIONS.find(m=>m.id === mood)?.label} دارد. یک پیام کوتاه و الهام بخش (حداکثر ۲ جمله) با لحن امیر میرزایی برای شروع بهتر تمرین ۳×۵ به او بده. اگر احساس منفی بود، یک راهکار ساده مثل تنفس یا موسیقی پیشنهاد بده.`;
    const { text } = await generateGeminiText(prompt, "شما یک مربی قانون جذب هستید.", false);
    setMoodSuggestion(text);
    setIsLoadingSuggestion(false);
  };

  const addEmotionChange = () => {
    if (currentExercise.emotionChanges.length < MAX_EMOTION_CHANGES) {
      const newChange: EmotionChangeEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        description: emotionChangeDesc,
      };
      setCurrentExercise(prev => ({
        ...prev,
        emotionChanges: [...prev.emotionChanges, newChange],
      }));
      setEmotionChangeDesc('');
      // Simple visual feedback
      const successSpark = document.createElement('div');
      successSpark.innerHTML = '✨';
      successSpark.className = 'absolute text-3xl animate-ping'; // This needs careful positioning if used.
      const btn = document.getElementById('emotion-change-btn');
      if (btn) {
        btn.appendChild(successSpark);
        setTimeout(() => successSpark.remove(), 1000);
      }
    }
  };

  const handleGoodEventChange = (index: number, value: string) => {
    const newGoodEvents = [...currentExercise.goodEvents];
    newGoodEvents[index] = value;
    setCurrentExercise(prev => ({ ...prev, goodEvents: newGoodEvents }));
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitudes = [...currentExercise.morningGratitude.newGratitudes];
    newGratitudes[index] = value;
    setCurrentExercise(prev => ({
      ...prev,
      morningGratitude: { ...prev.morningGratitude, newGratitudes },
    }));
  };
  
  const handleAffirmation = () => {
    setCurrentExercise(prev => ({
        ...prev,
        morningGratitude: {...prev.morningGratitude, affirmedYesterdayChanges: !prev.morningGratitude.affirmedYesterdayChanges}
    }));
  };

  const fetchGratitudeInspiration = async () => {
    setIsLoadingInspiration(true);
    const existingGratitudes = currentExercise.morningGratitude.newGratitudes.filter(Boolean).join(', ');
    const prompt = `کاربر (${userProfile.name}) برای تمرین شکرگزاری ۳×۵ به ${MAX_GRATITUDES} ایده جدید نیاز دارد. موارد تکراری نباشند. این موارد را قبلا نوشته است: ${existingGratitudes}. با لحن امیر میرزایی، ${MAX_GRATITUDES} مورد جدید پیشنهاد بده. هر مورد در یک خط جدا و کوتاه باشد.`;
    const { text } = await generateGeminiText(prompt, "شما یک دستیار خلاق برای پیشنهاد شکرگزاری هستید.", true);
    setGratitudeInspiration(text.split('\n').map(s => s.replace(/^- /, '')).filter(Boolean));
    setIsLoadingInspiration(false);
  };

  const handleCompleteExercise = async () => {
    setIsLoadingCompletion(true);
    const finalExercise = { ...currentExercise, completed: true };
    
    // AI Feedback
    const summaryPrompt = `کاربر (${userProfile.name}) تمرین ۳×۵ امروزش را تکمیل کرده. 
    تغییرات احساس: ${finalExercise.emotionChanges.length} مورد. 
    اتفاقات خوب: ${finalExercise.goodEvents.filter(Boolean).join(', ')}. 
    شکرگزاری‌ها: ${finalExercise.morningGratitude.newGratitudes.filter(Boolean).join(', ')}.
    یک پیام تبریک و تشویق کوتاه و قدرتمند (حداکثر ۳ جمله) با لحن امیر میرزایی برای او بنویس.`;
    
    const { text: aiFeedback } = await generateGeminiText(summaryPrompt, "شما یک مربی قانون جذب هستید.", false);
    finalExercise.aiFeedback = aiFeedback;

    setCurrentExercise(finalExercise);
    if (getExerciseByDate(today)) {
      updateExercise(today, finalExercise);
    } else {
      addExercise(finalExercise);
    }
    setIsLoadingCompletion(false);
    // Maybe use contextSendAiChatMessage to log this completion in the main chat
    // await contextSendAiChatMessage(`تبریک! تمرین ۳×۵ امروز با موفقیت ثبت شد. این هم پیام تشویقی مخصوص شما: ${aiFeedback}`);
  };
  
  // Update currentExercise if it changes in context (e.g. loaded from storage after initial render)
  useEffect(() => {
    const existing = getExerciseByDate(today);
    if (existing) {
      setCurrentExercise(existing);
      if (existing.moodAtStart || existing.completed) {
        setShowMoodScanner(false);
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getExerciseByDate(today)]);


  if (showMoodScanner && !currentExercise.completed) {
    return (
      <div className="animate-fadeInUp">
        <h2 className="text-3xl font-estedad gold-text mb-6">اسکنر احساس لحظه‌ای</h2>
        <Card title="امروز چه حسی داری؟" icon={<Smile />}>
          <p className="mb-4 text-gray-300">انتخاب حالت فعلی‌ات به ما کمک می‌کنه تجربه بهتری برات بسازیم.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MOOD_OPTIONS.map(mood => (
              <Button key={mood.id} onClick={() => handleMoodSelect(mood.id)} variant="outline" className="flex-col h-24">
                <span className="text-3xl mb-1">{mood.emoji}</span>
                {mood.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (isLoadingSuggestion) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="در حال آماده‌سازی پیشنهاد برای شما..." /></div>;
  }
  
  if (moodSuggestion && !currentExercise.completed) { // Only show if not completed and suggestion exists
     return (
        <Card title="پیام مخصوص تو" icon={<Lightbulb />} className="animate-fadeIn mb-6">
            <p className="text-lg mb-4">{moodSuggestion}</p>
            <Button onClick={() => setMoodSuggestion(null)}>ادامه تمرین</Button>
        </Card>
     );
  }

  if (currentExercise.completed) {
    return (
      <div className="animate-fadeInUp">
        <h2 className="text-3xl font-estedad gold-text mb-6">تمرین امروز تکمیل شد!</h2>
        <Card title="آفرین به تو، قهرمان!" icon={<Check className="text-green-400" />}>
          <p className="text-lg mb-4">تو یک قدم بزرگ دیگه در مسیر خلق آگاهانه آینده‌ات برداشتی.</p>
          {currentExercise.aiFeedback && (
            <div className="my-4 p-3 bg-purple-800 bg-opacity-50 rounded-md border-l-4 border-purple-400">
              <p className="font-semibold gold-text">پیام هوش مصنوعی برای تو:</p>
              <p className="italic">{currentExercise.aiFeedback}</p>
            </div>
          )}
          <Button onClick={() => navigate('/')} variant="primary">بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp">
      <h2 className="text-3xl font-estedad gold-text mb-6">تمرین روزانه ۳×۵ ({new Date(today).toLocaleDateString('fa-IR')})</h2>

      {/* 1. Emotion Changes */}
      <Card title="۱. پنج بار تغییر احساس عمدی" icon={<Zap className="text-yellow-400" />}>
        <p className="mb-2 text-sm text-gray-400">
          در طول روز، {MAX_EMOTION_CHANGES} بار آگاهانه احساست رو از بد یا خنثی، به خوب تغییر بده.
          ({currentExercise.emotionChanges.length}/{MAX_EMOTION_CHANGES})
        </p>
        {currentExercise.emotionChanges.length < MAX_EMOTION_CHANGES ? (
          <div className="flex items-end space-x-2 space-x-reverse">
            <input
              type="text"
              value={emotionChangeDesc}
              onChange={(e) => setEmotionChangeDesc(e.target.value)}
              placeholder="توضیح مختصر (اختیاری): مثلا چطور حست رو تغییر دادی؟"
              className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
            <Button id="emotion-change-btn" onClick={addEmotionChange} size="md" className="relative">ثبت تغییر احساس</Button>
          </div>
        ) : <p className="text-green-400 font-semibold">ایول! این بخش رو کامل کردی.</p>}
        <div className="mt-3 space-y-1">
          {currentExercise.emotionChanges.map((change, index) => (
            <div key={change.id} className="text-xs p-1 bg-gray-700 rounded text-gray-300">
              {index+1}. {change.description || "تغییر احساس ثبت شد"} (ساعت: {new Date(change.timestamp).toLocaleTimeString('fa-IR')})
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Good Events */}
      <Card title="۲. پنج اتفاق خوب روزانه" icon={<Star className="text-pink-400" />}>
        <p className="mb-2 text-sm text-gray-400">امروز چه اتفاقات خوبی برات افتاد؟ {MAX_GOOD_EVENTS} تا از بهترین‌هاشو بنویس.</p>
        <div className="space-y-2">
          {currentExercise.goodEvents.map((event, index) => (
            <input
              key={index}
              type="text"
              value={event}
              onChange={(e) => handleGoodEventChange(index, e.target.value)}
              placeholder={`اتفاق خوب ${index + 1}...`}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
          ))}
        </div>
      </Card>

      {/* 3. Morning Gratitude (Done next morning, but can be prepped) */}
      <Card title="۳. پنج شکرگزاری صبحگاهی (برای فردا)" icon={<Gift className="text-green-400" />}>
        <p className="mb-1 text-sm text-gray-400">این بخش مربوط به صبح روز بعد است. برای آمادگی:</p>
        <div className="mb-3 p-3 bg-gray-700 bg-opacity-60 rounded-md">
            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input type="checkbox" checked={currentExercise.morningGratitude.affirmedYesterdayChanges} onChange={handleAffirmation} className="form-checkbox h-5 w-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500" />
                <span>ایول به خودم بابت {MAX_EMOTION_CHANGES} تغییر احساس دیروز (فردا تیک بزن!)</span>
            </label>
        </div>
        
        {currentExercise.morningGratitude.reviewedYesterdayEvents.length > 0 && (
            <div className="mb-3">
                <p className="text-sm font-semibold gold-text mb-1">مرور اتفاقات خوب دیروز (اینها اتفاقات خوب <span className="underline">امروز</span> شما هستند که فردا مرور میکنید):</p>
                <ul className="list-disc list-inside text-xs text-gray-300 pl-4">
                    {currentExercise.goodEvents.filter(Boolean).map((event, i) => <li key={i}>{event}</li>)}
                    {currentExercise.goodEvents.filter(Boolean).length === 0 && <li>هنوز اتفاق خوبی برای امروز ثبت نکرده‌اید.</li>}
                </ul>
            </div>
        )}

        <p className="mb-2 text-sm text-gray-400">پنج شکرگزاری تازه برای فردا بنویس (هر روز متفاوت):</p>
        <div className="space-y-2">
          {currentExercise.morningGratitude.newGratitudes.map((gratitude, index) => (
            <input
              key={index}
              type="text"
              value={gratitude}
              onChange={(e) => handleGratitudeChange(index, e.target.value)}
              placeholder={`شکرگزاری جدید ${index + 1}...`}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            />
          ))}
        </div>
        <Button onClick={fetchGratitudeInspiration} variant="outline" size="sm" className="mt-3" icon={<Lightbulb size={16}/>} disabled={isLoadingInspiration}>
          {isLoadingInspiration ? <LoadingSpinner size="sm" /> : "ایده برای شکرگزاری"}
        </Button>
        {gratitudeInspiration.length > 0 && (
          <div className="mt-3 p-2 bg-purple-900 bg-opacity-40 rounded">
            <p className="text-xs gold-text mb-1">پیشنهادات هوش مصنوعی:</p>
            <ul className="list-disc list-inside text-xs">
              {gratitudeInspiration.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}
      </Card>

      <Button onClick={handleCompleteExercise} variant="primary" size="lg" glowEffect breathing className="w-full" disabled={isLoadingCompletion}>
        {isLoadingCompletion ? <LoadingSpinner text="در حال ثبت..." /> : "پایان و ذخیره تمرین امروز"}
        <Send />
      </Button>
    </div>
  );
};

export default DailyExerciseScreen;