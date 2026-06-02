'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
}

interface PatientContextType {
  selectedPatient: Patient | null;
  selectPatient: (patient: Patient) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Carrega o paciente selecionado anteriormente ao iniciar o app
  useEffect(() => {
    const saved = localStorage.getItem('selectedPatient');
    if (saved) {
      setSelectedPatient(JSON.parse(saved));
    }
  }, []); // <-- Corrigido aqui! Removido o </script> intruso

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    localStorage.setItem('selectedPatient', JSON.stringify(patient));
  };

  return (
    <PatientContext.Provider value={{ selectedPatient, selectPatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient deve ser usado dentro de um PatientProvider');
  }
  return context;
}