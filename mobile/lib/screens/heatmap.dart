import 'package:flutter/material.dart';

class ScamHeatmapScreen extends StatelessWidget {
  const ScamHeatmapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hotspots = [
      {"district": "Jamtara", "state": "Jharkhand", "reports": 1284, "loss": "₹1.8 Crore", "type": "KYC / UPI Refund"},
      {"district": "Nuh (Mewat)", "state": "Haryana", "reports": 1052, "loss": "₹1.4 Crore", "type": "Sextortion / Fake Jobs"},
      {"district": "Deoghar", "state": "Jharkhand", "reports": 810, "loss": "₹95 Lakh", "type": "Electricity Cutoff"},
      {"district": "Bengaluru", "state": "Karnataka", "reports": 2100, "loss": "₹4.5 Crore", "type": "Digital Arrest"},
      {"district": "New Delhi", "state": "Delhi", "reports": 1850, "loss": "₹3.8 Crore", "type": "Investment Stock tips"},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scam Hotspots Map'),
        backgroundColor: const Color(0xFF050811),
      ),
      body: Column(
        children: [
          // Schematic Map Box
          Container(
            height: 200,
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.black25,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.map, size: 48, color: Color(0xFF00F0FF)),
                  SizedBox(height: 8),
                  Text('India Heat-map Grid Visualizer', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text('District geodata feeds active', style: TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            ),
          ),

          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Text(
                  'Active Threat Clusters',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: hotspots.length,
              itemBuilder: (context, index) {
                final h = hotspots[index];
                return Card(
                  color: Theme.of(context).cardColor,
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: const BorderSide(color: Colors.white10),
                  ),
                  child: ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Color(0x15EF4444),
                      child: Icon(Icons.location_on, color: Color(0xFFEF4444)),
                    ),
                    title: Text('${h['district']} (${h['state']})', style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Primary Threat: ${h['type']}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(h['loss'] as String, style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold)),
                        Text('${h['reports']} cases', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
