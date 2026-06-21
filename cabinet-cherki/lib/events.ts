/** Pont léger entre les cartes de services et le formulaire de rendez-vous. */
export const SELECT_SERVICE_EVENT = "cabinet:select-service";

export function selectService(name: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(SELECT_SERVICE_EVENT, { detail: name }),
    );
  }
}
