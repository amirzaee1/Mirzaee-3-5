
import React from 'react';
import Card from '../components/Card';
import { AUTHOR_NAME } from '../constants';
import { Linkedin, Instagram, Youtube, Globe } from 'lucide-react';

const AboutScreen: React.FC = () => {
  return (
    <div className="animate-fadeInRight">
      <h2 className="text-3xl font-estedad gold-text mb-6 pb-2 border-b-2 border-purple-500">درباره {AUTHOR_NAME} و اپلیکیشن</h2>
      
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 md:space-x-reverse">
          <img 
            src="https://picsum.photos/seed/amir_mirzaei/200/200" // Placeholder image
            alt={AUTHOR_NAME}
            className="w-40 h-40 rounded-full object-cover shadow-lg border-2 border-yellow-400"
          />
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-estedad gold-text">{AUTHOR_NAME}</h3>
            <p className="text-purple-300">مربی و راهنمای قانون جذب آگاهانه</p>
            <p className="mt-3 text-gray-300 leading-relaxed">
              سلام به شما دوست عزیزم! من امیر میرزایی هستم و سال‌هاست که در مسیر تحقیق، تجربه و آموزش قانون جذب و قدرت ذهن فعالیت می‌کنم. باور دارم که هر انسانی قدرت خلق زندگی رویایی خودش رو داره، به شرطی که آگاهانه از قوانین جهان هستی استفاده کنه. اپلیکیشن ۳×۵ رو با عشق طراحی کردم تا ابزاری ساده و کاربردی برای تمرین روزانه و ساختن ارتعاش مثبت در اختیار شما باشه.
            </p>
            <div className="mt-4 flex justify-center md:justify-start space-x-4 space-x-reverse">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors"><Linkedin size={24}/></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors"><Instagram size={24}/></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors"><Youtube size={24}/></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors"><Globe size={24}/></a>
            </div>
          </div>
        </div>
      </Card>

      <Card title="فلسفه اپلیکیشن ۳×۵">
        <p className="leading-relaxed mb-3">
          این اپلیکیشن چیزی فراتر از یک دفترچه یادداشت دیجیتال برای تمرینات قانون جذبه. هدف اصلی «۳×۵ | معجزه‌ی جذب آگاهانه» اینه که به شما کمک کنه تا:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
          <li><strong>احساست رو مدیریت کنی:</strong> یاد بگیری چطور آگاهانه حالت احساسی خودت رو تغییر بدی و از منفی به مثبت حرکت کنی.</li>
          <li><strong>ارتعاشت رو بالا ببری:</strong> با تمرکز بر شکرگزاری و نکات مثبت، فرکانس انرژی خودت رو برای جذب خواسته‌هات تنظیم کنی.</li>
          <li><strong>ذهنت رو برنامه‌ریزی کنی:</strong> عادت‌های ذهنی مثبت بسازی و ضمیر ناخودآگاهت رو برای موفقیت همسو کنی.</li>
          <li><strong>شاهد معجزات باشی:</strong> با استمرار در تمرین، تغییرات مثبت و اتفاقات خوب رو در زندگیت تجربه کنی.</li>
        </ul>
        <p className="font-semibold text-lg gold-text text-center mt-6">
          تو با این اپ، نه فقط تمرین می‌کنی، بلکه ارتعاش می‌سازی. و ارتعاش یعنی آینده‌ای که خودت می‌سازی.
        </p>
      </Card>
      
      <div className="text-center mt-10 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} تمامی حقوق برای {AUTHOR_NAME} محفوظ است.</p>
      </div>
    </div>
  );
};

export default AboutScreen;
