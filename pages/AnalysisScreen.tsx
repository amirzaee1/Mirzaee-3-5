
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Award, Zap, Star, Gift, TrendingUp, CheckSquare } from 'lucide-react';
import { generateGeminiText } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { EXERCISE_CYCLE_DAYS, REQUIRED_STREAK_FOR_VIBE_ID } from '../constants';

const AnalysisScreen: React.FC = () => {
  const { exercises, userProfile, setUserProfile } = useAppContext();
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const completedExercises = exercises.filter(ex => ex.completed);

  // Calculate streak
  const calculateStreak = () => {
    if (completedExercises.length === 0) return 0;
    const sortedCompleted = [...completedExercises].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let today = new Date();
    today.setHours(0,0,0,0);

    const todayEx = sortedCompleted.find(ex => new Date(ex.date).setHours(0,0,0,0) === today.getTime());
    if (todayEx) streak = 1;
    else { // If today not done, check if yesterday was done for streak to continue
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayEx = sortedCompleted.find(ex => new Date(ex.date).setHours(0,0,0,0) === yesterday.getTime());
        if (!yesterdayEx) return 0; // if neither today nor yesterday is done, streak is 0
    }

    for (let i = (todayEx ? 1 : 0); i < sortedCompleted.length; i++) {
        const currentExDate = new Date(sortedCompleted[i].date);
        currentExDate.setHours(0,0,0,0);
        const previousDate = new Date(today);
        previousDate.setDate(today.getDate() - (streak + (todayEx ? 0 : 1)));
        previousDate.setHours(0,0,0,0);
        if (currentExDate.getTime() === previousDate.getTime()) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
  };
  const currentStreak = calculateStreak();

  const totalEmotionChanges = completedExercises.reduce((sum, ex) => sum + ex.emotionChanges.length, 0);
  const totalGoodEvents = completedExercises.reduce((sum, ex) => sum + ex.goodEvents.filter(Boolean).length, 0);
  const totalGratitudes = completedExercises.reduce((sum, ex) => sum + ex.morningGratitude.newGratitudes.filter(Boolean).length, 0);

  const moodCounts: {[key: string]: number} = {};
  completedExercises.forEach(ex => {
    if (ex.moodAtStart) {
      moodCounts[ex.moodAtStart] = (moodCounts[ex.moodAtStart] || 0) + 1;
    }
  });

  const moodData = Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

  const recentPerformanceData = completedExercises.slice(-7).map(ex => ({
    date: new Date(ex.date).toLocaleDateString('fa-IR', { day: 'numeric', month: 'short'}),
    تغییر_احساس: ex.emotionChanges.length,
    اتفاق_خوب: ex.goodEvents.filter(Boolean).length,
    شکرگزاری: ex.morningGratitude.newGratitudes.filter(Boolean).length,
  }));
  
  useEffect(() => {
    const generateVibeIdAndAnalysis = async () => {
      if (currentStreak >= REQUIRED_STREAK_FOR_VIBE_ID && !userProfile.vibeId) {
        setIsLoadingAnalysis(true);
        const vibeIdPrompt = `بر اساس ${currentStreak} روز تمرین مستمر ۳×۵، یک "نام ارتعاشی" (Vibe ID) الهام‌بخش و مثبت برای کاربر (${userProfile.name}) با لحن امیر میرزایی بساز. نام کوتاه و جذاب باشد، مثل "جریان پُرنعمت" یا "ارتعاش طلایی". فقط نام را برگردان.`;
        const { text: vibeId } = await generateGeminiText(vibeIdPrompt, "شما یک متخصص نامگذاری ارتعاشی هستید.", false);
        if (vibeId && !vibeId.toLowerCase().includes("خطا")) {
             setUserProfile(prev => ({ ...prev, vibeId: vibeId.trim() }));
        }
        setIsLoadingAnalysis(false);
      }

      // Generate analysis message
      if (completedExercises.length > 2) { // Only if there's enough data
          setIsLoadingAnalysis(true);
          const analysisPrompt = `کاربر (${userProfile.name}) این آمار را در تمرین ۳×۵ دارد: 
          تعداد روزهای تکمیل شده: ${completedExercises.length}, 
          روزهای پیوسته: ${currentStreak},
          مجموع تغییرات احساس: ${totalEmotionChanges},
          مجموع اتفاقات خوب: ${totalGoodEvents},
          مجموع شکرگزاری‌ها: ${totalGratitudes}.
          یک پیام تحلیل ارتعاشی کوتاه و انگیزشی (حداکثر ۳-۴ جمله) با تمرکز بر نقاط قوت و تشویق به ادامه، با لحن امیر میرزایی بنویس.`;
          const { text } = await generateGeminiText(analysisPrompt, "شما یک مربی قانون جذب و تحلیلگر ارتعاش هستید.", false);
          setAnalysisMessage(text);
          setIsLoadingAnalysis(false);
      }
    };

    generateVibeIdAndAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStreak, userProfile.vibeId, completedExercises.length]);


  return (
    <div className="animate-fadeInUp space-y-8">
      <h2 className="text-3xl font-estedad gold-text mb-6 pb-2 border-b-2 border-purple-500">تحلیل ارتعاش شما 📊</h2>
      
      {isLoadingAnalysis && <div className="text-center p-4"><LoadingSpinner text="در حال تحلیل و دریافت پیام..." /></div>}
      
      {userProfile.vibeId && (
        <Card title="Vibe ID شما" icon={<Award className="text-yellow-400"/>} className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 text-white text-center">
            <p className="text-3xl font-estedad">{userProfile.vibeId}</p>
            <p className="text-sm">این نام ارتعاشی پس از {REQUIRED_STREAK_FOR_VIBE_ID} روز تمرین مستمر به شما تعلق گرفته. آفرین!</p>
        </Card>
      )}

      {analysisMessage && (
        <Card title="پیام تحلیلی هوش مصنوعی" icon={<TrendingUp />} className="border-purple-400">
            <p className="italic leading-relaxed">{analysisMessage}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="روزهای پیوسته" icon={<Award />} className="text-center">
          <p className="text-4xl font-bold gold-text">{currentStreak}</p>
          <p className="text-sm text-gray-400">از {EXERCISE_CYCLE_DAYS} روز چالش</p>
        </Card>
        <Card title="تمرینات کامل شده" icon={<CheckSquare />} className="text-center">
          <p className="text-4xl font-bold gold-text">{completedExercises.length}</p>
          <p className="text-sm text-gray-400">روز</p>
        </Card>
        <Card title="کل تغییرات احساس" icon={<Zap />} className="text-center">
          <p className="text-4xl font-bold gold-text">{totalEmotionChanges}</p>
          <p className="text-sm text-gray-400">مورد</p>
        </Card>
        <Card title="کل اتفاقات خوب" icon={<Star />} className="text-center">
          <p className="text-4xl font-bold gold-text">{totalGoodEvents}</p>
          <p className="text-sm text-gray-400">مورد</p>
        </Card>
         <Card title="کل شکرگزاری‌ها" icon={<Gift />} className="text-center">
          <p className="text-4xl font-bold gold-text">{totalGratitudes}</p>
          <p className="text-sm text-gray-400">مورد</p>
        </Card>
      </div>

      {completedExercises.length > 0 && (
        <>
          <Card title="عملکرد ۷ روز اخیر">
            {recentPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recentPerformanceData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false}/>
                    <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: '#e0e0e0' }} labelStyle={{ color: '#FFD700' }}/>
                    <Legend wrapperStyle={{color: '#e0e0e0', fontSize: '12px'}}/>
                    <Bar dataKey="تغییر_احساس" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="اتفاق_خوب" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="شکرگزاری" fill="#ffc658" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            ) : <p className="text-gray-400 text-center">اطلاعات کافی برای نمایش نمودار ۷ روز اخیر وجود ندارد.</p>}
          </Card>

          {moodData.length > 0 && (
            <Card title="نمودار احساسات ثبت شده">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: '#e0e0e0' }}/>
                  <Legend wrapperStyle={{color: '#e0e0e0', fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
       {completedExercises.length === 0 && (
           <Card>
               <p className="text-center text-gray-400">هنوز داده‌ای برای تحلیل وجود ندارد. با انجام تمرینات، نمودارها اینجا ظاهر می‌شوند.</p>
           </Card>
       )}
    </div>
  );
};

export default AnalysisScreen;
