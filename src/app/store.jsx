import { create } from "zustand";

export const useFormStoreAdopcion = create(set => {
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