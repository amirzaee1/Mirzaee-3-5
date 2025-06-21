import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { DailyExercise } from '../types';
import { Calendar, Smile, Share2, Download } from 'lucide-react';
import { MOOD_OPTIONS } from '../constants'; // Import MOOD_OPTIONS from constants

const MemoriesScreen: React.FC = () => {
  const { exercises } = useAppContext();
  const [selectedExercise, setSelectedExercise] = useState<DailyExercise | null>(null);

  const completedExercises = exercises
    .filter(ex => ex.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getMoodEmoji = (moodId?: string): string => {
    if (!moodId) return '🙂'; // Default emoji
    const mood = MOOD_OPTIONS.find(m => m.id === moodId);
    return mood ? mood.emoji : '🙂';
  };
  

  const handleShare = (exercise: DailyExercise) => {
    const date = new Date(exercise.date).toLocaleDateString('fa-IR');
    let shareText = `خاطره جذب من در تاریخ ${date} ✨\n`;
    shareText += `حس شروع: ${getMoodEmoji(exercise.moodAtStart)}\n`;
    shareText += `تغییرات احساس مثبت: ${exercise.emotionChanges.length} مورد\n`;
    shareText += "اتفاقات خوب:\n";
    exercise.goodEvents.filter(Boolean).forEach((event, i) => shareText += `${i+1}. ${event}\n`);
    shareText += "شکرگزاری‌های جدید:\n";
    exercise.morningGratitude.newGratitudes.filter(Boolean).forEach((g, i) => shareText += `${i+1}. ${g}\n`);
    shareText += "\n#جذب_آگاهانه #تمرین_۳×۵ #امیرمیرزایی";
    
    if (navigator.share) {
      navigator.share({
        title: `تمرین ۳×۵ - ${date}`,
        text: shareText,
      }).catch(err => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert("متن در کلیپ‌بورد کپی شد!"))
        .catch(err => console.error("Error copying to clipboard:", err));
    }
  };

  // PDF generation is complex for frontend-only, placeholder for now
  const handleDownloadPdf = (exercise: DailyExercise) => {
    alert("ویژگی دانلود PDF به زودی اضافه خواهد شد.");
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-estedad gold-text mb-6 pb-2 border-b-2 border-purple-500">خاطرات جذب من 💖</h2>
      {completedExercises.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400">هنوز هیچ تمرین کاملی ثبت نکرده‌ای. با انجام تمرینات روزانه، خاطرات جذبت اینجا نمایش داده می‌شن.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedExercises.map(exercise => (
            <Card 
              key={exercise.id} 
              className="hover:border-purple-500" 
              onClick={() => setSelectedExercise(exercise)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar size={18} className="text-purple-400" />
                  <span className="font-semibold">{new Date(exercise.date).toLocaleDateString('fa-IR')}</span>
                </div>
                <span className="text-2xl">{getMoodEmoji(exercise.moodAtStart)}</span>
              </div>
              <p className="text-sm text-gray-400">تغییرات احساس: {exercise.emotionChanges.length}</p>
              <p className="text-sm text-gray-400">اتفاقات خوب: {exercise.goodEvents.filter(Boolean).length}</p>
              <p className="text-sm text-gray-400">شکرگزاری‌های جدید: {exercise.morningGratitude.newGratitudes.filter(Boolean).length}</p>
              {exercise.aiFeedback && <p className="text-xs mt-2 italic text-purple-300 truncate">"{exercise.aiFeedback}"</p>}
            </Card>
          ))}
        </div>
      )}

      {selectedExercise && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedExercise(null)} // Click outside modal to close
        >
            <Card 
                className="max-w-lg w-full bg-gray-800 animate-zoomIn" 
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-estedad gold-text">
                        جزئیات تمرین {new Date(selectedExercise.date).toLocaleDateString('fa-IR')}
                    </h3>
                    <span className="text-3xl">{getMoodEmoji(selectedExercise.moodAtStart)}</span>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <h4 className="font-semibold text-purple-300">تغییرات احساس ({selectedExercise.emotionChanges.length} مورد):</h4>
                        {selectedExercise.emotionChanges.length > 0 ? selectedExercise.emotionChanges.map(ec => <p key={ec.id} className="text-sm ml-4">- {ec.description || "ثبت شده"}</p>) : <p className="text-sm ml-4 text-gray-400">موردی ثبت نشده.</p>}
                    </div>
                    <div>
                        <h4 className="font-semibold text-purple-300">اتفاقات خوب روزانه:</h4>
                        {selectedExercise.goodEvents.filter(Boolean).length > 0 ? selectedExercise.goodEvents.filter(Boolean).map((event, i) => <p key={i} className="text-sm ml-4">- {event}</p>) : <p className="text-sm ml-4 text-gray-400">موردی ثبت نشده.</p>}
                    </div>
                    <div>
                        <h4 className="font-semibold text-purple-300">شکرگزاری‌های صبحگاهی:</h4>
                         {selectedExercise.morningGratitude.newGratitudes.filter(Boolean).length > 0 ? selectedExercise.morningGratitude.newGratitudes.filter(Boolean).map((g, i) => <p key={i} className="text-sm ml-4">- {g}</p>) : <p className="text-sm ml-4 text-gray-400">موردی ثبت نشده.</p>}
                    </div>
                    {selectedExercise.aiFeedback && (
                        <div>
                            <h4 className="font-semibold text-purple-300">بازخورد هوش مصنوعی:</h4>
                            <p className="text-sm italic ml-4">"{selectedExercise.aiFeedback}"</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex space-x-3 space-x-reverse">
                    <button onClick={() => handleShare(selectedExercise)} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"><Share2 size={18} className="ml-1"/> اشتراک</button>
                    <button onClick={() => handleDownloadPdf(selectedExercise)} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"><Download size={18} className="ml-1"/> PDF</button>
                    <button onClick={() => setSelectedExercise(null)} className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">بستن</button>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default MemoriesScreen;