// Logika penentuan Nutri-Level berdasarkan gambar (GGL per 100mL/100g)
export function calculateNutriLevel(gula, garam, lemakJenuh) {
    let gulaScore = 'A';
    if (gula > 10) gulaScore = 'D';
    else if (gula > 5) gulaScore = 'C';
    else if (gula > 1) gulaScore = 'B';
    
    let garamScore = 'A';
    if (garam > 500) garamScore = 'D';
    else if (garam > 120) garamScore = 'C';
    else if (garam > 5) garamScore = 'B';
    
    let lemakScore = 'A';
    // Catatan: satuan lemak jenuh di gambar kadang membingungkan (120g per 100mL?), 
    // asumsi ini menggunakan mg atau logika serupa, tapi kita ikuti angka di tabel secara literal.
    // Jika lemak > 500g (tidak mungkin untuk 100g), kita asumsikan nilainya tetap mengikuti angka tersebut (mungkin miligram atau salah ketik di banner asli).
    // Tapi tabel menulis: <= 5g (A), >5-120g (B), >120-500g (C), >500g (D). 
    if (lemakJenuh > 500) lemakScore = 'D';
    else if (lemakJenuh > 120) lemakScore = 'C';
    else if (lemakJenuh > 5) lemakScore = 'B';
    
    // Tingkat Nutri-Level akhir biasanya ditentukan oleh nilai GGL yang paling buruk (highest risk)
    const scores = [gulaScore, garamScore, lemakScore];
    const hierarchy = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
    
    let worst = 'A';
    for (let s of scores) {
        if (hierarchy[s] > hierarchy[worst]) {
            worst = s;
        }
    }
    
    return {
        level: worst,
        gulaScore,
        garamScore,
        lemakScore
    };
}
