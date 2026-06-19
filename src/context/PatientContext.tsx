// O contexto serve para o site todo saber qual paciente estamos olhando agora
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
  // Estado que guarda o paciente que está selecionado
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Quando abre o site, tenta pegar o paciente salvo no navegador
  useEffect(() => {
    const saved = localStorage.getItem('selectedPatient');
    if (saved) {
      setSelectedPatient(JSON.parse(saved));
    }
  }, []); 

  // Salva o paciente escolhido tanto no estado quanto no navegador
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

// Hook para facilitar o uso em qualquer parte do sistema
export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient deve ser usado dentro de um PatientProvider');
  }
  return context;
}