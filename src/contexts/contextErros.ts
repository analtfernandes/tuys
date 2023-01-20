export function contextError(name: string) {
	return new Error(`O contexto "${name}" não está disponível!`);
}
