//faz a gestão do estado global do paciente selecionado, permitindo que diferentes componentes acessem e atualizem as informações do paciente de forma consistente em toda a aplicação. Ele também persiste o paciente selecionado no localStorage para sobreviver a recarregamentos de página (F5).
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

  
  useEffect(() => {
    const saved = localStorage.getItem('selectedPatient');
    if (saved) {
      setSelectedPatient(JSON.parse(saved));
    }
  }, []); 

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