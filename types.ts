
export enum PrimaryRole {
  Clinician = 'Clinician',
  Researcher = 'Researcher',
  DataScientist = 'Data Scientist',
  Educator = 'Educator',
  Statistician = 'Statistician',
  Student = 'Student'
}

export enum MainTask {
  InvestigateCausality = 'Investigate Causality',
  GenerateResearchQuestion = 'Generate Research Question',
  DesignStudy = 'Design Study',
  OperationalizeVariables = 'Operationalize Variables'
}

export enum PreferredDesign {
  FixedEffects = 'Fixed Effects',
  DifferenceInDifferences = 'Difference-in-Differences (DiD)',
  InstrumentalVariable = 'Instrumental Variable (IV)',
  PropensityScores = 'Propensity Scores',
  TargetTrialEmulation = 'Target Trial Emulation'
}

export interface GeneratedQuestion {
  question: string;
  variantType: string;
}

export interface FormData {
  researchIdea: string;
  primaryRole: PrimaryRole;
  mainTask: MainTask;
  exposure: string;
  outcome: string;
  population: string;
  timeframe: string;
  dataSource: string;
  covariates: string[];
  preferredDesign: PreferredDesign;
  lagDays: number;
  objectiveTone: boolean;
}
