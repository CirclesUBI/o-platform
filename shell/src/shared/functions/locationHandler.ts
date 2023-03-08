import { Environment } from "../environment";

export async function getGeoDataFromHereId(locationId) {
  if (locationId) {
    const url = "https://lookup.search.hereapi.com/v1/lookup?id=" + locationId + "&apiKey=" + Environment.hereApiKey;
    const response = await fetch(url);
    return await response.json();
  }
}

export async function findLocation(keyword) {
  if (keyword) {
    const url = "https://autocomplete.search.hereapi.com/v1/autocomplete?q=" + encodeURIComponent(keyword) + "&apiKey=" + Environment.hereApiKey;

    const response = await fetch(url);
    const json = await response.json();
    return json.items;
  }
}

export async function findGoogleLocation(keyword) {
  if (keyword) {
    const url = "https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=" + encodeURIComponent(keyword) + "&key=" + Environment.placesApiKey;

    const response = await fetch(url);
    const json = await response.json();
    console.log("JOSN:", json);
    return json.items;
  }
}

export function buildAddressString(address) {
  let addr: string[] = [address.street, address.houseNumber, address.city, address.district, address.countryCode];
  addr = addr.filter(function (element) {
    return element !== undefined;
  });

  return addr.join(", ");
}
