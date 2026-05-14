export interface Tender {
  id: string;
  title: string;
  organization: string;
  budget: string;
  deadline: string;
  category: string;
  status: 'Open' | 'Closed' | 'Under Review' | 'Awarded';
  description: string;
  requirements: string[];
  country: string;
}

export const MOCK_TENDERS: Tender[] = [
  // IT & Software
  {
    id: 'T-101',
    title: 'Smart City Infrastructure - Phase 2',
    organization: 'Ministry of Urban Development',
    budget: '$2,500,000',
    deadline: '2026-05-15',
    category: 'IT Services',
    status: 'Open',
    description: 'Implementation of smart traffic management systems and IoT-enabled street lighting across the metropolitan area.',
    requirements: ['5+ years experience in IoT', 'ISO 9001 Certification', 'Local presence in Metro City'],
    country: 'United States'
  },
  {
    id: 'T-102',
    title: 'Digital Health Records Migration',
    organization: 'National Health Service',
    budget: '€1,850,000',
    deadline: '2026-06-01',
    category: 'Healthcare',
    status: 'Open',
    description: 'Migration of legacy paper records to a secure, cloud-based electronic health record system with HL7 compatibility.',
    requirements: ['Data security compliance', 'Experience with health systems', 'Cloud certification'],
    country: 'United Kingdom'
  },
  {
    id: 'T-104',
    title: 'Enterprise Cyber Security Framework',
    organization: 'FinTech Alliance Network',
    budget: '€4,200,000',
    deadline: '2026-05-20',
    category: 'Software',
    status: 'Open',
    description: 'Procurement of enterprise-grade cybersecurity software for multi-branch banking operations across 12 participating nations.',
    requirements: ['Financial sector experience', '24/7 support availability', 'Zero-trust architecture'],
    country: 'Switzerland'
  },
  {
    id: 'T-105',
    title: 'AI-Driven Custom Control Systems',
    organization: 'Port Authority of Singapore',
    budget: '$8,000,000',
    deadline: '2026-07-10',
    category: 'Software',
    status: 'Under Review',
    description: 'Implementation of neural networks to optimize container stacking, crane scheduling, and predictive maintenance.',
    requirements: ['AI/ML deployment history', 'Enterprise scalability', 'Maritime logistics knowledge'],
    country: 'Singapore'
  },
  // Construction
  {
    id: 'T-103',
    title: 'Renewable Energy Plant Construction',
    organization: 'Greenfield Energy Corp',
    budget: '€12,000,000',
    deadline: '2026-04-30',
    category: 'Construction',
    status: 'Under Review',
    description: 'Design and construction of a 50MW solar farm including grid connection and battery storage facility.',
    requirements: ['Renewable energy license', 'Environmental impact study', 'EPC experience'],
    country: 'Germany'
  },
  {
    id: 'T-106',
    title: 'High-Speed Rail Nexus Development',
    organization: 'Japan Railway Construction',
    budget: '¥14,000,000,000',
    deadline: '2026-08-22',
    category: 'Construction',
    status: 'Open',
    description: 'Civil engineering works for the new ultra-high-speed magnetic levitation track connecting southern districts.',
    requirements: ['Heavy civil construction capable', 'Seismic compliance rating', 'ISO 14001'],
    country: 'Japan'
  },
  {
    id: 'T-107',
    title: 'Public Hospital Expansion Wing',
    organization: 'Department of Public Works',
    budget: '$34,500,000',
    deadline: '2026-06-15',
    category: 'Construction',
    status: 'Open',
    description: 'Addition of a 200-bed trauma center including surgical suites, helipad, and underground emergency triage.',
    requirements: ['Healthcare facility experience', 'Union labor compliance', 'LEED Silver minimum'],
    country: 'Canada'
  },
  // Logistics
  {
    id: 'T-108',
    title: 'National Cold Chain Distribution',
    organization: 'Federal Ministry of Health',
    budget: '$15,000,000',
    deadline: '2026-05-30',
    category: 'Logistics',
    status: 'Open',
    description: 'Establishment of a nationwide temperature-controlled logistics network for distribution of biopharmaceuticals.',
    requirements: ['Cold-chain certification (GDP)', 'Real-time GPS tracking', 'Fleet capacity > 500 units'],
    country: 'United States'
  },
  {
    id: 'T-109',
    title: 'Autonomous Drone Delivery Fleet',
    organization: 'Nordic Postal Services',
    budget: '€5,000,000',
    deadline: '2026-07-05',
    category: 'Logistics',
    status: 'Open',
    description: 'Acquisition and operational management of long-range UAVs for remote area medical and postal delivery.',
    requirements: ['Aviation authority clearance', 'Drone payload > 5kg', 'Winter weather resilience'],
    country: 'Norway'
  },
  // Healthcare
  {
    id: 'T-110',
    title: 'Next-Gen MRI Machine Procurement',
    organization: 'Global Research Hospital',
    budget: '$4,200,000',
    deadline: '2026-06-12',
    category: 'Healthcare',
    status: 'Open',
    description: 'Supply and installation of three 3-Tesla MRI scanners, including staff training and 5-year maintenance plans.',
    requirements: ['Medical device certification', 'OEM partnership', '24h emergency maintenance SLA'],
    country: 'Australia'
  },
  {
    id: 'T-111',
    title: 'Telemedicine Network Integration',
    organization: 'Rural Health Initiative',
    budget: '$1,200,000',
    deadline: '2026-05-25',
    category: 'Healthcare',
    status: 'Open',
    description: 'Deployment of secure video-consultation hardware and encrypted software across 50 regional clinics.',
    requirements: ['HIPAA/GDPR compliance', 'Low-bandwidth optimization', 'Local support teams'],
    country: 'India'
  },
  // Extra Software / IT
  {
    id: 'T-112',
    title: 'Blockchain Government Registry',
    organization: 'Ministry of Digital Affairs',
    budget: '€3,100,000',
    deadline: '2026-08-01',
    category: 'Software',
    status: 'Open',
    description: 'Development of a distributed ledger system for immutable land registry and public property records.',
    requirements: ['Web3 development background', 'High TPS infrastructure', 'Public sector compliance'],
    country: 'Estonia'
  }
];
