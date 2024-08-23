import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
      (set) => ({
        isAuthenticated: false,
        logIn: () => set({ isAuthenticated: true }),
        logOut: () => set({ isAuthenticated: false }),
      }),
      {
        name: 'auth-storage', 
        getStorage: () => localStorage, 
      }
    )
  );


//TODO (nico) cambiar esto de nombre
export const useGlobalStore = create(set => {
    return {
        step: 1,
        animalType: '',
        nombre: '',
        tamanio: '',
        anios: '',
        meses: '',
        sexo: '',
        vacunado: false,
        desparasitado: false,
        castrado: false,
        descripcion: '',
        imagen: '',
        nombreImagen: '',
        setAnimalType: (newType) => set({ animalType: newType }),
        setNombre: (newNombre) => set({ nombre: newNombre }),
        setTamanio: (newTamanio) => set({ tamanio: newTamanio }),
        setAnios: (newAnios) => set({ anios: newAnios }),
        setMeses: (newMeses) => set({ meses: newMeses }),
        setSexo: (newSexo) => set({ sexo: newSexo }),
        setVacunado: (isChecked) => set({ vacunado: isChecked }),
        setDesparasitado: (isChecked) => set({ desparasitado: isChecked }),
        setCastrado: (isChecked) => set({ castrado: isChecked }),
        setDescripcion: (newDescripcion) => set({ descripcion: newDescripcion }),
        setImagen: (newImagen) => set({ imagen: newImagen }),
        setNombreImagen: (newNombreImagen) => set({ nombreImagen: newNombreImagen }),
        nextStep: () => set((state) => ({ step: state.step + 1 })),
        prevStep: () => set((state) => ({ step: state.step - 1 })),
        resetForm: () => set(state => ({ 
            animalType: '',
            nombre: '',
            step: 1,
            tamanio: '',
            anios: '',
            meses: '',
            sexo: '',
            vacunado: false,
            desparasitado: false,
            castrado: false,
            descripcion: '',
            imagen: '',
            nombreImagen: '',
        }))
    }
})
