import { LocalStorageType } from "./types";

function useLocalStorage() {
	const storageKey = "tuys.com";
	const localData = getLocalData();

	function getLocalData() {
		return parse(localStorage.getItem(storageKey));
	}

	function clearLocalStorage() {
		const localData = getLocalData();
		setData({ theme: localData.theme || "light" });
	}

	function addInLocalStorage(data: Partial<LocalStorageType>) {
		const localData = getLocalData();
		setData({ ...localData, ...data });
	}

	function setData(data: Partial<LocalStorageType>) {
		localStorage.setItem(storageKey, stringify(data));
	}

	function parse(data: string | null) {
		return JSON.parse(data ?? "{}") as LocalStorageType;
	}

	function stringify(data: Partial<LocalStorageType>) {
		return JSON.stringify(data);
	}

	return { localData, clearLocalStorage, addInLocalStorage };
}

export { useLocalStorage };
