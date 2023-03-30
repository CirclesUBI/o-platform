import { writable, get } from "svelte/store";

const initialState = {
  supported: false,
  allowed: false,
  error: null,
  location: null,
  loading: false,
  timestamp: -1,
};

export const geolocation = writable(initialState);

if ("geolocation" in navigator) {
  geolocation.update((state) => ({ ...state, supported: true }));
}
export const myLocation = () =>
  new Promise((resolve, reject) => {
    if (get(geolocation).supported) {
      geolocation.update((state) => ({ ...state, loading: true }));
      navigator.geolocation.getCurrentPosition(
        ({ coords, timestamp }) => {
          geolocation.set({ loading: false, supported: true, allowed: true, location: coords, timestamp, error: null });
          resolve({ geolocation: coords, timestamp });
        },
        (error) => {
          geolocation.update((state) => ({ ...state, error, loading: false }));
          reject(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    } else {
      reject(new Error(`navigator.geolocation is not available`));
    }
  });
