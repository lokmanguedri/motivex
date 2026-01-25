// Static Algeria data - 58 wilayas, 1541 communes
// Source: Official Algeria administrative divisions
export const ALGERIA_WILAYAS = [
    { id: 1, name: "Adrar", zone: 4 },
    { id: 2, name: "Chlef", zone: 2 },
    { id: 3, name: "Laghouat", zone: 3 },
    { id: 4, name: "Oum El Bouaghi", zone: 2 },
    { id: 5, name: "Batna", zone: 2 },
    { id: 6, name: "Béjaïa", zone: 2 },
    { id: 7, name: "Biskra", zone: 3 },
    { id: 8, name: "Béchar", zone: 4 },
    { id: 9, name: "Blida", zone: 1 },
    { id: 10, name: "Bouira", zone: 2 },
    { id: 11, name: "Tamanrasset", zone: 4 },
    { id: 12, name: "Tébessa", zone: 3 },
    { id: 13, name: "Tlemcen", zone: 2 },
    { id: 14, name: "Tiaret", zone: 2 },
    { id: 15, name: "Tizi Ouzou", zone: 2 },
    { id: 16, name: "Alger", zone: 1 },
    { id: 17, name: "Djelfa", zone: 3 },
    { id: 18, name: "Jijel", zone: 2 },
    { id: 19, name: "Sétif", zone: 2 },
    { id: 20, name: "Saïda", zone: 2 },
    { id: 21, name: "Skikda", zone: 2 },
    { id: 22, name: "Sidi Bel Abbès", zone: 2 },
    { id: 23, name: "Annaba", zone: 2 },
    { id: 24, name: "Guelma", zone: 2 },
    { id: 25, name: "Constantine", zone: 2 },
    { id: 26, name: "Médéa", zone: 2 },
    { id: 27, name: "Mostaganem", zone: 2 },
    { id: 28, name: "M'Sila", zone: 3 },
    { id: 29, name: "Mascara", zone: 2 },
    { id: 30, name: "Ouargla", zone: 4 },
    { id: 31, name: "Oran", zone: 1 },
    { id: 32, name: "El Bayadh", zone: 3 },
    { id: 33, name: "Illizi", zone: 4 },
    { id: 34, name: "Bordj Bou Arreridj", zone: 2 },
    { id: 35, name: "Boumerdès", zone: 1 },
    { id: 36, name: "El Tarf", zone: 2 },
    { id: 37, name: "Tindouf", zone: 4 },
    { id: 38, name: "Tissemsilt", zone: 2 },
    { id: 39, name: "El Oued", zone: 4 },
    { id: 40, name: "Khenchela", zone: 3 },
    { id: 41, name: "Souk Ahras", zone: 2 },
    { id: 42, name: "Tipaza", zone: 1 },
    { id: 43, name: "Mila", zone: 2 },
    { id: 44, name: "Aïn Defla", zone: 2 },
    { id: 45, name: "Naâma", zone: 3 },
    { id: 46, name: "Aïn Témouchent", zone: 2 },
    { id: 47, name: "Ghardaïa", zone: 4 },
    { id: 48, name: "Relizane", zone: 2 },
    { id: 49, name: "Timimoun", zone: 4 },
    { id: 50, name: "Bordj Badji Mokhtar", zone: 4 },
    { id: 51, name: "Ouled Djellal", zone: 3 },
    { id: 52, name: "Béni Abbès", zone: 4 },
    { id: 53, name: "In Salah", zone: 4 },
    { id: 54, name: "In Guezzam", zone: 4 },
    { id: 55, name: "Touggourt", zone: 4 },
    { id: 56, name: "Djanet", zone: 4 },
    { id: 57, name: "El M'Ghair", zone: 4 },
    { id: 58, name: "El Menia", zone: 4 }
]

// This will be populated from API or static file
export type CommuneData = {
    id: number
    name: string
    wilaya_id: number
    has_stop_desk?: number
    is_deliverable?: number
}
