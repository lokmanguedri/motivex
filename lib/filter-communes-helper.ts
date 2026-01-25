// Temporary sync fix - need to find proper async approach later
// For now, immediately fetch when selected
const filterCommunesForWilaya = async (wilayaId: number, mode: string) => {
    try {
        console.log(`[CHECKOUT] Fetching communes for wilaya ${wilayaId}, mode: ${mode}`)

        // Fetch communes for this specific wilaya using query parameter
        const res = await fetch(`/api/shipping/communes?wilaya_id=${wilayaId}`)
        if (!res.ok) {
            console.error("[CHECKOUT] Failed to fetch communes:", await res.text())
            setFilteredCommunes([])
            return
        }

        const allCommunes = await res.json()
        console.log(`[CHECKOUT] Received ${allCommunes.length} communes for wilaya ${wilayaId} from API`)

        // Filter based on delivery mode
        const filtered = allCommunes.filter((c: Commune) => {
            // STOPDESK mode: only communes with stopdesk offices
            if (mode === 'DESK_PICKUP') {
                return c.has_stop_desk === 1
            }

            // HOME delivery: only deliverable communes
            return c.is_deliverable === 1
        })

        setFilteredCommunes(filtered)
        console.log(`[CHECKOUT] Filtered Communes for Wilaya ${wilayaId} (${mode}): ${filtered.length} found`)
    } catch (err) {
        console.error("[CHECKOUT] Error filtering communes:", err)
        setFilteredCommunes([])
    }
}
