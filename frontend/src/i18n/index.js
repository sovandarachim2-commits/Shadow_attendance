import en from './en'
import kh from './kh'

export const translations = {
  en,
  km: kh,
}

export function translate(language, label) {
  return translations[language]?.[label] || label
}
