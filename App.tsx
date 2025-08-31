
import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PrimaryRole, MainTask, PreferredDesign, GeneratedQuestion } from './types';
import { PRIMARY_ROLES, MAIN_TASKS, PREFERRED_DESIGNS } from './constants';
import { generateQuestions } from './services/geminiService';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { Select } from './components/Select';
import { TagInput } from './components/TagInput';
import { Slider } from './components/Slider';
import { Toggle } from './components/Toggle';
import { Button } from './components/Button';
import { OutputCard } from './components/OutputCard';
import { Footer } from './components/Footer';
import { Copy, Download, RotateCcw, Send, LoaderCircle } from './components/icons';

const App: React.FC = () => {
  const [researchIdea, setResearchIdea] = useLocalStorage('researchIdea', 'Investigating the correlation between sleep patterns and academic performance in university students using wearable sensor data.');
  const [primaryRole, setPrimaryRole] = useLocalStorage<PrimaryRole>('primaryRole', PrimaryRole.Researcher);
  const [mainTask, setMainTask] = useLocalStorage<MainTask>('mainTask', MainTask.GenerateResearchQuestion);
  const [exposure, setExposure] = useLocalStorage('exposure', 'Nightly sleep duration (hours)');
  const [outcome, setOutcome] = useLocalStorage('outcome', 'Grade Point Average (GPA)');
  const [population, setPopulation] = useLocalStorage('population', 'Full-time university students');
  const [timeframe, setTimeframe] = useLocalStorage('timeframe', 'One academic semester');
  const [dataSource, setDataSource] = useLocalStorage('dataSource', 'Wearable sensors and university records');
  const [covariates, setCovariates] = useLocalStorage<string[]>('covariates', ['Study hours', 'Caffeine intake', 'Stress levels']);
  const [preferredDesign, setPreferredDesign] = useLocalStorage<PreferredDesign>('preferredDesign', PreferredDesign.FixedEffects);
  const [lagDays, setLagDays] = useLocalStorage('lagDays', 7);
  const [objectiveTone, setObjectiveTone] = useLocalStorage('objectiveTone', true);

  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const isCausalityMode = mainTask === MainTask.InvestigateCausality;

  const resetAllFields = useCallback(() => {
    setResearchIdea('');
    setPrimaryRole(PrimaryRole.Researcher);
    setMainTask(MainTask.GenerateResearchQuestion);
    setExposure('');
    setOutcome('');
    setPopulation('');
    setTimeframe('');
    setDataSource('');
    setCovariates([]);
    setPreferredDesign(PreferredDesign.FixedEffects);
    setLagDays(7);
    setObjectiveTone(true);
    setGeneratedQuestions([]);
    setError(null);
  }, [setResearchIdea, setPrimaryRole, setMainTask, setExposure, setOutcome, setPopulation, setTimeframe, setDataSource, setCovariates, setPreferredDesign, setLagDays, setObjectiveTone]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedQuestions([]);
    try {
      const formData = { researchIdea, primaryRole, mainTask, exposure, outcome, population, timeframe, dataSource, covariates, preferredDesign, lagDays, objectiveTone };
      const questions = await generateQuestions(formData);
      setGeneratedQuestions(questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatForMarkdown = () => {
    return generatedQuestions.map(q => `- **${primaryRole} / ${mainTask} / ${objectiveTone ? 'Objective' : 'Inquisitive'}**: ${q.question}`).join('\n');
  };

  const copyToClipboard = () => {
    if (generatedQuestions.length > 0) {
      navigator.clipboard.writeText(formatForMarkdown()).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  const downloadAsMarkdown = () => {
    if (generatedQuestions.length > 0) {
      const markdownContent = formatForMarkdown();
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'research_questions.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <Header isCausalityMode={isCausalityMode} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column: Inputs */}
          <div className="space-y-8">
            <InputSection title="1. Topic & Core Task">
              <div className="space-y-4">
                <label htmlFor="research-idea" className="block text-sm font-medium text-gray-700">Research Idea</label>
                <textarea
                  id="research-idea"
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition"
                  placeholder="e.g., Investigating the correlation between..."
                  value={researchIdea}
                  onChange={(e) => setResearchIdea(e.target.value)}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Primary Role" value={primaryRole} options={PRIMARY_ROLES} onChange={e => setPrimaryRole(e.target.value as PrimaryRole)} />
                  <Select label="Main Task" value={mainTask} options={MAIN_TASKS} onChange={e => setMainTask(e.target.value as MainTask)} />
                </div>
              </div>
            </InputSection>

            <InputSection title="2. Study Scaffolding">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exposure" className="block text-sm font-medium text-gray-700">Exposure</label>
                  <input type="text" id="exposure" value={exposure} onChange={e => setExposure(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label htmlFor="outcome" className="block text-sm font-medium text-gray-700">Outcome</label>
                  <input type="text" id="outcome" value={outcome} onChange={e => setOutcome(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label htmlFor="population" className="block text-sm font-medium text-gray-700">Population</label>
                  <input type="text" id="population" value={population} onChange={e => setPopulation(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">Timeframe</label>
                  <input type="text" id="timeframe" value={timeframe} onChange={e => setTimeframe(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="md:col-span-2">
                   <label htmlFor="dataSource" className="block text-sm font-medium text-gray-700">Data Source</label>
                   <input type="text" id="dataSource" value={dataSource} onChange={e => setDataSource(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="md:col-span-2">
                  <TagInput label="Covariates" tags={covariates} setTags={setCovariates} />
                </div>
              </div>
            </InputSection>
            
            <InputSection title="3. Analytic Strategy">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <Select label="Preferred Design" value={preferredDesign} options={PREFERRED_DESIGNS} onChange={e => setPreferredDesign(e.target.value as PreferredDesign)} />
                <Slider label="Lag Days" value={lagDays} setValue={setLagDays} min={0} max={28} />
                <div className="flex items-center space-x-2">
                  <Toggle enabled={objectiveTone} setEnabled={setObjectiveTone} />
                  <span className="text-sm font-medium text-gray-700">Objective Tone</span>
                </div>
              </div>
            </InputSection>
          </div>

          {/* Right Column: Outputs */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation</h3>
              <div className="space-y-4">
                 <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                  {isLoading ? <LoaderCircle className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
                  {isLoading ? 'Generating...' : 'Generate Questions'}
                </Button>
                <div className="flex items-center space-x-2">
                  <Button onClick={copyToClipboard} variant="secondary" className="flex-1" disabled={generatedQuestions.length === 0}>
                    <Copy size={16} className="mr-2" />
                    {copySuccess ? 'Copied!' : 'Copy Markdown'}
                  </Button>
                   <Button onClick={downloadAsMarkdown} variant="secondary" className="flex-1" disabled={generatedQuestions.length === 0}>
                    <Download size={16} className="mr-2" />
                    Download .md
                  </Button>
                  <Button onClick={resetAllFields} variant="ghost" className="text-gray-600 hover:text-red-600">
                    <RotateCcw size={16} className="mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading && (
                  <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
                      <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
                      <p className="ml-4 text-gray-600">Generating insights...</p>
                  </div>
              )}
              {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
              {generatedQuestions.length > 0 && (
                <div className="space-y-4 transition-all duration-500">
                  {generatedQuestions.map((q, index) => (
                    <OutputCard 
                      key={index}
                      question={q.question}
                      role={primaryRole}
                      task={mainTask}
                      tone={objectiveTone ? 'Objective' : 'Inquisitive'}
                      variantType={q.variantType}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default App;
