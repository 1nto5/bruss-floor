'use client';
import Loading from '@/app/[lang]/components/loading';
import LoginWithKeypad from '@/app/[lang]/components/login-with-keypad';
import type { Locale } from '@/lib/config/i18n';
import { useEffect, useState } from 'react';
import { fetchActiveOvenProgram, login } from '../actions';
import { useGetOvenProcesses } from '../data/get-oven-processes';
import type { Dictionary } from '../lib/dict';
import { useOperatorStore, useOvenStore } from '../lib/stores';
import OvenSelection from './oven-selection';
import ProcessList from './process-list';
import ProgramSelection from './program-selection';

interface AppProps {
  dict: Dictionary;
  lang: Locale;
}

export default function App({ dict, lang }: AppProps) {
  const {
    operator1,
    operator2,
    operator3,
    setOperator1,
    setOperator2,
    setOperator3,
  } = useOperatorStore();
  const {
    selectedOven,
    selectedProgram,
    isLoadingProgram,
    setSelectedProgram,
  } = useOvenStore();
  const { data: processesData, isLoading: isLoadingProcesses } =
    useGetOvenProcesses(selectedOven);
  const [isFetchingProgram, setIsFetchingProgram] = useState(false);

  // Check if there are active processes (running or prepared)
  const hasActiveProcesses =
    processesData &&
    'success' in processesData &&
    processesData.success.some(
      (process) => process.status === 'running' || process.status === 'prepared'
    );

  // Automatically fetch and set program if active processes exist and no program is selected
  useEffect(() => {
    // Check if there are active processes
    const hasActive =
      processesData &&
      'success' in processesData &&
      processesData.success.some(
        (process) =>
          process.status === 'running' || process.status === 'prepared'
      );

    if (
      selectedOven &&
      !isLoadingProcesses &&
      hasActive &&
      selectedProgram === null &&
      !isLoadingProgram &&
      !isFetchingProgram
    ) {
      setIsFetchingProgram(true);
      fetchActiveOvenProgram(selectedOven)
        .then((result) => {
          if ('program' in result && result.program !== null) {
            setSelectedProgram(result.program);
          }
          setIsFetchingProgram(false);
        })
        .catch((error) => {
          console.error('Error fetching active oven program:', error);
          setIsFetchingProgram(false);
        });
    }
  }, [
    selectedOven,
    processesData,
    isLoadingProcesses,
    selectedProgram,
    isLoadingProgram,
    isFetchingProgram,
    setSelectedProgram,
  ]);

  if (!operator1 && !operator2 && !operator3) {
    return (
      <LoginWithKeypad
        {...dict.login}
        loginAction={login}
        onSuccess={(res) => {
          setOperator1(res.operator1 || null);
          setOperator2(res.operator2 || null);
          setOperator3(res.operator3 || null);
        }}
      />
    );
  } else if (!selectedOven) {
    return <OvenSelection dict={dict} />;
  } else if (isLoadingProgram || isFetchingProgram || isLoadingProcesses) {
    return <Loading />;
  } else if (selectedProgram === null) {
    // Check if there are active processes
    if (hasActiveProcesses) {
      // If active processes exist but program is still null, show loading while we fetch
      return <Loading />;
    } else {
      // Only show ProgramSelection if there are NO active processes
      return <ProgramSelection dict={dict} />;
    }
  } else {
    return <ProcessList dict={dict} lang={lang} />;
  }
}
