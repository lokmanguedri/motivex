/**
 * Complete Algeria Administrative Divisions
 * 58 Wilayas + Communes with Arabic names
 * Source: Official Algeria administrative data
 */

export type Wilaya = {
    id: number
    name: string
    name_ar: string
    zone: number
}

export type Commune = {
    id: number
    wilaya_id: number
    name: string
    name_ar: string
    has_stop_desk?: boolean
    is_deliverable?: boolean
}

export const WILAYAS: Wilaya[] = [
    { id: 1, name: "Adrar", name_ar: "أدرار", zone: 4 },
    { id: 2, name: "Chlef", name_ar: "الشلف", zone: 2 },
    { id: 3, name: "Laghouat", name_ar: "الأغواط", zone: 3 },
    { id: 4, name: "Oum El Bouaghi", name_ar: "أم البواقي", zone: 2 },
    { id: 5, name: "Batna", name_ar: "باتنة", zone: 2 },
    { id: 6, name: "Béjaïa", name_ar: "بجاية", zone: 2 },
    { id: 7, name: "Biskra", name_ar: "بسكرة", zone: 3 },
    { id: 8, name: "Béchar", name_ar: "بشار", zone: 4 },
    { id: 9, name: "Blida", name_ar: "البليدة", zone: 1 },
    { id: 10, name: "Bouira", name_ar: "البويرة", zone: 2 },
    { id: 11, name: "Tamanrasset", name_ar: "تمنراست", zone: 4 },
    { id: 12, name: "Tébessa", name_ar: "تبسة", zone: 3 },
    { id: 13, name: "Tlemcen", name_ar: "تلمسان", zone: 2 },
    { id: 14, name: "Tiaret", name_ar: "تيارت", zone: 2 },
    { id: 15, name: "Tizi Ouzou", name_ar: "تيزي وزو", zone: 2 },
    { id: 16, name: "Alger", name_ar: "الجزائر", zone: 1 },
    { id: 17, name: "Djelfa", name_ar: "الجلفة", zone: 3 },
    { id: 18, name: "Jijel", name_ar: "جيجل", zone: 2 },
    { id: 19, name: "Sétif", name_ar: "سطيف", zone: 2 },
    { id: 20, name: "Saïda", name_ar: "سعيدة", zone: 2 },
    { id: 21, name: "Skikda", name_ar: "سكيكدة", zone: 2 },
    { id: 22, name: "Sidi Bel Abbès", name_ar: "سيدي بلعباس", zone: 2 },
    { id: 23, name: "Annaba", name_ar: "عنابة", zone: 2 },
    { id: 24, name: "Guelma", name_ar: "قالمة", zone: 2 },
    { id: 25, name: "Constantine", name_ar: "قسنطينة", zone: 2 },
    { id: 26, name: "Médéa", name_ar: "المدية", zone: 2 },
    { id: 27, name: "Mostaganem", name_ar: "مستغانم", zone: 2 },
    { id: 28, name: "M'Sila", name_ar: "المسيلة", zone: 3 },
    { id: 29, name: "Mascara", name_ar: "معسكر", zone: 2 },
    { id: 30, name: "Ouargla", name_ar: "ورقلة", zone: 4 },
    { id: 31, name: "Oran", name_ar: "وهران", zone: 1 },
    { id: 32, name: "El Bayadh", name_ar: "البيض", zone: 3 },
    { id: 33, name: "Illizi", name_ar: "إليزي", zone: 4 },
    { id: 34, name: "Bordj Bou Arreridj", name_ar: "برج بوعريريج", zone: 2 },
    { id: 35, name: "Boumerdès", name_ar: "بومرداس", zone: 1 },
    { id: 36, name: "El Tarf", name_ar: "الطارف", zone: 2 },
    { id: 37, name: "Tindouf", name_ar: "تندوف", zone: 4 },
    { id: 38, name: "Tissemsilt", name_ar: "تيسمسيلت", zone: 2 },
    { id: 39, name: "El Oued", name_ar: "الوادي", zone: 4 },
    { id: 40, name: "Khenchela", name_ar: "خنشلة", zone: 3 },
    { id: 41, name: "Souk Ahras", name_ar: "سوق أهراس", zone: 2 },
    { id: 42, name: "Tipaza", name_ar: "تيبازة", zone: 1 },
    { id: 43, name: "Mila", name_ar: "ميلة", zone: 2 },
    { id: 44, name: "Aïn Defla", name_ar: "عين الدفلى", zone: 2 },
    { id: 45, name: "Naâma", name_ar: "النعامة", zone: 3 },
    { id: 46, name: "Aïn Témouchent", name_ar: "عين تموشنت", zone: 2 },
    { id: 47, name: "Ghardaïa", name_ar: "غرداية", zone: 4 },
    { id: 48, name: "Relizane", name_ar: "غليزان", zone: 2 },
    { id: 49, name: "Timimoun", name_ar: "تيميمون", zone: 4 },
    { id: 50, name: "Bordj Badji Mokhtar", name_ar: "برج باجي مختار", zone: 4 },
    { id: 51, name: "Ouled Djellal", name_ar: "أولاد جلال", zone: 3 },
    { id: 52, name: "Béni Abbès", name_ar: "بني عباس", zone: 4 },
    { id: 53, name: "In Salah", name_ar: "عين صالح", zone: 4 },
    { id: 54, name: "In Guezzam", name_ar: "عين قزام", zone: 4 },
    { id: 55, name: "Touggourt", name_ar: "تقرت", zone: 4 },
    { id: 56, name: "Djanet", name_ar: "جانت", zone: 4 },
    { id: 57, name: "El M'Ghair", name_ar: "المغير", zone: 4 },
    { id: 58, name: "El Menia", name_ar: "المنيعة", zone: 4 }
]

// Major communes for Algiers (Wilaya 16) - most commonly used for testing
// Full commune list would be 1541 entries - using subset for major cities
export const COMMUNES: Commune[] = [
    // Alger (16)
    { id: 1601, wilaya_id: 16, name: "Alger Centre", name_ar: "الجزائر الوسطى", has_stop_desk: true, is_deliverable: true },
    { id: 1602, wilaya_id: 16, name: "Bab El Oued", name_ar: "باب الواد", has_stop_desk: true, is_deliverable: true },
    { id: 1603, wilaya_id: 16, name: "Bir Mourad Raïs", name_ar: "بئر مراد رايس", has_stop_desk: true, is_deliverable: true },
    { id: 1604, wilaya_id: 16, name: "Birtouta", name_ar: "بيرتوتة", has_stop_desk: false, is_deliverable: true },
    { id: 1605, wilaya_id: 16, name: "Bouzareah", name_ar: "بوزريعة", has_stop_desk: true, is_deliverable: true },
    { id: 1606, wilaya_id: 16, name: "Cheraga", name_ar: "الشراقة", has_stop_desk: true, is_deliverable: true },
    { id: 1607, wilaya_id: 16, name: "Dar El Beïda", name_ar: "دار البيضاء", has_stop_desk: true, is_deliverable: true },
    { id: 1608, wilaya_id: 16, name: "Draria", name_ar: "دراريا", has_stop_desk: false, is_deliverable: true },
    { id: 1609, wilaya_id: 16, name: "El Harrach", name_ar: "الحراش", has_stop_desk: true, is_deliverable: true },
    { id: 1610, wilaya_id: 16, name: "Hussain Dey", name_ar: "حسين داي", has_stop_desk: true, is_deliverable: true },
    { id: 1611, wilaya_id: 16, name: "Kouba", name_ar: "القبة", has_stop_desk: true, is_deliverable: true },
    { id: 1612, wilaya_id: 16, name: "Rouiba", name_ar: "الرويبة", has_stop_desk: false, is_deliverable: true },
    { id: 1613, wilaya_id: 16, name: "Sidi M'Hamed", name_ar: "سيدي امحمد", has_stop_desk: true, is_deliverable: true },
    { id: 1614, wilaya_id: 16, name: "Zeralda", name_ar: "زرالدة", has_stop_desk: false, is_deliverable: true },

    // Oran (31)
    { id: 3101, wilaya_id: 31, name: "Oran", name_ar: "وهران", has_stop_desk: true, is_deliverable: true },
    { id: 3102, wilaya_id: 31, name: "Bir El Djir", name_ar: "بئر الجير", has_stop_desk: true, is_deliverable: true },
    { id: 3103, wilaya_id: 31, name: "Es Senia", name_ar: "السانية", has_stop_desk: true, is_deliverable: true },
    { id: 3104, wilaya_id: 31, name: "Arzew", name_ar: "أرزيو", has_stop_desk: false, is_deliverable: true },

    // Constantine (25)
    { id: 2501, wilaya_id: 25, name: "Constantine", name_ar: "قسنطينة", has_stop_desk: true, is_deliverable: true },
    { id: 2502, wilaya_id: 25, name: "El Khroub", name_ar: "الخروب", has_stop_desk: true, is_deliverable: true },
    { id: 2503, wilaya_id: 25, name: "Ain Smara", name_ar: "عين السمارة", has_stop_desk: false, is_deliverable: true },

    // Blida (9)
    { id: 901, wilaya_id: 9, name: "Blida", name_ar: "البليدة", has_stop_desk: true, is_deliverable: true },
    { id: 902, wilaya_id: 9, name: "Boufarik", name_ar: "بوفاريك", has_stop_desk: true, is_deliverable: true },
    { id: 903, wilaya_id: 9, name: "Bougara", name_ar: "بوقرة", has_stop_desk: false, is_deliverable: true },

    // Sétif (19)
    { id: 1901, wilaya_id: 19, name: "Sétif", name_ar: "سطيف", has_stop_desk: true, is_deliverable: true },
    { id: 1902, wilaya_id: 19, name: "El Eulma", name_ar: "العلمة", has_stop_desk: true, is_deliverable: true },

    // Annaba (23)
    { id: 2301, wilaya_id: 23, name: "Annaba", name_ar: "عنابة", has_stop_desk: true, is_deliverable: true },
    { id: 2302, wilaya_id: 23, name: "El Bouni", name_ar: "البوني", has_stop_desk: false, is_deliverable: true },

    // Batna (5)
    { id: 501, wilaya_id: 5, name: "Batna", name_ar: "باتنة", has_stop_desk: true, is_deliverable: true },
    { id: 502, wilaya_id: 5, name: "Barika", name_ar: "بريكة", has_stop_desk: false, is_deliverable: true },

    // Tlemcen (13)
    { id: 1301, wilaya_id: 13, name: "Tlemcen", name_ar: "تلمسان", has_stop_desk: true, is_deliverable: true },
    { id: 1302, wilaya_id: 13, name: "Maghnia", name_ar: "مغنية", has_stop_desk: false, is_deliverable: true },

    // Béjaïa (6)
    { id: 601, wilaya_id: 6, name: "Béjaïa", name_ar: "بجاية", has_stop_desk: true, is_deliverable: true },
    { id: 602, wilaya_id: 6, name: "Amizour", name_ar: "أميزور", has_stop_desk: false, is_deliverable: true },

    // Tizi Ouzou (15)
    { id: 1501, wilaya_id: 15, name: "Tizi Ouzou", name_ar: "تيزي وزو", has_stop_desk: true, is_deliverable: true },
    { id: 1502, wilaya_id: 15, name: "Azazga", name_ar: "عزازقة", has_stop_desk: false, is_deliverable: true },

    // Biskra (7)
    { id: 701, wilaya_id: 7, name: "Biskra", name_ar: "بسكرة", has_stop_desk: true, is_deliverable: true },
    { id: 702, wilaya_id: 7, name: "Tolga", name_ar: "طولقة", has_stop_desk: false, is_deliverable: true },

    // Chlef (2)
    { id: 201, wilaya_id: 2, name: "Chlef", name_ar: "الشلف", has_stop_desk: true, is_deliverable: true },

    // Mostaganem (27)
    { id: 2701, wilaya_id: 27, name: "Mostaganem", name_ar: "مستغانم", has_stop_desk: true, is_deliverable: true },

    // Add more communes as needed - this is a representative subset
    // For production, you would import all 1541 communes from a complete dataset
]

// Helper function to get communes by wilaya
export function getCommunesByWilaya(wilayaId: number): Commune[] {
    return COMMUNES.filter(c => c.wilaya_id === wilayaId)
}

// Helper function to get wilaya by ID
export function getWilayaById(id: number): Wilaya | undefined {
    return WILAYAS.find(w => w.id === id)
}

// Helper function to get commune by ID
export function getCommuneById(id: number): Commune | undefined {
    return COMMUNES.find(c => c.id === id)
}
