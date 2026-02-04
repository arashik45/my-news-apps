
import React, { useState, useCallback } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Sparkles, 
  Loader2, 
  ChevronRight, 
  ShieldCheck, 
  RefreshCw, 
  LayoutGrid, 
  Edit3, 
  Calendar, 
  Link as LinkIcon, 
  Vote, 
  User 
} from 'lucide-react';
import { FactDotLogo } from './components/FactDotLogo';
import { CATEGORIES } from './constants';
import { ReportType, SubCategory, ReportData, AICheckResult } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'typeSelection' | 'subCategorySelection' | 'editor'>('typeSelection');
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<SubCategory | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AICheckResult | null>(null);

  const [reportData, setReportData] = useState<ReportData>({
    title: '',
    description: '',
    image1: null,
    image2: null,
    date: new Date().toLocaleDateString('bn-BD'),
    person1Name: '',
    person1Title: '',
    person1Quote: '',
    person2Name: '',
    person2Title: '',
    person2Quote: '',
    authorName: '',
    subText: '',
    source: '',
    party1Seats: '০',
    party1MarkerName: 'মার্কার নাম',
    party2Seats: '০',
    party2MarkerName: 'মার্কার নাম',
    candidateName1: 'প্রার্থীর নাম',
    candidateName2: 'প্রার্থীর নাম',
    candidateImage1: null,
    candidateImage2: null
  });

  const isType1News = selectedType === 'type1' && selectedSubCat?.id === 'news_card';
  const isSingleImageType1 = selectedType === 'type1' && selectedSubCat && ['satire', 'rumor', 'fake_claim_1', 'clickbait'].includes(selectedSubCat.id);
  const isSingleImageType2 = selectedType === 'type2' && selectedSubCat && ['misinfo', 'misleading'].includes(selectedSubCat.id);
  const isSingleImageOverall = isSingleImageType1 || isSingleImageType2 || isType1News;
  const isType4 = selectedType === 'type4';
  const isResult1 = isType4 && selectedSubCat?.id === 'result_1';
  const isResult2 = isType4 && selectedSubCat?.id === 'result_2';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ReportData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportData(prev => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalyze = async () => {
    if (!reportData.title && !reportData.description) return;
    
    setIsAIAnalyzing(true);
    try {
      const result = await geminiService.verifyClaim(reportData.title, reportData.description);
      setAiResult(result);
      setReportData(prev => ({
        ...prev,
        title: result.suggestedTitle || prev.title,
        description: result.suggestedDescription || prev.description
      }));
    } catch (err) {
      console.error(err);
      alert("AI এনালাইসিস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  const resetAll = () => {
    setStep('typeSelection');
    setSelectedType(null);
    setSelectedSubCat(null);
    setAiResult(null);
    setReportData({ 
      title: '', description: '', image1: null, image2: null, date: new Date().toLocaleDateString('bn-BD'),
      person1Name: '', person1Title: '', person1Quote: '', person2Name: '', person2Title: '', person2Quote: '', authorName: '', subText: '', source: '',
      party1Seats: '০', party1MarkerName: 'মার্কার নাম', party2Seats: '০', party2MarkerName: 'মার্কার নাম',
      candidateName1: 'প্রার্থীর নাম', candidateName2: 'প্রার্থীর নাম', candidateImage1: null, candidateImage2: null
    });
  };

  const downloadReport = useCallback(() => {
    const preview = document.getElementById('report-preview');
    // @ts-ignore
    if (!preview || !window.html2canvas) {
      alert("সিস্টেম লোড হচ্ছে, আবার চেষ্টা করুন।");
      return;
    }

    setIsProcessing(true);
    // @ts-ignore
    window.html2canvas(preview, {
      scale: 3, 
      useCORS: true,
      backgroundColor: '#FFFFFF',
      logging: false,
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement('a');
      link.download = `FactDot_${selectedSubCat?.label || 'Report'}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsProcessing(false);
    }).catch((err: any) => {
      console.error(err);
      setIsProcessing(false);
      alert("ইমেজ জেনারেট করতে সমস্যা হয়েছে।");
    });
  }, [selectedSubCat]);

  const inputClasses = "w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-900 bg-white placeholder-slate-400 font-medium";
  const textareaClasses = "w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-900 bg-white placeholder-slate-400 font-medium text-lg";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 h-16 flex items-center shadow-sm">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step !== 'typeSelection' && (
              <button 
                onClick={() => step === 'editor' ? setStep('subCategorySelection') : setStep('typeSelection')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={resetAll}>
              <FactDotLogo size={32} className="bg-indigo-50 p-1 rounded-lg" />
              <span className="font-bold text-xl text-indigo-950">FactDot</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {step === 'editor' && (
               <button 
                onClick={resetAll}
                className="text-sm font-semibold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> রিসেট
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
               <ShieldCheck size={16} />
               <span className="text-xs font-bold uppercase tracking-wider">AI Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 md:py-12">
        {step === 'typeSelection' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">আপনার ফ্যাক্ট-চেক রিপোর্ট তৈরি করুন</h1>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                সহজেই প্রফেশনাল রিপোর্ট কার্ড তৈরি করুন যা সোশ্যাল মিডিয়ায় পোস্ট করার জন্য অপ্টিমাইজড।
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(Object.entries(CATEGORIES) as [ReportType, typeof CATEGORIES.type1][]).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => { setSelectedType(key); setStep('subCategorySelection'); }}
                  className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-600 hover:shadow-2xl hover:-translate-y-1 transition-all group text-left relative flex flex-col items-start"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-all duration-300">
                     <LayoutGrid size={32} className="text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{category.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {category.description}
                  </p>
                  <div className="mt-auto flex items-center text-indigo-600 font-bold text-sm">
                    শুরু করুন <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'subCategorySelection' && selectedType && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
             <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900">ক্যাটাগরি নির্বাচন করুন</h2>
              <p className="text-slate-500 font-medium">{CATEGORIES[selectedType].name} এর অন্তর্ভুক্ত টপিকগুলো দেখুন</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES[selectedType].subCats.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedSubCat(cat); setStep('editor'); }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:scale-[1.01] transition-all flex items-center gap-5 group"
                >
                  <span className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors shadow-sm">{cat.icon}</span>
                  <span className="font-bold text-lg text-slate-800">{cat.label}</span>
                  <ChevronRight size={20} className="ml-auto text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'editor' && selectedType && selectedSubCat && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-xl border-slate-200 space-y-6 lg:sticky lg:top-24 h-fit max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                   <Edit3 size={24} className="text-indigo-600" /> তথ্য ইনপুট
                 </h2>
                 <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {selectedSubCat.label}
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">তারিখ</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="তারিখ লিখুন..."
                        className={`${inputClasses} pl-12`}
                        value={reportData.date} 
                        onChange={(e) => setReportData({...reportData, date: e.target.value})} 
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>
                </div>

                {(isResult1 || isResult2) ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">আসন নাম (যেমন: সংসদীয় আসন নড়াইল-২)</label>
                      <input 
                        type="text" 
                        placeholder={isResult2 ? "যেমন: সংসদীয় আসন (নড়াইল-২)" : "যেমন: সদ্য প্রাপ্ত (বাংলাদেশ)"}
                        className={`${inputClasses} text-lg`}
                        value={reportData.title} 
                        onChange={(e) => setReportData({...reportData, title: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                        <label className="block text-[10px] font-black uppercase text-blue-800 tracking-tighter">প্রার্থী ১ তথ্য</label>
                        <input type="text" className={inputClasses} placeholder="প্রার্থীর নাম..." value={reportData.candidateName1} onChange={(e) => setReportData({...reportData, candidateName1: e.target.value})} />
                        <input type="text" className={inputClasses} placeholder="ভোট সংখ্যা..." value={reportData.party1Seats} onChange={(e) => setReportData({...reportData, party1Seats: e.target.value})} />
                        <input type="text" className={inputClasses} placeholder="মার্কার নাম..." value={reportData.party1MarkerName} onChange={(e) => setReportData({...reportData, party1MarkerName: e.target.value})} />
                        
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">মার্কার ছবি</span>
                           <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-white hover:border-blue-300 overflow-hidden relative group">
                              {reportData.image1 ? <img src={reportData.image1} className="w-full h-full object-contain" alt="Marker 1" /> : <Upload size={20} className="text-slate-300" />}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image1')} />
                           </label>
                        </div>
                      </div>

                      <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100 space-y-4">
                        <label className="block text-[10px] font-black uppercase text-red-800 tracking-tighter">প্রার্থী ২ তথ্য</label>
                        <input type="text" className={inputClasses} placeholder="প্রার্থীর নাম..." value={reportData.candidateName2} onChange={(e) => setReportData({...reportData, candidateName2: e.target.value})} />
                        <input type="text" className={inputClasses} placeholder="ভোট সংখ্যা..." value={reportData.party2Seats} onChange={(e) => setReportData({...reportData, party2Seats: e.target.value})} />
                        <input type="text" className={inputClasses} placeholder="মার্কার নাম..." value={reportData.party2MarkerName} onChange={(e) => setReportData({...reportData, party2MarkerName: e.target.value})} />
                        
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">মার্কার ছবি</span>
                           <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-white hover:border-red-300 overflow-hidden relative group">
                              {reportData.image2 ? <img src={reportData.image2} className="w-full h-full object-contain" alt="Marker 2" /> : <Upload size={20} className="text-slate-300" />}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image2')} />
                           </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {isType1News && (
                        <div>
                          <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">COURTESY (সোর্স)</label>
                          <input 
                            type="text" 
                            placeholder="যেমন: RUPALIBANGLADESH"
                            className={`${inputClasses} uppercase`} 
                            value={reportData.source} 
                            onChange={(e) => setReportData({...reportData, source: e.target.value})} 
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">শিরোনাম / নিউজ টেক্সট</label>
                        <textarea 
                          rows={6} 
                          placeholder="নিউজ বা খবরের বিস্তারিত টেক্সট দিন..."
                          className={textareaClasses} 
                          value={reportData.description} 
                          onChange={(e) => setReportData({...reportData, description: e.target.value})} 
                        />
                      </div>
                      
                      {isType1News && (
                        <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-4">
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">প্রবক্তা / প্রার্থীর তথ্য</label>
                          <input type="text" className={inputClasses} placeholder="নাম (যেমন: ড. মাহদী আমিন)..." value={reportData.person1Name} onChange={(e) => setReportData({...reportData, person1Name: e.target.value})} />
                          <input type="text" className={inputClasses} placeholder="পদবি/বিবরণ..." value={reportData.person1Title} onChange={(e) => setReportData({...reportData, person1Title: e.target.value})} />
                        </div>
                      )}

                      {selectedType === 'type3' && (
                        <div className="space-y-6">
                          <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm space-y-4">
                            <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-2">ব্যক্তি ১ (বাম পাশ)</h4>
                            <input type="text" className={inputClasses} placeholder="নাম..." value={reportData.person1Name} onChange={(e) => setReportData({...reportData, person1Name: e.target.value})} />
                            <input type="text" className={inputClasses} placeholder="পদবি/বিবরণ..." value={reportData.person1Title} onChange={(e) => setReportData({...reportData, person1Title: e.target.value})} />
                            <textarea className={textareaClasses} placeholder="বক্তব্য..." value={reportData.person1Quote} onChange={(e) => setReportData({...reportData, person1Quote: e.target.value})} />
                          </div>
                          <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                            <h4 className="font-bold text-indigo-800 text-sm flex items-center gap-2">ব্যক্তি ২ (ডান পাশ)</h4>
                            <input type="text" className={inputClasses} placeholder="নাম..." value={reportData.person2Name} onChange={(e) => setReportData({...reportData, person2Name: e.target.value})} />
                            <input type="text" className={inputClasses} placeholder="পদবি/বিবরণ..." value={reportData.person2Title} onChange={(e) => setReportData({...reportData, person2Title: e.target.value})} />
                            <textarea className={textareaClasses} placeholder="বক্তব্য..." value={reportData.person2Quote} onChange={(e) => setReportData({...reportData, person2Quote: e.target.value})} />
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedType !== 'type3' && !isType1News && (
                      <div className="pt-4 border-t">
                        <button 
                          onClick={handleAIAnalyze}
                          disabled={isAIAnalyzing || (!reportData.title && !reportData.description)}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:grayscale"
                        >
                          {isAIAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                          AI দিয়ে ভেরিফাই করুন
                        </button>
                      </div>
                    )}

                    {!isType4 && (
                      <div className={`grid ${isSingleImageOverall ? 'grid-cols-1' : 'grid-cols-2'} gap-4 pt-4`}>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-400">{isType1News ? 'প্রার্থীর ছবি' : 'ছবি ১'}</label>
                          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-white hover:border-indigo-300 transition-all overflow-hidden relative group">
                            {reportData.image1 ? (
                              <>
                                <img src={reportData.image1} className="w-full h-full object-contain" alt="Image 1" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Upload className="text-white" size={24} />
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-slate-400">
                                 <Upload size={24} />
                                 <span className="text-[10px] font-bold">আপলোড</span>
                              </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image1')} />
                          </label>
                        </div>
                        {!isSingleImageOverall && (
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400">ছবি ২</label>
                            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-white hover:border-indigo-300 transition-all overflow-hidden relative group">
                              {reportData.image2 ? (
                                <>
                                  <img src={reportData.image2} className="w-full h-full object-contain" alt="Image 2" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload className="text-white" size={24} />
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                   <Upload size={24} />
                                   <span className="text-[10px] font-bold">আপলোড</span>
                                </div>
                              )}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image2')} />
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-center space-y-8 w-full">
              <div 
                id="report-preview" 
                className={`w-full max-w-[400px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] relative flex flex-col ${isType1News ? 'bg-[#fcfdf8]' : 'bg-white border border-slate-200'}`}
                style={{ height: '500px' }}
              >
                  {selectedType !== 'type3' && !isType1News && (
                    selectedType === 'type1' ? (
                      selectedSubCat.id === 'factcheck' ? (
                        <div className="w-full h-16 flex z-20">
                           <div className="flex-1 bg-[#b91c1c] flex items-center justify-center border-r border-white/20">
                              <h4 className="text-white text-2xl font-black uppercase tracking-widest">গুজব</h4>
                           </div>
                           <div className="flex-1 bg-[#057a44] flex items-center justify-center">
                              <h4 className="text-white text-2xl font-black uppercase tracking-widest">মূল ঘটনা</h4>
                           </div>
                        </div>
                      ) : (
                        <div style={{ backgroundColor: selectedSubCat.color }} className="w-full h-14 flex items-center justify-center relative z-20">
                           <h4 className="text-white text-3xl font-black uppercase tracking-widest">{selectedSubCat.label}</h4>
                        </div>
                      )
                    ) : (isResult1 || isResult2) ? (
                        <div className="w-full h-16 bg-[#1e3a8a] flex items-center justify-center relative z-20">
                           <h4 className="text-white text-[32px] font-black uppercase tracking-widest">নির্বাচনী ফলাফল ২০২৬</h4>
                        </div>
                    ) : (
                      <div style={{ backgroundColor: selectedSubCat.color }} className="w-full h-14 flex items-center justify-center relative z-20">
                         <h4 className="text-white text-[24px] font-black uppercase tracking-widest">{selectedSubCat.label}</h4>
                      </div>
                    )
                  )}

                  <div className="flex-1 flex flex-col overflow-hidden relative">
                      {!isType1News && (
                        <div className="absolute top-2 right-4 z-30">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{reportData.date}</span>
                        </div>
                      )}

                      {isType1News ? (
                        <div className="flex-1 flex flex-col relative p-6">
                           <div className="flex justify-between items-start w-full mb-8">
                              <div className="flex items-center gap-1.5">
                                 <div className="bg-[#057a44] p-1 rounded-md">
                                    <FactDotLogo size={20} className="stroke-white" />
                                 </div>
                                 <span className="text-[18px] font-black tracking-tighter text-[#057a44]">FactDot</span>
                              </div>
                              <div className="text-right flex flex-col border-l border-slate-200 pl-3">
                                 <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">COURTESY: {reportData.source || 'SOURCE'}</span>
                                 <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">{reportData.date}</span>
                              </div>
                           </div>
                           <div className="flex-1 z-10">
                              <p className="text-[20px] font-bold text-slate-800 leading-[1.4] text-left pr-12">
                                 {reportData.description || 'খবরের বিস্তারিত টেক্সট এখানে প্রদর্শিত হবে।'}
                              </p>
                           </div>
                           <div className="absolute bottom-12 left-6 z-20 space-y-0.5 max-w-[200px]">
                              <span className="text-[16px] font-black text-slate-900 block leading-tight">- {reportData.person1Name || 'প্রবক্তার নাম'}</span>
                              <span className="text-[9px] font-bold text-slate-500 block leading-snug">{reportData.person1Title || 'প্রবক্তার পদবি বা বিবরণ'}</span>
                           </div>
                           <div className="absolute bottom-0 right-0 w-[55%] h-[60%] z-10 flex items-end">
                              {reportData.image1 ? (
                                <img src={reportData.image1} className="w-full h-full object-contain object-bottom" style={{ maskImage: 'linear-gradient(to top, transparent 0%, black 15%)', WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)' }} />
                              ) : (
                                <div className="w-full h-full bg-slate-100/50 flex items-center justify-center border-l border-t border-slate-100 rounded-tl-3xl opacity-20">
                                   <User size={64} className="text-slate-300" />
                                </div>
                              )}
                           </div>
                           <div className="absolute bottom-0 left-0 w-full h-[15%] bg-gradient-to-t from-green-50/50 to-transparent z-0 opacity-50"></div>
                        </div>
                      ) : isResult1 ? (
                        <div className="flex-1 flex flex-col p-4 space-y-6">
                           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-center">
                              <h2 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight">{reportData.title || "সদ্য প্রাপ্ত (বাংলাদেশ)"}</h2>
                           </div>
                           <div className="grid grid-cols-2 gap-8 flex-1 mt-2">
                              <div className="flex flex-col items-center space-y-4">
                                 <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                    {reportData.image1 ? <img src={reportData.image1} className="max-w-full max-h-full object-contain" /> : <Vote className="text-slate-200" size={40} />}
                                 </div>
                                 <div className="text-center space-y-1">
                                    <span className="text-[18px] font-black text-slate-900 block leading-tight">{reportData.party1MarkerName || 'মার্কার নাম'}</span>
                                    <div className="pt-2 border-t border-slate-100 mt-2">
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">আসন সংখ্যা</span>
                                       <span className="text-[48px] font-black text-[#1e3a8a] leading-none">{reportData.party1Seats || '০'}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-center space-y-4">
                                 <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                    {reportData.image2 ? <img src={reportData.image2} className="max-w-full max-h-full object-contain" /> : <Vote className="text-slate-200" size={40} />}
                                 </div>
                                 <div className="text-center space-y-1">
                                    <span className="text-[18px] font-black text-slate-900 block leading-tight">{reportData.party2MarkerName || 'মার্কার নাম'}</span>
                                    <div className="pt-2 border-t border-slate-100 mt-2">
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">আসন সংখ্যা</span>
                                       <span className="text-[48px] font-black text-[#dc2626] leading-none">{reportData.party2Seats || '০'}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ) : isResult2 ? (
                        <div className="flex-1 flex flex-col p-4 space-y-4">
                           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-center w-full">
                              <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">{reportData.title || "নড়াইল-২"}</h2>
                           </div>
                           <div className="flex-1 grid grid-cols-2 gap-px bg-slate-100 mt-2">
                              <div className="bg-white flex flex-col items-center justify-center p-4 space-y-6">
                                 <h3 className="text-[18px] font-black text-slate-900 text-center leading-tight h-10 flex items-center">{reportData.candidateName1 || 'প্রার্থীর নাম'}</h3>
                                 <div className="flex flex-col items-center justify-center space-y-1">
                                    <span className="text-[42px] font-black text-[#1e3a8a] leading-none drop-shadow-sm">{reportData.party1Seats || '০'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ভোট/আসন</span>
                                    <span className="text-[16px] font-black text-slate-800 tracking-tight pt-2">{reportData.party1MarkerName || 'মার্কার'}</span>
                                 </div>
                                 <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                                    {reportData.image1 ? <img src={reportData.image1} className="max-w-[80%] max-h-[80%] object-contain" /> : <Vote size={32} className="text-slate-200" />}
                                 </div>
                              </div>
                              <div className="bg-white flex flex-col items-center justify-center p-4 space-y-6">
                                 <h3 className="text-[18px] font-black text-slate-900 text-center leading-tight h-10 flex items-center">{reportData.candidateName2 || 'প্রার্থীর নাম'}</h3>
                                 <div className="flex flex-col items-center justify-center space-y-1">
                                    <span className="text-[42px] font-black text-[#dc2626] leading-none drop-shadow-sm">{reportData.party2Seats || '০'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ভোট/আসন</span>
                                    <span className="text-[16px] font-black text-slate-800 tracking-tight pt-2">{reportData.party2MarkerName || 'মার্কার'}</span>
                                 </div>
                                 <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                                    {reportData.image2 ? <img src={reportData.image2} className="max-w-[80%] max-h-[80%] object-contain" /> : <Vote size={32} className="text-slate-200" />}
                                 </div>
                              </div>
                           </div>
                        </div>
                      ) : isSingleImageOverall ? (
                        <div className="flex-1 flex flex-col h-full">
                            <div className="h-1/2 bg-white flex items-center justify-center overflow-hidden">
                                {reportData.image1 ? <img src={reportData.image1} className="w-full h-full object-contain p-2" alt="Screenshot" /> : <div className="text-slate-100 font-black text-4xl italic">IMAGE</div>}
                            </div>
                            <div className="h-1/2 flex items-center justify-center px-6 bg-slate-50/30">
                                <h2 className="text-[26px] font-black text-[#b91c1c] leading-[1.2] text-center drop-shadow-sm line-clamp-4">{reportData.title || 'শিরোনাম এখানে দেখা যাবে'}</h2>
                            </div>
                        </div>
                      ) : selectedType === 'type1' ? (
                        <div className="flex-1 flex flex-col p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4 h-[55%]">
                              <div className="bg-white p-1 rounded-sm shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                  {reportData.image1 ? <img src={reportData.image1} className="max-w-full max-h-full object-contain" alt="Screenshot 1" /> : <div className="text-slate-100 font-black text-4xl italic">IMG 1</div>}
                              </div>
                              <div className="bg-white p-1 rounded-sm shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                  {reportData.image2 ? <img src={reportData.image2} className="max-w-full max-h-full object-contain" alt="Screenshot 2" /> : <div className="text-slate-100 font-black text-4xl italic">IMG 2</div>}
                              </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-center items-center px-4">
                              <h2 className="text-[22px] font-black text-[#b91c1c] leading-[1.2] text-center drop-shadow-sm line-clamp-3">{reportData.title || 'শিরোনাম এখানে দেখা যাবে'}</h2>
                          </div>
                        </div>
                      ) : selectedType === 'type4' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 p-6">
                            <div className="bg-white p-8 rounded-2xl shadow-xl border-y-4 border-slate-900 w-full">
                               <h2 className="text-[28px] font-black leading-tight text-slate-900">{reportData.title || 'শিরোনাম এখানে দেখা যাবে'}</h2>
                               {reportData.source && <div className="mt-4 pt-3 border-t border-slate-100"><p className="text-slate-500 text-sm font-bold">সোর্স: {reportData.source}</p></div>}
                            </div>
                        </div>
                      ) : selectedType === 'type3' ? (
                        <div className="flex-1 flex h-full">
                            <div className="flex-1 flex flex-col relative" style={{ backgroundColor: selectedSubCat.color }}>
                                <div className="absolute top-2 left-4"><FactDotLogo size={24} className="bg-white/20 p-1 rounded" /></div>
                                <div className="p-4 pt-10 text-white flex flex-col flex-1 space-y-4">
                                   <h2 className="text-[18px] font-bold leading-snug drop-shadow-sm">{reportData.person1Quote || 'উক্তি বা বক্তব্য এখানে থাকবে...'}</h2>
                                   <div className="flex flex-col">
                                      <span className="text-xs font-black opacity-90 border-t border-white/20 pt-2">- {reportData.person1Name || 'নাম ১'}</span>
                                      <span className="text-[10px] opacity-70 font-bold uppercase">{reportData.person1Title || 'পদবি ১'}</span>
                                   </div>
                                </div>
                                <div className="h-[40%] w-full flex items-end">
                                   {reportData.image1 ? <img src={reportData.image1} className="w-full h-full object-contain object-bottom" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Edit3 size={40} className="text-white" /></div>}
                                </div>
                            </div>
                            <div className="flex-1 bg-white flex flex-col border-l border-slate-100 relative">
                                <div className="p-4 pt-10 text-slate-900 flex flex-col flex-1 space-y-4">
                                   <h2 className="text-[18px] font-bold leading-snug">{reportData.person2Quote || 'উক্তি বা বক্তব্য এখানে থাকবে...'}</h2>
                                   <div className="flex flex-col">
                                      <span className="text-xs font-black text-red-600 border-t border-slate-100 pt-2">- {reportData.person2Name || 'নাম ২'}</span>
                                      <span className="text-[10px] text-slate-400 font-bold uppercase">{reportData.person2Title || 'পদবি ২'}</span>
                                   </div>
                                </div>
                                <div className="h-[40%] w-full flex items-end">
                                   {reportData.image2 ? <img src={reportData.image2} className="w-full h-full object-contain object-bottom" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Edit3 size={40} className="text-slate-300" /></div>}
                                </div>
                                <div className="absolute bottom-2 right-2"><FactDotLogo size={20} className="opacity-20" /></div>
                            </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col space-y-4 p-4">
                            <div className={`grid ${(!isSingleImageOverall && selectedType === 'type2') ? 'grid-cols-2 gap-3' : 'grid-cols-1'} h-[45%]`}>
                                <div className="bg-white p-1 rounded-xl shadow-md border border-slate-100 overflow-hidden relative flex items-center justify-center">
                                    {reportData.image1 ? <img src={reportData.image1} className="max-w-full max-h-full object-contain" alt="Report Img 1" /> : <div className="text-slate-100 font-black text-2xl">IMG 1</div>}
                                    {selectedType === 'type2' && !isSingleImageOverall && <div className="absolute top-1 left-1 bg-red-600 text-white text-[7px] font-black px-1.5 rounded">দাবি</div>}
                                </div>
                                {selectedType === 'type2' && !isSingleImageOverall && (
                                  <div className="bg-white p-1 rounded-xl shadow-md border border-slate-100 overflow-hidden relative flex items-center justify-center">
                                      {reportData.image2 ? <img src={reportData.image2} className="max-w-full max-h-full object-contain" alt="Report Img 2" /> : <div className="text-slate-100 font-black text-2xl">IMG 2</div>}
                                      <div className="absolute top-1 left-1 bg-green-600 text-white text-[7px] font-black px-1.5 rounded">বাস্তবতা</div>
                                  </div>
                                )}
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-50 flex-1 flex flex-col justify-center space-y-2">
                                <h2 style={{ color: selectedType === 'type2' ? '#b91c1c' : selectedSubCat.color }} className="text-[20px] font-black leading-tight text-center">{reportData.title || 'রিপোর্টের শিরোনাম এখানে লিখুন'}</h2>
                                <p className="text-slate-700 text-[13px] leading-relaxed font-bold italic text-center opacity-80 line-clamp-3">{reportData.description || 'রিপোর্টের বিস্তারিত ব্যাখ্যা এখানে থাকবে।'}</p>
                            </div>
                        </div>
                      )}
                  </div>
                  {!isType1News && (
                    <div className="w-full h-14 bg-[#FFD700] flex flex-col items-center justify-center border-t border-black/5 relative z-30">
                       <span className="text-[14px] font-black tracking-widest text-black">FACTDOT</span>
                       <span className="text-[8px] font-bold text-black/60 uppercase tracking-[0.2em]">www.factdot.com</span>
                    </div>
                  )}
                  {isType1News && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 opacity-10">
                       <span className="text-[8px] font-black tracking-widest text-slate-400">FACTDOT REPORT</span>
                    </div>
                  )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-[400px]">
                <button 
                  onClick={downloadReport} 
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-black transition-all disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
                  {isProcessing ? 'ডাউনলোড হচ্ছে...' : 'HD ইমেজ ডাউনলোড'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-12 text-center border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 flex flex-col items-center gap-2">
           <FactDotLogo size={32} className="grayscale opacity-30" />
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] italic">© FactDot 2026</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.6s ease-out forwards; }
      ` }} />
    </div>
  );
};

export default App;
