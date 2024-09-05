import { create } from "zustand";

export const useFormStoreAdopcion = create(set => {
    return {
        step: 1,
        animalType: '',
        title: '',
        sizeType: '',
        ageYears: '',
        ageMonths: '',
        sexType: '',
        vaccinated: false,
        unprotected: false,
        castrated: false,
        description: '',
        image: '',
        nombreImagen: '',
        locality: '',
        province: '',
        adoptionStatusType: 'FOR_ADOPTION',
        fileImage: null,
        setAnimalType: (newType) => set({ animalType: newType }),
        setNombre: (newNombre) => set({ title: newNombre }),
        setTamanio: (newTamanio) => set({ sizeType: newTamanio }),
        setAnios: (newAnios) => set({ ageYears: newAnios }),
        setMeses: (newMeses) => set({ ageMonths: newMeses }),
        setSexo: (newSexo) => set({ sexType: newSexo }),
        setVacunado: (isChecked) => set({ vaccinated: isChecked }),
        setDesparasitado: (isChecked) => set({ unprotected: isChecked }),
        setCastrado: (isChecked) => set({ castrated: isChecked }),
        setDescripcion: (newDescripcion) => set({ description: newDescripcion }),
        setFileImage: (newFileImage) => set({ fileImage: newFileImage }),
        setImagen: (newImagen) => set({ image: newImagen }),
        setLocality: (newLocality) => set({ locality: newLocality }),
        setProvince: (newProvince) => set({ province: newProvince }),
        setNombreImagen: (newNombreImagen) => set({ nombreImagen: newNombreImagen }),
        nextStep: () => set((state) => ({ step: state.step + 1 })),
        prevStep: () => set((state) => ({ step: state.step - 1 })),
        resetForm: () => set(state => ({ 
            animalType: '',
            title: '',
            step: 1,
            sizeType: '',
            ageYears: '',
            ageMonths: '',
            sexType: '',
            vaccinated: false,
            unprotected: false,
            castrated: false,
            description: '',
            image: '',
            nombreImagen: '',
            locality: '',
            province: '',
            adoptionStatusType: 'FOR_ADOPTION',
        }))
    }
})

export const useFormStorePerfil = create(set => {
    return {
        step: 1,
        firstName: '',
        lastName: '',
        genderType: '',
        description: '',
        image: '',
        nameImage: '',
        fileImage: null,
        locality: '',
        province: '',
        setFirstName: (newFirstName) => set({ firstName: newFirstName }),
        setLastName: (newLastName) => set({ lastName: newLastName }),
        setGenderType: (newGenderType) => set({ genderType: newGenderType }),
        setDescription: (newDescription) => set({ description: newDescription }),
        setImage: (newImage) => set({ image: newImage }),
        setFileImage: (newFileImage) => set({ fileImage: newFileImage }),
        setNameImage: (newNameImage) => set({ nameImage: newNameImage }),
        setLocality: (newLocality) => set({ locality: newLocality }),
        setProvince: (newProvince) => set({ province: newProvince }),
        nextStep: () => set((state) => ({ step: state.step + 1 })),
        prevStep: () => set((state) => ({ step: state.step - 1 })),
        resetForm: () => set(state => ({ 
            step: 1,
            firstName: '',
            lastName: '',
            genderType: '',
            description: '',
            image: '',
            nameImage: '',
            locality: '',
            province: '',
        }))
    }
})

export const useChatStore = create(set => {
    return {
        chatId: null,
        setChatId: (id) => set({chatId: id})
    }
})