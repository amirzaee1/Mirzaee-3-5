
import React from 'react';
import TabComponent from '../components/TabComponent';
import { TabItem } from '../types';
import { LEARN_TAB1_CONTENT } from '../constants';
import { ThumbsUp, Star, Gift, CheckCircle, Brain, Target, Clock, Edit } from 'lucide-react';
import Card from '../components/Card';

const LearnExerciseScreen: React.FC = () => {
  const tabs: TabItem[] = [
    {
      id: 'what-is',
      title: 'چی هست تمرین ۳×۵؟',
      content: (
        <div className="prose prose-invert prose-p:font-vazir prose-headings:font-estedad max-w-none text-right leading-relaxed space-y-4 p-4">
          <p>{LEARN_TAB1_CONTENT}</p>
        </div>
      ),
    },
    {
      id: 'pillars',
      title: '۳ ستون تمرین چی هستن؟',
      content: (
        <div className="space-y-6 p-4">
          <Card title="۱. پنج بار تغییر احساس عمدی" icon={<ThumbsUp className="text-blue-400" />} className="border-blue-500">
            <p>در طول روز، پنج بار آگاهانه احساست رو از بد یا خنثی، به خوب تغییر بده. هر بار که موفق شدی، با افتخار به خودت بگو "ایول به خودم!". می‌تونی با دکمه شمارنده در بخش تمرین روزانه ثبتش کنی.</p>
          </Card>
          <Card title="۲. پنج اتفاق خوب روزانه" icon={<Star className="text-yellow-400" />} className="border-yellow-500">
            <p>به اتفاقات مثبت اطرافت توجه کن، هرچقدر هم کوچیک باشن. شب، پنج تا از بهترین‌ها رو در بخش مربوطه بنویس. این کار ذهن تو رو برای دیدن زیبایی‌ها شرطی می‌کنه.</p>
          </Card>
          <Card title="۳. پنج شکرگزاری صبحگاهی" icon={<Gift className="text-green-400" />} className="border-green-500">
            <p>صبح روز بعد، این سه مرحله رو انجام بده:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>ایول به خودم بابت ۵ تغییر احساس دیروز.</li>
              <li>مرور لیست پنج اتفاق خوب دیروز.</li>
              <li>نوشتن پنج شکرگزاری تازه و جدید برای نعمت‌هایی که داری (هر روز متفاوت).</li>
            </ul>
            <p className="mt-2">این بخش خیلی مهمه چون ارتعاش قدرتمندی برای شروع روزت ایجاد می‌کنه.</p>
          </Card>
        </div>
      ),
    },
    {
      id: 'why-it-works',
      title: 'چرا جواب می‌ده؟',
      content: (
        <div className="space-y-4 p-4">
          <div className="flex items-start space-x-3 space-x-reverse">
            <CheckCircle className="text-purple-400 mt-1 flex-shrink-0" size={24}/>
            <div>
                <h4 className="font-semibold text-lg gold-text">تمرکز روی فراوانی</h4>
                <p>با توجه آگاهانه به نکات مثبت و شکرگزاری، فرکانس ذهنی خودت رو روی فراوانی و داشته‌ها تنظیم می‌کنی، نه کمبودها.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 space-x-reverse">
            <Brain className="text-purple-400 mt-1 flex-shrink-0" size={24}/>
            <div>
                <h4 className="font-semibold text-lg gold-text">شرطی‌سازی مثبت مغز</h4>
                <p>تکرار این تمرین باعث ایجاد مسیرهای عصبی جدید در مغزت می‌شه و به‌طور خودکار تمایل بیشتری به دیدن خوبی‌ها و احساسات مثبت پیدا می‌کنی.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 space-x-reverse">
            <Target className="text-purple-400 mt-1 flex-shrink-0" size={24}/>
            <div>
                <h4 className="font-semibold text-lg gold-text">فعال‌سازی ضمیر ناخودآگاه</h4>
                <p>ضمیر ناخودآگاهت با دریافت پیام‌های مثبت و احساسات خوب، برای جذب خواسته‌ها و اهدافت فعال‌تر می‌شه.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'important-notes',
      title: 'نکات مهم',
      content: (
         <div className="space-y-4 p-4">
          <div className="flex items-start space-x-3 space-x-reverse">
            <Target className="text-yellow-400 mt-1 flex-shrink-0" size={24}/>
            <div>
                <h4 className="font-semibold text-lg gold-text">استمرار ۴۰ روزه</h4>
                <p>برای نتایج عمیق و پایدار، این تمرین رو حداقل ۴۰ روز بدون وقفه انجام بده. اگه یک روز جا انداختی، از اول شروع کن.</p>
            </div>
          </div>
           <div className="flex items-start space-x-3 space-x-reverse">
            <Edit className="text-yellow-400 mt-1 flex-shrink-0" size={24}/>
            <div>
                <h4 className="font-semibold text-lg gold-text">نوشتن با حس واقعی</h4>
                <p>موقع نوشتن، خصوصاً شکرگزاری‌ها، سعی کن احساس واقعی اون نعمت رو در وجودت لمس کنی. صرفاً نوشتن کلمات کافی نیست.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 space-x-reverse">
            <Clock className="text-yellow-400 mt-1 flex-shrink-0" size={24}/>
            <div>
                <h4 className="font-semibold text-lg gold-text">داشتن ساعت ثابت (اختیاری ولی موثر)</h4>
                <p>اگه بتونی تمرین رو هر روز حدود یک ساعت مشخص انجام بدی، به ایجاد عادت و نظم ذهنی کمک می‌کنه.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 space-x-reverse">
            <Gift className="text-yellow-400 mt-1 flex-shrink-0" size={24}/>
            <div>
                <h4 className="font-semibold text-lg gold-text">نوشتن شکرگزاری جدید هر روز</h4>
                <p>سعی کن هر روز برای ۵ چیز جدید شکرگزاری کنی. این کار خلاقیتت رو در دیدن نعمت‌ها افزایش می‌ده و از تکراری شدن جلوگیری می‌کنه.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fadeInRight">
      <h2 className="text-3xl font-estedad gold-text mb-6 pb-2 border-b-2 border-purple-500">آموزش تمرین ۳×۵</h2>
      <TabComponent tabs={tabs} />
    </div>
  );
};

export default LearnExerciseScreen;
