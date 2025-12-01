from flask import Flask, render_template, request, jsonify
import torch 
from collections import defaultdict

app = Flask(__name__)

TN_ROAD_DB = {
    'NH 16 (Chennai – Kolkata)': {'lat': 13.0827, 'lon': 80.2707, 'type': 'national'},
    'NH 38 (Vellore – Thoothukudi)': {'lat': 12.9165, 'lon': 79.1325, 'type': 'national'},
    'NH 44 (Srinagar – Kanyakumari)': {'lat': 11.0168, 'lon': 76.9558, 'type': 'national'},
    'NH 45 (Chennai – Theni)': {'lat': 13.0827, 'lon': 80.2707, 'type': 'national'},
    'NH 66 (Pondicherry – Krishnagiri)': {'lat': 12.0056, 'lon': 79.8498, 'type': 'national'},
    'NH 81 (Karur – Coimbatore)': {'lat': 10.9601, 'lon': 78.0766, 'type': 'national'},
    'NH 83 (Trichy – Dindigul)': {'lat': 10.7905, 'lon': 78.7047, 'type': 'national'},
    'NH 85 (Madurai – Ramanathapuram)': {'lat': 9.9252, 'lon': 78.1198, 'type': 'national'},
    'NH 136 (Thanjavur – Perambalur)': {'lat': 10.7867, 'lon': 79.1378, 'type': 'national'},
    'NH 183 (Dindigul – Kollam)': {'lat': 10.3673, 'lon': 77.9803, 'type': 'national'},
    'NH 332 (Puducherry – Tindivanam)': {'lat': 11.9400, 'lon': 79.5000, 'type': 'national'},
    'NH 381 (Avinashi – Tiruppur)': {'lat': 11.1085, 'lon': 77.3411, 'type': 'national'},
    'NH 381A (Vellakoil – Sankagiri)': {'lat': 11.1726, 'lon': 77.6150, 'type': 'national'},
    'NH 383 (Dindigul – Kottampatty)': {'lat': 10.3673, 'lon': 77.9803, 'type': 'national'},
    'NH 536 (Nagapattinam – Thanjavur)': {'lat': 10.7905, 'lon': 79.1300, 'type': 'national'},
    'NH 544 (Salem – Coimbatore – Kochi)': {'lat': 11.0168, 'lon': 76.9558, 'type': 'national'},
    'NH 716 (Chennai – Tirupati)': {'lat': 13.0827, 'lon': 80.2707, 'type': 'national'},
    'NH 785 (Madurai – Natham)': {'lat': 9.9252, 'lon': 78.1198, 'type': 'national'},
    'NH 844 (Hosur – Dharmapuri)': {'lat': 12.5300, 'lon': 78.2100, 'type': 'national'},
    'NH 948 (Coimbatore – Gundlupet)': {'lat': 11.0168, 'lon': 76.9558, 'type': 'national'},
    'NH 83 (Nagapattinam Bus Stand)': {'lat': 10.7650, 'lon': 79.8428, 'type': 'national'},
    
    # State Highways (SH)
    'SH 1 (Chennai – Ennore)': {'lat': 13.1500, 'lon': 80.3000, 'type': 'state'},
    'SH 2 (Chennai – Tiruvallur – Tiruttani – Renigunta)': {'lat': 13.0827, 'lon': 80.2707, 'type': 'state'},
    'SH 4 (Arcot – Villupuram)': {'lat': 12.9050, 'lon': 79.3333, 'type': 'state'},
    'SH 6 (Cuddalore – Sankarapuram)': {'lat': 11.7447, 'lon': 79.7680, 'type': 'state'},
    'SH 9 (Cuddalore – Chittoor)': {'lat': 11.7447, 'lon': 79.7680, 'type': 'state'},
    'SH 15 (Vellore – Thiruvannamalai)': {'lat': 12.9165, 'lon': 79.1325, 'type': 'state'},
    'SH 20 (Erode – Karur)': {'lat': 11.3424, 'lon': 77.7274, 'type': 'state'},
    'SH 22 (Salem – Harur)': {'lat': 11.6643, 'lon': 78.1460, 'type': 'state'},
    'SH 25 (Madurai – Theni)': {'lat': 9.9252, 'lon': 78.1198, 'type': 'state'},
    'SH 29 (Tirunelveli – Tenkasi)': {'lat': 8.7139, 'lon': 77.7567, 'type': 'state'},
    'SH 33 (Kumbakonam – Sirkali)': {'lat': 10.9601, 'lon': 79.3832, 'type': 'state'},
    'SH 37 (Thanjavur – Vedaranyam)': {'lat': 10.7867, 'lon': 79.1378, 'type': 'state'},
    'SH 41 (Erode – Dharapuram)': {'lat': 11.3424, 'lon': 77.7274, 'type': 'state'},
    'SH 45 (Tiruchirappalli – Musiri)': {'lat': 10.7905, 'lon': 78.7047, 'type': 'state'},
    'SH 50 (Coimbatore – Pollachi)': {'lat': 11.0168, 'lon': 76.9558, 'type': 'state'},
    'SH 60 (Hogenakkal – Dharmapuri – Tirupattur)': {'lat': 12.1030, 'lon': 78.1570, 'type': 'state'},
    'SH 65 (Tiruvarur – Kumbakonam)': {'lat': 10.7677, 'lon': 79.6365, 'type': 'state'},
    'SH 74 (Dindigul – Palani)': {'lat': 10.3673, 'lon': 77.9803, 'type': 'state'},
    'SH 78 (Namakkal – Thuraiyur)': {'lat': 11.2196, 'lon': 78.1670, 'type': 'state'},
    'SH 94 (Karaikudi – Devakottai)': {'lat': 10.1000, 'lon': 78.7833, 'type': 'state'},

    # Major District Roads (MDR)
    'MDR 1 (Soolaimeni – Thervoy Kandigai)': {'lat': 13.3000, 'lon': 80.1500, 'type': 'district'},
    'MDR 2 (Pallavaram – Thiruneermalai – Thirumudivakkam)': {'lat': 12.9500, 'lon': 80.1500, 'type': 'district'},
    'MDR 3 (Erode – Chennimalai)': {'lat': 11.3424, 'lon': 77.7274, 'type': 'district'},
    'MDR 4 (Perundurai – Bhavani)': {'lat': 11.2750, 'lon': 77.5875, 'type': 'district'},
    'MDR 5 (Tiruchengode – Komarapalayam)': {'lat': 11.3800, 'lon': 77.9000, 'type': 'district'},
    'MDR 6 (Namakkal – Rasipuram)': {'lat': 11.2200, 'lon': 78.1700, 'type': 'district'},
    'MDR 7 (Karur – Aravakurichi)': {'lat': 10.9500, 'lon': 78.0800, 'type': 'district'},
    'MDR 8 (Dindigul – Vedasandur)': {'lat': 10.3700, 'lon': 77.9800, 'type': 'district'},
    'MDR 9 (Madurai – Melur)': {'lat': 9.9252, 'lon': 78.1198, 'type': 'district'},
    'MDR 10 (Theni – Periyakulam)': {'lat': 10.0100, 'lon': 77.4800, 'type': 'district'},
    'MDR 11 (Tirunelveli – Ambasamudram)': {'lat': 8.7139, 'lon': 77.7567, 'type': 'district'},
    'MDR 12 (Nagercoil – Colachel)': {'lat': 8.1800, 'lon': 77.4300, 'type': 'district'},
    'MDR 13 (Kanyakumari – Suchindram)': {'lat': 8.0800, 'lon': 77.5500, 'type': 'district'},
    'MDR 14 (Tuticorin – Tiruchendur)': {'lat': 8.8000, 'lon': 78.1500, 'type': 'district'},
    'MDR 15 (Ramanathapuram – Rameswaram)': {'lat': 9.3700, 'lon': 78.8300, 'type': 'district'},
    'MDR 16 (Sivaganga – Manamadurai)': {'lat': 9.8500, 'lon': 78.4800, 'type': 'district'},
    'NH 544 (Avinashi Road)': {'lat': 11.0168, 'lon': 76.9558, 'type': 'national'},
    'NH 181 (Mettupalayam Road)': {'lat': 11.0620, 'lon': 76.9490, 'type': 'national'},
    'NH 83 (Trichy Road)': {'lat': 11.0055, 'lon': 76.9661, 'type': 'national'},
    'NH 948 (Palakkad Road)': {'lat': 10.9923, 'lon': 76.9616, 'type': 'national'},
    # State Highways (SH)
    'SH 164 (Sathyamangalam Road)': {'lat': 11.0500, 'lon': 77.0000, 'type': 'state'},
    'SH 167 (Pollachi Road)': {'lat': 10.9500, 'lon': 76.9500, 'type': 'state'},
    'SH 167A (Thadagam Road)': {'lat': 11.0300, 'lon': 76.9200, 'type': 'state'},
    'SH 167B (Maruthamalai Road)': {'lat': 11.0300, 'lon': 76.9200, 'type': 'state'},

    # Major District Roads (MDR)
    'MDR 1 (Perur Main Road)': {'lat': 10.9900, 'lon': 76.9300, 'type': 'district'},
    'MDR 2 (Sundarapuram Road)': {'lat': 10.9800, 'lon': 76.9400, 'type': 'district'},
    'MDR 3 (Peelamedu Road)': {'lat': 11.0200, 'lon': 77.0000, 'type': 'district'},
    'MDR 4 (Singanallur Road)': {'lat': 11.0000, 'lon': 77.0100, 'type': 'district'},
    'MDR 5 (Saravanampatti Road)': {'lat': 11.0600, 'lon': 77.0200, 'type': 'district'},
    'MDR 6 (Kalapatti Road)': {'lat': 11.0700, 'lon': 77.0300, 'type': 'district'},
    'MDR 7 (Vilankurichi Road)': {'lat': 11.0800, 'lon': 77.0400, 'type': 'district'},
    'MDR 8 (Koundampalayam Road)': {'lat': 11.0900, 'lon': 77.0500, 'type': 'district'},
    'MDR 9 (Thudiyalur Road)': {'lat': 11.1000, 'lon': 77.0600, 'type': 'district'},
    'MDR 10 (Gandhipuram Road)': {'lat': 11.1100, 'lon': 77.0700, 'type': 'district'},
    'MDR 11 (Ramanathapuram Road)': {'lat': 11.1200, 'lon': 77.0800, 'type': 'district'},
    'MDR 12 (Saibaba Colony Road)': {'lat': 11.1300, 'lon': 77.0900, 'type': 'district'},
    'MDR 13 (RS Puram Road)': {'lat': 11.1400, 'lon': 77.1000, 'type': 'district'},
    'MDR 14 (Race Course Road)': {'lat': 11.1500, 'lon': 77.1100, 'type': 'district'},
    'MDR 15 (Ukkadam Road)': {'lat': 11.1600, 'lon': 77.1200, 'type': 'district'},
    'MDR 140 (Kinathukadavu Junction)': {'lat': 10.7965, 'lon': 77.0011, 'type': 'district'}
}

@app.route('/')
def dashboard():
    road_types = defaultdict(int)
    for road in TN_ROAD_DB.values():
        road_types[road['type']] += 1
        
    return render_template(
        'dashboard.html',
        roads=TN_ROAD_DB.keys(),
        road_json=TN_ROAD_DB,
        road_types=dict(road_types)
    )

@app.route('/traffic', methods=['GET', 'POST'])
def traffic():
    prediction = None
    if request.method == 'POST':
        road_name = request.form.get('road_name')
        if road_name in TN_ROAD_DB:
            levels = ['low', 'medium', 'high']
            prediction = {
                'road': road_name,
                'location': TN_ROAD_DB[road_name],
                'traffic': levels[torch.randint(0, 3, ()).item()],
                'confidence': float(torch.rand(()).item())
            }
    
    return render_template(
        'traffic.html',
        prediction=prediction,
        roads=TN_ROAD_DB.keys(),
        road_json=TN_ROAD_DB
    )

if __name__ == '__main__':
    app.run(debug=True)