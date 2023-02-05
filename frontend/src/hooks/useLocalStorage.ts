import { LocalStorageType } from "../components/utils/Protocols";

function useLocalStorage() {
	const storageKey = "tuys.com";
	const localData = getLocalData();

	function getLocalData() {
		return JSON.parse(
			localStorage.getItem(storageKey) || "{}"
		) as LocalStorageType;
	}

	function clearLocalStorage() {
		const localData = getLocalData();
		localStorage.setItem(
			storageKey,
			JSON.stringify({ theme: localData.theme || "light" })
		);
	}

	function addInLocalStorage(data: Partial<LocalStorageType>) {
		const localData = getLocalData();
		localStorage.setItem(storageKey, JSON.stringify({ ...localData, ...data }));
	}

	return { localData, clearLocalStorage, addInLocalStorage };
}

export { useLocalStorage };
