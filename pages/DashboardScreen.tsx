
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from '../components/Button';
import { BookOpen, Edit3, Award, Sun, Zap, MessageCircle } from 'lucide-react'; // Changed User to MessageCircle
import { useAppContext } from '../context/AppContext';
import { generateGeminiText } from '../services/geminiService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardScreen: React.FC = () => {
  const { userProfile, exercises, todayExercise } = useAppContext();
  const [motivationalQuote, setMotivationalQuote] = useState<string | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const completedExercisesCount = exercises.filter(ex => ex.completed).length;
  const currentStreak = calculateStreak();

  function calculateStreak(): number {
    if (exercises.length === 0) return 0;
    const sortedExercises = [...exercises]
        .filter(ex => ex.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    let today = new Date();
    today.setHours(0,0,0,0);

    // Check if today's exercise is completed
    const todayEx = sortedExercises.find(ex => new Date(ex.date).setHours(0,0,0,0) === today.getTime());
    if (todayEx) {
        streak++;
    } else {
        // If today not done, check if yesterday was done for streak to continue
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayEx = sortedExercises.find(ex => new Date(ex.date).setHours(0,0,0,0) === yesterday.getTime());
        if (!yesterdayEx && sortedExercises.length > 0 && new Date(sortedExercises[0].date).setHours(0,0,0,0) < yesterday.getTime()){
             // if neither today nor yesterday is done, and last exercise is older than yesterday, streak is 0
            return 0;
        }
        // if today not done, but yesterday was, streak count starts from yesterday
        if(!yesterdayEx && sortedExercises.length > 0 && new Date(sortedExercises[0].date).setHours(0,0,0,0) === yesterday.getTime()){
             // This case means streak is at least 1 (from yesterday)
        } else if (!yesterdayEx) { // no exercise yesterday or today
            return 0;
        }
    }


    for (let i = (todayEx ? 1 : 0); i < sortedExercises.length; i++) {
        const currentExDate = new Date(sortedExercises[i].date);
        currentExDate.setHours(0,0,0,0);

        const previousDate = new Date(today);
        previousDate.setDate(today.getDate() - (streak + (todayEx ? 0 : 1))); // Adjust based on today's completion
        previousDate.setHours(0,0,0,0);
        
        if (currentExDate.getTime() === previousDate.getTime()) {
            streak++;
        } else {
            break; 
        }
    }
    return streak;
  }
  
  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoadingQuote(true);
      const prompt = `یک پیام انگیزشی کوتاه و قدرتمند در مورد قانون جذب یا شروع یک روز عالی، با لحن امیر میرزایی برای ${userProfile.name} بنویس.`;
      const { text } = await generateGeminiText(prompt, "شما یک مربی انگیزشی هستید.", false);
      setMotivationalQuote(text);
      setIsLoadingQuote(false);
    };

    if (!motivationalQuote) {
     // fetchQuote(); // Uncomment to fetch quote on load - can be costly
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.name]); // Only fetch when user name changes, or once


  return (
    <div className="space-y-8 animate-fadeIn">
      <Card className="bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
                <h1 className="text-3xl font-estedad mb-2">سلام {userProfile.name} جان! <span className="text-yellow-300">🌟</span></h1>
                <p className="text-lg font-vazir">آماده‌ای یه روز متفاوت و پر از جذب آگاهانه بسازی؟</p>
                {userProfile.vibeId && <p className="mt-1 text-md text-yellow-200">ارتعاش شما: <span className="font-semibold">{userProfile.vibeId}</span></p>}
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end space-x-2 space-x-reverse">
                    <Award className="text-yellow-300" size={24} />
                    <span className="text-xl">{currentStreak} روز پیوسته</span>
                </div>
                <p className="text-sm text-purple-200">مجموع تمرینات انجام شده: {completedExercisesCount}</p>
            </div>
        </div>
      </Card>

      {isLoadingQuote && <div className="text-center p-4"><LoadingSpinner text="در حال دریافت پیام انگیزشی..." /></div>}
      {motivationalQuote && !isLoadingQuote && (
        <Card title="پیام امروز برای تو" icon={<Zap size={20} />}>
          <p className="text-lg italic leading-relaxed">{motivationalQuote}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/learn" className="w-full">
          <Button variant="primary" size="lg" className="w-full h-full" glowEffect icon={<BookOpen />}>
            آموزش تمرین ۳×۵
          </Button>
        </Link>
        <Link to="/practice" className="w-full">
          <Button variant="secondary" size="lg" className="w-full h-full breathing" icon={<Edit3 />}>
            {todayExercise && todayExercise.completed ? "مشاهده تمرین امروز" : "شروع تمرین امروز"}
          </Button>
        </Link>
      </div>

      {/* Placeholder for Mood Scanner */}
      <Card title="اسکنر احساس لحظه‌ای" icon={<Sun size={20} />}>
        <p className="text-sm text-gray-400 mb-2">حالت الان چطوره؟ به زودی می‌تونی اینجا انتخاب کنی و پیشنهادهای مخصوص خودت رو بگیری.</p>
        <Button size="sm" variant="outline" onClick={() => alert("ویژگی اسکنر احساس به زودی فعال می‌شود!")}>بررسی احساسات</Button>
      </Card>
      
      {/* AI Chat Link */}
       <Card title="چت با دستیار هوش مصنوعی" icon={<MessageCircle size={20}/>}>
         <p className="text-sm text-gray-400 mb-2">برای دریافت انگیزه، الهام و پاسخ به سوالاتت در مورد تمرین ۳×۵، با دستیار هوش مصنوعی صحبت کن.</p>
         <Button size="sm" variant="primary" onClick={() => navigate('/chat')}> {/* Navigate to /chat */}
            شروع چت
         </Button>
       </Card>
    </div>
  );
};

export default DashboardScreen;
