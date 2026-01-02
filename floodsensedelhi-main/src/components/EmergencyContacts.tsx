/**
 * FloodSense Delhi - Emergency Contacts Component
 * Displays helpline numbers and evacuation routes for wards
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, AlertTriangle, Building2, Ambulance, Shield, Users, Navigation } from 'lucide-react';
import { allWards, type Ward } from '@/data/wardData';

// Emergency helpline numbers
const emergencyContacts = [
  { name: 'Delhi Flood Control Room', number: '1800-111-7777', icon: Phone, priority: 'critical' },
  { name: 'NDRF Helpline', number: '011-24363260', icon: Shield, priority: 'high' },
  { name: 'Delhi Police Control', number: '100', icon: Shield, priority: 'high' },
  { name: 'Fire & Rescue', number: '101', icon: AlertTriangle, priority: 'high' },
  { name: 'Ambulance', number: '102', icon: Ambulance, priority: 'high' },
  { name: 'Disaster Helpline', number: '1078', icon: Phone, priority: 'critical' },
  { name: 'MCD Helpline', number: '1916', icon: Building2, priority: 'medium' },
  { name: 'Delhi Jal Board', number: '1916', icon: Users, priority: 'medium' },
];

// Evacuation centers by zone
const evacuationCenters: Record<string, { name: string; address: string; capacity: number }[]> = {
  'Central Delhi': [
    { name: 'Talkatora Stadium', address: 'Talkatora Rd, New Delhi', capacity: 5000 },
    { name: 'Constitution Club', address: 'Rafi Marg, New Delhi', capacity: 2000 },
  ],
  'North Delhi': [
    { name: 'GTB Hospital', address: 'Dilshad Garden', capacity: 3000 },
    { name: 'Burari Community Center', address: 'Burari', capacity: 2500 },
  ],
  'South Delhi': [
    { name: 'Thyagaraj Stadium', address: 'INA, New Delhi', capacity: 4000 },
    { name: 'Siri Fort Complex', address: 'August Kranti Marg', capacity: 3500 },
  ],
  'East Delhi': [
    { name: 'Yamuna Sports Complex', address: 'Surajmal Vihar', capacity: 6000 },
    { name: 'Akshardham Parking', address: 'NH24', capacity: 8000 },
  ],
  'West Delhi': [
    { name: 'Dwarka Sports Complex', address: 'Sector 11, Dwarka', capacity: 5000 },
    { name: 'Rajouri Garden Stadium', address: 'Rajouri Garden', capacity: 3000 },
  ],
  'North West Delhi': [
    { name: 'Rohini Sports Complex', address: 'Sector 15, Rohini', capacity: 4000 },
    { name: 'Japanese Park', address: 'Rohini', capacity: 2500 },
  ],
  'South West Delhi': [
    { name: 'Jawaharlal Nehru Stadium', address: 'Lodhi Road', capacity: 10000 },
    { name: 'Vasant Kunj Community Hall', address: 'Vasant Kunj', capacity: 2000 },
  ],
  'North East Delhi': [
    { name: 'Dilshad Garden Stadium', address: 'Dilshad Garden', capacity: 3500 },
    { name: 'Welcome Stadium', address: 'Welcome', capacity: 3000 },
  ],
  'South East Delhi': [
    { name: 'Sarita Vihar Sports Complex', address: 'Sarita Vihar', capacity: 3000 },
    { name: 'Lajpat Nagar Central Market', address: 'Lajpat Nagar', capacity: 2000 },
  ],
  'New Delhi': [
    { name: 'Major Dhyan Chand Stadium', address: 'India Gate', capacity: 8000 },
    { name: 'Indira Gandhi Indoor Stadium', address: 'ITO', capacity: 6000 },
  ],
  'Old Delhi': [
    { name: 'Ramlila Maidan', address: 'JLN Marg', capacity: 15000 },
    { name: 'Town Hall', address: 'Chandni Chowk', capacity: 1500 },
  ],
};

interface EmergencyContactsProps {
  selectedWard?: Ward | null;
}

const EmergencyContacts = ({ selectedWard }: EmergencyContactsProps) => {
  const [showAllContacts, setShowAllContacts] = useState(false);
  
  const visibleContacts = showAllContacts ? emergencyContacts : emergencyContacts.slice(0, 4);
  const wardZone = selectedWard?.zone || 'Central Delhi';
  const zoneEvacuationCenters = evacuationCenters[wardZone] || evacuationCenters['Central Delhi'];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            Emergency Contacts
          </CardTitle>
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            24/7
          </Badge>
        </div>
        {selectedWard && (
          <p className="text-sm text-muted-foreground">
            Showing evacuation routes for {selectedWard.name}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Helpline Numbers */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Helpline Numbers
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {visibleContacts.map((contact, i) => (
              <a
                key={i}
                href={`tel:${contact.number}`}
                className={`p-3 rounded-lg border flex items-center gap-2 transition-colors hover:bg-muted/50 ${
                  contact.priority === 'critical' ? 'border-red-500/50 bg-red-500/5' : ''
                }`}
              >
                <contact.icon className={`w-4 h-4 flex-shrink-0 ${
                  contact.priority === 'critical' ? 'text-red-500' : 'text-muted-foreground'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{contact.name}</p>
                  <p className="font-mono font-bold text-sm">{contact.number}</p>
                </div>
              </a>
            ))}
          </div>
          {!showAllContacts && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setShowAllContacts(true)}
            >
              Show All Contacts
            </Button>
          )}
        </div>

        {/* Evacuation Centers */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Evacuation Centers - {wardZone}
          </h4>
          <div className="space-y-2">
            {zoneEvacuationCenters.map((center, i) => (
              <div 
                key={i}
                className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{center.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {center.address}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {center.capacity.toLocaleString()} capacity
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 gap-1"
                  onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(center.name + ' ' + center.address + ' Delhi')}`, '_blank')}
                >
                  <Navigation className="w-3 h-3" />
                  Get Directions
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-600 mb-1">Safety Tips</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Move to higher ground immediately if water rises</li>
            <li>• Avoid walking through floodwaters</li>
            <li>• Turn off electricity and gas if flooding is imminent</li>
            <li>• Keep emergency supplies ready</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
