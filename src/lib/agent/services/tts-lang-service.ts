import { TTS_LANGS, type Lang } from "./tts-lang-data-service";

export function getAllStandardLangs(): Lang[] {
    return TTS_LANGS.filter((lang) => {
        return (lang.voice == 'Standard');
    })
}

export function getAllNeuralLangs(): Lang[] {
    return TTS_LANGS.filter((lang) => {
        return (lang.voice == 'Premium' && lang.name.indexOf('Neural2') > 0);
    })
}


export function getAllJourneyLangs(): Lang[] {
    return TTS_LANGS.filter((lang) => {
        return (lang.voice == 'Premium' && lang.name.indexOf('Journey') > 0);
    })
}

export function getAllSuppotedLangs(): string[] {
    let langs: Lang[] = [...getAllStandardLangs(), ...getAllNeuralLangs(), ...getAllNeuralLangs()];
    let langSet = new Set<string>();
    langs.forEach((l) => {
        langSet.add(l.lang);
    });
    let array: string[] = Array.from(langSet);
    return array.sort()
}

export function getAllSuppotedTtsVoice() {
    return [{ _id: 'Standard', name: 'Standard' }, { _id: 'Neural2', name: 'Modorate' }, { _id: 'Journey', name: 'High' }]
}

export function getAllSuppotedGenders() {
    return ['Male', 'Female']
}