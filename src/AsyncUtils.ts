export async function sleep(delay: number = 0): Promise<void> {
    return new Promise<void>( resolve => setTimeout( () => resolve(), delay ) );
}
