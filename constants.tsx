
import React from 'react';
import { AlertCircle, Info, ImageIcon, MessageSquare, Quote, Zap, ShieldCheck, BarChart3, Users, Newspaper } from 'lucide-react';
import { ReportCategory, ReportType } from './types';

export const CATEGORIES: Record<ReportType, ReportCategory> = {
  type1: {
    name: 'ফটোকার্ড স্টাইল (Type 1)',
    description: 'স্ক্রিনশট কোলাজ ও ফটোকার্ড। সোশ্যাল মিডিয়া পোস্ট বা একক ছবির ফ্যাক্ট চেক।',
    subCats: [
      { id: 'news_card', label: 'নিউজ', color: '#057a44', icon: <Newspaper size={20} className="text-green-600" /> },
      { id: 'factcheck', label: 'ফ্যাক্টচেক', color: '#b91c1c', icon: <ShieldCheck size={20} className="text-indigo-600" /> },
      { id: 'fake_prop', label: 'বিকৃত প্রচার', color: '#b91c1c', icon: <AlertCircle size={20} className="text-red-600" /> },
      { id: 'satire', label: 'ঠাট্টা / ব্যঙ্গ', color: '#1d4ed8', icon: <Info size={20} className="text-blue-600" /> },
      { id: 'rumor', label: 'গুজব', color: '#b91c1c', icon: <AlertCircle size={20} className="text-red-600" /> },
      { id: 'fake_claim_1', label: 'ভুয়া দাবি', color: '#b91c1c', icon: <AlertCircle size={20} className="text-red-800" /> },
      { id: 'clickbait', label: 'চমকপ্রদ শিরোনাম', color: '#d97706', icon: <ImageIcon size={20} className="text-amber-600" /> }
    ]
  },
  type2: {
    name: 'তুলনামূলক লেআউট (Type 2)',
    description: 'দাবি বনাম প্রকৃত তথ্য। দুই পাশের ছবির মাধ্যমে পার্থক্য তুলে ধরুন।',
    subCats: [
      { id: 'fake_claim_2', label: 'দাবি বনাম সত্য', color: '#0f172a', icon: <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-red-600"></div><div className="w-1.5 h-3 bg-green-600"></div></div> },
      { id: 'edited_video', label: 'এডিট করা ভিডিও', color: '#0d9488', icon: <ImageIcon size={20} className="text-teal-600" /> },
      { id: 'misinfo', label: 'ভুল তথ্য বিশ্লেষণ', color: '#be123c', icon: <AlertCircle size={20} className="text-rose-700" /> },
      { id: 'misleading', label: 'বিভ্রান্তিকর ব্যাখ্যা', color: '#4338ca', icon: <Info size={20} className="text-indigo-700" /> }
    ]
  },
  type3: {
    name: 'উদ্ধৃতি তুলনা (Type 3)',
    description: 'বক্তব্য তুলনা। দুইজন ব্যক্তির বক্তব্য পাশাপাশি দেখানোর জন্য।',
    subCats: [
      { id: 'statement_cmp', label: 'বক্তব্য তুলনা', color: '#057a44', icon: <MessageSquare size={20} className="text-emerald-700" /> },
      { id: 'quote_cmp', label: 'উদ্ধৃতি তুলনা', color: '#3b3b5e', icon: <Quote size={20} className="text-slate-600" /> }
    ]
  },
  type4: {
    name: 'নিউজ কার্ড (Type 4)',
    description: 'ব্রেকিং নিউজ ও সর্বশেষ আপডেট। জরুরি তথ্যের জন্য ব্যবহৃত হয়।',
    subCats: [
      { id: 'breaking', label: 'ব্রেকিং নিউজ', color: '#b91c1c', icon: <Zap size={20} className="text-red-600" /> },
      { id: 'latest', label: 'সর্বশেষ সংবাদ', color: '#b91c1c', icon: <Info size={20} className="text-red-600" /> },
      { id: 'result_1', label: 'ফলাফল-১', color: '#1e3a8a', icon: <BarChart3 size={20} className="text-blue-700" /> },
      { id: 'result_2', label: 'ফলাফল-২', color: '#1e3a8a', icon: <Users size={20} className="text-blue-700" /> }
    ]
  }
};
