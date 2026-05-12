"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import ContactPopup from "../components/Sections/contact/ContactPopup";

type ContactPopupContextType = {
  openPopup: () => void;
  closePopup: () => void;
};

const ContactPopupContext = createContext<ContactPopupContextType | undefined>(
  undefined
);

export function ContactPopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = useCallback(() => setIsOpen(true), []);
  const closePopup = useCallback(() => setIsOpen(false), []);

  return (
    <ContactPopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {/* Jedyna instancja ContactPopup w całej aplikacji */}
      <ContactPopup isOpen={isOpen} onClose={closePopup} />
    </ContactPopupContext.Provider>
  );
}

export function useContactPopup() {
  const ctx = useContext(ContactPopupContext);

// Jeśli z jakiegoś powodu komponent jest poza Providerem,
// nie wywalaj całej aplikacji, tylko daj bezpieczny fallback.
if (!ctx) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "useContactPopup was used outside of ContactPopupProvider. Returning a no-op fallback."
    );
  }

  return {
    isOpen: false,
    openPopup: () => {},
    closePopup: () => {},
    togglePopup: () => {},
  };
}

return ctx;

}
